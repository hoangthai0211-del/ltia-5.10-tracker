# -*- coding: utf-8 -*-
"""
Database Initialization & Real Data Seeding for LTIA Package 5.10 (HBS & SSE)
Installation & T&C Progress Tracking Web Application.
"""

import os
import re
import json
import sqlite3
import datetime
import sys

# Ensure we can import from Approval Drawing\scripts
WORKSPACE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SCRIPTS_DIR = os.path.join(WORKSPACE_ROOT, "Approval Drawing", "scripts")
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

try:
    from boq_and_drawing_data import (
        SHIPMENT_INDEX_DATA,
        BOQ_MASTER_DATA,
        DRAWING_EQUIPMENT_DATA,
        ISSUES_LOG_DATA,
    )
    from pl_detail_builder import build_all_pl_details
except ImportError:
    SHIPMENT_INDEX_DATA = []
    BOQ_MASTER_DATA = []
    DRAWING_EQUIPMENT_DATA = []
    ISSUES_LOG_DATA = []

    def build_all_pl_details(*args, **kwargs):
        return {}

STEPS_DEFINITION = [
    {
        "code": "STEP_1_INCOMING",
        "order": 1,
        "phase": "INSTALLATION",
        "name": "1. Hàng về kho/site",
        "short_name": "Hàng về",
        "en_name": "Incoming Material",
        "weight": 10,
    },
    {
        "code": "STEP_2_POSITIONING",
        "order": 2,
        "phase": "INSTALLATION",
        "name": "2. Đưa vào vị trí",
        "short_name": "Vị trí",
        "en_name": "Positioning",
        "weight": 10,
    },
    {
        "code": "STEP_3_MECHANICAL",
        "order": 3,
        "phase": "INSTALLATION",
        "name": "3. Lắp cơ khí",
        "short_name": "Cơ khí",
        "en_name": "Mechanical Installation",
        "weight": 15,
    },
    {
        "code": "STEP_4_POWER_DATA",
        "order": 4,
        "phase": "INSTALLATION",
        "name": "4. Đấu điện & Mạng",
        "short_name": "Điện/Mạng",
        "en_name": "Power & Data Connection",
        "weight": 10,
    },
    {
        "code": "STEP_5_INST_INSPECT",
        "order": 5,
        "phase": "INSTALLATION",
        "name": "5. Nghiệm thu lắp đặt",
        "short_name": "NT Lắp đặt",
        "en_name": "Installation Inspection",
        "weight": 10,
    },
    {
        "code": "STEP_6_POWER_ON",
        "order": 6,
        "phase": "TC",
        "name": "6. Cấp nguồn & Cấu hình",
        "short_name": "Cấp nguồn",
        "en_name": "Power-on & Config",
        "weight": 10,
    },
    {
        "code": "STEP_7_SAT",
        "order": 7,
        "phase": "TC",
        "name": "7. Chạy thử độc lập (SAT)",
        "short_name": "SAT",
        "en_name": "Site Acceptance Test (SAT)",
        "weight": 15,
    },
    {
        "code": "STEP_8_ISAT",
        "order": 8,
        "phase": "TC",
        "name": "8. Tích hợp hệ thống (ISAT)",
        "short_name": "ISAT",
        "en_name": "Integrated SAT (BHS/WS)",
        "weight": 10,
    },
    {
        "code": "STEP_9_HANDOVER",
        "order": 9,
        "phase": "TC",
        "name": "9. Kiểm định & Bàn giao",
        "short_name": "Bàn giao",
        "en_name": "Certification & Handover",
        "weight": 10,
    },
]

DEFAULT_USERS = [
    ("thai", "123456", "Thái (Quản trị viên)", "ADMIN", "Toàn bộ dự án 5.10 (HBS & SSE)", "090xxxxxxx"),
    ("hanviet", "123456", "Kỹ sư Nhà thầu Hàn Việt", "ENGINEER", "Đội thi công lắp đặt & T&C", ""),
    ("viewer", "123456", "Khách / PMU / TVGS (Chỉ xem)", "VIEWER", "Xem báo cáo & Dashboard", ""),
]


