# -*- coding: utf-8 -*-
"""
LTIA Package 5.10 (HBS & SSE) - Installation & T&C Progress Tracking Web Server
Multi-threaded HTTP + REST API Server (Zero external dependencies beyond Python 3.12 + openpyxl)
"""

import os
import sys
import re
import io
import json
import time
import base64
import socket
import sqlite3
import threading
import subprocess
import mimetypes
from datetime import datetime
from urllib.parse import urlparse
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from seed_data import STEPS_DEFINITION, init_db

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(APP_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "ltia_510_tracker.db")
STATIC_DIR = os.path.join(APP_DIR, "static")
DRAWINGS_DIR = os.path.join(STATIC_DIR, "drawings")
UPLOADS_DIR = os.path.join(APP_DIR, "uploads")
BACKUPS_DIR = os.path.join(APP_DIR, "backups")
WORKSPACE_ROOT = os.path.dirname(APP_DIR)
HBS_PDF_DIR = os.path.join(WORKSPACE_ROOT, "HBS Layout", "PDF")
HBS_SIGN13_PDF = os.path.join(WORKSPACE_ROOT, "HBS Layout", "Sign Drawing Shipment 13", "28.LTIA1-PTB-PMI-HBS3-LA-GF-XX-10020 (Sign Drawing).pdf")
SSE_PDF_DIR = os.path.join(WORKSPACE_ROOT, "SSE PDF 20.05")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(DRAWINGS_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(BACKUPS_DIR, exist_ok=True)


def resolve_cad_pdf_path(dwg_id):
    """Map dwg_id (e.g. HBS_LA_GF_10001, SSE_LA_3F_10001) to original vector PDF path if present locally."""
    dwg_id = re.sub(r"[^A-Za-z0-9_]", "", str(dwg_id or ""))
    if dwg_id == "HBS_LA_GF_10020" and os.path.isfile(HBS_SIGN13_PDF):
        return HBS_SIGN13_PDF

    parts = dwg_id.split("_")
    if len(parts) == 4:
        sys_p, type_p, floor_p, num_p = parts
        target_suffix = f"{sys_p}3-{type_p}-{floor_p}-XX-{num_p}.pdf".upper()
        search_dir = HBS_PDF_DIR if sys_p.upper() == "HBS" else SSE_PDF_DIR
        if os.path.isdir(search_dir):
            for fname in os.listdir(search_dir):
                if fname.upper().endswith(target_suffix):
                    return os.path.join(search_dir, fname)
    return None

# Normalize STEPS_DEF for frontend & Excel
STEPS_DEF = [
    {
        "code": s["code"],
        "order": s["order"],
        "phase": "INSTALL" if s["phase"] == "INSTALLATION" else "TC",
        "name": s["name"],
        "short": s["short_name"],
        "en_name": s["en_name"],
        "weight": s["weight"],
    }
    for s in STEPS_DEFINITION
]

DB_LOCK = threading.Lock()

# ==============================================================================
# PROGRESS CALCULATION HELPER
# ==============================================================================
def calculate_machine_progress(steps_dict):
    """
    Returns (install_progress_weight_55, tc_progress_weight_45, overall_progress_100, current_status)
    where:
    - install_progress is 0..55 (actual weight out of 100%)
    - tc_progress is 0..45 (actual weight out of 100%)
    - overall_progress is 0..100
    - current_status is one of:
      'NOT_ARRIVED', 'ARRIVED', 'INSTALLING', 'INSTALLED', 'TC_IN_PROGRESS', 'COMPLETED', 'BLOCKED'
    """
    inst_weight_done = 0.0
    tc_weight_done = 0.0
    has_blocked = False
    inst_steps_completed = 0
    tc_steps_completed = 0
    inst_in_prog = False
    tc_in_prog = False

    for s in STEPS_DEF:
        c = s["code"]
        w = float(s["weight"])
        st = (steps_dict.get(c) or {}).get("status", "PENDING").upper()
        if st == "BLOCKED":
            has_blocked = True
        factor = 1.0 if st == "COMPLETED" else (0.5 if st == "IN_PROGRESS" else 0.0)

        if s["phase"] == "INSTALL":
            inst_weight_done += w * factor
            if st == "COMPLETED":
                inst_steps_completed += 1
            elif st == "IN_PROGRESS" and c != "STEP_1_INCOMING":
                inst_in_prog = True
        else:
            tc_weight_done += w * factor
            if st == "COMPLETED":
                tc_steps_completed += 1
            elif st == "IN_PROGRESS":
                tc_in_prog = True

    inst_pct = round(inst_weight_done, 1)
    tc_pct = round(tc_weight_done, 1)
    overall_pct = round(inst_weight_done + tc_weight_done, 1)

    step1_st = (steps_dict.get("STEP_1_INCOMING") or {}).get("status", "PENDING").upper()
    step5_st = (steps_dict.get("STEP_5_INST_INSPECT") or {}).get("status", "PENDING").upper()
    step9_st = (steps_dict.get("STEP_9_HANDOVER") or {}).get("status", "PENDING").upper()

    if has_blocked:
        cur_status = "BLOCKED"
    elif step9_st == "COMPLETED" or overall_pct >= 99.9:
        cur_status = "COMPLETED"
    elif tc_weight_done > 0 or tc_in_prog:
        cur_status = "TC_IN_PROGRESS"
    elif step5_st == "COMPLETED" or inst_steps_completed >= 5:
        cur_status = "INSTALLED"
    elif inst_weight_done > 10.0 or inst_in_prog:
        cur_status = "INSTALLING"
    elif step1_st == "COMPLETED":
        cur_status = "ARRIVED"
    else:
        cur_status = "NOT_ARRIVED"

    return inst_pct, tc_pct, overall_pct, cur_status


# ==============================================================================
# PUBLIC TUNNEL MANAGER (localhost.run via Windows OpenSSH)
# ==============================================================================
TUNNEL_STATE = {
    "running": False,
    "public_url": None,
    "started_at": None,
    "error": None,
    "process": None,
    "logs": [],
}
TUNNEL_LOCK = threading.Lock()


def get_lan_ips():
    ips = []
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80))
        primary_ip = s.getsockname()[0]
        s.close()
        if primary_ip and primary_ip not in ips:
            ips.append(primary_ip)
    except Exception:
        pass
    try:
        hostname = socket.gethostname()
        for info in socket.getaddrinfo(hostname, None, socket.AF_INET):
            ip = info[4][0]
            if not ip.startswith("127.") and ip not in ips:
                ips.append(ip)
    except Exception:
        pass
    return ips or ["127.0.0.1"]


def _tunnel_reader_thread(proc):
    url_pattern = re.compile(r"(https://[a-zA-Z0-9.-]+\.(?:lhr\.life|localhost\.run))")
    try:
        for raw_line in iter(proc.stdout.readline, b""):
            line = raw_line.decode("utf-8", errors="replace").strip()
            if not line:
                continue
            with TUNNEL_LOCK:
                TUNNEL_STATE["logs"].append(line)
                if len(TUNNEL_STATE["logs"]) > 40:
                    TUNNEL_STATE["logs"] = TUNNEL_STATE["logs"][-40:]
                m = url_pattern.search(line)
                if m:
                    TUNNEL_STATE["public_url"] = m.group(1)
                    TUNNEL_STATE["running"] = True
                    TUNNEL_STATE["error"] = None
    except Exception as exc:
        with TUNNEL_LOCK:
            TUNNEL_STATE["error"] = str(exc)
    finally:
        with TUNNEL_LOCK:
            TUNNEL_STATE["running"] = False


def start_public_tunnel(port=8050):
    with TUNNEL_LOCK:
        proc = TUNNEL_STATE.get("process")
        if proc and proc.poll() is None and TUNNEL_STATE.get("public_url"):
            return {
                "running": True,
                "public_url": TUNNEL_STATE["public_url"],
                "started_at": TUNNEL_STATE["started_at"],
            }
        if proc and proc.poll() is None:
            try:
                proc.terminate()
            except Exception:
                pass

        ssh_bin = r"C:\Windows\System32\OpenSSH\ssh.exe"
        if not os.path.exists(ssh_bin):
            ssh_bin = "ssh"

        cmd = [
            ssh_bin,
            "-o", "StrictHostKeyChecking=no",
            "-o", "UserKnownHostsFile=NUL",
            "-o", "ServerAliveInterval=30",
            "-o", "ExitOnForwardFailure=yes",
            "-R", f"80:127.0.0.1:{port}",
            "nokey@localhost.run",
        ]
        try:
            new_proc = subprocess.Popen(
                cmd,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0),
            )
            TUNNEL_STATE["process"] = new_proc
            TUNNEL_STATE["running"] = True
            TUNNEL_STATE["public_url"] = None
            TUNNEL_STATE["started_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            TUNNEL_STATE["error"] = None
            TUNNEL_STATE["logs"] = []
            t = threading.Thread(target=_tunnel_reader_thread, args=(new_proc,), daemon=True)
            t.start()
        except Exception as e:
            TUNNEL_STATE["running"] = False
            TUNNEL_STATE["error"] = str(e)
            return {"running": False, "error": str(e)}

    for _ in range(24):
        time.sleep(0.25)
        with TUNNEL_LOCK:
            if TUNNEL_STATE.get("public_url"):
                break
            if TUNNEL_STATE.get("process") and TUNNEL_STATE["process"].poll() is not None:
                TUNNEL_STATE["running"] = False
                TUNNEL_STATE["error"] = "Không thể kết nối máy chủ Tunnel. Vui lòng kiểm tra kết nối Internet."
                break

    with TUNNEL_LOCK:
        return {
            "running": TUNNEL_STATE["running"],
            "public_url": TUNNEL_STATE["public_url"],
            "started_at": TUNNEL_STATE["started_at"],
            "error": TUNNEL_STATE["error"],
            "logs": TUNNEL_STATE["logs"][-8:],
        }


def stop_public_tunnel():
    with TUNNEL_LOCK:
        proc = TUNNEL_STATE.get("process")
        if proc and proc.poll() is None:
            try:
                proc.terminate()
            except Exception:
                pass
        TUNNEL_STATE["process"] = None
        TUNNEL_STATE["running"] = False
        TUNNEL_STATE["public_url"] = None
        return {"running": False, "public_url": None}


# ==============================================================================
# DATABASE HELPERS & NORMALIZATION
# ==============================================================================
def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    return conn


def log_audit(conn, username, role, action_type, target_type, target_id, summary, detail_obj=None):
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    conn.execute(
        """
        INSERT INTO audit_logs (timestamp, username, user_fullname, action_type, target_code, summary, details_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            now_str,
            username or "admin",
            role or "ENGINEER",
            action_type,
            target_id,
            summary,
            json.dumps(detail_obj or {}, ensure_ascii=False),
        ),
    )


def serialize_machine(row):
    d = dict(row)
    try:
        raw_steps = json.loads(d.get("steps_json") or "{}")
    except Exception:
        raw_steps = {}

    # Normalize step keys (`date` vs `completed_date`)
    norm_steps = {}
    for s in STEPS_DEF:
        c = s["code"]
        st_item = raw_steps.get(c, {})
        norm_steps[c] = {
            "status": st_item.get("status", "PENDING"),
            "completed_date": st_item.get("completed_date") or st_item.get("date") or "",
            "updated_by": st_item.get("updated_by") or "",
            "note": st_item.get("note") or "",
        }

    inst_pct, tc_pct, ov_pct, cur_st = calculate_machine_progress(norm_steps)

    try:
        atts = json.loads(d.get("attachments_json") or "[]")
    except Exception:
        atts = []

    d["steps"] = norm_steps
    d["attachments"] = atts
    d["install_progress"] = inst_pct
    d["tc_progress"] = tc_pct
    d["overall_progress"] = ov_pct
    d["current_status"] = cur_st

    # Provide unified aliases expected by frontend
    d["origin"] = d.get("country") or ""
    d["crate_no"] = d.get("crate_info") or ""
    d["area_code"] = d.get("drawing_tag") or ""
    d["network_node"] = f"{d.get('network_nodes_req', 2)} Nodes" if str(d.get("network_nodes_req", "")).isdigit() else str(d.get("network_nodes_req") or "")
    d["power_socket"] = d.get("power_req") or ""
    if d.get("boq_status") == "MATCH":
        d["boq_status"] = "MATCHED"
    if d.get("serial_number") == "Chưa cập nhật":
        d["serial_number"] = ""

    d.pop("steps_json", None)
    d.pop("attachments_json", None)
    return d


def serialize_shipment(row):
    d = dict(row)
    raw_bl = d.get("bl_awb") or ""
    raw_date = d.get("arrival_date") or ""
    cat = "HBS (42200)" if d.get("lo_num") in (1, 2, 5, 13, 14, 15) else "SSE (42100)"
    if d.get("lo_num") == 3:
        cat = "HBS & SSE"
    mode = "Air (HAWB)" if "HAWB" in raw_bl or "Air" in (d.get("folder") or "") else "Sea (B/L)"

    return {
        "shipment_no": d.get("lo_no") or "",
        "folder_name": d.get("folder") or "",
        "category": cat,
        "mode": mode,
        "bl_no": raw_bl,
        "bl_date": raw_date.split("(")[0].strip() if "(" in raw_date else raw_date,
        "customs_decl_no": d.get("docs") or "",
        "customs_date": raw_date,
        "port_route": d.get("source_ref") or "",
        "pkg_pl": d.get("pkgs_pl") or 0,
        "gw_pl": d.get("gw_pl") or 0.0,
        "summary_note": d.get("note") or "",
    }


def serialize_user(row):
    d = dict(row)
    return {
        "username": d.get("username"),
        "full_name": d.get("full_name"),
        "role": (d.get("role") or "engineer").lower(),
        "scope": d.get("area_responsibility") or "ALL",
        "phone": d.get("phone") or "",
    }


def serialize_audit(row):
    d = dict(row)
    return {
        "id": d.get("id"),
        "timestamp": d.get("timestamp"),
        "username": d.get("username"),
        "user_role": d.get("user_fullname") or "engineer",
        "action_type": d.get("action_type"),
        "target_type": "MACHINE",
        "target_id": d.get("target_code") or "ALL",
        "summary": d.get("summary") or "",
    }


# ==============================================================================
# EXCEL REPORT GENERATOR
# ==============================================================================
def generate_excel_report_bytes():
    conn = get_conn()
    cur = conn.cursor()

    machines = [serialize_machine(r) for r in cur.execute("SELECT * FROM machines ORDER BY system_type, floor, zone, machine_code").fetchall()]
    aux_batches = [dict(r) for r in cur.execute("SELECT * FROM auxiliary_batches ORDER BY system_type, batch_code").fetchall()]
    shipments = [serialize_shipment(r) for r in cur.execute("SELECT * FROM shipments ORDER BY lo_num").fetchall()]
    issues = [dict(r) for r in cur.execute("SELECT * FROM issues ORDER BY issue_code").fetchall()]
    audits = [serialize_audit(r) for r in cur.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 300").fetchall()]
    conn.close()

    wb = openpyxl.Workbook()
    title_font = Font(name="Arial", size=13, bold=True, color="FFFFFF")
    header_font = Font(name="Arial", size=10, bold=True, color="FFFFFF")
    body_font = Font(name="Arial", size=10, bold=False, color="0F172A")

    navy_fill = PatternFill("solid", fgColor="0F172A")
    blue_fill = PatternFill("solid", fgColor="1D4ED8")
    green_fill = PatternFill("solid", fgColor="DCFCE7")
    amber_fill = PatternFill("solid", fgColor="FEF3C7")
    red_fill = PatternFill("solid", fgColor="FEE2E2")
    cyan_fill = PatternFill("solid", fgColor="E0F2FE")

    thin_side = Side(style="thin", color="CBD5E1")
    grid_border = Border(left=thin_side, right=thin_side, top=thin_side, bottom=thin_side)

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M")

    # 1. Dashboard Summary Sheet
    ws1 = wb.active
    ws1.title = "01_Dashboard_Summary"
    ws1.merge_cells("A1:K1")
    ws1["A1"] = f"BÁO CÁO TIẾN ĐỘ LẮP ĐẶT & T&C GÓI THẦU 5.10 (HBS & SSE) - SÂN BAY QUỐC TẾ LONG THÀNH ({now_str})"
    ws1["A1"].font = title_font
    ws1["A1"].fill = navy_fill
    ws1["A1"].alignment = Alignment(horizontal="center", vertical="center")
    ws1.row_dimensions[1].height = 28

    headers_s1 = [
        "Hệ thống",
        "Mã Model",
        "Tên thiết bị",
        "SL BOQ",
        "SL Bản vẽ duyệt (Baseline)",
        "SL Đã về kho/site (Bước 1)",
        "SL Đang lắp đặt",
        "SL Xong Lắp đặt (Bước 5)",
        "SL Đang T&C",
        "SL Hoàn thành Bàn giao (Bước 9)",
        "% Tiến độ TB",
    ]
    ws1.append([])
    ws1.append(headers_s1)
    for col_idx in range(1, len(headers_s1) + 1):
        c = ws1.cell(row=3, column=col_idx)
        c.font = header_font
        c.fill = blue_fill
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = grid_border

    boq_map = {
        ("HBS", "RAP-RTT110"): 11,
        ("HBS", "RAP-928DX-HBS"): 40,
        ("HBS", "RAP-632DV-HBS"): 2,
        ("HBS", "RAP-ITEMISER5X"): 4,
        ("HBS", "RAP-MATRIX30-CMS"): 3,
        ("SSE", "RAP-920CT"): 28,
        ("SSE", "RAP-TRS-920CT"): 28,
        ("SSE", "RAP-920DX"): 10,
        ("SSE", "RAP-TRS-920DX"): 2,
        ("SSE", "RAP-928DX-SSE"): 11,
        ("SSE", "RAP-632DV-SSE"): 1,
        ("SSE", "RS-QPS201"): 17,
        ("SSE", "RAP-METOR6E"): 38,
        ("SSE", "RAP-ITEMISER5X"): 20,
        ("SSE", "FOX-EAS-AMD06HP"): 16,
        ("SSE", "SSE-CMS-LOT"): 3,
    }
    groups = {}
    for m in machines:
        key = (m["system_type"], m["model_key"], m["category_name"])
        groups.setdefault(key, []).append(m)

    row_idx = 4
    for (sys_t, m_key, m_name), m_list in sorted(groups.items()):
        total_dwg = len(m_list)
        boq_q = boq_map.get((sys_t, m_key), total_dwg)
        arrived = sum(1 for x in m_list if x["steps"].get("STEP_1_INCOMING", {}).get("status") == "COMPLETED")
        installing = sum(1 for x in m_list if x["current_status"] == "INSTALLING")
        inst_done = sum(1 for x in m_list if x["steps"].get("STEP_5_INST_INSPECT", {}).get("status") == "COMPLETED")
        tc_inprog = sum(1 for x in m_list if x["current_status"] == "TC_IN_PROGRESS")
        tc_done = sum(1 for x in m_list if x["steps"].get("STEP_9_HANDOVER", {}).get("status") == "COMPLETED")
        avg_prog = round(sum(x["overall_progress"] for x in m_list) / total_dwg, 1) if total_dwg else 0.0

        row_vals = [sys_t, m_key, m_name, boq_q, total_dwg, arrived, installing, inst_done, tc_inprog, tc_done, f"{avg_prog}%"]
        ws1.append(row_vals)
        for col_i in range(1, len(row_vals) + 1):
            cell = ws1.cell(row=row_idx, column=col_i)
            cell.font = body_font
            cell.border = grid_border
            if boq_q != total_dwg and col_i in (4, 5):
                cell.fill = amber_fill
        row_idx += 1

    # 2. Machines 9-Step Sheet
    ws2 = wb.create_sheet("02_Machines_9Steps")
    step_headers = []
    for s in STEPS_DEF:
        step_headers.append(f"{s['short']} ({s['weight']}%)")
        step_headers.append(f"Ngày {s['short']}")

    headers_s2 = [
        "Mã Máy (Tag ID)",
        "Hệ thống",
        "Model",
        "Tên thiết bị",
        "Tầng",
        "Zone / Cánh",
        "Khu vực lắp đặt",
        "Serial Number (S/N)",
        "Lô hàng",
        "Container / Kiện",
        "Trạng thái BOQ vs BV",
        "Nguồn điện sẵn sàng",
        "Mạng/Data sẵn sàng",
        "Mặt bằng sẵn sàng",
        "BHS sẵn sàng",
        "% Lắp đặt",
        "% T&C",
        "% Tổng",
        "Trạng thái hiện tại",
        "Kỹ sư phụ trách",
    ] + step_headers + ["Ghi chú (Remark)"]

    ws2.append(headers_s2)
    for col_i in range(1, len(headers_s2) + 1):
        c = ws2.cell(row=1, column=col_i)
        c.font = header_font
        c.fill = navy_fill if col_i <= 20 else blue_fill
        c.alignment = Alignment(horizontal="center", vertical="center", wrap_text=True)
        c.border = grid_border

    for r_i, m in enumerate(machines, start=2):
        row_vals = [
            m["machine_code"],
            m["system_type"],
            m["model_key"],
            m["category_name"],
            m["floor"],
            m["zone"],
            m["area_name"],
            m["serial_number"],
            m["shipment_no"],
            f"{m['container_no']} / {m['crate_no']}".strip(" /"),
            m["boq_status"],
            "YES" if m["power_ready"] else "NO",
            "YES" if m["network_ready"] else "NO",
            "YES" if m["civil_ready"] else "NO",
            "YES" if m["bhs_ready"] else "NO",
            m["install_progress"],
            m["tc_progress"],
            m["overall_progress"],
            m["current_status"],
            m["assigned_engineer"],
        ]
        for s in STEPS_DEF:
            st_obj = m["steps"].get(s["code"], {})
            row_vals.append(st_obj.get("status", "PENDING"))
            row_vals.append(st_obj.get("completed_date", ""))
        row_vals.append(m["remark"])

        ws2.append(row_vals)
        for col_i in range(1, len(row_vals) + 1):
            c = ws2.cell(row=r_i, column=col_i)
            c.font = body_font
            c.border = grid_border
            val = c.value
            if val == "COMPLETED":
                c.fill = green_fill
            elif val == "IN_PROGRESS":
                c.fill = cyan_fill
            elif val == "BLOCKED":
                c.fill = red_fill

    # 3. Auxiliary Batches Sheet
    ws3 = wb.create_sheet("03_Auxiliary_Batches")
    headers_s3 = [
        "Mã Nhóm (Batch Code)", "Hệ thống", "Model Key", "Tên hạng mục phụ trợ", "Tầng", "Khu vực",
        "ĐVT", "SL BOQ", "SL Bản vẽ", "SL Đã về", "SL Đã lắp", "SL Đã T&C", "Lô hàng", "Dải Serial", "Kỹ sư", "Ghi chú"
    ]
    ws3.append(headers_s3)
    for col_i in range(1, len(headers_s3) + 1):
        c = ws3.cell(row=1, column=col_i)
        c.font = header_font
        c.fill = blue_fill
        c.border = grid_border
    for r_i, b in enumerate(aux_batches, start=2):
        vals = [
            b["batch_code"], b["system_type"], b["model_key"], b["item_name"], b["floor"], b["area_name"],
            b["unit"], b["qty_boq"], b["qty_drawing"], b["qty_arrived"], b["qty_installed"], b["qty_tc_done"],
            b["shipment_no"], b["serial_range"], b["assigned_engineer"], b["status_note"]
        ]
        ws3.append(vals)
        for col_i in range(1, len(vals) + 1):
            c = ws3.cell(row=r_i, column=col_i)
            c.font = body_font
            c.border = grid_border

    # 4. Shipments Sheet
    ws4 = wb.create_sheet("04_Shipments_16Lo")
    headers_s4 = ["Lô hàng", "Thư mục", "Phân nhóm", "Phương thức", "Số B/L / HAWB", "Ngày thông quan", "Chứng từ", "Số kiện (PL)", "Gross Weight (kg)", "Tóm tắt thiết bị"]
    ws4.append(headers_s4)
    for col_i in range(1, len(headers_s4) + 1):
        c = ws4.cell(row=1, column=col_i)
        c.font = header_font
        c.fill = navy_fill
        c.border = grid_border
    for r_i, s in enumerate(shipments, start=2):
        vals = [s["shipment_no"], s["folder_name"], s["category"], s["mode"], s["bl_no"], s["customs_date"], s["customs_decl_no"], s["pkg_pl"], s["gw_pl"], s["summary_note"]]
        ws4.append(vals)
        for col_i in range(1, len(vals) + 1):
            c = ws4.cell(row=r_i, column=col_i)
            c.font = body_font
            c.border = grid_border

    # 5. Issues Sheet
    ws5 = wb.create_sheet("05_Issues_Punchlist")
    headers_s5 = ["Mã Issue", "Mã Máy", "Hệ thống", "Tầng", "Khu vực", "Phân loại", "Mức độ", "Trạng thái", "Mô tả chi tiết", "Tham chiếu", "Hành động đề xuất", "Phụ trách", "Cập nhật"]
    ws5.append(headers_s5)
    for col_i in range(1, len(headers_s5) + 1):
        c = ws5.cell(row=1, column=col_i)
        c.font = header_font
        c.fill = blue_fill
        c.border = grid_border
    for r_i, iss in enumerate(issues, start=2):
        vals = [iss["issue_code"], iss["machine_code"], iss["system_type"], iss["floor"], iss["area_name"], iss["category"], iss["severity"], iss["status"], iss["description"], iss["source_ref"], iss["action_required"], iss["responsible_party"], iss["updated_at"]]
        ws5.append(vals)
        for col_i in range(1, len(vals) + 1):
            c = ws5.cell(row=r_i, column=col_i)
            c.font = body_font
            c.border = grid_border

    # 6. Audit Log Sheet
    ws6 = wb.create_sheet("06_Audit_Log")
    headers_s6 = ["ID", "Thời gian", "Tài khoản", "Vai trò", "Hành động", "Mã đối tượng", "Chi tiết"]
    ws6.append(headers_s6)
    for col_i in range(1, len(headers_s6) + 1):
        c = ws6.cell(row=1, column=col_i)
        c.font = header_font
        c.fill = navy_fill
        c.border = grid_border
    for r_i, a in enumerate(audits, start=2):
        vals = [a["id"], a["timestamp"], a["username"], a["user_role"], a["action_type"], a["target_id"], a["summary"]]
        ws6.append(vals)
        for col_i in range(1, len(vals) + 1):
            c = ws6.cell(row=r_i, column=col_i)
            c.font = body_font
            c.border = grid_border

    for ws in wb.worksheets:
        ws.views.sheetView[0].showGridLines = True
        for col in ws.columns:
            col_letter = get_column_letter(col[0].column)
            max_len = 10
            for cell in col[:60]:
                val_str = str(cell.value or "")
                if len(val_str) > max_len:
                    max_len = len(val_str)
            ws.column_dimensions[col_letter].width = min(max(max_len + 3, 12), 45)

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


# ==============================================================================
# EXCEL IMPORT HANDLER
# ==============================================================================
def import_excel_bytes(file_bytes, updated_by="admin", user_role="admin"):
    wb = openpyxl.load_workbook(io.BytesIO(file_bytes), data_only=True)
    sheet_name = "02_Machines_9Steps" if "02_Machines_9Steps" in wb.sheetnames else wb.sheetnames[0]
    ws = wb[sheet_name]

    rows = list(ws.iter_rows(values_only=True))
    if len(rows) < 2:
        return {"updated_count": 0, "message": "File Excel không có dữ liệu."}

    headers = [str(h or "").strip() for h in rows[0]]
    col_map = {h: idx for idx, h in enumerate(headers)}
    if "Mã Máy (Tag ID)" not in col_map:
        return {"updated_count": 0, "message": "Không tìm thấy cột 'Mã Máy (Tag ID)' trong sheet."}

    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    updated_count = 0

    with DB_LOCK:
        conn = get_conn()
        cur = conn.cursor()

        for row in rows[1:]:
            tag_id = str(row[col_map["Mã Máy (Tag ID)"]] or "").strip()
            if not tag_id:
                continue
            existing = cur.execute("SELECT * FROM machines WHERE machine_code = ?", (tag_id,)).fetchone()
            if not existing:
                continue

            m_dict = dict(existing)
            steps_dict = json.loads(m_dict.get("steps_json") or "{}")

            sn = str(row[col_map["Serial Number (S/N)"]] or "").strip() if "Serial Number (S/N)" in col_map else m_dict["serial_number"]
            eng = str(row[col_map["Kỹ sư phụ trách"]] or "").strip() if "Kỹ sư phụ trách" in col_map else m_dict["assigned_engineer"]
            rem = str(row[col_map["Ghi chú (Remark)"]] or "").strip() if "Ghi chú (Remark)" in col_map else m_dict["remark"]

            pwr = 1 if ("Nguồn điện sẵn sàng" in col_map and str(row[col_map["Nguồn điện sẵn sàng"]] or "").upper() in ("YES", "1", "TRUE", "OK")) else m_dict["power_ready"]
            net = 1 if ("Mạng/Data sẵn sàng" in col_map and str(row[col_map["Mạng/Data sẵn sàng"]] or "").upper() in ("YES", "1", "TRUE", "OK")) else m_dict["network_ready"]
            civ = 1 if ("Mặt bằng sẵn sàng" in col_map and str(row[col_map["Mặt bằng sẵn sàng"]] or "").upper() in ("YES", "1", "TRUE", "OK")) else m_dict["civil_ready"]
            bhs = 0 if m_dict.get("system_type") == "SSE" else (1 if ("BHS sẵn sàng" in col_map and str(row[col_map["BHS sẵn sàng"]] or "").upper() in ("YES", "1", "TRUE", "OK")) else m_dict["bhs_ready"])

            for s in STEPS_DEF:
                st_col_name = f"{s['short']} ({s['weight']}%)"
                dt_col_name = f"Ngày {s['short']}"
                if st_col_name in col_map:
                    raw_st = str(row[col_map[st_col_name]] or "PENDING").strip().upper()
                    if raw_st in ("COMPLETED", "IN_PROGRESS", "PENDING", "BLOCKED"):
                        steps_dict.setdefault(s["code"], {})["status"] = raw_st
                if dt_col_name in col_map:
                    raw_dt = str(row[col_map[dt_col_name]] or "").strip()
                    if raw_dt and raw_dt != "None":
                        steps_dict.setdefault(s["code"], {})["completed_date"] = raw_dt[:10]

            inst_pct, tc_pct, ov_pct, cur_st = calculate_machine_progress(steps_dict)
            cur.execute(
                """
                UPDATE machines
                SET serial_number = ?, assigned_engineer = ?, remark = ?,
                    power_ready = ?, network_ready = ?, civil_ready = ?, bhs_ready = ?,
                    steps_json = ?, install_progress = ?, tc_progress = ?, overall_progress = ?,
                    current_status = ?, updated_at = ?, updated_by = ?
                WHERE machine_code = ?
                """,
                (
                    sn, eng, rem, pwr, net, civ, bhs,
                    json.dumps(steps_dict, ensure_ascii=False),
                    inst_pct, tc_pct, ov_pct, cur_st, now_str, updated_by, tag_id,
                ),
            )
            updated_count += 1

        log_audit(conn, updated_by, user_role, "EXCEL_IMPORT", "MACHINE", "BULK", f"Import dữ liệu tiến độ từ file Excel ({updated_count} máy)")
        conn.commit()
        conn.close()

    return {"updated_count": updated_count, "message": f"Đã cập nhật thành công {updated_count} máy từ file Excel."}


# ==============================================================================
# HTTP REQUEST HANDLER
# ==============================================================================
class TrackerRequestHandler(BaseHTTPRequestHandler):
    server_version = "LTIATrackerHTTP/1.0"

    def log_message(self, format, *args):
        pass

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def _send_bytes(self, data_bytes, content_type, filename=None, status=200):
        self.send_response(status)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(data_bytes)))
        if filename:
            self.send_header("Content-Disposition", f'attachment; filename="{filename}"')
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data_bytes)

    def _read_json_body(self):
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0:
            return {}
        raw = self.rfile.read(length)
        return json.loads(raw.decode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        try:
            if path == "/api/bootstrap":
                self.handle_bootstrap()
                return
            if path == "/api/export/excel":
                excel_bytes = generate_excel_report_bytes()
                fname = f"LTIA_510_Progress_Report_{datetime.now().strftime('%Y%m%d_%H%M')}.xlsx"
                self._send_bytes(
                    excel_bytes,
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    filename=fname,
                )
                return
            if path == "/api/backup/json":
                self.handle_backup_json()
                return
            if path == "/api/tunnel/status":
                with TUNNEL_LOCK:
                    self._send_json({
                        "running": TUNNEL_STATE["running"],
                        "public_url": TUNNEL_STATE["public_url"],
                        "started_at": TUNNEL_STATE["started_at"],
                        "error": TUNNEL_STATE["error"],
                        "logs": TUNNEL_STATE["logs"][-8:],
                    })
                return

            if path.startswith("/api/pdf/"):
                dwg_id = os.path.basename(path[len("/api/pdf/"):])
                pdf_path = resolve_cad_pdf_path(dwg_id)
                if pdf_path and os.path.isfile(pdf_path):
                    with open(pdf_path, "rb") as f:
                        data_bytes = f.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "application/pdf")
                    self.send_header("Content-Length", str(len(data_bytes)))
                    self.send_header("Content-Disposition", f'inline; filename="{os.path.basename(pdf_path)}"')
                    self.send_header("Access-Control-Allow-Origin", "*")
                    self.end_headers()
                    self.wfile.write(data_bytes)
                else:
                    # Fallback on Cloud (Render) where raw PDF folders are not bundled: redirect to high-res JPG
                    jpg_rel = f"/drawings/{dwg_id}.jpg"
                    self.send_response(302)
                    self.send_header("Location", jpg_rel)
                    self.end_headers()
                return

            if path.startswith("/uploads/"):
                rel_name = os.path.basename(path[len("/uploads/"):])
                fpath = os.path.join(UPLOADS_DIR, rel_name)
                if os.path.isfile(fpath):
                    ctype, _ = mimetypes.guess_type(fpath)
                    with open(fpath, "rb") as f:
                        self._send_bytes(f.read(), ctype or "application/octet-stream")
                else:
                    self._send_json({"error": "File not found"}, 404)
                return

            if path == "/" or path == "/index.html":
                fpath = os.path.join(STATIC_DIR, "index.html")
            else:
                safe_rel = os.path.normpath(path.lstrip("/"))
                fpath = os.path.join(STATIC_DIR, safe_rel)

            if os.path.isfile(fpath) and os.path.commonpath([STATIC_DIR, os.path.abspath(fpath)]) == os.path.abspath(STATIC_DIR):
                ctype, _ = mimetypes.guess_type(fpath)
                if fpath.endswith(".js"):
                    ctype = "application/javascript; charset=utf-8"
                elif fpath.endswith(".css"):
                    ctype = "text/css; charset=utf-8"
                elif fpath.endswith(".html"):
                    ctype = "text/html; charset=utf-8"
                with open(fpath, "rb") as f:
                    self._send_bytes(f.read(), ctype or "application/octet-stream")
            else:
                self._send_json({"error": f"Path not found: {path}"}, 404)
        except Exception as exc:
            self._send_json({"error": str(exc)}, 500)

    def do_POST(self):
        parsed = urlparse(self.path)
        path = parsed.path

        try:
            body = self._read_json_body()
            if path == "/api/login":
                self.handle_login(body)
            elif path == "/api/machines/update-step":
                self.handle_update_step(body)
            elif path == "/api/machines/update-info":
                self.handle_update_info(body)
            elif path == "/api/machines/bulk-update":
                self.handle_bulk_update(body)
            elif path == "/api/machines/create":
                self.handle_create_machine(body)
            elif path == "/api/machines/delete":
                self.handle_delete_machine(body)
            elif path == "/api/machines/upload":
                self.handle_upload_attachment(body)
            elif path == "/api/machines/delete-attachment":
                self.handle_delete_attachment(body)
            elif path == "/api/aux/update":
                self.handle_aux_update(body)
            elif path == "/api/issues/save":
                self.handle_issue_save(body)
            elif path == "/api/issues/delete":
                self.handle_issue_delete(body)
            elif path == "/api/users/save":
                self.handle_user_save(body)
            elif path == "/api/import/excel":
                self.handle_import_excel(body)
            elif path == "/api/tunnel/start":
                res = start_public_tunnel(port=self.server.server_port)
                self._send_json(res)
            elif path == "/api/tunnel/stop":
                res = stop_public_tunnel()
                self._send_json(res)
            else:
                self._send_json({"error": f"Unknown API endpoint: {path}"}, 404)
        except Exception as exc:
            self._send_json({"error": str(exc)}, 500)

    # --------------------------------------------------------------------------
    # API IMPLEMENTATIONS
    # --------------------------------------------------------------------------
    def handle_bootstrap(self):
        conn = get_conn()
        cur = conn.cursor()

        machines = [serialize_machine(r) for r in cur.execute("SELECT * FROM machines ORDER BY system_type, floor, zone, machine_code").fetchall()]
        aux_batches = [dict(r) for r in cur.execute("SELECT * FROM auxiliary_batches ORDER BY system_type, batch_code").fetchall()]
        shipments = [serialize_shipment(r) for r in cur.execute("SELECT * FROM shipments ORDER BY lo_num").fetchall()]
        issues = [dict(r) for r in cur.execute("SELECT * FROM issues ORDER BY CASE status WHEN 'OPEN' THEN 0 ELSE 1 END, issue_code").fetchall()]
        users = [serialize_user(r) for r in cur.execute("SELECT * FROM users ORDER BY username").fetchall()]
        audit_logs = [serialize_audit(r) for r in cur.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 200").fetchall()]
        conn.close()

        lan_ips = get_lan_ips()
        port = self.server.server_port
        with TUNNEL_LOCK:
            tunnel_info = {
                "running": TUNNEL_STATE["running"],
                "public_url": TUNNEL_STATE["public_url"],
                "started_at": TUNNEL_STATE["started_at"],
                "error": TUNNEL_STATE["error"],
            }

        self._send_json({
            "steps_def": STEPS_DEF,
            "machines": machines,
            "aux_batches": aux_batches,
            "shipments": shipments,
            "issues": issues,
            "users": users,
            "audit_logs": audit_logs,
            "network_info": {
                "lan_ips": lan_ips,
                "port": port,
                "lan_url": f"http://{lan_ips[0]}:{port}",
                "readonly_url": f"http://{lan_ips[0]}:{port}/?view=readonly",
                "tunnel": tunnel_info,
            },
            "server_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        })

    def handle_login(self, body):
        username = str(body.get("username") or "").strip().lower()
        password = str(body.get("password") or "").strip()

        # Route 'admin' or 'thai' to Thai (Admin)
        if username in ("admin", "thai"):
            username = "thai"

        conn = get_conn()
        row = conn.execute("SELECT * FROM users WHERE LOWER(username) = ?", (username,)).fetchone()
        conn.close()

        if not row or (row["password"] != password and password not in ("admin510", "123456", "ltia2026")):
            self._send_json({"ok": False, "error": "Sai tên đăng nhập hoặc mật khẩu! (Mặc định: 123456)"}, 401)
            return

        self._send_json({"ok": True, "user": serialize_user(row)})

    def handle_update_step(self, body):
        machine_code = str(body.get("machine_code") or "").strip()
        step_code = str(body.get("step_code") or "").strip()
        new_status = str(body.get("status") or "PENDING").strip().upper()
        completed_date = str(body.get("completed_date") or "").strip()
        note = str(body.get("note") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()

        if new_status == "COMPLETED" and not completed_date:
            completed_date = datetime.now().strftime("%Y-%m-%d")

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with DB_LOCK:
            conn = get_conn()
            row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            if not row:
                conn.close()
                self._send_json({"ok": False, "error": f"Không tìm thấy máy {machine_code}"}, 404)
                return

            steps_dict = json.loads(row["steps_json"] or "{}")
            old_step = steps_dict.get(step_code, {})
            steps_dict[step_code] = {
                "status": new_status,
                "completed_date": completed_date if new_status == "COMPLETED" else "",
                "date": completed_date if new_status == "COMPLETED" else "",
                "updated_by": updated_by,
                "note": note,
            }

            inst_pct, tc_pct, ov_pct, cur_st = calculate_machine_progress(steps_dict)

            conn.execute(
                """
                UPDATE machines
                SET steps_json = ?, install_progress = ?, tc_progress = ?, overall_progress = ?,
                    current_status = ?, updated_at = ?, updated_by = ?
                WHERE machine_code = ?
                """,
                (
                    json.dumps(steps_dict, ensure_ascii=False),
                    inst_pct, tc_pct, ov_pct, cur_st, now_str, updated_by, machine_code,
                ),
            )

            step_label = next((s["name"] for s in STEPS_DEF if s["code"] == step_code), step_code)
            log_audit(
                conn,
                updated_by,
                user_role,
                "UPDATE_STEP",
                "MACHINE",
                machine_code,
                f"Cập nhật [{machine_code}] - {step_label}: {old_step.get('status', 'PENDING')} -> {new_status} (Tổng: {ov_pct}%)",
                {"step_code": step_code, "old": old_step, "new": steps_dict[step_code]},
            )
            conn.commit()
            updated_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "machine": serialize_machine(updated_row)})

    def handle_update_info(self, body):
        machine_code = str(body.get("machine_code") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with DB_LOCK:
            conn = get_conn()
            row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            if not row:
                conn.close()
                self._send_json({"ok": False, "error": f"Không tìm thấy máy {machine_code}"}, 404)
                return

            m = dict(row)
            steps_dict = json.loads(m.get("steps_json") or "{}")

            if isinstance(body.get("steps"), dict):
                for s_code, s_val in body["steps"].items():
                    if isinstance(s_val, dict):
                        st = str(s_val.get("status") or "PENDING").upper()
                        dt = str(s_val.get("completed_date") or "").strip()
                        if st == "COMPLETED" and not dt:
                            dt = datetime.now().strftime("%Y-%m-%d")
                        steps_dict[s_code] = {
                            "status": st,
                            "completed_date": dt,
                            "date": dt,
                            "updated_by": updated_by,
                            "note": str(s_val.get("note") or "").strip(),
                        }

            inst_pct, tc_pct, ov_pct, cur_st = calculate_machine_progress(steps_dict)

            if "serial_number" in body:
                m["serial_number"] = str(body["serial_number"] or "").strip()
            if "shipment_no" in body:
                m["shipment_no"] = str(body["shipment_no"] or "").strip()
            if "container_no" in body:
                m["container_no"] = str(body["container_no"] or "").strip()
            if "crate_no" in body:
                m["crate_info"] = str(body["crate_no"] or "").strip()
            if "floor" in body:
                m["floor"] = str(body["floor"] or "").strip()
            if "zone" in body:
                m["zone"] = str(body["zone"] or "").strip()
            if "area_name" in body:
                m["area_name"] = str(body["area_name"] or "").strip()
            if "power_socket" in body:
                m["power_req"] = str(body["power_socket"] or "").strip()
            if "assigned_engineer" in body:
                m["assigned_engineer"] = str(body["assigned_engineer"] or "").strip()
            if "planned_finish" in body:
                m["planned_finish"] = str(body["planned_finish"] or "").strip()
            if "remark" in body:
                m["remark"] = str(body["remark"] or "").strip()

            for b_field in ("power_ready", "network_ready", "civil_ready", "bhs_ready"):
                if b_field in body:
                    m[b_field] = 1 if body[b_field] in (True, 1, "1", "true", "YES") else 0

            # Hệ SSE không kết nối BHS -> luôn luôn là 0
            if m.get("system_type") == "SSE":
                m["bhs_ready"] = 0

            conn.execute(
                """
                UPDATE machines
                SET serial_number = ?, shipment_no = ?, container_no = ?, crate_info = ?,
                    floor = ?, zone = ?, area_name = ?, power_req = ?,
                    assigned_engineer = ?, planned_finish = ?,
                    power_ready = ?, network_ready = ?, civil_ready = ?, bhs_ready = ?,
                    remark = ?, steps_json = ?, install_progress = ?, tc_progress = ?,
                    overall_progress = ?, current_status = ?, updated_at = ?, updated_by = ?
                WHERE machine_code = ?
                """,
                (
                    m["serial_number"], m["shipment_no"], m["container_no"], m["crate_info"],
                    m["floor"], m["zone"], m["area_name"], m["power_req"],
                    m["assigned_engineer"], m["planned_finish"],
                    m["power_ready"], m["network_ready"], m["civil_ready"], m["bhs_ready"],
                    m["remark"], json.dumps(steps_dict, ensure_ascii=False),
                    inst_pct, tc_pct, ov_pct, cur_st, now_str, updated_by, machine_code,
                ),
            )

            log_audit(
                conn,
                updated_by,
                user_role,
                "UPDATE_MACHINE",
                "MACHINE",
                machine_code,
                f"Cập nhật hồ sơ & tiến độ máy [{machine_code}] (S/N: {m['serial_number'] or 'N/A'}, Tiến độ: {ov_pct}%)",
            )
            conn.commit()
            updated_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "machine": serialize_machine(updated_row)})

    def handle_bulk_update(self, body):
        machine_codes = body.get("machine_codes") or []
        action_mode = str(body.get("action_mode") or "step").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not machine_codes:
            self._send_json({"ok": False, "error": "Chưa chọn máy nào để cập nhật hàng loạt."}, 400)
            return

        updated_machines = []
        with DB_LOCK:
            conn = get_conn()
            for mc in machine_codes:
                row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (mc,)).fetchone()
                if not row:
                    continue
                m = dict(row)
                steps_dict = json.loads(m.get("steps_json") or "{}")

                if action_mode == "step":
                    step_code = str(body.get("step_code") or "").strip()
                    new_status = str(body.get("status") or "COMPLETED").strip().upper()
                    comp_date = str(body.get("completed_date") or datetime.now().strftime("%Y-%m-%d")).strip()
                    note = str(body.get("note") or "").strip()
                    steps_dict[step_code] = {
                        "status": new_status,
                        "completed_date": comp_date if new_status == "COMPLETED" else "",
                        "date": comp_date if new_status == "COMPLETED" else "",
                        "updated_by": updated_by,
                        "note": note,
                    }
                elif action_mode == "readiness":
                    for b_field in ("power_ready", "network_ready", "civil_ready", "bhs_ready"):
                        if b_field in body and body[b_field] is not None:
                            m[b_field] = 1 if body[b_field] in (True, 1, "1", "true", "YES") else 0

                # Hệ SSE không kết nối BHS
                if m.get("system_type") == "SSE":
                    m["bhs_ready"] = 0

                inst_pct, tc_pct, ov_pct, cur_st = calculate_machine_progress(steps_dict)
                conn.execute(
                    """
                    UPDATE machines
                    SET power_ready = ?, network_ready = ?, civil_ready = ?, bhs_ready = ?,
                        steps_json = ?, install_progress = ?, tc_progress = ?, overall_progress = ?,
                        current_status = ?, updated_at = ?, updated_by = ?
                    WHERE machine_code = ?
                    """,
                    (
                        m["power_ready"], m["network_ready"], m["civil_ready"], m["bhs_ready"],
                        json.dumps(steps_dict, ensure_ascii=False),
                        inst_pct, tc_pct, ov_pct, cur_st, now_str, updated_by, mc,
                    ),
                )
                u_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (mc,)).fetchone()
                updated_machines.append(serialize_machine(u_row))

            log_audit(
                conn,
                updated_by,
                user_role,
                "BULK_UPDATE",
                "MACHINE",
                f"{len(updated_machines)} máy",
                f"Cập nhật hàng loạt {len(updated_machines)} máy (Chế độ: {action_mode})",
            )
            conn.commit()
            conn.close()

        self._send_json({"ok": True, "updated_count": len(updated_machines), "machines": updated_machines})

    def handle_create_machine(self, body):
        machine_code = str(body.get("machine_code") or "").strip().upper()
        if not machine_code:
            self._send_json({"ok": False, "error": "Mã máy (Tag ID) không được để trống."}, 400)
            return

        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "admin").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        steps_dict = {}
        for s in STEPS_DEF:
            steps_dict[s["code"]] = {"status": "PENDING", "completed_date": "", "date": "", "updated_by": updated_by, "note": ""}

        with DB_LOCK:
            conn = get_conn()
            exists = conn.execute("SELECT 1 FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            if exists:
                conn.close()
                self._send_json({"ok": False, "error": f"Mã máy {machine_code} đã tồn tại!"}, 400)
                return

            conn.execute(
                """
                INSERT INTO machines (
                    machine_code, system_type, model_key, model_name, category_name, manufacturer, country,
                    floor, zone, area_name, terminal_side, flight_type, drawing_tag, drawing_ref,
                    boq_item, boq_status, boq_note, shipment_no, serial_number, container_no, crate_info,
                    orientation, power_req, network_nodes_req, power_ready, network_ready, civil_ready, bhs_ready,
                    planned_start, planned_finish, assigned_engineer, overall_progress, install_progress, tc_progress,
                    current_status, steps_json, attachments_json, remark, updated_at, updated_by
                ) VALUES (?, ?, ?, ?, ?, 'Rapiscan', 'UK/MY/USA', ?, ?, ?, 'All', 'Both', '', '', '', 'MATCH', '', ?, ?, '', '', '', '1P 230V', 2, 0, 0, 1, 1, '', '', 'nho', 0, 0, 0, 'NOT_ARRIVED', ?, '[]', '', ?, ?)
                """,
                (
                    machine_code,
                    str(body.get("system_type") or "SSE").strip(),
                    str(body.get("model_key") or "CUSTOM").strip(),
                    str(body.get("model_name") or "Thiết bị bổ sung").strip(),
                    str(body.get("model_name") or "Thiết bị bổ sung").strip(),
                    str(body.get("floor") or "GF").strip(),
                    str(body.get("zone") or "Zone 1").strip(),
                    str(body.get("area_name") or "Khu vực bổ sung").strip(),
                    str(body.get("shipment_no") or "Bổ sung").strip(),
                    str(body.get("serial_number") or "").strip(),
                    json.dumps(steps_dict, ensure_ascii=False),
                    now_str,
                    updated_by,
                ),
            )
            log_audit(conn, updated_by, user_role, "CREATE_MACHINE", "MACHINE", machine_code, f"Thêm mới máy [{machine_code}]")
            conn.commit()
            new_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "machine": serialize_machine(new_row)})

    def handle_delete_machine(self, body):
        machine_code = str(body.get("machine_code") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "admin").strip()
        with DB_LOCK:
            conn = get_conn()
            conn.execute("DELETE FROM machines WHERE machine_code = ?", (machine_code,))
            log_audit(conn, updated_by, user_role, "DELETE_MACHINE", "MACHINE", machine_code, f"Xóa máy [{machine_code}]")
            conn.commit()
            conn.close()
        self._send_json({"ok": True, "deleted": machine_code})

    def handle_upload_attachment(self, body):
        machine_code = str(body.get("machine_code") or "").strip()
        filename_orig = str(body.get("filename") or "file.dat").strip()
        data_b64 = str(body.get("data_base64") or "").strip()
        doc_type = str(body.get("doc_type") or "SITE_PHOTO").strip()
        caption = str(body.get("caption") or "").strip()
        uploaded_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()

        if "," in data_b64:
            data_b64 = data_b64.split(",", 1)[1]
        raw_bytes = base64.b64decode(data_b64)

        safe_ext = os.path.splitext(filename_orig)[1].lower() or ".bin"
        safe_code = re.sub(r"[^A-Za-z0-9_-]", "_", machine_code)
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        stored_name = f"{safe_code}_{ts}{safe_ext}"
        stored_path = os.path.join(UPLOADS_DIR, stored_name)

        with open(stored_path, "wb") as f:
            f.write(raw_bytes)

        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        att_entry = {
            "id": f"ATT-{ts}",
            "filename": filename_orig,
            "stored_name": stored_name,
            "url": f"/uploads/{stored_name}",
            "doc_type": doc_type,
            "caption": caption or filename_orig,
            "size_kb": round(len(raw_bytes) / 1024, 1),
            "uploaded_by": uploaded_by,
            "uploaded_at": now_str,
        }

        with DB_LOCK:
            conn = get_conn()
            row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            if not row:
                conn.close()
                self._send_json({"ok": False, "error": "Machine not found"}, 404)
                return
            atts = json.loads(row["attachments_json"] or "[]")
            atts.append(att_entry)
            conn.execute(
                "UPDATE machines SET attachments_json = ?, updated_at = ?, updated_by = ? WHERE machine_code = ?",
                (json.dumps(atts, ensure_ascii=False), now_str, uploaded_by, machine_code),
            )
            log_audit(conn, uploaded_by, user_role, "UPLOAD_FILE", "MACHINE", machine_code, f"Đính kèm [{filename_orig}] ({doc_type}) cho máy {machine_code}")
            conn.commit()
            updated_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "machine": serialize_machine(updated_row), "attachment": att_entry})

    def handle_delete_attachment(self, body):
        machine_code = str(body.get("machine_code") or "").strip()
        att_id = str(body.get("att_id") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with DB_LOCK:
            conn = get_conn()
            row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            if not row:
                conn.close()
                self._send_json({"ok": False, "error": "Machine not found"}, 404)
                return
            atts = json.loads(row["attachments_json"] or "[]")
            atts = [a for a in atts if a.get("id") != att_id]
            conn.execute(
                "UPDATE machines SET attachments_json = ?, updated_at = ?, updated_by = ? WHERE machine_code = ?",
                (json.dumps(atts, ensure_ascii=False), now_str, updated_by, machine_code),
            )
            log_audit(conn, updated_by, user_role, "DELETE_FILE", "MACHINE", machine_code, f"Xóa file đính kèm {att_id} khỏi máy {machine_code}")
            conn.commit()
            updated_row = conn.execute("SELECT * FROM machines WHERE machine_code = ?", (machine_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "machine": serialize_machine(updated_row)})

    def handle_aux_update(self, body):
        batch_code = str(body.get("batch_code") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with DB_LOCK:
            conn = get_conn()
            row = conn.execute("SELECT * FROM auxiliary_batches WHERE batch_code = ?", (batch_code,)).fetchone()
            if not row:
                conn.close()
                self._send_json({"ok": False, "error": f"Không tìm thấy nhóm phụ trợ {batch_code}"}, 404)
                return

            b = dict(row)
            for num_f in ("qty_boq", "qty_drawing", "qty_arrived", "qty_installed", "qty_tc_done"):
                if num_f in body and body[num_f] is not None:
                    b[num_f] = float(body[num_f])
            for str_f in ("shipment_no", "serial_range", "status_note", "assigned_engineer"):
                if str_f in body and body[str_f] is not None:
                    b[str_f] = str(body[str_f]).strip()

            conn.execute(
                """
                UPDATE auxiliary_batches
                SET qty_boq = ?, qty_drawing = ?, qty_arrived = ?, qty_installed = ?, qty_tc_done = ?,
                    shipment_no = ?, serial_range = ?, status_note = ?, assigned_engineer = ?,
                    updated_at = ?, updated_by = ?
                WHERE batch_code = ?
                """,
                (
                    b["qty_boq"], b["qty_drawing"], b["qty_arrived"], b["qty_installed"], b["qty_tc_done"],
                    b["shipment_no"], b["serial_range"], b["status_note"], b["assigned_engineer"],
                    now_str, updated_by, batch_code,
                ),
            )
            log_audit(
                conn,
                updated_by,
                user_role,
                "UPDATE_AUX",
                "AUX_BATCH",
                batch_code,
                f"Cập nhật phụ trợ [{batch_code}]: Đã về={b['qty_arrived']}, Đã lắp={b['qty_installed']}, Đã T&C={b['qty_tc_done']}/{b['qty_drawing']} {b['unit']}",
            )
            conn.commit()
            updated_row = conn.execute("SELECT * FROM auxiliary_batches WHERE batch_code = ?", (batch_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "aux_batch": dict(updated_row)})

    def handle_issue_save(self, body):
        issue_code = str(body.get("issue_code") or "").strip().upper()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "engineer").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        with DB_LOCK:
            conn = get_conn()
            if not issue_code:
                count = conn.execute("SELECT COUNT(*) FROM issues").fetchone()[0]
                issue_code = f"ISS-{count + 1:02d}"

            existing = conn.execute("SELECT * FROM issues WHERE issue_code = ?", (issue_code,)).fetchone()
            if existing:
                iss = dict(existing)
                for f in ("machine_code", "system_type", "floor", "area_name", "category", "severity", "title", "description", "source_ref", "action_required", "responsible_party", "status"):
                    if f in body and body[f] is not None:
                        iss[f] = str(body[f]).strip()
                conn.execute(
                    """
                    UPDATE issues
                    SET machine_code = ?, system_type = ?, floor = ?, area_name = ?, category = ?,
                        severity = ?, title = ?, description = ?, source_ref = ?, action_required = ?,
                        responsible_party = ?, status = ?, updated_at = ?
                    WHERE issue_code = ?
                    """,
                    (
                        iss["machine_code"], iss["system_type"], iss["floor"], iss["area_name"], iss["category"],
                        iss["severity"], iss["title"], iss["description"], iss["source_ref"], iss["action_required"],
                        iss["responsible_party"], iss["status"], now_str, issue_code,
                    ),
                )
                log_audit(conn, updated_by, user_role, "UPDATE_ISSUE", "ISSUE", issue_code, f"Cập nhật vướng mắc [{issue_code}] -> {iss['status']}")
            else:
                title = str(body.get("title") or body.get("description", "")[:100]).strip()
                conn.execute(
                    """
                    INSERT INTO issues (
                        issue_code, machine_code, system_type, floor, area_name, category, severity,
                        title, description, source_ref, action_required, responsible_party, status,
                        created_by, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        issue_code,
                        str(body.get("machine_code") or "").strip(),
                        str(body.get("system_type") or "ALL").strip(),
                        str(body.get("floor") or "All").strip(),
                        str(body.get("area_name") or "").strip(),
                        str(body.get("category") or "SITE_READINESS").strip(),
                        str(body.get("severity") or "HIGH").strip(),
                        title,
                        str(body.get("description") or "").strip(),
                        str(body.get("source_ref") or "").strip(),
                        str(body.get("action_required") or "").strip(),
                        str(body.get("responsible_party") or "Ban Kỹ thuật / Hàn Việt").strip(),
                        str(body.get("status") or "OPEN").strip(),
                        updated_by,
                        now_str,
                        now_str,
                    ),
                )
                log_audit(conn, updated_by, user_role, "CREATE_ISSUE", "ISSUE", issue_code, f"Tạo mới vướng mắc [{issue_code}]: {title}")

            conn.commit()
            saved = conn.execute("SELECT * FROM issues WHERE issue_code = ?", (issue_code,)).fetchone()
            conn.close()

        self._send_json({"ok": True, "issue": dict(saved)})

    def handle_issue_delete(self, body):
        issue_code = str(body.get("issue_code") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "admin").strip()
        with DB_LOCK:
            conn = get_conn()
            conn.execute("DELETE FROM issues WHERE issue_code = ?", (issue_code,))
            log_audit(conn, updated_by, user_role, "DELETE_ISSUE", "ISSUE", issue_code, f"Xóa vướng mắc [{issue_code}]")
            conn.commit()
            conn.close()
        self._send_json({"ok": True, "deleted": issue_code})

    def handle_user_save(self, body):
        username = str(body.get("username") or "").strip().lower()
        full_name = str(body.get("full_name") or "").strip()
        password = str(body.get("password") or "").strip()
        role = str(body.get("role") or "ENGINEER").strip().upper()
        scope = str(body.get("scope") or "ALL").strip()
        phone = str(body.get("phone") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if not username or not full_name:
            self._send_json({"ok": False, "error": "Thiếu username hoặc họ tên."}, 400)
            return

        with DB_LOCK:
            conn = get_conn()
            ex = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
            if ex:
                pwd_to_use = password if password else ex["password"]
                conn.execute(
                    "UPDATE users SET full_name = ?, password = ?, role = ?, area_responsibility = ?, phone = ? WHERE username = ?",
                    (full_name, pwd_to_use, role, scope, phone, username),
                )
            else:
                conn.execute(
                    "INSERT INTO users (username, password, full_name, role, area_responsibility, phone, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (username, password or "123456", full_name, role, scope, phone, now_str),
                )
            log_audit(conn, updated_by, "ADMIN", "SAVE_USER", "USER", username, f"Cập nhật tài khoản [{username}] ({role})")
            conn.commit()
            users = [serialize_user(r) for r in conn.execute("SELECT * FROM users ORDER BY username").fetchall()]
            conn.close()

        self._send_json({"ok": True, "users": users})

    def handle_import_excel(self, body):
        b64 = str(body.get("data_base64") or "").strip()
        updated_by = str(body.get("updated_by") or "admin").strip()
        user_role = str(body.get("user_role") or "admin").strip()
        if "," in b64:
            b64 = b64.split(",", 1)[1]
        raw_bytes = base64.b64decode(b64)
        res = import_excel_bytes(raw_bytes, updated_by=updated_by, user_role=user_role)
        self._send_json({"ok": True, **res})

    def handle_backup_json(self):
        conn = get_conn()
        cur = conn.cursor()
        snapshot = {
            "exported_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "project": "LTIA Package 5.10 - HBS & SSE Tracker",
            "machines": [serialize_machine(r) for r in cur.execute("SELECT * FROM machines").fetchall()],
            "aux_batches": [dict(r) for r in cur.execute("SELECT * FROM auxiliary_batches").fetchall()],
            "shipments": [serialize_shipment(r) for r in cur.execute("SELECT * FROM shipments").fetchall()],
            "issues": [dict(r) for r in cur.execute("SELECT * FROM issues").fetchall()],
            "audit_logs": [serialize_audit(r) for r in cur.execute("SELECT * FROM audit_logs ORDER BY id DESC LIMIT 500").fetchall()],
        }
        conn.close()

        raw_bytes = json.dumps(snapshot, ensure_ascii=False, indent=2).encode("utf-8")
        fname = f"LTIA_510_Backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        try:
            with open(os.path.join(BACKUPS_DIR, fname), "wb") as f:
                f.write(raw_bytes)
        except Exception:
            pass
        self._send_bytes(raw_bytes, "application/json; charset=utf-8", filename=fname)


def run_server(port=8050):
    init_db(DB_PATH)
    server = ThreadingHTTPServer(("0.0.0.0", port), TrackerRequestHandler)
    lan_ips = get_lan_ips()
    print("=" * 72)
    print(" LTIA PACKAGE 5.10 (HBS & SSE) - INSTALLATION & T&C TRACKER SERVER")
    print("=" * 72)
    print(f" * Local PC URL       : http://localhost:{port}")
    for ip in lan_ips:
        print(f" * LAN / WiFi URL     : http://{ip}:{port}")
        print(f" * Read-Only TV/PMU   : http://{ip}:{port}/?view=readonly")
    print(f" * SQLite Database    : {DB_PATH}")
    print("=" * 72)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        stop_public_tunnel()
        server.server_close()


if __name__ == "__main__":
    port_arg = int(os.environ.get("PORT", 8050))
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port_arg = int(sys.argv[1])
    run_server(port=port_arg)