def init_db(db_path):
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    cur.executescript(
        """
        CREATE TABLE IF NOT EXISTS users (
            username TEXT PRIMARY KEY,
            password TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL,
            area_responsibility TEXT,
            phone TEXT,
            created_at TEXT
        );

        CREATE TABLE IF NOT EXISTS shipments (
            lo_no TEXT PRIMARY KEY,
            lo_num INTEGER,
            folder TEXT,
            bl_awb TEXT,
            arrival_date TEXT,
            pkgs_pl INTEGER,
            pkgs_bl INTEGER,
            nw_pl REAL,
            gw_pl REAL,
            gw_bl REAL,
            docs TEXT,
            source_ref TEXT,
            note TEXT
        );

        CREATE TABLE IF NOT EXISTS machines (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            machine_code TEXT UNIQUE NOT NULL,
            system_type TEXT NOT NULL,          -- 'HBS' or 'SSE'
            model_key TEXT NOT NULL,            -- e.g. 'RAP-RTT110'
            model_name TEXT NOT NULL,           -- e.g. 'RTT110'
            category_name TEXT NOT NULL,        -- Vietnamese category name
            manufacturer TEXT,
            country TEXT,
            floor TEXT NOT NULL,                -- 'GF', '1F', '2F', '3F', 'DC'
            zone TEXT NOT NULL,                 -- e.g. 'Zone 1-7', 'West', 'East'
            area_name TEXT NOT NULL,            -- Detailed location name
            terminal_side TEXT,                 -- 'West', 'East', 'Center', 'All'
            flight_type TEXT,                   -- 'International', 'Domestic', 'Both'
            drawing_tag TEXT,
            drawing_ref TEXT,
            boq_item TEXT,
            boq_status TEXT,                    -- 'MATCH', 'DESIGN_CHANGE', 'REALLOCATED', 'FUTURE_PROVISION'
            boq_note TEXT,
            shipment_no TEXT,                   -- 'Lô 01'..'Lô 14' or 'Chưa về'
            serial_number TEXT,
            container_no TEXT,
            crate_info TEXT,
            orientation TEXT,                   -- 'LHS', 'RHS', ''
            power_req TEXT,
            network_nodes_req INTEGER DEFAULT 2,
            power_ready INTEGER DEFAULT 0,      -- 0: Chưa có, 1: Đã có
            network_ready INTEGER DEFAULT 0,    -- 0: Chưa có, 1: Đã có
            civil_ready INTEGER DEFAULT 1,      -- 0: Vướng mặt bằng, 1: Sẵn sàng
            bhs_ready INTEGER DEFAULT 1,        -- 0: Chưa sẵn sàng, 1: Sẵn sàng
            planned_start TEXT,
            planned_finish TEXT,
            assigned_engineer TEXT,
            overall_progress REAL DEFAULT 0,
            install_progress REAL DEFAULT 0,
            tc_progress REAL DEFAULT 0,
            current_status TEXT DEFAULT 'NOT_STARTED', -- 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'
            steps_json TEXT NOT NULL,           -- JSON dict of 9 steps
            attachments_json TEXT DEFAULT '[]', -- JSON list of photos/docs
            remark TEXT DEFAULT '',
            updated_at TEXT,
            updated_by TEXT
        );

        CREATE TABLE IF NOT EXISTS auxiliary_batches (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            batch_code TEXT UNIQUE NOT NULL,
            system_type TEXT NOT NULL,
            model_key TEXT NOT NULL,
            item_name TEXT NOT NULL,
            floor TEXT NOT NULL,
            area_name TEXT NOT NULL,
            unit TEXT NOT NULL,
            qty_boq REAL DEFAULT 0,
            qty_drawing REAL DEFAULT 0,
            qty_arrived REAL DEFAULT 0,
            qty_installed REAL DEFAULT 0,
            qty_tc_done REAL DEFAULT 0,
            shipment_no TEXT,
            serial_range TEXT,
            boq_item TEXT,
            drawing_tag TEXT,
            status_note TEXT,
            assigned_engineer TEXT,
            updated_at TEXT,
            updated_by TEXT
        );

        CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            issue_code TEXT UNIQUE NOT NULL,
            machine_code TEXT,                  -- Nullable if project-wide issue
            system_type TEXT,                   -- 'HBS', 'SSE', 'ALL'
            floor TEXT,
            area_name TEXT,
            category TEXT,                      -- 'SHIPMENT_PL', 'DESIGN_BOQ', 'SITE_CIVIL', 'POWER_DATA', 'TECHNICAL_TC'
            severity TEXT DEFAULT 'HIGH',       -- 'HIGH', 'MEDIUM', 'LOW'
            title TEXT NOT NULL,
            description TEXT,
            source_ref TEXT,
            action_required TEXT,
            responsible_party TEXT,
            status TEXT DEFAULT 'OPEN',         -- 'OPEN', 'IN_PROGRESS', 'RESOLVED'
            created_by TEXT,
            created_at TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS audit_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT NOT NULL,
            username TEXT NOT NULL,
            user_fullname TEXT,
            action_type TEXT NOT NULL,
            target_code TEXT,
            summary TEXT NOT NULL,
            details_json TEXT
        );
        """
    )

    # Check if already seeded
    cur.execute("SELECT COUNT(*) FROM machines")
    if cur.fetchone()[0] > 0:
        conn.close()
        return False

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 1. Seed Users
    for u in DEFAULT_USERS:
        cur.execute(
            """
            INSERT OR IGNORE INTO users (username, password, full_name, role, area_responsibility, phone, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (*u, now_str),
        )

    # 2. Seed Shipments (16 Lô hàng đầy đủ)
    shipment_15 = {
        "lo_no": "Lô 15",
        "lo_num": 15,
        "folder": "15. Shipment 15_4xIT5X",
        "bl_awb": "HAWB SAEVW0028729",
        "arrival_date": "12/06/2026 (Ngày TK: 12/06/2026)",
        "pkgs_pl": 9,
        "pkgs_bl": 9,
        "nw_pl": 166.0,
        "gw_pl": 166.0,
        "gw_bl": 166.0,
        "docs": "Tờ khai HQ 108333589450 (12/06/2026), HAWB SAEVW0028729, PL (PDF 1 trang), COO, COQ, FAT Reports",
        "source_ref": "PL_4xIT5X_LTIA 241127.pdf; HAWB SAEVW0028729; Tờ khai HQ 108333589450",
        "note": "04 máy dò chất nổ Itemiser 5X cho hệ thống HBS (42200) từ Rapiscan USA (Andover, MA). S/N: 25-14757, 25-14755, 25-14758, 25-14799.",
    }
    shipment_16 = {
        "lo_no": "Lô 16",
        "lo_num": 16,
        "folder": "16. Shipment 16_20xIT5X",
        "bl_awb": "4120820901 / HAWB 23Z0242663",
        "arrival_date": "16/10/2026 (Ngày TK: 16/10/2026)",
        "pkgs_pl": 40,
        "pkgs_bl": 40,
        "nw_pl": 763.0,
        "gw_pl": 763.0,
        "gw_bl": 763.0,
        "docs": "Tờ khai HQ 108727140760 (16/10/2026), HAWB 23Z0242663 (4120820901), PL (PDF 1 trang), COO, COQ, FAT Reports",
        "source_ref": "Packing List_Sep 26.pdf; HAWB 23Z0242663; Tờ khai HQ 108727140760",
        "note": "20 máy dò chất nổ Itemiser 5X cho hệ thống SSE (42100) từ Rapiscan USA (Andover, MA). S/N: 25-15732, 25-15734, 25-15749, 25-15730, 25-15731, 25-15733, 25-15729, 25-15728, 25-15750, 25-15739, 25-15736, 25-15738, 25-15751, 25-15737, 25-15747, 25-15735, 25-15744, 25-15743, 25-15742, 25-15740.",
    }
    all_shipments = list(SHIPMENT_INDEX_DATA) + [shipment_15, shipment_16]

    shipment_arrival_map = {}
    for s in all_shipments:
        # Extract date dd/mm/yyyy from arrival_date
        m_date = re.search(r"(\d{2})/(\d{2})/(\d{4})", s["arrival_date"])
        iso_date = f"{m_date.group(3)}-{m_date.group(2)}-{m_date.group(1)}" if m_date else "2026-07-01"
        shipment_arrival_map[s["lo_no"]] = iso_date
        cur.execute(
            """
            INSERT INTO shipments (lo_no, lo_num, folder, bl_awb, arrival_date, pkgs_pl, pkgs_bl, nw_pl, gw_pl, gw_bl, docs, source_ref, note)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                s["lo_no"],
                s["lo_num"],
                s["folder"],
                s["bl_awb"],
                s["arrival_date"],
                s["pkgs_pl"],
                s["pkgs_bl"],
                s["nw_pl"],
                s["gw_pl"],
                s["gw_bl"],
                s["docs"],
                s["source_ref"],
                s["note"],
            ),
        )

    # Extract real serial numbers & container info from PL_Detail
    shipments_dir = os.path.join(WORKSPACE_ROOT, "Approval Drawing", "shipments_data")
    pl_rows = build_all_pl_details(shipments_dir)

    # Build queues of arrived units per model_key with exact S/N, shipment_no, container, crate_info
    arrived_pools = {
        "RAP-RTT110": [],
        "RAP-928DX-HBS": [],
        "RAP-928DX-SSE": [],
        "RAP-632DV-HBS": [],
        "RAP-632DV-SSE": [],
        "RAP-920CT": [],
        "RAP-TRS-920CT": [],
        "RAP-TRS-920DX": [],
        "RAP-920DX": [],
        "RS-QPS201": [],
        "RAP-METOR6E": [],
        "RAP-MATRIX30-CMS": [],
        "RAP-ITEMISER5X": [],
    }

    # Add 4 units for HBS (Lô 15) and 20 units for SSE (Lô 16)
    for sn15 in ["25-14757", "25-14755", "25-14758", "25-14799"]:
        arrived_pools["RAP-ITEMISER5X"].append({
            "lo_no": "Lô 15",
            "sn": sn15,
            "cntr": "HAWB SAEVW0028729",
            "crate": "Lô 15 - Crate (Itemiser 5X Cargo, Andover MA)",
            "hand": "",
        })

    for sn16 in [
        "25-15732", "25-15734", "25-15749", "25-15730", "25-15731",
        "25-15733", "25-15729", "25-15728", "25-15750", "25-15739",
        "25-15736", "25-15738", "25-15751", "25-15737", "25-15747",
        "25-15735", "25-15744", "25-15743", "25-15742", "25-15740"
    ]:
        arrived_pools["RAP-ITEMISER5X"].append({
            "lo_no": "Lô 16",
            "sn": sn16,
            "cntr": "4120820901",
            "crate": "Lô 16 - Crate (Itemiser 5X Cargo, Andover MA)",
            "hand": "",
        })

    for r in pl_rows:
        mk = r["model_key"]
        lo = r["lo_no"]
        case_no = r["case_no"]
        desc = r["orig_desc"]
        note = r["note"]

        if mk == "RAP-RTT110" and r["group"] == "Main Equipment":
            if lo == "Lô 01":
                for i in range(1, 7):
                    arrived_pools["RAP-RTT110"].append({
                        "lo_no": "Lô 01",
                        "sn": f"RTT110-S01-{i:02d}",
                        "cntr": "B/L 2CFE5050011",
                        "crate": f"Lô 01 - Unit #{i} (3 Crates, 7,650 kg GW)",
                        "hand": "",
                    })
            elif lo == "Lô 05":
                for i in range(7, 12):
                    arrived_pools["RAP-RTT110"].append({
                        "lo_no": "Lô 05",
                        "sn": f"RTT110-S05-{i:02d}",
                        "cntr": "B/L MAN250001010",
                        "crate": f"Lô 05 - Unit #{i} (7,620 kg GW, kèm UPS 30kVA)",
                        "hand": "",
                    })
            elif lo == "Lô 13":
                arrived_pools["RAP-RTT110"].append({
                    "lo_no": "Lô 13",
                    "sn": "1M11251105",
                    "cntr": "HAWB 4750566615",
                    "crate": "Lô 13 - Crates 1..3 (7,746 kg GW)",
                    "hand": "",
                })

        elif mk in ("RAP-928DX-HBS", "RAP-928DX-SSE") and r["group"] == "Main Equipment":
            m_sn = re.search(r"S/N\s*(\d+)", case_no)
            sn = m_sn.group(1) if m_sn else ""
            m_cntr = re.search(r"Cntr\s*([A-Z0-9]+)", case_no)
            cntr = m_cntr.group(1) if m_cntr else ""
            arrived_pools[mk].append({
                "lo_no": lo,
                "sn": sn,
                "cntr": cntr,
                "crate": case_no,
                "hand": "LHS",
            })

        elif mk in ("RAP-632DV-HBS", "RAP-632DV-SSE") and r["group"] == "Main Equipment":
            m_sn = re.search(r"S/N\s*(\d+)", case_no)
            sn = m_sn.group(1) if m_sn else ""
            m_cntr = re.search(r"Cntr\s*([A-Z0-9]+)", case_no)
            cntr = m_cntr.group(1) if m_cntr else ""
            arrived_pools[mk].append({
                "lo_no": lo,
                "sn": sn,
                "cntr": cntr,
                "crate": case_no,
                "hand": "Dual-View",
            })

        elif mk == "RAP-920DX" and r["group"] == "Main Equipment":
            sns = re.findall(r"625\d{4}", case_no)
            m_cntr = re.search(r"Cntr\s*([A-Z0-9]+)", case_no)
            cntr = m_cntr.group(1) if m_cntr else ""
            hand = "RHS" if "RHS" in desc else "LHS"
            for sn in sns:
                arrived_pools["RAP-920DX"].append({
                    "lo_no": lo,
                    "sn": sn,
                    "cntr": cntr,
                    "crate": f"{r['source_file']} ({cntr})",
                    "hand": hand,
                })

        elif mk == "RAP-920CT" and r["group"] == "Main Equipment":
            if lo == "Lô 04":
                arrived_pools["RAP-920CT"].append({
                    "lo_no": "Lô 04",
                    "sn": "1253054",
                    "cntr": "B/L S00107882",
                    "crate": "Lô 04 - Pkg 1 (LHS, 2,585 kg GW)",
                    "hand": "LHS",
                })
            elif lo == "Lô 07":
                s7_sns = [
                    ("1253057", "LHS"),
                    ("1253063", "LHS"),
                    ("1253069", "RHS"),
                    ("1253070", "RHS"),
                    ("1253071", "RHS"),
                    ("1253072", "RHS"),
                ]
                for sn, h in s7_sns:
                    arrived_pools["RAP-920CT"].append({
                        "lo_no": "Lô 07",
                        "sn": sn,
                        "cntr": "B/L S00107877",
                        "crate": f"Lô 07 - Wooden Crate ({h})",
                        "hand": h,
                    })
            elif lo == "Lô 08":
                s8_sns = [
                    ("1253055", "LHS"),
                    ("1253058", "LHS"),
                    ("1253061", "LHS"),
                    ("1253064", "LHS"),
                    ("1253066", "LHS"),
                    ("1253075", "RHS"),
                    ("1253077", "RHS"),
                    ("1253079", "RHS"),
                    ("1253080", "RHS"),
                ]
                for sn, h in s8_sns:
                    arrived_pools["RAP-920CT"].append({
                        "lo_no": "Lô 08",
                        "sn": sn,
                        "cntr": "B/L LGB2601004",
                        "crate": f"Lô 08 - Wooden Crate ({h})",
                        "hand": h,
                    })
            elif lo == "Lô 09":
                for idx in range(1, 13):
                    h = "LHS" if idx <= 6 else "RHS"
                    arrived_pools["RAP-920CT"].append({
                        "lo_no": "Lô 09",
                        "sn": f"920CT-S09-{idx:02d} ({h})",
                        "cntr": "B/L LGB260000060",
                        "crate": f"Lô 09 - Pkg #{idx} ({h})",
                        "hand": h,
                    })

        elif mk in ("RAP-TRS-920CT", "RAP-TRS-920DX") and r["group"] == "Main Equipment":
            m_cntr = re.search(r"Cntr\s*([A-Z0-9\-]+)", case_no)
            cntr = m_cntr.group(1) if m_cntr else ""
            m_sn = re.search(r"(625\d+[A-Z0-9\-]+|Lane\s+L\d+\s*\([A-Z]+\))", case_no)
            sn = m_sn.group(1) if m_sn else case_no
            hand = "LH" if "LH" in desc else "RH"
            arrived_pools[mk].append({
                "lo_no": lo,
                "sn": sn,
                "cntr": cntr,
                "crate": case_no,
                "hand": hand,
            })

        elif mk == "RS-QPS201" and r["group"] == "Main Equipment":
            if lo == "Lô 06":
                for sn in ["110018", "110021", "110022"]:
                    arrived_pools["RS-QPS201"].append({
                        "lo_no": "Lô 06",
                        "sn": sn,
                        "cntr": "HAWB MUC85045225",
                        "crate": f"Lô 06 - Pallet QPS201 (S/N {sn})",
                        "hand": "",
                    })
            elif lo == "Lô 11":
                s11_sns = [str(x) for x in range(110024, 110034)] + [str(x) for x in range(110035, 110039)]
                for sn in s11_sns:
                    arrived_pools["RS-QPS201"].append({
                        "lo_no": "Lô 11",
                        "sn": sn,
                        "cntr": "HAWB MUC85052699",
                        "crate": f"Lô 11 - Pallet QPS201 (S/N {sn})",
                        "hand": "",
                    })

        elif mk == "RAP-METOR6E" and r["group"] == "Main Equipment":
            if "PL8800" in case_no:
                sns = [str(x) for x in range(62517001, 62517012)] + ["62503037", "62503038", "62503039"]
                for sn in sns:
                    arrived_pools["RAP-METOR6E"].append({
                        "lo_no": "Lô 02",
                        "sn": sn,
                        "cntr": "MRSU4405256",
                        "crate": "PL8800 - Crate 1 (14 units)",
                        "hand": "",
                    })
            elif "PL9791" in case_no:
                sns = [str(x) for x in range(62517012, 62517026)]
                for sn in sns:
                    arrived_pools["RAP-METOR6E"].append({
                        "lo_no": "Lô 02",
                        "sn": sn,
                        "cntr": "MRKU4272778",
                        "crate": "PL9791 - Crate 1 (14 units)",
                        "hand": "",
                    })
            elif "PL9792" in case_no:
                sns = [str(x) for x in range(62517026, 62517036)]
                for sn in sns:
                    arrived_pools["RAP-METOR6E"].append({
                        "lo_no": "Lô 02",
                        "sn": sn,
                        "cntr": "MRSU5915547",
                        "crate": "PL9792 - Crate 1 (10 units)",
                        "hand": "",
                    })

    # Remember: 40 units of 928DX arrived in Lô 02 (HBS), while Approved HBS Drawing uses 39 units and SSE needs 11 units (Lô 03 brought 10 units).
    # So the 40th unit of RAP-928DX-HBS in Lô 02 is reallocated to RAP-928DX-SSE!
    if len(arrived_pools["RAP-928DX-HBS"]) == 40 and len(arrived_pools["RAP-928DX-SSE"]) == 10:
        reallocated_unit = arrived_pools["RAP-928DX-HBS"].pop()
        reallocated_unit["reallocated_note"] = "Điều chuyển từ Lô 02 (HBS dư 1 máy do nâng cấp lên RTT110 tại GF Level 3) sang bù cho SSE (đủ 50 máy 928DX toàn gói)"
        arrived_pools["RAP-928DX-SSE"].append(reallocated_unit)

    # Sort TRS-920CT by lane number L1..L28 so they map in order!
    def trs_sort_key(item):
        m = re.search(r"L(\d+)", item["sn"])
        return int(m.group(1)) if m else 999

    arrived_pools["RAP-TRS-920CT"].sort(key=trs_sort_key)

    # Helper to create initial 9-step JSON and calculate progress
    def make_steps_json(arrived_lo):
        steps = {}
        for s in STEPS_DEFINITION:
            code = s["code"]
            if code == "STEP_1_INCOMING" and arrived_lo and arrived_lo.startswith("Lô"):
                arr_date = shipment_arrival_map.get(arrived_lo, "2026-07-01")
                steps[code] = {
                    "status": "COMPLETED",
                    "completed_date": arr_date,
                    "date": arr_date,
                    "updated_by": "System (16 Lô hàng)",
                    "note": f"Đã về kho/site trong {arrived_lo} (Ngày TK: {arr_date})",
                }
            elif code == "STEP_2_POSITIONING":
                steps[code] = {
                    "status": "COMPLETED",
                    "completed_date": "2026-11-02",
                    "date": "2026-11-02",
                    "updated_by": "thai",
                    "note": "Đã đưa vào vị trí lắp đặt",
                }
            else:
                steps[code] = {
                    "status": "PENDING",
                    "completed_date": "",
                    "date": "",
                    "updated_by": "",
                    "note": "",
                }
        return steps

    def calc_progress(steps):
        overall = 0.0
        inst_w = 0.0
        inst_done = 0.0
        tc_w = 0.0
        tc_done = 0.0
        has_blocked = False
        has_in_progress = False
        completed_count = 0

        for s in STEPS_DEFINITION:
            code = s["code"]
            w = s["weight"]
            st = steps.get(code, {}).get("status", "PENDING")
            factor = 1.0 if st == "COMPLETED" else (0.5 if st == "IN_PROGRESS" else 0.0)
            if st == "BLOCKED":
                has_blocked = True
            if st == "IN_PROGRESS":
                has_in_progress = True
            if st == "COMPLETED":
                completed_count += 1

            overall += w * factor
            if s["phase"] == "INSTALLATION":
                inst_w += w
                inst_done += w * factor
            else:
                tc_w += w
                tc_done += w * factor

        inst_pct = round(inst_done, 1)
        tc_pct = round(tc_done, 1)
        overall_pct = round(overall, 1)

        step5_st = steps.get("STEP_5_INST_INSPECT", {}).get("status", "PENDING")
        step9_st = steps.get("STEP_9_HANDOVER", {}).get("status", "PENDING")

        if has_blocked:
            curr_st = "BLOCKED"
        elif step9_st == "COMPLETED" or overall_pct >= 99.9:
            curr_st = "COMPLETED"
        elif tc_done > 0:
            curr_st = "TC_IN_PROGRESS"
        elif step5_st == "COMPLETED" or inst_done >= 55.0:
            curr_st = "INSTALLED"
        elif inst_done > 10.0:
            curr_st = "INSTALLING"
        elif completed_count > 0 or has_in_progress:
            curr_st = "ARRIVED"
        else:
            curr_st = "NOT_STARTED"

        return overall_pct, inst_pct, tc_pct, curr_st

    # Define the complete list of individual machines across HBS (42200) and SSE (42100)
    machine_specs = []

    def add_machines(
        prefix, count, sys_type, model_key, model_name, cat_name, mfr, country,
        floor, zone, area_name, side, flight_type, dwg_tag, dwg_ref,
        boq_item, boq_status, boq_note, power_req, net_nodes,
        plan_start, plan_finish, engineer
    ):
        for idx in range(1, count + 1):
            m_code = f"{prefix}-{idx:02d}"
            # Pop from arrived pool if available
            pool = arrived_pools.get(model_key, [])
            unit_info = pool.pop(0) if pool else None

            lo_no = unit_info["lo_no"] if unit_info else "Chưa về (PL=0)"
            sn = unit_info["sn"] if unit_info else "Chưa cập nhật"
            cntr = unit_info["cntr"] if unit_info else ""
            crate = unit_info["crate"] if unit_info else ""
            hand = unit_info["hand"] if unit_info else ""

            actual_boq_status = boq_status
            actual_boq_note = boq_note
            if prefix == "HBS-RTT110-GF-L3" and idx == 2:
                actual_boq_status = "DESIGN_CHANGE"
                actual_boq_note = "Tăng +1 máy RTT110 tại GF Level 3 theo Bản vẽ duyệt 0380A/0369A (Comment #5 ACV, thay thế 1 máy 928DX mục 42200-I.C.1.3). Nhập tại Lô 13."
            elif unit_info and unit_info.get("reallocated_note"):
                actual_boq_status = "REALLOCATED"
                actual_boq_note = unit_info["reallocated_note"]

            steps = make_steps_json(lo_no)
            ov_pct, in_pct, tc_pct, curr_st = calc_progress(steps)

            machine_specs.append((
                m_code, sys_type, model_key, model_name, cat_name, mfr, country,
                floor, zone, area_name, side, flight_type, dwg_tag, dwg_ref,
                boq_item, actual_boq_status, actual_boq_note,
                lo_no, sn, cntr, crate, hand, power_req, net_nodes,
                0, 0, 1, 1 if sys_type == "HBS" else 0,
                plan_start, plan_finish, engineer,
                ov_pct, in_pct, tc_pct, curr_st,
                json.dumps(steps, ensure_ascii=False),
                "[]",
                "",
                now_str,
                "System",
            ))

    # ==========================================================================
    # A. HBS MACHINES (SECTION 42200)
    # ==========================================================================
    # 1. RTT110 (12 units: 5 on 2F West, 5 on 2F East, 2 on GF Level 3)
    add_machines(
        "HBS-RTT110-2F-W", 5, "HBS", "RAP-RTT110", "RTT110", "Máy soi CT 3D HBS tốc độ cao (EDS ECAC C3)",
        "Rapiscan", "UK", "2F", "2F-Zone 7 (West)", "2F - Primary HBS Screening (Cánh Tây - Quốc tế)",
        "West", "International", "HBS-RTT110-2F-L1", "0380A Tr.24, 34-36; 0369A Tr.35-37",
        "42200-I.B.1.1", "MATCH", "Khớp BOQ (5/10 máy tại Tầng 2 - Cánh Tây)",
        "3P 400V 32A + UPS 30kVA", 2, "2026-06-05", "2026-06-11", "duc"
    )
    add_machines(
        "HBS-RTT110-2F-E", 5, "HBS", "RAP-RTT110", "RTT110", "Máy soi CT 3D HBS tốc độ cao (EDS ECAC C3)",
        "Rapiscan", "UK", "2F", "2F-Zone 6 (East)", "2F - Primary HBS Screening (Cánh Đông - Quốc tế & Quốc nội)",
        "East", "Both", "HBS-RTT110-2F-L1", "0380A Tr.24, 34-36; 0369A Tr.35-37",
        "42200-I.B.1.1", "MATCH", "Khớp BOQ (5/10 máy tại Tầng 2 - Cánh Đông)",
        "3P 400V 32A + UPS 30kVA", 2, "2026-06-12", "2026-06-18", "duc"
    )
    add_machines(
        "HBS-RTT110-GF-L3", 2, "HBS", "RAP-RTT110", "RTT110", "Máy soi CT 3D HBS Thứ cấp Level 3",
        "Rapiscan", "UK", "GF", "GF-Zone 5 (Make-up)", "GF - Make-up Platform (Secondary HBS Level 3)",
        "Center", "Both", "HBS-RTT110-GF-L3", "0380A Tr.24, 25, 30; 0369A Tr.12, 26, 31",
        "42200-I.C.1.2", "MATCH", "Khớp BOQ mục 42200-I.C.1.2 (Máy số 1 tại GF)",
        "3P 400V 32A + UPS 30kVA", 2, "2026-08-05", "2026-08-11", "hau"
    )

    # 2. 928DX-HBS (39 units on HBS Approved Drawing: 19 GF Arrival + 2 GF Make-up + 2 3F Dom + 14 3F Int'l + 2 3F OOG)
    add_machines(
        "HBS-928DX-GF-ARR", 19, "HBS", "RAP-928DX-HBS", "928DX (HBS)", "Máy soi X-Ray 2 góc chiếu tích hợp BHS (Hành lý đến)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 1..3 & 6", "GF - Arrival Baggage In-Gauge Screening (Hải quan đến)",
        "All", "International", "HBS-928DX-GF-ARR", "0380A Tr.24, 25-32; 0369A Tr.26-34",
        "42200-I.D.1.1", "MATCH", "Khớp 100% BOQ (19 bộ) & Bản vẽ duyệt (19 bộ)",
        "1P 230V 16A", 2, "2026-05-15", "2026-06-08", "hau"
    )
    add_machines(
        "HBS-928DX-GF-MUP", 2, "HBS", "RAP-928DX-HBS", "928DX (HBS)", "Máy soi X-Ray 2 góc chiếu tích hợp BHS (Hành lý nối chuyến)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 5..6", "GF - Make-up Platform (Transfer Baggage Screening)",
        "Center", "Both", "HBS-928DX-GF-MUP", "0380A Tr.24, 25; 0369A Tr.26, 29",
        "42200-I.C.1.1", "MATCH", "Khớp 100% BOQ (2 bộ) & Bản vẽ duyệt (2 bộ)",
        "1P 230V 16A", 2, "2026-06-02", "2026-06-08", "hau"
    )
    add_machines(
        "HBS-928DX-3F-DOM", 2, "HBS", "RAP-928DX-HBS", "928DX (HBS)", "Máy soi X-Ray 2 góc chiếu tích hợp BHS (Check-in Quốc nội)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 3 & 6 (Island E-F)", "3F - Check-in Island E-F (Domestic In-Gauge)",
        "East", "Domestic", "HBS-928DX-3F-DOM", "0380A Tr.24, 37, 40; 0369A Tr.38, 41",
        "42200-I.A.1.1", "MATCH", "Khớp 100% BOQ (2 bộ tại Đảo làm thủ tục Quốc nội E-F)",
        "1P 230V 16A", 2, "2026-06-22", "2026-06-28", "thai"
    )
    add_machines(
        "HBS-928DX-3F-INT", 14, "HBS", "RAP-928DX-HBS", "928DX (HBS)", "Máy soi X-Ray 2 góc chiếu tích hợp BHS (Check-in Quốc tế)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 1, 2, 7 (Islands A-B, C-D, G-H)", "3F - Check-in Islands A-B (6), C-D (2), G-H (6) (International)",
        "All", "International", "HBS-928DX-3F-INT", "0380A Tr.24, 37-41; 0369A Tr.38-42",
        "42200-I.A.1.2", "MATCH", "Khớp 100% BOQ (14 bộ tại các Đảo làm thủ tục Quốc tế)",
        "1P 230V 16A", 2, "2026-07-01", "2026-07-21", "thai"
    )
    add_machines(
        "HBS-928DX-3F-OOG", 2, "HBS", "RAP-928DX-HBS", "928DX (HBS)", "Máy soi X-Ray 2 góc chiếu tích hợp BHS (Hành lý quá khổ 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 1 & 7 (West & East OOG)", "3F - Departure Out-of-Gauge Check-in (1 West + 1 East)",
        "All", "Both", "HBS-928DX-3F-OOG", "0380A Tr.24, 37-41; 0369A Tr.38-42",
        "42200-I.A.2.1", "MATCH", "Khớp 100% BOQ (2 bộ OOG Tầng 3: 1 Cánh Tây + 1 Cánh Đông)",
        "1P 230V 16A", 2, "2026-07-15", "2026-07-21", "thai"
    )

    # 3. 632DV-HBS (2 units on GF: 1 Make-up OOG + 1 Arrival OOG)
    add_machines(
        "HBS-632DV-GF-MUP", 1, "HBS", "RAP-632DV-HBS", "632DV (HBS)", "Máy soi X-Ray 2 góc chiếu hành lý quá khổ OOG tích hợp BHS",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 (Make-up OOG)", "GF - Make-up Area Out-of-Gauge (OOG) Screening",
        "East", "Both", "HBS-632DV-GF-OOG", "0380A Tr.24, 25; 0369A Tr.26, 30",
        "42200-I.C.2.1", "MATCH", "Khớp 100% BOQ (1 bộ OOG Make-up GF)",
        "1P 230V 16A", 2, "2026-06-16", "2026-06-22", "hau"
    )
    add_machines(
        "HBS-632DV-GF-ARR", 1, "HBS", "RAP-632DV-HBS", "632DV (HBS)", "Máy soi X-Ray 2 góc chiếu hành lý quá khổ OOG tích hợp BHS",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 7 (Arrival OOG)", "GF - Arrival Out-of-Gauge (OOG) Baggage Screening",
        "West", "International", "HBS-632DV-GF-OOG", "0380A Tr.24, 25; 0369A Tr.26, 32",
        "42200-I.D.2.1", "MATCH", "Khớp 100% BOQ (1 bộ OOG Arrival GF)",
        "1P 230V 16A", 2, "2026-06-16", "2026-06-22", "hau"
    )

    # 4. ITEMISER 5X - HBS (2 units on GF Make-up Level 3 + 2 units on 3F OOG per BOQ)
    add_machines(
        "HBS-ETD-GF-L3", 2, "HBS", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn (ETD HBS Level 3/4)",
        "Rapiscan", "USA", "GF", "GF-Zone 5 (Make-up L3)", "GF - Make-up Platform Secondary HBS (Level 3/4)",
        "Center", "Both", "HBS-ETD-GF-L3", "0380A Tr.24, 25, 30; 0369A Tr.26, 31",
        "42200-I.C.1.4", "MATCH", "Khớp BOQ & Bản vẽ (2 bộ tại GF Make-up) - Đã nhập khẩu đủ tại Lô 15",
        "1P 230V 10A", 2, "2026-08-05", "2026-08-11", "thai"
    )
    add_machines(
        "HBS-ETD-3F-OOG", 2, "HBS", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn (ETD HBS 3F OOG)",
        "Rapiscan", "USA", "3F", "3F-Zone 1 & 7 (OOG)", "3F - Departure Out-of-Gauge Check-in (1 West + 1 East)",
        "All", "Both", "HBS-ETD-3F-OOG", "BOQ 42200-I.A.2.3 (Node mạng R78, R80)",
        "42200-I.A.2.3", "MATCH", "Có trong BOQ (2 bộ) & Node mạng R78, R80 - Đã nhập khẩu đủ tại Lô 15",
        "1P 230V 10A", 2, "2026-07-15", "2026-07-21", "thai"
    )

    # 5. MATRIX 30 SERVER RACKS & CMS - HBS (3 subsystems / Lô 14)
    for idx, (sub_desc, boq_it) in enumerate([
        ("Tủ Server Rack Matrix 30 (Split Site) & Kết nối BHS", "42200-II.1"),
        ("Tủ Server Rack Matrix 30 (Base) & Kết nối SSE", "42200-II.2"),
        ("Hệ thống TMAS / TIP Server Rack & Kết nối SAS/AODB", "42200-II.3"),
    ], 1):
        arrived_pools["RAP-MATRIX30-CMS"].append({
            "lo_no": "Lô 14",
            "sn": f"MATRIX30-RACK-{idx:02d}",
            "cntr": "HAWB 4750567149",
            "crate": f"Lô 14 - Crates 1..2 & Crate 5 ({sub_desc})",
            "hand": "",
        })
    add_machines(
        "HBS-CMS-MATRIX30", 3, "HBS", "RAP-MATRIX30-CMS", "Matrix 30 CMS", "Hệ thống Máy chủ Điều khiển & Giám sát HBS (Matrix 30 Server Rack)",
        "Rapiscan", "UK", "2F", "Data Center / IT Rooms", "Phòng Server Data Center & Phòng OSR (Kết nối BHS/SSE/SAS)",
        "Center", "Both", "HBS-CMS-MATRIX30", "0380A Tr.23-24; 0369A Tr.25",
        "42200-II.1..3", "MATCH", "Đã nhập tại Lô 14 (2 tủ Server Rack Split Site/Base + 1 tủ TIP Server Rack + trạm TMAS)",
        "3P/1P UPS Power", 4, "2026-08-10", "2026-08-25", "duc"
    )

    # ==========================================================================
    # B. SSE MACHINES (SECTION 42100)
    # ==========================================================================
    # 1. 920CT (28 units on 3F Departure: 6 Dom + 13 Int-East + 9 Int-West)
    add_machines(
        "SSE-920CT-3F-DOM", 6, "SSE", "RAP-920CT", "920CT", "Máy soi CT hành lý xách tay ECAC C3 (An ninh khởi hành Quốc nội)",
        "Rapiscan", "USA", "3F", "3F-Zone 7 (Domestic)", "3F - Departure Security Check Point (Quốc nội - 6 làn)",
        "West", "Domestic", "SSE-3F-DEP-920CT", "0466 Tr.29, 46 (LA-3F-10001)",
        "42100-I.B.2.1", "MATCH", "Khớp 100% BOQ (6 bộ) & Bản vẽ duyệt Code B (6 bộ)",
        "1P 230V 16A", 2, "2026-08-17", "2026-08-23", "thai"
    )
    add_machines(
        "SSE-920CT-3F-INTE", 13, "SSE", "RAP-920CT", "920CT", "Máy soi CT hành lý xách tay ECAC C3 (An ninh khởi hành Quốc tế - Đông)",
        "Rapiscan", "USA", "3F", "3F-Zone 2 (Int'l East)", "3F - Departure Security Check Point (Quốc tế Cánh Đông - 13 làn)",
        "East", "International", "SSE-3F-DEP-920CT", "0466 Tr.29, 47 (LA-3F-10002)",
        "42100-I.B.1.1", "MATCH", "Khớp 100% BOQ (13/22 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 2, "2026-08-25", "2026-09-17", "thai"
    )
    add_machines(
        "SSE-920CT-3F-INTW", 9, "SSE", "RAP-920CT", "920CT", "Máy soi CT hành lý xách tay ECAC C3 (An ninh khởi hành Quốc tế - Tây)",
        "Rapiscan", "USA", "3F", "3F-Zone 2 (Int'l West)", "3F - Departure Security Check Point (Quốc tế Cánh Tây - 9 làn)",
        "West", "International", "SSE-3F-DEP-920CT", "0466 Tr.29, 48 (LA-3F-10003)",
        "42100-I.B.1.1", "MATCH", "Khớp 100% BOQ (9/22 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 2, "2026-09-16", "2026-09-30", "thai"
    )

    # 2. TRS Flight 19.5m for 920CT (28 lanes on 3F Departure: 6 Dom + 13 Int-East + 9 Int-West)
    add_machines(
        "SSE-TRS195-3F-DOM", 6, "SSE", "RAP-TRS-920CT", "TRS Flight 19.5m", "Hệ thống trả khay tự động ATRS 19.5m kết nối máy 920CT (Quốc nội)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 7 (Domestic)", "3F - Departure Security Check Point (Quốc nội - Làn 1..6)",
        "West", "Domestic", "SSE-3F-DEP-TRS195", "0466 Tr.29-30, 46 (LA-3F-10001)",
        "42100-I.B.2.7", "MATCH", "Khớp 100% BOQ (6 làn) & Bản vẽ duyệt Code B",
        "3P 400V 16A", 2, "2026-08-17", "2026-08-23", "thai"
    )
    add_machines(
        "SSE-TRS195-3F-INTE", 13, "SSE", "RAP-TRS-920CT", "TRS Flight 19.5m", "Hệ thống trả khay tự động ATRS 19.5m kết nối máy 920CT (Quốc tế - Đông)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 2 (Int'l East)", "3F - Departure Security Check Point (Quốc tế Cánh Đông - 13 làn)",
        "East", "International", "SSE-3F-DEP-TRS195", "0466 Tr.29-30, 47 (LA-3F-10002)",
        "42100-I.B.1.7", "MATCH", "Khớp 100% BOQ (13/22 làn Quốc tế) & Bản vẽ duyệt Code B",
        "3P 400V 16A", 2, "2026-08-25", "2026-09-17", "thai"
    )
    add_machines(
        "SSE-TRS195-3F-INTW", 9, "SSE", "RAP-TRS-920CT", "TRS Flight 19.5m", "Hệ thống trả khay tự động ATRS 19.5m kết nối máy 920CT (Quốc tế - Tây)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 2 (Int'l West)", "3F - Departure Security Check Point (Quốc tế Cánh Tây - 9 làn)",
        "West", "International", "SSE-3F-DEP-TRS195", "0466 Tr.29-30, 48 (LA-3F-10003)",
        "42100-I.B.1.7", "MATCH", "Khớp 100% BOQ (9/22 làn Quốc tế) & Bản vẽ duyệt Code B",
        "3P 400V 16A", 2, "2026-09-16", "2026-09-30", "thai"
    )

    # 3. 920DX (10 units: 3 GF Staff + 2 GF VIP + 2 1F Transfer + 3 3F Staff)
    add_machines(
        "SSE-920DX-GF-STF", 3, "SSE", "RAP-920DX", "920DX", "Máy soi X-Ray 2 góc chiếu hành lý xách tay (Điểm KT Nhân viên & Hàng hóa GF)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 & 7 (Staff & Goods)", "GF - Staff & Goods Check Points (1 West Dom + 1 West Int'l + 1 East Int'l)",
        "All", "Both", "SSE-GF-STF-920DX", "0466 Tr.29, 33-35 (LA-GF-10001..10003)",
        "42100-I.A.4.1 / A.5.1 / A.6.1", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 2, "2026-08-25", "2026-08-31", "hau"
    )
    add_machines(
        "SSE-920DX-GF-VIP", 2, "SSE", "RAP-920DX", "920DX", "Máy soi X-Ray 2 góc chiếu hành lý xách tay (Điểm KT An ninh VIP GF)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 & 7 (VIP)", "GF - VIP Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-GF-VIP-920DX", "0466 Tr.29, 36-37 (LA-GF-10004..10005)",
        "42100-I.B.8.1 / B.9.1", "MATCH", "Khớp 100% BOQ (2 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 4, "2026-08-18", "2026-08-24", "hau"
    )
    add_machines(
        "SSE-920DX-1F-TRF", 2, "SSE", "RAP-920DX", "920DX", "Máy soi X-Ray 2 góc chiếu tích hợp TRS 12m (Điểm Trung chuyển 1F)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 1 & 3 (Transfer)", "1F - Transfer Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-1F-TRF-920DX", "0466 Tr.29, 41 (LA-1F-10005)",
        "42100-I.B.6.1 / B.7.1", "MATCH", "Khớp 100% BOQ (2 bộ tích hợp TRS 12m tại Lô 12) & Bản vẽ duyệt Code A",
        "1P 230V 16A", 2, "2026-09-03", "2026-09-09", "thai"
    )
    add_machines(
        "SSE-920DX-3F-STF", 3, "SSE", "RAP-920DX", "920DX", "Máy soi X-Ray 2 góc chiếu hành lý xách tay (Điểm KT Nhân viên 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 6 & 7 (Staff)", "3F - Staff Security Check Points (1 West Int'l + 1 West Dom + 1 East Int'l)",
        "All", "Both", "SSE-3F-STF-920DX", "0466 Tr.29, 49-50 (LA-3F-10004..10005)",
        "42100-I.A.1.1 / A.2.1 / A.3.1", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code A",
        "1P 230V 16A", 2, "2026-09-15", "2026-09-29", "thai"
    )

    # 4. TRS Flight 12m for 920DX (2 lanes on 1F Transfer)
    add_machines(
        "SSE-TRS12-1F-TRF", 2, "SSE", "RAP-TRS-920DX", "TRS Flight 12m", "Hệ thống trả khay tự động ATRS 12m kết nối máy 920DX (Trung chuyển 1F)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 1 & 3 (Transfer)", "1F - Transfer Security Check Points (1 West LH + 1 East RH)",
        "All", "International", "SSE-1F-TRF-TRS12", "0466 Tr.29, 41 (LA-1F-10005)",
        "42100-I.B.6.5 / B.7.5", "MATCH", "Khớp 100% BOQ (2 làn) & Bản vẽ duyệt Code A (Đã về đủ tại Lô 12)",
        "3P 400V 16A", 2, "2026-09-03", "2026-09-09", "thai"
    )

    # 5. 928DX-SSE (11 units: 3 GF Staff & Goods + 4 1F Arrival Customs West + 4 1F Arrival Customs East)
    add_machines(
        "SSE-928DX-GF-STF", 3, "SSE", "RAP-928DX-SSE", "928DX (SSE)", "Máy soi X-Ray hàng hóa Pallet EU (Điểm KT Nhân viên & Hàng hóa GF)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 & 7 (Staff & Goods)", "GF - Staff & Goods Check Points (1 West Dom + 1 West Int'l + 1 East Int'l)",
        "All", "Both", "SSE-GF-STF-928DX", "0466 Tr.29, 33-35 (LA-GF-10001..10003)",
        "42100-I.A.4.2 / A.5.2 / A.6.2", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 2, "2026-08-25", "2026-08-31", "hau"
    )
    add_machines(
        "SSE-928DX-1F-CUSW", 4, "SSE", "RAP-928DX-SSE", "928DX (SSE)", "Máy soi X-Ray hành lý tiêu chuẩn (Hải quan đến 1F - Cánh Tây)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 2 (Customs West)", "1F - Arrival Customs Clearance Check Point (West Side - 4 máy)",
        "West", "International", "SSE-1F-CUS-928DX", "0466 Tr.29, 40 (LA-1F-10002)",
        "42100-I.B.3.1", "MATCH", "Khớp 100% BOQ (4 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 16A", 2, "2026-09-09", "2026-09-15", "thai"
    )
    add_machines(
        "SSE-928DX-1F-CUSE", 4, "SSE", "RAP-928DX-SSE", "928DX (SSE)", "Máy soi X-Ray hành lý tiêu chuẩn (Hải quan đến 1F - Cánh Đông)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 2 (Customs East)", "1F - Arrival Customs Clearance Check Point (East Side - 4 máy)",
        "East", "International", "SSE-1F-CUS-928DX", "0466 Tr.29, 39 (LA-1F-10001)",
        "42100-I.B.4.1", "MATCH", "Khớp 100% BOQ (4 bộ) & Mặt bằng duyệt Code B (Tr.39)",
        "1P 230V 16A", 2, "2026-09-17", "2026-09-23", "thai"
    )

    # 6. 632DV-SSE (1 unit at 1F Arrival Customs East OOG)
    add_machines(
        "SSE-632DV-1F-CUSE", 1, "SSE", "RAP-632DV-SSE", "632DV (SSE)", "Máy soi X-Ray 2 góc chiếu hành lý quá khổ OOG (Hải quan đến 1F - Đông)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 2 (Customs East OOG)", "1F - Arrival Customs Clearance Check Point East Side (OOG)",
        "East", "International", "SSE-1F-CUS-632DV", "0466 Tr.29, 39 (LA-1F-10001)",
        "42100-I.B.5.1", "MATCH", "Khớp 100% BOQ (1 bộ) & Bản vẽ duyệt Code B (Đã về tại Lô 03, S/N 6252414)",
        "1P 230V 16A", 2, "2026-09-03", "2026-09-09", "thai"
    )

    # 7. QPS201 Body Scanner (17 units: 2 GF VIP + 3 3F Dom + 7 3F Int-East + 5 3F Int-West)
    add_machines(
        "SSE-QPS201-GF-VIP", 2, "SSE", "RS-QPS201", "QPS201 BodyScan", "Cổng quét cơ thể sóng milimet R&S QPS201 (Điểm KT VIP GF)",
        "Rohde & Schwarz", "Germany", "GF", "GF-Zone 6 & 7 (VIP)", "GF - VIP Security Check Points (1 West + 1 East, kèm 2 màn hình/máy)",
        "All", "International", "SSE-GF-VIP-QPS201", "0466 Tr.29, 36-37 (LA-GF-10004..10005)",
        "42100-I.B.8.2 / B.9.2", "MATCH", "Khớp 100% BOQ (2 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-18", "2026-08-24", "hau"
    )
    add_machines(
        "SSE-QPS201-3F-DOM", 3, "SSE", "RS-QPS201", "QPS201 BodyScan", "Cổng quét cơ thể sóng milimet R&S QPS201 (An ninh khởi hành Quốc nội 3F)",
        "Rohde & Schwarz", "Germany", "3F", "3F-Zone 7 (Domestic)", "3F - Departure Security Check Point (Quốc nội - 3 bộ)",
        "West", "Domestic", "SSE-3F-DEP-QPS201", "0466 Tr.29, 46 (LA-3F-10001)",
        "42100-I.B.2.2", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-17", "2026-08-23", "thai"
    )
    add_machines(
        "SSE-QPS201-3F-INTE", 7, "SSE", "RS-QPS201", "QPS201 BodyScan", "Cổng quét cơ thể sóng milimet R&S QPS201 (An ninh khởi hành Quốc tế Đông 3F)",
        "Rohde & Schwarz", "Germany", "3F", "3F-Zone 2 (Int'l East)", "3F - Departure Security Check Point (Quốc tế Cánh Đông - 7 bộ)",
        "East", "International", "SSE-3F-DEP-QPS201", "0466 Tr.29, 47 (LA-3F-10002)",
        "42100-I.B.1.2", "MATCH", "Khớp 100% BOQ (7/12 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-25", "2026-09-17", "thai"
    )
    add_machines(
        "SSE-QPS201-3F-INTW", 5, "SSE", "RS-QPS201", "QPS201 BodyScan", "Cổng quét cơ thể sóng milimet R&S QPS201 (An ninh khởi hành Quốc tế Tây 3F)",
        "Rohde & Schwarz", "Germany", "3F", "3F-Zone 2 (Int'l West)", "3F - Departure Security Check Point (Quốc tế Cánh Tây - 5 bộ)",
        "West", "International", "SSE-3F-DEP-QPS201", "0466 Tr.29, 48 (LA-3F-10003)",
        "42100-I.B.1.2", "MATCH", "Khớp 100% BOQ (5/12 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-09-16", "2026-09-30", "thai"
    )

    # 8. Metor 6E WTMD (38 units: 3 GF Staff + 2 GF VIP + 2 1F Transfer + 6 3F Dom + 13 3F Int-East + 9 3F Int-West + 3 3F Staff)
    add_machines(
        "SSE-WTMD-GF-STF", 3, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (Điểm KT Nhân viên & Hàng hóa GF)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 & 7 (Staff & Goods)", "GF - Staff & Goods Check Points (1 West Dom + 1 West Int'l + 1 East Int'l)",
        "All", "Both", "SSE-GF-STF-WTMD", "0466 Tr.29, 33-35",
        "42100-I.A.4.3 / A.5.3 / A.6.3", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-25", "2026-08-31", "hau"
    )
    add_machines(
        "SSE-WTMD-GF-VIP", 2, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (Điểm KT VIP GF)",
        "Rapiscan", "Malaysia", "GF", "GF-Zone 6 & 7 (VIP)", "GF - VIP Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-GF-VIP-WTMD", "0466 Tr.29, 36-37",
        "42100-I.B.8.3 / B.9.3", "MATCH", "Khớp 100% BOQ (2 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-18", "2026-08-24", "hau"
    )
    add_machines(
        "SSE-WTMD-1F-TRF", 2, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (Điểm Trung chuyển 1F)",
        "Rapiscan", "Malaysia", "1F", "1F-Zone 1 & 3 (Transfer)", "1F - Transfer Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-1F-TRF-WTMD", "0466 Tr.29, 41",
        "42100-I.B.6.2 / B.7.2", "MATCH", "Khớp 100% BOQ (2 bộ) & Bản vẽ duyệt Code A",
        "1P 230V 10A", 2, "2026-09-03", "2026-09-09", "thai"
    )
    add_machines(
        "SSE-WTMD-3F-DOM", 6, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (An ninh khởi hành Quốc nội 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 7 (Domestic)", "3F - Departure Security Check Point (Quốc nội - 6 cổng)",
        "West", "Domestic", "SSE-3F-DEP-WTMD", "0466 Tr.29, 46",
        "42100-I.B.2.3", "MATCH", "Khớp 100% BOQ (6 bộ) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-17", "2026-08-23", "thai"
    )
    add_machines(
        "SSE-WTMD-3F-INTE", 13, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (An ninh khởi hành Quốc tế Đông 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 2 (Int'l East)", "3F - Departure Security Check Point (Quốc tế Cánh Đông - 13 cổng)",
        "East", "International", "SSE-3F-DEP-WTMD", "0466 Tr.29, 47",
        "42100-I.B.1.3", "MATCH", "Khớp 100% BOQ (13/22 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-08-25", "2026-09-17", "thai"
    )
    add_machines(
        "SSE-WTMD-3F-INTW", 9, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (An ninh khởi hành Quốc tế Tây 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 2 (Int'l West)", "3F - Departure Security Check Point (Quốc tế Cánh Tây - 9 cổng)",
        "West", "International", "SSE-3F-DEP-WTMD", "0466 Tr.29, 48",
        "42100-I.B.1.3", "MATCH", "Khớp 100% BOQ (9/22 bộ Quốc tế) & Bản vẽ duyệt Code B",
        "1P 230V 10A", 2, "2026-09-16", "2026-09-30", "thai"
    )
    add_machines(
        "SSE-WTMD-3F-STF", 3, "SSE", "RAP-METOR6E", "Metor 6E (WTMD)", "Cổng từ dò kim loại đi bộ qua Metor 6E (Điểm KT Nhân viên 3F)",
        "Rapiscan", "Malaysia", "3F", "3F-Zone 6 & 7 (Staff)", "3F - Staff Security Check Points (1 West Int'l + 1 West Dom + 1 East Int'l)",
        "All", "Both", "SSE-3F-STF-WTMD", "0466 Tr.29, 49-50",
        "42100-I.A.1.2 / A.2.2 / A.3.2", "MATCH", "Khớp 100% BOQ (3 bộ) & Bản vẽ duyệt Code A",
        "1P 230V 10A", 2, "2026-09-15", "2026-09-29", "thai"
    )

    # 9. Itemiser 5X ETD - SSE (20 units: 5 GF Staff + 2 GF VIP + 2 1F Transfer + 8 3F Departure + 3 3F Staff)
    add_machines(
        "SSE-ETD-GF-STF", 5, "SSE", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn ETD (Điểm KT Nhân viên & Hàng hóa GF)",
        "Rapiscan", "USA", "GF", "GF-Zone 6 & 7 (Staff & Goods)", "GF - Staff & Goods Check Points (2 West Dom + 1 West Int'l + 2 East Int'l)",
        "All", "Both", "SSE-GF-STF-ETD", "0466 Tr.29, 33-35",
        "42100-I.A.4.4 / A.5.4 / A.6.4", "MATCH", "Khớp 100% BOQ & Bản vẽ duyệt Code B - Đã nhập khẩu đủ tại Lô 16",
        "1P 230V 10A", 2, "2026-08-25", "2026-08-31", "thai"
    )
    add_machines(
        "SSE-ETD-GF-VIP", 2, "SSE", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn ETD (Điểm KT VIP GF)",
        "Rapiscan", "USA", "GF", "GF-Zone 6 & 7 (VIP)", "GF - VIP Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-GF-VIP-ETD", "0466 Tr.29, 36-37",
        "42100-I.B.8.4 / B.9.4", "MATCH", "Khớp 100% BOQ & Bản vẽ duyệt Code B - Đã nhập khẩu đủ tại Lô 16",
        "1P 230V 10A", 2, "2026-08-18", "2026-08-24", "thai"
    )
    add_machines(
        "SSE-ETD-1F-TRF", 2, "SSE", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn ETD (Điểm Trung chuyển 1F)",
        "Rapiscan", "USA", "1F", "1F-Zone 1 & 3 (Transfer)", "1F - Transfer Security Check Points (1 West + 1 East)",
        "All", "International", "SSE-1F-TRF-ETD", "0466 Tr.29, 41",
        "42100-I.B.6.3 / B.7.3", "MATCH", "Khớp 100% BOQ & Bản vẽ duyệt Code A - Đã nhập khẩu đủ tại Lô 16",
        "1P 230V 10A", 2, "2026-09-03", "2026-09-09", "thai"
    )
    add_machines(
        "SSE-ETD-3F-DEP", 8, "SSE", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn ETD (An ninh khởi hành 3F)",
        "Rapiscan", "USA", "3F", "3F-Zone 2 & 7 (Departure)", "3F - Departure Security Check Points (2 Dom + 4 Int-East + 2 Int-West)",
        "All", "Both", "SSE-3F-DEP-ETD", "0466 Tr.29, 46-48",
        "42100-I.B.1.5 / B.2.5", "MATCH", "Khớp 100% BOQ & Bản vẽ duyệt Code B - Đã nhập khẩu đủ tại Lô 16",
        "1P 230V 10A", 2, "2026-08-25", "2026-09-30", "thai"
    )
    add_machines(
        "SSE-ETD-3F-STF", 3, "SSE", "RAP-ITEMISER5X", "Itemiser 5X", "Máy dò dấu vết chất nổ để bàn ETD (Điểm KT Nhân viên 3F)",
        "Rapiscan", "USA", "3F", "3F-Zone 6 & 7 (Staff)", "3F - Staff Security Check Points (1 West Int'l + 1 West Dom + 1 East Int'l)",
        "All", "Both", "SSE-3F-STF-ETD", "0466 Tr.29, 49-50",
        "42100-I.A.1.3 / A.2.3 / A.3.3", "MATCH", "Khớp 100% BOQ & Bản vẽ duyệt Code A - Đã nhập khẩu đủ tại Lô 16",
        "1P 230V 10A", 2, "2026-09-15", "2026-09-29", "thai"
    )

    # 10. EAS-AMD06HP RFID Detector (16 units at 1F Arrival Customs: 6 West + 10 East)
    add_machines(
        "SSE-RFID-1F-CUSW", 6, "SSE", "FOX-EAS-AMD06HP", "EAS-AMD06HP (RFID)", "Cổng dò RFID Hải quan (Hải quan đến 1F - Cánh Tây)",
        "Foxcon", "China", "1F", "1F-Zone 2 (Customs West)", "1F - Arrival Customs Clearance Check Point (West Side - 6 bộ)",
        "West", "International", "SSE-1F-CUS-RFID", "0466 Tr.29, 40 (LA-1F-10002)",
        "42100-I.B.3.2", "MATCH", "Khớp 100% BOQ (6 bộ) & Bản vẽ duyệt Code B (Thiết bị hãng Foxcon, ngoài 14 lô Rapiscan)",
        "1P 230V 10A", 2, "2026-09-09", "2026-09-15", "thai"
    )
    add_machines(
        "SSE-RFID-1F-CUSE", 10, "SSE", "FOX-EAS-AMD06HP", "EAS-AMD06HP (RFID)", "Cổng dò RFID Hải quan (Hải quan đến 1F - Cánh Đông: 6 In-gauge + 4 OOG)",
        "Foxcon", "China", "1F", "1F-Zone 2 (Customs East)", "1F - Arrival Customs Clearance Check Point (East Side - 6 In-gauge + 4 OOG)",
        "East", "International", "SSE-1F-CUS-RFID", "0466 Tr.29, 39 (LA-1F-10001)",
        "42100-I.B.4.2 / B.5.2", "MATCH", "Khớp 100% BOQ (6+4=10 bộ) & Bản vẽ duyệt Code B (Thiết bị hãng Foxcon)",
        "1P 230V 10A", 2, "2026-09-17", "2026-09-23", "thai"
    )

    # 11. CEIA SAMD Shoe Scanner - ĐÃ BỎ TRONG GIAI ĐOẠN NÀY
    # (Từng có 5 bộ trong BOQ 42100-I.B.1.4 & B.2.4; Bản vẽ 0466 ghi chú FUTURE PROVISION ONLY - Nay đã chính thức bỏ)

    # 12. SSE Control and Monitoring System (3 subsystems)
    add_machines(
        "SSE-CMS-SYS", 3, "SSE", "SSE-CMS-LOT", "SSE CMS System", "Hệ thống Điều khiển & Giám sát SSE (Kết nối BHS, HBS, SAS trên hạ tầng Server/SAN)",
        "Rapiscan / MSI", "Malaysia", "2F", "Data Center DC1/DC2 & FDR", "Data Center DC1/DC2 & FDR Rooms (Interface BHS, HBS, SAS)",
        "Center", "Both", "SSE-CMS-LOT", "0466 Tr.31-32 (DG-XX-XX-00001 & 00002)",
        "42100-II.1..3", "MATCH", "Khớp BOQ (3 phân hệ kết nối) & Sơ đồ nguyên lý duyệt Code B (Chạy trên VM/SAN)",
        "Server Room UPS", 4, "2026-09-01", "2026-09-30", "duc"
    )

    # Insert all machines
    cur.executemany(
        """
        INSERT INTO machines (
            machine_code, system_type, model_key, model_name, category_name, manufacturer, country,
            floor, zone, area_name, terminal_side, flight_type, drawing_tag, drawing_ref,
            boq_item, boq_status, boq_note, shipment_no, serial_number, container_no, crate_info,
            orientation, power_req, network_nodes_req, power_ready, network_ready, civil_ready, bhs_ready,
            planned_start, planned_finish, assigned_engineer, overall_progress, install_progress, tc_progress,
            current_status, steps_json, attachments_json, remark, updated_at, updated_by
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?,
            ?, ?, ?, ?, ?, ?
        )
        """,
        machine_specs,
    )

    # ==========================================================================
    # C. SEED AUXILIARY / BATCH ITEMS (Grouped by Area/Floor as requested in Q5)
    # ==========================================================================
    aux_batches = [
        # 1. Workstations HBS (RAP-WS-HBS)
        ("AUX-HBS-WS-GF-ARR", "HBS", "RAP-WS-HBS", "Máy trạm kiểm tra & truy xuất hình ảnh HBS (GF Arrival Searching Room)", "GF", "GF - Arrival Searching Room (Hải quan đến)", "bộ", 14, 14, 14, 0, 0, "Lô 02 & Lô 14", "17 Matrix 30 WS (Lô 14) + 40 Console (Lô 02)", "42200-I.D.1.2", "HBS-WS-ALL", "Khớp BOQ (14 trạm)", "hau", now_str, "System"),
        ("AUX-HBS-WS-GF-MUP", "HBS", "RAP-WS-HBS", "Máy trạm kiểm tra & truy xuất hình ảnh HBS (GF Make-up Level 3)", "GF", "GF - Make-up Platform (Secondary HBS)", "bộ", 4, 4, 4, 0, 0, "Lô 02 & Lô 14", "Matrix 30 RTTVis / Local Console", "42200-I.C.1.5", "HBS-WS-ALL", "Khớp BOQ (4 trạm)", "hau", now_str, "System"),
        ("AUX-HBS-WS-2F-REC", "HBS", "RAP-WS-HBS", "Máy trạm đối chiếu hình ảnh HBS (2F Reconciliation Room Int'l & Dom)", "2F", "2F - Reconciliation Rooms (1 Quốc tế + 1 Quốc nội)", "bộ", 2, 2, 2, 0, 0, "Lô 14", "Matrix 30 RTTVis Screener WS", "42200-I.B.1.2", "HBS-WS-ALL", "Khớp BOQ (2 trạm)", "duc", now_str, "System"),
        ("AUX-HBS-WS-3F-INL", "HBS", "RAP-WS-HBS", "Máy trạm kiểm tra hình ảnh HBS (3F Check-in In-gauge & Searching Room)", "3F", "3F - Check-in Islands & HBS/SSE Searching Rooms", "bộ", 32, 32, 33, 0, 0, "Lô 02 & Lô 14", "Matrix 30 WS + Remote Console (Tổng về 57/56 bộ)", "42200-I.A.1.3", "HBS-WS-ALL", "PL Lô 2 + Lô 14 giao tổng 57 bộ so với 56 bộ BOQ (+1 dự phòng)", "thai", now_str, "System"),
        ("AUX-HBS-WS-3F-OOG", "HBS", "RAP-WS-HBS", "Máy trạm kiểm tra hình ảnh HBS (3F Departure Out-of-Gauge)", "3F", "3F - Departure OOG Check-in (West & East)", "bộ", 4, 4, 4, 0, 0, "Lô 02 & Lô 14", "Local & Remote Review WS", "42200-I.A.2.2", "HBS-WS-ALL", "Khớp BOQ (4 trạm)", "thai", now_str, "System"),

        # 2. UPS 30kVA for RTT110
        ("AUX-HBS-UPS-RTT", "HBS", "ACC-RTT-UPS30KVA", "Bộ lưu điện UPS 3 Pha 30kVA (30 phút) & Tủ Bypass cho máy RTT110", "2F", "2F (10 máy RTT110) & GF (2 máy RTT110)", "bộ", 11, 12, 11, 0, 0, "Lô 05", "P/N 101035559 (22 kiện = 11 bộ)", "42200-I.B.1.1 / I.C.1.2", "HBS-RTT110", "Lô 05 đã về 11 bộ UPS cho 11 máy đầu; máy RTT110 thứ 12 (Lô 13) cần kiểm tra bổ sung UPS", "duc", now_str, "System"),

        # 3. Workstations SSE (RAP-WS-SSE)
        ("AUX-SSE-WS-1F-TRF", "SSE", "RAP-WS-SSE", "Máy trạm kiểm tra hình ảnh soi chiếu SSE (1F Transfer East & West)", "1F", "1F - Transfer Security Check Points (2 East + 2 West)", "bộ", 4, 4, 4, 0, 0, "Lô 03 & Lô 12", "KIT Viewing Station / NDS 101029135", "42100-I.B.6.7 / B.7.7", "SSE-1F-TRF-WS", "Khớp BOQ & Bản vẽ (4 bộ)", "thai", now_str, "System"),
        ("AUX-SSE-WS-3F-DOM", "SSE", "RAP-WS-SSE", "Máy trạm kiểm tra hình ảnh soi chiếu SSE (3F Departure Quốc nội - 6 làn)", "3F", "3F - Departure Security Check Point (Domestic)", "bộ", 12, 12, 12, 0, 0, "Lô 04, 07, 08, 09", "P/N 10-79026S-01 (2 trạm SVS/làn x 6 làn)", "42100-I.B.2.9", "SSE-3F-DEP-WS", "Khớp BOQ & Bản vẽ (12 bộ)", "thai", now_str, "System"),
        ("AUX-SSE-WS-3F-INT", "SSE", "RAP-WS-SSE", "Máy trạm kiểm tra hình ảnh soi chiếu SSE (3F Departure Quốc tế - 22 làn)", "3F", "3F - Departure Security Check Point (International East & West)", "bộ", 44, 44, 45, 0, 0, "Lô 04, 07, 08, 09", "P/N 10-79026S-01 (Tổng 4 lô giao 61 bộ vs 60 BOQ)", "42100-I.B.1.9", "SSE-3F-DEP-WS", "Đã về 61 bộ Kit Viewing Station trên 4 lô Mỹ (dư +1 bộ so với 60 bộ BOQ)", "thai", now_str, "System"),

        # 4. Hand-held Metal Detectors (Metor 28e - 80 sets)
        ("AUX-SSE-HHMD-GF", "SSE", "RAP-METOR28E", "Tay dò kim loại cầm tay Metor 28e kèm bộ sạc (Khu vực Tầng trệt GF)", "GF", "GF - Staff & Goods (10 bộ) + VIP East/West (4 bộ)", "bộ", 14, 14, 14, 0, 0, "Lô 02", "S/N INI813018..INI813031 (PL8801)", "42100-I.A.4.6..B.9.9", "RAP-METOR28E", "Đã về đủ trong kiện 80 bộ tại Lô 02", "hau", now_str, "System"),
        ("AUX-SSE-HHMD-1F", "SSE", "RAP-METOR28E", "Tay dò kim loại cầm tay Metor 28e kèm bộ sạc (Khu vực Tầng 1 - Transfer)", "1F", "1F - Transfer Points West (2 bộ) & East (2 bộ)", "bộ", 4, 4, 4, 0, 0, "Lô 02", "S/N INI813032..INI813035 (PL8801)", "42100-I.B.6.9 / B.7.9", "RAP-METOR28E", "Đã về đủ trong kiện 80 bộ tại Lô 02", "thai", now_str, "System"),
        ("AUX-SSE-HHMD-3F-STF", "SSE", "RAP-METOR28E", "Tay dò kim loại cầm tay Metor 28e kèm bộ sạc (3F Staff Check Points)", "3F", "3F - Staff Check Points (West Int'l [2], West Dom [2], East Int'l [2])", "bộ", 6, 6, 6, 0, 0, "Lô 02", "S/N INI813036..INI813041 (PL8801)", "42100-I.A.1.5 / A.2.5 / A.3.5", "RAP-METOR28E", "Đã về đủ trong kiện 80 bộ tại Lô 02", "thai", now_str, "System"),
        ("AUX-SSE-HHMD-3F-DEP", "SSE", "RAP-METOR28E", "Tay dò kim loại cầm tay Metor 28e kèm bộ sạc (3F Departure Int'l [44] & Dom [12])", "3F", "3F - Departure Security Check Points (28 làn x 2 bộ/làn = 56 bộ)", "bộ", 56, 56, 56, 0, 0, "Lô 02", "S/N INI813042..INI813097 (PL8801)", "42100-I.B.1.11 / B.2.11", "RAP-METOR28E", "Đã về đủ 80/80 bộ tại Lô 02", "thai", now_str, "System"),

        # 5. Roller Tables & Ball Tables
        ("AUX-SSE-ROL640-GF", "SSE", "CONV-ROLLER-640", "Bàn con lăn W:640mm cho máy 920DX (GF Staff & Goods [16m] + GF VIP [10m])", "GF", "GF - Staff & Goods (West/East) & VIP Check Points", "m", 25, 26, 25, 0, 0, "Lô 03", "PL000011328 (Tổng Lô 3 giao 43m W:640mm)", "42100-I.A.4.7..B.9.6", "SSE-GF-STF/VIP-ROL640", "Đã về đủ 43m theo BOQ tại Lô 03 (trên bản vẽ GF West Dom vẽ 6m thay vì 5m)", "hau", now_str, "System"),
        ("AUX-SSE-ROL640-3F", "SSE", "CONV-ROLLER-640", "Bàn con lăn W:640mm cho máy 920DX (3F Staff Check Points East & West)", "3F", "3F - Staff Check Points (West Int'l [6m], West Dom [6m], East Int'l [6m])", "m", 18, 18, 18, 0, 0, "Lô 03", "PL000011328 (Cntr HASU5201724)", "42100-I.A.1.6 / A.2.6 / A.3.6", "SSE-3F-STF-ROL640", "Đã về đủ 18m tại Lô 03 (Khớp 100% BOQ & Bản vẽ)", "thai", now_str, "System"),
        ("AUX-SSE-ROL1010-GF", "SSE", "CONV-ROLLER-1010", "Bàn con lăn hàng hóa W:1010mm cho 3 máy 928DX (GF Staff & Goods)", "GF", "GF - Staff & Goods Check Points (West Dom [6m], West Int'l [8m], East Int'l [7m])", "m", 21, 20, 21, 0, 0, "Lô 03", "PL000011325 (Giao chuẩn W:1010mm cho máy 928DX)", "42100-I.A.4.8 / A.5.8 / A.6.8", "SSE-GF-STF-ROLGOODS", "BOQ in nhầm tên W:1537mm (21m), Rapiscan đã giao chuẩn 21m loại W:1010mm cho máy 928DX tại Lô 03 (ISS-09)", "hau", now_str, "System"),
        ("AUX-SSE-ROL1010-1F", "SSE", "CONV-ROLLER-1010", "Bàn con lăn W:1010mm cho 8 máy 928DX (1F Hải quan đến Đông & Tây)", "1F", "1F - Arrival Customs Clearance (West [18m BOQ / 20m BV] + East [23m BOQ / 18.5m BV])", "m", 41, 38.5, 41, 0, 0, "Lô 03", "PL000011325 (Cntr MRKU4740441 - Tổng 62m)", "42100-I.B.3.3 / B.4.4", "SSE-1F-CUS-ROL1010", "Đã về đủ 41m (+21m GF = 62m) tại Lô 03", "thai", now_str, "System"),
        ("AUX-SSE-ROL1537-1F", "SSE", "CONV-ROLLER-1537", "Bàn con lăn quá khổ W:1537mm cho máy 632DV (1F Hải quan đến Cánh Đông)", "1F", "1F - Arrival Customs Check Point East Side (OOG 632DV)", "m", 5, 6, 7.5, 0, 0, "Lô 03", "PL000011329 (4.5m mở rộng + 3m theo máy = 7.5m)", "42100-I.B.5.3", "SSE-1F-CUS-ROL1537", "Đã về 4.5m mở rộng + 3m theo máy = 7.5m tại Lô 03 (Đủ cho 5m BOQ / 6m Bản vẽ)", "thai", now_str, "System"),
        ("AUX-SSE-BALL-GF", "SSE", "CONV-BALL-1350", "Bàn bi hàng hóa (Goods Ball Table W:1350mm - GF Staff & Goods West Dom)", "GF", "GF - Staff & Goods Check Point West Dom", "m", 2, 2, 0, 0, 0, "Chưa về (Mua sắm nội địa/bổ sung)", "Chưa có trong 14 lô Rapiscan", "42100-I.A.4.9", "SSE-GF-STF-BALL", "Cần theo dõi cung cấp tại công trường (ISS-12)", "hau", now_str, "System"),

        # 6. Site Furniture & Searching Tables
        ("AUX-SSE-BENCH-TRS", "SSE", "FURN-TABLE-SEARCH", "Bàn kiểm tra hành lý tích hợp theo làn TRS Flight (Search Bench 30 làn TRS)", "3F", "3F Departure (28 bàn) & 1F Transfer (2 bàn)", "bộ", 31, 30, 30, 0, 0, "Lô 03, 10, 12", "Đi kèm trong 30 làn TRS Flight (19.5m & 12m)", "42100-I.B.1.10 / B.2.10 / B.6.8 / B.7.8", "SSE-3F-DEP/1F-TRF-TBLSEARCH", "Đã về đủ 30 bàn Search Bench đồng bộ theo 30 làn TRS", "thai", now_str, "System"),
        ("AUX-SSE-FURN-SEARCH", "SSE", "FURN-TABLE-SEARCH", "Bàn kiểm tra rời (Searching Table tại 1F Hải quan [16] & GF VIP [8])", "1F", "1F Arrival Customs (16 bàn) & GF VIP (8 bàn)", "bộ", 24, 24, 0, 0, 0, "Cung cấp tại site", "Hạng mục bàn nội thất sản xuất tại Việt Nam", "42100-I.B.3.5 / B.4.3 / B.8.8 / B.9.8", "SSE-1F-CUS/GF-VIP-TBLSEARCH", "Mua sắm/gia công trong nước theo BOQ", "thai", now_str, "System"),
        ("AUX-SSE-FURN-TBLWS", "SSE", "FURN-TABLE-WS", "Bàn để máy trạm (Table for WS/Post tại GF, 1F, 3F)", "All", "GF (8), 1F (11), 3F (31) - Toàn bộ các điểm kiểm tra SSE", "bộ", 53, 50, 0, 0, 0, "Cung cấp tại site", "Hạng mục bàn nội thất tại công trường", "42100-I.A..I.B", "SSE-TBLWS", "Gia công/cung cấp tại site (Xem đối chiếu Table SSE.xlsx)", "thai", now_str, "System"),
        ("AUX-SSE-FURN-TBLETD", "SSE", "FURN-TABLE-ETD", "Bàn đặt máy dò chất nổ ETD (Table for ETD tại GF, 1F, 3F)", "All", "GF (7), 1F (2), 3F (11) - Tương ứng 20 vị trí máy Itemiser 5X SSE", "bộ", 19, 20, 0, 0, 0, "Cung cấp tại site", "Hạng mục bàn nội thất sản xuất tại Việt Nam", "42100-I.A..I.B", "SSE-TBLETD", "Gia công/cung cấp tại site (20 vị trí trên bản vẽ)", "thai", now_str, "System"),
    ]

    cur.executemany(
        """
        INSERT INTO auxiliary_batches (
            batch_code, system_type, model_key, item_name, floor, area_name, unit,
            qty_boq, qty_drawing, qty_arrived, qty_installed, qty_tc_done,
            shipment_no, serial_range, boq_item, drawing_tag, status_note,
            assigned_engineer, updated_at, updated_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        aux_batches,
    )

    # ==========================================================================
    # D. SEED ISSUES LOG FROM RECONCILIATION & SITE CHECK
    # ==========================================================================
    for iss in ISSUES_LOG_DATA:
        iss_code, stage, desc, src, act, st_raw = iss

        if iss_code == "ISS-12":
            desc = desc + " -> [CẬP NHẬT MỚI]: Đã nhập khẩu và thông quan đầy đủ 24 bộ Itemiser 5X tại Lô 15 (04 bộ HBS) và Lô 16 (20 bộ SSE). Hiện chỉ còn 16 cổng RFID Foxcon đang theo dõi (Hạng mục 05 máy quét giày CEIA SAMD đã chính thức bỏ trong giai đoạn này)."
            act = "Đã thông quan & bàn giao hiện trường 24 bộ Itemiser 5X (Lô 15 & 16). Tiếp tục theo dõi tiến độ các cổng RFID và nội thất."
            st_raw = "Đã xử lý (Lô 15 & 16)"

        status = "OPEN" if ("Mở" in st_raw or "Đang theo dõi" in st_raw) else "RESOLVED"
        severity = "HIGH" if status == "OPEN" else "LOW"
        cat = "SHIPMENT_PL" if "Lô" in desc and "Bản vẽ" not in stage else ("DESIGN_BOQ" if "GĐ2" in stage or "GĐ3" in stage else "TECHNICAL_TC")
        sys_t = "HBS" if "HBS" in desc and "SSE" not in desc else ("SSE" if "SSE" in desc and "HBS" not in desc else "ALL")
        title = desc[:110] + ("..." if len(desc) > 110 else "")

        cur.execute(
            """
            INSERT INTO issues (
                issue_code, machine_code, system_type, floor, area_name, category, severity,
                title, description, source_ref, action_required, responsible_party, status,
                created_by, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                iss_code,
                "",
                sys_t,
                "All",
                stage,
                cat,
                severity,
                title,
                desc,
                src,
                act,
                "Ban Kỹ thuật / Hàn Việt / PMU",
                status,
                "System (Reconciliation)",
                now_str,
                now_str,
            ),
        )

    # Also add a site readiness issue from 'Copy of RFA-SDS-0305C SSE Data outlet and Power socket layout Description Site checked.xlsx'
    cur.execute(
        """
        INSERT INTO issues (
            issue_code, machine_code, system_type, floor, area_name, category, severity,
            title, description, source_ref, action_required, responsible_party, status,
            created_by, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            "ISS-SITE-01",
            "",
            "SSE",
            "GF / 1F / 2F",
            "Các điểm kiểm tra an ninh SSE (GF VIP, GF Staff, 1F Hải quan, 1F Transfer)",
            "POWER_DATA",
            "HIGH",
            "Thiếu số lượng ổ cắm nguồn (Power socket) & ổ mạng (Data outlet) thực tế ngoài site so với thiết kế 0305C",
            "Qua kiểm tra hiện trường (File RFA-SDS-0305C Site checked & bảng node mạng máy soi): Nhiều vị trí tại GF (Hậu phụ trách), 1F (Thái phụ trách), 2F (Đức phụ trách) số lượng ổ nguồn và node mạng trên bản vẽ ký tay / thi công thực tế đang thiếu so với yêu cầu thiết kế Stage 2 (0305C).",
            "Copy of RFA-SDS-0305C SSE Data outlet and Power socket layout Description Site checked.xlsx & node mang máy soi.xlsx",
            "Đối chiếu và yêu cầu nhà thầu MEP/Ricons bổ sung đủ ổ nguồn và node mạng tại từng vị trí máy soi trước khi đấu nối & T&C.",
            "Hậu (GF), Thái (1F/3F), Đức (2F) & Ricons/MEP",
            "OPEN",
            "System (Site Check)",
            now_str,
            now_str,
        ),
    )

    # Initial audit log
    cur.execute(
        """
        INSERT INTO audit_logs (timestamp, username, user_fullname, action_type, target_code, summary, details_json)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            now_str,
            "admin",
            "Hệ thống khởi tạo tự động",
            "INIT_DATABASE",
            "ALL",
            f"Khởi tạo dữ liệu chuẩn Gói thầu 5.10 (LTIA): {len(machine_specs)} máy chính độc lập, {len(aux_batches)} nhóm thiết bị phụ trợ/máy trạm/băng tải, 14 lô hàng và danh mục vướng mắc.",
            "{}",
        ),
    )

    conn.commit()
    conn.close()
    return True


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    db_file = os.path.join(os.path.dirname(__file__), "data", "ltia_510_tracker.db")
    if os.path.exists(db_file):
        os.remove(db_file)
    init_db(db_file)
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    c.execute("SELECT system_type, model_key, COUNT(*) FROM machines GROUP BY system_type, model_key")
    print("=== SEEDED INDIVIDUAL MACHINES ===")
    tot = 0
    for r in c.fetchall():
        print(f"  {r[0]:3s} | {r[1]:18s} : {r[2]:3d} units")
        tot += r[2]
    print(f"TOTAL INDIVIDUAL MACHINES: {tot}")
    c.execute("SELECT COUNT(*) FROM auxiliary_batches")
    print(f"TOTAL AUXILIARY BATCHES: {c.fetchone()[0]}")
    c.execute("SELECT COUNT(*) FROM issues")
    print(f"TOTAL ISSUES: {c.fetchone()[0]}")
    conn.close()
