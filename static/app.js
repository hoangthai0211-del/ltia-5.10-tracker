/* ==========================================================================
   LTIA Package 5.10 (HBS & SSE) - Frontend Application Logic (app.js)
   ========================================================================== */

const STATE = {
  stepsDef: [],
  machines: [],
  auxBatches: [],
  shipments: [],
  issues: [],
  users: [],
  auditLogs: [],
  networkInfo: {},
  currentUser: {
    username: "thai",
    full_name: "Thái (Quản trị viên)",
    role: "admin",
    scope: "ALL",
  },
  isReadOnly: false,
  activeTab: "dashboard",
  modelTableFilter: "ALL",
  selectedFloorMap: "ALL",
  selectedMachineCodes: new Set(),
  editingMachineCode: null,
  cad: {
    currentDwgId: "HBS_LA_2F_10001",
    highlightedMachineCode: null,
    showPinLabels: true,
    isCollapsed: false,
    zoom: 1.0,
    panX: 0,
    panY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    pendingFocusOnLoad: false,
  },
};

const STATUS_LABELS = {
  NOT_ARRIVED: "Chưa về kho",
  ARRIVED: "Đã về kho (Chờ lắp)",
  INSTALLING: "Đang lắp đặt",
  INSTALLED: "Xong lắp đặt (Chờ T&C)",
  TC_IN_PROGRESS: "Đang T&C",
  COMPLETED: "Hoàn thành Bàn giao",
  BLOCKED: "Đang vướng (Blocked)",
};

const BOQ_MAP = {
  "HBS|RAP-RTT110": { qty: 11, note: "+1 máy RTT110 tại GF Make-up (Thay 1 máy 928DX theo Comment ACV)" },
  "HBS|RAP-928DX-HBS": { qty: 40, note: "-1 máy tại GF chuyển sang RTT110; 1 máy Lô 2 điều chuyển sang SSE" },
  "HBS|RAP-632DV-HBS": { qty: 2, note: "Khớp 100% BOQ & Bản vẽ (2 bộ)" },
  "HBS|RAP-ITEMISER5X": { qty: 4, note: "Đã về đủ 4 bộ tại Lô 15 (S/N: 25-14757, 14755, 14758, 14799)" },
  "HBS|RAP-MATRIX30-CMS": { qty: 3, note: "Lô 14 đã về 2 tủ Server Split + 1 tủ TIP Rack" },
  "SSE|RAP-920CT": { qty: 28, note: "Khớp 100% BOQ, Bản vẽ & Lô 4, 7, 8, 9 (28 bộ)" },
  "SSE|RAP-TRS-920CT": { qty: 28, note: "Khớp 100% BOQ, Bản vẽ & Lô 11, 12 (28 hệ TRS 19.5m)" },
  "SSE|RAP-920DX": { qty: 10, note: "Khớp 100% BOQ, Bản vẽ & Lô 3 (10 bộ)" },
  "SSE|RAP-TRS-920DX": { qty: 2, note: "Khớp 100% BOQ, Bản vẽ & Lô 12 (2 hệ TRS 12m)" },
  "SSE|RAP-928DX-SSE": { qty: 11, note: "Lô 3 về 10 bộ + 1 bộ điều chuyển từ HBS Lô 2 = Đủ 11 bộ" },
  "SSE|RAP-632DV-SSE": { qty: 1, note: "Khớp 100% BOQ, Bản vẽ & Lô 3 (1 bộ)" },
  "SSE|RS-QPS201": { qty: 17, note: "Khớp 100% BOQ, Bản vẽ & Lô 6 (17 bộ R&S QPS201)" },
  "SSE|RAP-METOR6E": { qty: 38, note: "Khớp 100% BOQ, Bản vẽ & Lô 3 (38 cổng từ Metor 6E)" },
  "SSE|RAP-ITEMISER5X": { qty: 20, note: "Đã về đủ 20 bộ tại Lô 16 (S/N: 25-15732..15740)" },
  "SSE|FOX-EAS-AMD06HP": { qty: 16, note: "Khớp 16 cổng RFID tại 1F Arrival Customs - Chờ hàng về" },
  "SSE|SSE-CMS-LOT": { qty: 3, note: "Hệ thống Server quản lý tập trung SSE tại 2F Data Center" },
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================
window.addEventListener("DOMContentLoaded", () => {
  // Check URL query for readonly mode
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "readonly") {
    STATE.isReadOnly = true;
    STATE.currentUser = {
      username: "viewer",
      full_name: "Chế độ Xem Báo cáo (CĐT / PMU)",
      role: "viewer",
      scope: "ALL",
    };
  } else {
    const savedUser = localStorage.getItem("ltia510_user");
    if (savedUser) {
      try {
        STATE.currentUser = JSON.parse(savedUser);
        STATE.isReadOnly = STATE.currentUser.role === "viewer";
      } catch (e) {}
    }
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const bulkDateEl = document.getElementById("bulkDateInput");
  if (bulkDateEl) bulkDateEl.value = todayStr;

  updateUserHeaderUI();
  initCadViewerEvents();
  refreshAllData();
});

function showToast(msg, isError = false) {
  const container = document.getElementById("toastContainer");
  if (!container) return;
  const el = document.createElement("div");
  el.className = `toast-item ${isError ? "toast-error" : ""}`;
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => {
    el.remove();
  }, 3600);
}

async function apiPost(url, payload = {}) {
  if (STATE.isReadOnly && !url.startsWith("/api/login") && !url.startsWith("/api/tunnel")) {
    showToast("Bạn đang ở Chế độ Chỉ Xem (Read-Only). Vui lòng chuyển sang tài khoản Kỹ sư để cập nhật!", true);
    throw new Error("Read-only mode");
  }
  payload.updated_by = STATE.currentUser.username;
  payload.user_role = STATE.currentUser.role;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data;
}

async function refreshAllData() {
  const syncEl = document.getElementById("headerSyncStatus");
  if (syncEl) syncEl.textContent = "⏳ Đang đồng bộ...";
  try {
    const res = await fetch("/api/bootstrap");
    const data = await res.json();
    STATE.stepsDef = data.steps_def || [];
    STATE.machines = data.machines || [];
    STATE.auxBatches = data.aux_batches || [];
    STATE.shipments = data.shipments || [];
    STATE.issues = data.issues || [];
    STATE.users = data.users || [];
    STATE.auditLogs = data.audit_logs || [];
    STATE.networkInfo = data.network_info || {};

    populateDynamicFilterDropdowns();
    renderAllViews();

    if (syncEl) {
      syncEl.textContent = `● Trực tuyến (${data.server_time || ""})`;
    }
  } catch (err) {
    if (syncEl) syncEl.textContent = "⚠️ Lỗi kết nối máy chủ";
    showToast("Không thể tải dữ liệu từ máy chủ: " + err.message, true);
  }
}

function renderAllViews() {
  document.getElementById("badgeMachinesCount").textContent = STATE.machines.length;
  document.getElementById("badgeAuxCount").textContent = STATE.auxBatches.length;
  const badgeShipments = document.getElementById("badgeShipmentsCount");
  if (badgeShipments) badgeShipments.textContent = STATE.shipments.length;
  const openIssCount = STATE.issues.filter((i) => i.status === "OPEN").length;
  document.getElementById("badgeOpenIssues").textContent = openIssCount;

  renderDashboard();
  populateCadDrawingDropdown();
  renderFloorMap();
  renderCadViewer();
  renderMachinesTable();
  renderAuxTable();
  renderShipmentsTable();
  renderIssuesList();
  renderAdminTab();
}

function switchTab(tabId) {
  STATE.activeTab = tabId;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === `tab-${tabId}`);
  });
}

// ==========================================================================
// USER & READ-ONLY MODE
// ==========================================================================
function updateUserHeaderUI() {
  const u = STATE.currentUser;
  const banner = document.getElementById("readonlyBanner");
  if (banner) banner.classList.toggle("hidden", !STATE.isReadOnly);

  document.getElementById("userNameDisplay").textContent = u.full_name || u.username;
  document.getElementById("userRoleDisplay").textContent = STATE.isReadOnly
    ? "Chỉ xem (Read-Only)"
    : `Vai trò: ${u.role.toUpperCase()} (${u.scope || "ALL"})`;
  document.getElementById("userAvatar").textContent = (u.username || "KS").slice(0, 2).toUpperCase();
}

function openLoginModal() {
  const grid = document.getElementById("quickUsersGrid");
  if (grid) {
    grid.innerHTML = STATE.users
      .map(
        (u) => `
      <button class="quick-user-btn" onclick="quickSwitchUser('${u.username}')">
        <div class="font-bold">${u.full_name}</div>
        <div class="text-xs text-muted">@${u.username} • Phạm vi: ${u.scope}</div>
      </button>
    `
      )
      .join("");
  }
  document.getElementById("loginErrorMsg").classList.add("hidden");
  document.getElementById("loginModal").classList.remove("hidden");
}

function quickSwitchUser(username) {
  const u = STATE.users.find((x) => x.username === username);
  if (!u) return;
  STATE.currentUser = u;
  STATE.isReadOnly = u.role === "viewer";
  localStorage.setItem("ltia510_user", JSON.stringify(u));
  updateUserHeaderUI();
  closeModal("loginModal");
  showToast(`Đã chuyển sang tài khoản: ${u.full_name}`);
}

async function submitLogin() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  try {
    const res = await apiPost("/api/login", { username, password });
    if (res.ok && res.user) {
      STATE.currentUser = res.user;
      STATE.isReadOnly = res.user.role === "viewer";
      localStorage.setItem("ltia510_user", JSON.stringify(res.user));
      updateUserHeaderUI();
      closeModal("loginModal");
      showToast(`Đăng nhập thành công: ${res.user.full_name}`);
    }
  } catch (err) {
    const errEl = document.getElementById("loginErrorMsg");
    errEl.textContent = err.message;
    errEl.classList.remove("hidden");
  }
}

function enterReadOnlyMode() {
  STATE.isReadOnly = true;
  STATE.currentUser = {
    username: "viewer",
    full_name: "Chế độ Xem Báo cáo (CĐT / PMU)",
    role: "viewer",
    scope: "ALL",
  };
  updateUserHeaderUI();
  closeModal("loginModal");
  showToast("Đã bật Chế độ Xem Báo cáo (Read-Only)");
}

function exitReadOnlyMode() {
  openLoginModal();
}

// ==========================================================================
// TAB 1: DASHBOARD & RECONCILIATION
// ==========================================================================
function renderDashboard() {
  const total = STATE.machines.length || 1;
  const hbsMachines = STATE.machines.filter((m) => m.system_type === "HBS");
  const sseMachines = STATE.machines.filter((m) => m.system_type === "SSE");

  const arrivedCount = STATE.machines.filter(
    (m) => m.steps?.STEP_1_INCOMING?.status === "COMPLETED"
  ).length;
  const installingCount = STATE.machines.filter((m) => m.current_status === "INSTALLING").length;
  const instDoneCount = STATE.machines.filter(
    (m) => m.steps?.STEP_5_INST_INSPECT?.status === "COMPLETED"
  ).length;
  const tcInProgCount = STATE.machines.filter((m) => m.current_status === "TC_IN_PROGRESS").length;
  const handoverCount = STATE.machines.filter(
    (m) => m.steps?.STEP_9_HANDOVER?.status === "COMPLETED"
  ).length;

  const avgOverall = (
    STATE.machines.reduce((acc, m) => acc + (m.overall_progress || 0), 0) / total
  ).toFixed(1);
  const avgInstall = (
    STATE.machines.reduce((acc, m) => acc + (m.install_progress || 0), 0) / total
  ).toFixed(1);
  const avgTc = (
    STATE.machines.reduce((acc, m) => acc + (m.tc_progress || 0), 0) / total
  ).toFixed(1);

  const readySiteCount = STATE.machines.filter(
    (m) => m.power_ready && m.network_ready && m.civil_ready
  ).length;
  const openIssues = STATE.issues.filter((i) => i.status === "OPEN").length;

  // 1. Render KPI Cards
  const kpiGrid = document.getElementById("dashboardKpiGrid");
  kpiGrid.innerHTML = `
    <div class="kpi-card kpi-blue" onclick="switchTab('machines')">
      <div class="kpi-title">Tổng số Máy chính (Baseline BV)</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${STATE.machines.length}</div>
        <span class="kpi-pct">${avgOverall}% TB</span>
      </div>
      <div class="kpi-sub">HBS (42200): <strong>${hbsMachines.length}</strong> • SSE (42100): <strong>${sseMachines.length}</strong></div>
    </div>

    <div class="kpi-card kpi-cyan" onclick="quickFilterMachinesByStatus('ARRIVED')">
      <div class="kpi-title">Bước 1: Đã về kho / công trường</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${arrivedCount}<span class="text-muted text-md">/${STATE.machines.length}</span></div>
        <span class="kpi-pct">${Math.round((arrivedCount / total) * 100)}%</span>
      </div>
      <div class="kpi-sub">Theo 16 Lô PL • Chưa về: <strong>${STATE.machines.length - arrivedCount}</strong> máy</div>
    </div>

    <div class="kpi-card kpi-amber" onclick="quickFilterMachinesByStatus('INSTALLING')">
      <div class="kpi-title">GĐ Lắp đặt (Bước 2 → Bước 5)</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${instDoneCount}<span class="text-muted text-md"> xong NT</span></div>
        <span class="kpi-pct">${avgInstall}% / 55%</span>
      </div>
      <div class="kpi-sub">Đang lắp: <strong>${installingCount}</strong> máy • Đã NT tĩnh: <strong>${instDoneCount}</strong> máy</div>
    </div>

    <div class="kpi-card kpi-purple" onclick="quickFilterMachinesByStatus('TC_IN_PROGRESS')">
      <div class="kpi-title">GĐ T&C & Bàn giao (Bước 6 → 9)</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${handoverCount}<span class="text-muted text-md"> bàn giao</span></div>
        <span class="kpi-pct">${avgTc}% / 45%</span>
      </div>
      <div class="kpi-sub">Đang chạy SAT/ISAT: <strong>${tcInProgCount}</strong> máy • Hoàn tất: <strong>${handoverCount}</strong></div>
    </div>

    <div class="kpi-card kpi-green" onclick="quickFilterSpecial('READY_TO_INSTALL')">
      <div class="kpi-title">Mặt bằng Sẵn sàng (Điện + Mạng + Sàn)</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${readySiteCount}<span class="text-muted text-md">/${STATE.machines.length}</span></div>
        <span class="kpi-pct">${Math.round((readySiteCount / total) * 100)}%</span>
      </div>
      <div class="kpi-sub">Bấm để lọc các máy đã đủ Điện/Mạng/Mặt bằng</div>
    </div>

    <div class="kpi-card kpi-red" onclick="switchTab('issues')">
      <div class="kpi-title">Vướng mắc / RFI / Punchlist</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${openIssues}</div>
        <span class="kpi-pct">Tổng ${STATE.issues.length} mục</span>
      </div>
      <div class="kpi-sub">Bấm để xem chi tiết thiếu ổ cắm, VO & hàng chưa về</div>
    </div>
  `;

  // 2. Render System Progress Panel (HBS vs SSE)
  const calcSysStats = (arr) => {
    const n = arr.length || 1;
    const ov = (arr.reduce((s, m) => s + (m.overall_progress || 0), 0) / n).toFixed(1);
    const inst = (arr.reduce((s, m) => s + (m.install_progress || 0), 0) / n).toFixed(1);
    const tc = (arr.reduce((s, m) => s + (m.tc_progress || 0), 0) / n).toFixed(1);
    const arrCnt = arr.filter((m) => m.steps?.STEP_1_INCOMING?.status === "COMPLETED").length;
    const instCnt = arr.filter((m) => m.steps?.STEP_5_INST_INSPECT?.status === "COMPLETED").length;
    const doneCnt = arr.filter((m) => m.steps?.STEP_9_HANDOVER?.status === "COMPLETED").length;
    return { n: arr.length, ov, inst, tc, arrCnt, instCnt, doneCnt };
  };

  const hbsSt = calcSysStats(hbsMachines);
  const sseSt = calcSysStats(sseMachines);

  document.getElementById("systemProgressPanel").innerHTML = `
    <div class="sys-prog-card">
      <div class="flex-between">
        <div>
          <span class="badge badge-hbs">HBS - 42200</span>
          <strong>Hệ thống Soi chiếu Hành lý Ký gửi (${hbsSt.n} máy chính)</strong>
        </div>
        <strong class="text-md">${hbsSt.ov}%</strong>
      </div>
      <div class="progress-track progress-track-lg mt-8">
        <div class="progress-fill fill-blue" style="width:${hbsSt.ov}%"></div>
      </div>
      <div class="flex-between text-xs text-muted mt-8">
        <span>📦 Đã về kho: <strong>${hbsSt.arrCnt}/${hbsSt.n}</strong></span>
        <span>🔧 Xong Lắp đặt (B5): <strong>${hbsSt.instCnt}/${hbsSt.n}</strong> (${hbsSt.inst}%/55%)</span>
        <span>🏆 Bàn giao (B9): <strong>${hbsSt.doneCnt}/${hbsSt.n}</strong> (${hbsSt.tc}%/45%)</span>
      </div>
    </div>

    <div class="sys-prog-card">
      <div class="flex-between">
        <div>
          <span class="badge badge-sse">SSE - 42100</span>
          <strong>Hệ thống Thiết bị Soi chiếu An ninh (${sseSt.n} máy chính)</strong>
        </div>
        <strong class="text-md">${sseSt.ov}%</strong>
      </div>
      <div class="progress-track progress-track-lg mt-8">
        <div class="progress-fill fill-purple" style="width:${sseSt.ov}%"></div>
      </div>
      <div class="flex-between text-xs text-muted mt-8">
        <span>📦 Đã về kho: <strong>${sseSt.arrCnt}/${sseSt.n}</strong></span>
        <span>🔧 Xong Lắp đặt (B5): <strong>${sseSt.instCnt}/${sseSt.n}</strong> (${sseSt.inst}%/55%)</span>
        <span>🏆 Bàn giao (B9): <strong>${sseSt.doneCnt}/${sseSt.n}</strong> (${sseSt.tc}%/45%)</span>
      </div>
    </div>
  `;

  // 3. Render Floor Progress Panel
  const floorsInfo = [
    { code: "3F", name: "Tầng 3 (3F) - Check-in Islands, Passenger Departure, OOG & Staff", color: "fill-blue" },
    { code: "2F", name: "Tầng 2 (2F) - Primary HBS (10 RTT110) & Data Center (Matrix 30 / SSE CMS)", color: "fill-purple" },
    { code: "1F", name: "Tầng 1 (1F) - Arrival Customs (928DX, RFID) & Transfer Check Points", color: "fill-cyan" },
    { code: "GF", name: "Tầng Trệt (GF) - Arrival HBS, Make-up RTT110, Oversize, VIP & Staff/Goods", color: "fill-green" },
  ];

  document.getElementById("floorProgressPanel").innerHTML = floorsInfo
    .map((fl) => {
      const list = STATE.machines.filter((m) => m.floor === fl.code);
      const st = calcSysStats(list);
      return `
      <div class="floor-bar-row" onclick="jumpToFloorMap('${fl.code}')">
        <div class="flex-between">
          <strong>${fl.name}</strong>
          <span><strong>${st.ov}%</strong> (${st.n} máy)</span>
        </div>
        <div class="progress-track mt-4">
          <div class="progress-fill ${fl.color}" style="width:${st.ov}%"></div>
        </div>
        <div class="flex-between text-xs text-muted mt-4">
          <span>Đã về: ${st.arrCnt}/${st.n}</span>
          <span>Xong lắp đặt: ${st.instCnt}/${st.n}</span>
          <span>Hoàn thành T&C: ${st.doneCnt}/${st.n}</span>
        </div>
      </div>
    `;
    })
    .join("");

  // 4. Render 9-Step Funnel
  const funnelEl = document.getElementById("stepFunnelGrid");
  funnelEl.innerHTML = STATE.stepsDef
    .map((s) => {
      const doneCnt = STATE.machines.filter((m) => m.steps?.[s.code]?.status === "COMPLETED").length;
      const inProgCnt = STATE.machines.filter((m) => m.steps?.[s.code]?.status === "IN_PROGRESS").length;
      const pct = Math.round((doneCnt / total) * 100);
      return `
      <div class="funnel-step-box phase-${s.phase}" onclick="switchTab('machines')">
        <div class="funnel-step-num">${s.phase === "INSTALL" ? "GĐ LẮP ĐẶT" : "GĐ T&C"} • ${s.weight}%</div>
        <div class="funnel-step-title">${s.name}</div>
        <div class="flex-between">
          <span class="funnel-step-count">${doneCnt}<small class="text-xs text-muted">/${STATE.machines.length}</small></span>
          <span class="badge ${pct === 100 ? "badge-success" : "badge-info"}">${pct}%</span>
        </div>
        <div class="progress-track mt-4">
          <div class="progress-fill ${s.phase === "INSTALL" ? "fill-blue" : "fill-purple"}" style="width:${pct}%"></div>
        </div>
        <div class="text-xs text-muted mt-4">Đang làm: <strong>${inProgCnt}</strong> máy</div>
      </div>
    `;
    })
    .join("");

  // 5. Render Model Summary & Reconciliation Table
  renderModelSummaryTable();
}

function filterModelTable(sys) {
  STATE.modelTableFilter = sys;
  renderModelSummaryTable();
}

function renderModelSummaryTable() {
  const groups = {};
  STATE.machines.forEach((m) => {
    if (STATE.modelTableFilter !== "ALL" && m.system_type !== STATE.modelTableFilter) return;
    const key = `${m.system_type}|${m.model_key}`;
    if (!groups[key]) {
      groups[key] = {
        system_type: m.system_type,
        model_key: m.model_key,
        model_name: m.model_name,
        list: [],
      };
    }
    groups[key].list.push(m);
  });

  const tbody = document.getElementById("modelSummaryTbody");
  const keys = Object.keys(groups).sort();

  tbody.innerHTML = keys
    .map((k) => {
      const g = groups[k];
      const list = g.list;
      const n = list.length;
      const boqInfo = BOQ_MAP[k] || { qty: n, note: "Khớp BOQ & Bản vẽ" };
      const diff = n - boqInfo.qty;

      const arrived = list.filter((m) => m.steps?.STEP_1_INCOMING?.status === "COMPLETED").length;
      const installing = list.filter((m) => m.current_status === "INSTALLING").length;
      const instDone = list.filter((m) => m.steps?.STEP_5_INST_INSPECT?.status === "COMPLETED").length;
      const tcInProg = list.filter((m) => m.current_status === "TC_IN_PROGRESS").length;
      const done = list.filter((m) => m.steps?.STEP_9_HANDOVER?.status === "COMPLETED").length;
      const avgPct = (list.reduce((s, m) => s + (m.overall_progress || 0), 0) / n).toFixed(1);

      let diffBadge = `<span class="badge badge-success">Khớp (${n})</span>`;
      if (diff > 0) {
        diffBadge = `<span class="badge badge-warning">+${diff} so với BOQ</span>`;
      } else if (diff < 0) {
        diffBadge = `<span class="badge badge-warning">${diff} so với BOQ</span>`;
      }

      return `
      <tr>
        <td><span class="badge ${g.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${g.system_type}</span></td>
        <td class="font-bold">${g.model_key}</td>
        <td>${g.model_name}</td>
        <td class="text-center font-bold">${boqInfo.qty}</td>
        <td class="text-center font-bold">${n}</td>
        <td>
          ${diffBadge}
          <div class="text-xs text-muted mt-4">${boqInfo.note}</div>
        </td>
        <td class="text-center font-bold">${arrived}/${n}</td>
        <td class="text-center">${installing}</td>
        <td class="text-center">${instDone}/${n}</td>
        <td class="text-center">${tcInProg}</td>
        <td class="text-center font-bold text-success">${done}/${n}</td>
        <td>
          <div class="flex-between text-xs"><strong>${avgPct}%</strong></div>
          <div class="progress-track"><div class="progress-fill fill-blue" style="width:${avgPct}%"></div></div>
        </td>
        <td class="text-center">
          <button class="btn btn-xs btn-outline" onclick="jumpToModelMachines('${g.system_type}', '${g.model_key}')">Xem ${n} máy</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// ==========================================================================
// TAB 2: VISUAL FLOOR & ZONE MATRIX + INTERACTIVE CAD BLUEPRINT VIEWER
// ==========================================================================
function jumpToFloorMap(floorCode) {
  switchTab("floormap");
  selectFloorMap(floorCode);
}

function selectFloorMap(floorCode) {
  STATE.selectedFloorMap = floorCode;
  document.querySelectorAll("#floorMapSelector .floor-pill").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-floor") === floorCode);
  });

  // Automatically select the corresponding overall floor plan (00001)
  const sysFilter = document.getElementById("floorMapSystemFilter")?.value || "ALL";
  const defaultByFloor = {
    "3F": sysFilter === "HBS" ? "HBS_LA_3F_00001" : "SSE_LA_3F_00001",
    "2F": sysFilter === "SSE" ? "SSE_LA_2F_00001" : "HBS_LA_2F_00001",
    "1F": "SSE_LA_1F_00001",
    "GF": sysFilter === "SSE" ? "SSE_LA_GF_00001" : "HBS_LA_GF_00001",
  };

  if (floorCode !== "ALL" && defaultByFloor[floorCode]) {
    populateCadDrawingDropdown();
    selectCadDrawing(defaultByFloor[floorCode], null, false);
  } else {
    populateCadDrawingDropdown();
    renderCadViewer();
  }
  renderFloorMap();
}

function initCadViewerEvents() {
  const vp = document.getElementById("cadViewport");
  if (!vp) return;

  // Mouse wheel zoom centered on cursor
  vp.addEventListener(
    "wheel",
    (e) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.22 : -0.22;
      const rect = vp.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      zoomCadAtPoint(STATE.cad.zoom + delta, mouseX, mouseY);
    },
    { passive: false }
  );

  // Mouse drag pan
  vp.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    if (e.target.closest(".cad-pin")) return;
    STATE.cad.isDragging = true;
    STATE.cad.dragStartX = e.clientX - STATE.cad.panX;
    STATE.cad.dragStartY = e.clientY - STATE.cad.panY;
    vp.classList.add("is-dragging");
  });

  window.addEventListener("mousemove", (e) => {
    if (!STATE.cad.isDragging) return;
    STATE.cad.panX = e.clientX - STATE.cad.dragStartX;
    STATE.cad.panY = e.clientY - STATE.cad.dragStartY;
    applyCadStageTransform(false);
  });

  window.addEventListener("mouseup", () => {
    if (STATE.cad.isDragging) {
      STATE.cad.isDragging = false;
      vp.classList.remove("is-dragging");
    }
  });
}

function populateCadDrawingDropdown() {
  const sel = document.getElementById("cadDrawingSelect");
  if (!sel || typeof DRAWINGS_CATALOG === "undefined") return;

  const sysFilter = document.getElementById("floorMapSystemFilter")?.value || "ALL";
  const flFilter = STATE.selectedFloorMap || "ALL";

  const allDwgs = Object.values(DRAWINGS_CATALOG);
  const filteredDwgs = allDwgs.filter((d) => {
    if (sysFilter !== "ALL" && d.system !== sysFilter) return false;
    if (flFilter !== "ALL" && d.floor !== flFilter) return false;
    return true;
  });
  const listToUse = filteredDwgs.length > 0 ? filteredDwgs : allDwgs;

  const groups = {
    "Hệ thống HBS - Hành lý ký gửi (42200)": [],
    "Hệ thống SSE - An ninh soi chiếu (42100)": [],
  };

  listToUse.forEach((d) => {
    const gKey = d.system === "HBS" ? "Hệ thống HBS - Hành lý ký gửi (42200)" : "Hệ thống SSE - An ninh soi chiếu (42100)";
    const count = getMachinesForDrawing(d.id, STATE.machines).length;
    const optHtml = `<option value="${d.id}">🏢 ${d.zone_label} — ${d.code} (${count} máy)</option>`;
    if (groups[gKey]) groups[gKey].push(optHtml);
  });

  sel.innerHTML = Object.entries(groups)
    .filter(([, arr]) => arr.length > 0)
    .map(([gName, arr]) => `<optgroup label="${gName}">${arr.join("")}</optgroup>`)
    .join("");

  if (DRAWINGS_CATALOG[STATE.cad.currentDwgId]) {
    sel.value = STATE.cad.currentDwgId;
  }
}

function selectCadDrawing(dwgId, highlightMachineCode = null, autoZoomToPin = false) {
  if (typeof DRAWINGS_CATALOG === "undefined" || !DRAWINGS_CATALOG[dwgId]) return;
  const dwgChanged = STATE.cad.currentDwgId !== dwgId;
  STATE.cad.currentDwgId = dwgId;
  if (highlightMachineCode !== undefined) {
    STATE.cad.highlightedMachineCode = highlightMachineCode;
  }

  const sel = document.getElementById("cadDrawingSelect");
  if (sel) {
    if (!Array.from(sel.options).some((o) => o.value === dwgId)) {
      populateCadDrawingDropdown();
    }
    sel.value = dwgId;
  }

  const imgEl = document.getElementById("cadImage");
  const dwg = DRAWINGS_CATALOG[dwgId];
  if (imgEl && dwg) {
    STATE.cad.pendingFocusOnLoad = !!autoZoomToPin;
    if (dwgChanged || !imgEl.getAttribute("src") || !imgEl.getAttribute("src").endsWith(dwg.img_url)) {
      imgEl.src = dwg.img_url;
    } else {
      renderCadViewer();
      if (autoZoomToPin) {
        setTimeout(() => focusHighlightedMachinePin(), 40);
      }
    }
  }
}

function onCadImageLoaded() {
  renderCadViewer();
  if (STATE.cad.pendingFocusOnLoad && STATE.cad.highlightedMachineCode) {
    STATE.cad.pendingFocusOnLoad = false;
    setTimeout(() => focusHighlightedMachinePin(), 50);
  } else {
    resetCadZoomFit(false);
  }
}

function renderCadViewer() {
  if (typeof DRAWINGS_CATALOG === "undefined") return;
  const dwg = DRAWINGS_CATALOG[STATE.cad.currentDwgId];
  if (!dwg) return;

  // Update metadata bar
  const sysBadge = document.getElementById("cadDwgSysBadge");
  if (sysBadge) {
    sysBadge.textContent = dwg.system;
    sysBadge.className = `badge ${dwg.system === "HBS" ? "badge-hbs" : "badge-sse"}`;
  }
  const codeEl = document.getElementById("cadDwgCodeText");
  if (codeEl) codeEl.textContent = dwg.code;
  const scaleEl = document.getElementById("cadDwgScaleBadge");
  if (scaleEl) scaleEl.textContent = dwg.scale;
  const titleEl = document.getElementById("cadDwgTitleText");
  if (titleEl) titleEl.textContent = dwg.title;
  const pdfBtn = document.getElementById("btnCadOpenPdf");
  if (pdfBtn) pdfBtn.href = dwg.pdf_url;

  // Render machine pins on this drawing
  const pinsLayer = document.getElementById("cadPinsLayer");
  const pinItems = getMachinesForDrawing(dwg.id, STATE.machines);
  const countBadge = document.getElementById("cadDwgMachineCountBadge");
  if (countBadge) {
    countBadge.textContent = `${pinItems.length} máy trên mặt bằng tổng`;
  }

  if (!pinsLayer) return;
  const hlCode = STATE.cad.highlightedMachineCode;
  const showLabels = STATE.cad.showPinLabels;

  pinsLayer.innerHTML = pinItems
    .map((item) => {
      const m = item.machine;
      const isHighlighted = m.machine_code === hlCode;
      const shortTag = m.machine_code
        .replace(/^HBS-|^SSE-/, "")
        .replace(/-3F-|-2F-|-1F-|-GF-/, "-");

      const calloutHtml = isHighlighted
        ? `
        <div class="cad-pin-callout" onclick="event.stopPropagation()">
          <div class="cad-callout-top">
            <span class="badge ${m.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${m.system_type}</span>
            <strong>${m.machine_code}</strong>
            <span class="status-pill st-${m.current_status}">${m.overall_progress}%</span>
          </div>
          <div class="cad-callout-pos">📍 ${item.pos_desc}</div>
          <div class="cad-callout-meta">Model: <strong>${m.model_key}</strong> • S/N: <strong>${m.serial_number || "Chưa gán"}</strong> (${m.shipment_no})</div>
          <div class="cad-callout-actions">
            <button class="btn btn-xs btn-primary" onclick="openMachineModal('${m.machine_code}')">✏️ Cập nhật 9 bước</button>
          </div>
        </div>
      `
        : "";

      return `
      <div class="cad-pin st-${m.current_status} ${isHighlighted ? "cad-pin-highlighted" : ""}"
           style="left:${item.x}%; top:${item.y}%;"
           data-machine="${m.machine_code}"
           onclick="onCadPinClick(event, '${m.machine_code}')"
           ondblclick="openMachineModal('${m.machine_code}')"
           title="${m.machine_code} (${m.model_key})\nVị trí: ${item.pos_desc}\nTiến độ: ${m.overall_progress}% (${STATUS_LABELS[m.current_status] || m.current_status})\nS/N: ${m.serial_number || "Chưa gán"}">
        ${isHighlighted ? '<span class="cad-pin-radar"></span><span class="cad-pin-radar cad-pin-radar-delay"></span>' : ""}
        <span class="cad-pin-dot">${m.overall_progress >= 100 ? "✓" : ""}</span>
        ${showLabels || isHighlighted ? `<span class="cad-pin-label">${shortTag}</span>` : ""}
        ${calloutHtml}
      </div>
    `;
    })
    .join("");

  renderSelectedMachineBanner();
}

function renderSelectedMachineBanner() {
  const banner = document.getElementById("cadSelectedMachineBanner");
  if (!banner) return;
  const code = STATE.cad.highlightedMachineCode;
  if (!code) {
    banner.classList.add("hidden");
    return;
  }
  const m = STATE.machines.find((x) => x.machine_code === code);
  if (!m) {
    banner.classList.add("hidden");
    return;
  }
  const cadInfo = resolveMachineCadInfo(m);

  banner.classList.remove("hidden");
  banner.innerHTML = `
    <div class="cad-banner-left">
      <span class="cad-spotlight-badge">🎯 ĐANG ĐỊNH VỊ TRÊN MẶT BẰNG TỔNG</span>
      <span class="badge ${m.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${m.system_type}</span>
      <strong class="cad-banner-code">${m.machine_code}</strong>
      <span class="status-pill st-${m.current_status}">${STATUS_LABELS[m.current_status] || m.current_status} (${m.overall_progress}%)</span>
      <span class="cad-banner-pos">📍 <strong>Vị trí trên mặt bằng:</strong> ${cadInfo ? cadInfo.pos_desc : m.area_name}</span>
      <span class="text-xs text-muted">• Model: <strong>${m.model_key}</strong> • S/N: <strong>${m.serial_number || "Chưa gán"}</strong> • ${m.shipment_no}</span>
    </div>
    <div class="cad-banner-actions">
      <button class="btn btn-xs btn-outline" onclick="focusHighlightedMachinePin()">🎯 Phóng to tâm máy</button>
      <button class="btn btn-xs btn-primary" onclick="openMachineModal('${m.machine_code}')">✏️ Cập nhật Checklist 9 Bước & Hồ sơ</button>
      <button class="btn btn-xs btn-outline" onclick="clearHighlightedMachine()" title="Bỏ chọn máy">✕</button>
    </div>
  `;
}

function onCadPinClick(event, machineCode) {
  event.stopPropagation();
  STATE.cad.highlightedMachineCode = machineCode;
  renderCadViewer();
  focusHighlightedMachinePin();
  highlightMachineCardInDOM(machineCode);
}

function highlightMachineOnDrawing(machineCode, switchToTab = true) {
  const m = STATE.machines.find((x) => x.machine_code === machineCode);
  if (!m) return;

  if (switchToTab && STATE.activeTab !== "floormap") {
    switchTab("floormap");
  }

  // Ensure viewer is expanded
  if (STATE.cad.isCollapsed) {
    toggleCadViewerCollapse();
  }

  const cadInfo = resolveMachineCadInfo(m);
  STATE.cad.highlightedMachineCode = machineCode;

  if (cadInfo && cadInfo.dwg_id) {
    selectCadDrawing(cadInfo.dwg_id, machineCode, true);
  } else {
    renderCadViewer();
    focusHighlightedMachinePin();
  }

  highlightMachineCardInDOM(machineCode);

  const viewerCard = document.getElementById("cadViewerCard");
  if (viewerCard) {
    viewerCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
}

function highlightMachineCardInDOM(machineCode) {
  document.querySelectorAll(".machine-card").forEach((el) => {
    el.classList.toggle("machine-card-selected", el.getAttribute("data-machine-code") === machineCode);
  });
}

function clearHighlightedMachine() {
  STATE.cad.highlightedMachineCode = null;
  renderCadViewer();
  highlightMachineCardInDOM(null);
}

function toggleCadOverviewDrawing() {
  // All drawings are now overall floor plans (00001)
  resetCadZoomFit(true);
}

function toggleCadPinLabels() {
  STATE.cad.showPinLabels = !STATE.cad.showPinLabels;
  const btn = document.getElementById("btnCadToggleLabels");
  if (btn) {
    btn.textContent = `🏷️ Nhãn Mã máy: ${STATE.cad.showPinLabels ? "BẬT" : "TẮT"}`;
  }
  renderCadViewer();
}

function toggleCadViewerCollapse() {
  STATE.cad.isCollapsed = !STATE.cad.isCollapsed;
  const vp = document.getElementById("cadViewport");
  const meta = document.getElementById("cadMetaBar");
  const btn = document.getElementById("btnCadCollapse");
  if (vp) vp.classList.toggle("hidden", STATE.cad.isCollapsed);
  if (meta) meta.classList.toggle("hidden", STATE.cad.isCollapsed);
  if (btn) btn.textContent = STATE.cad.isCollapsed ? "🔽 Mở rộng Bản vẽ" : "🔼 Thu gọn";
}

function applyCadStageTransform(animate = true) {
  const stage = document.getElementById("cadStage");
  const label = document.getElementById("cadZoomPctLabel");
  if (!stage) return;
  stage.style.transition = animate ? "transform 0.28s cubic-bezier(0.22, 1, 0.36, 1)" : "none";
  stage.style.transform = `translate(${STATE.cad.panX}px, ${STATE.cad.panY}px) scale(${STATE.cad.zoom})`;
  if (label) {
    label.textContent = `${Math.round(STATE.cad.zoom * 100)}%`;
  }
}

function zoomCadAtPoint(newZoom, originX, originY, animate = false) {
  const clamped = Math.min(4.0, Math.max(0.4, newZoom));
  const ratio = clamped / STATE.cad.zoom;
  STATE.cad.panX = originX - (originX - STATE.cad.panX) * ratio;
  STATE.cad.panY = originY - (originY - STATE.cad.panY) * ratio;
  STATE.cad.zoom = clamped;
  applyCadStageTransform(animate);
}

function zoomCadBy(delta) {
  const vp = document.getElementById("cadViewport");
  if (!vp) return;
  zoomCadAtPoint(STATE.cad.zoom + delta, vp.clientWidth / 2, vp.clientHeight / 2, true);
}

function resetCadZoomFit(animate = true) {
  STATE.cad.zoom = 1.0;
  STATE.cad.panX = 0;
  STATE.cad.panY = 0;
  applyCadStageTransform(animate);
}

function focusHighlightedMachinePin() {
  const vp = document.getElementById("cadViewport");
  const stage = document.getElementById("cadStage");
  if (!vp || !stage) return;

  const code = STATE.cad.highlightedMachineCode;
  if (!code) {
    resetCadZoomFit(true);
    return;
  }

  const pinItems = getMachinesForDrawing(STATE.cad.currentDwgId, STATE.machines);
  const target = pinItems.find((p) => p.machine.machine_code === code);
  if (!target) {
    resetCadZoomFit(true);
    return;
  }

  const stageW = stage.offsetWidth || vp.clientWidth || 1000;
  const stageH = stage.offsetHeight || vp.clientHeight || 600;
  const pinPxX = (target.x / 100) * stageW;
  const pinPxY = (target.y / 100) * stageH;

  const targetZoom = 1.85;
  STATE.cad.zoom = targetZoom;
  STATE.cad.panX = vp.clientWidth / 2 - pinPxX * targetZoom;
  STATE.cad.panY = vp.clientHeight / 2 - pinPxY * targetZoom + 30;
  applyCadStageTransform(true);
}

function renderFloorMap() {
  const sysFilter = document.getElementById("floorMapSystemFilter")?.value || "ALL";
  const stFilter = document.getElementById("floorMapStatusFilter")?.value || "ALL";
  const q = (document.getElementById("floorMapSearch")?.value || "").trim().toLowerCase();

  populateCadDrawingDropdown();

  const filtered = STATE.machines.filter((m) => {
    if (STATE.selectedFloorMap !== "ALL" && m.floor !== STATE.selectedFloorMap) return false;
    if (sysFilter !== "ALL" && m.system_type !== sysFilter) return false;
    if (stFilter !== "ALL" && m.current_status !== stFilter) return false;
    if (q) {
      const hay = `${m.machine_code} ${m.model_key} ${m.model_name} ${m.serial_number} ${m.area_name} ${m.zone}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  // Group by Floor + Area Name
  const areaGroups = {};
  filtered.forEach((m) => {
    const key = `${m.floor} • ${m.area_name}`;
    if (!areaGroups[key]) {
      areaGroups[key] = {
        floor: m.floor,
        zone: m.zone,
        area_name: m.area_name,
        machines: [],
      };
    }
    areaGroups[key].machines.push(m);
  });

  const container = document.getElementById("floorMapZonesContainer");
  const keys = Object.keys(areaGroups);

  if (keys.length === 0) {
    container.innerHTML = `<div class="card"><div class="card-body text-center text-muted">Không có máy nào khớp bộ lọc hiện tại.</div></div>`;
    return;
  }

  container.innerHTML = keys
    .map((k) => {
      const grp = areaGroups[k];
      const avgPct = (
        grp.machines.reduce((s, m) => s + (m.overall_progress || 0), 0) / grp.machines.length
      ).toFixed(1);

      // Direct button to open Overall Floor Plan for this zone group
      const zoneDwgIds = Array.from(
        new Set(
          grp.machines
            .map((m) => resolveMachineCadInfo(m)?.dwg_id)
            .filter(Boolean)
        )
      );
      const zoneDwgButtons = zoneDwgIds
        .map((dId) => {
          const dObj = DRAWINGS_CATALOG[dId];
          if (!dObj) return "";
          return `<button class="btn btn-xs btn-outline zone-dwg-btn" onclick="selectCadDrawing('${dId}', '${grp.machines[0]?.machine_code || ""}', false); document.getElementById('cadViewerCard')?.scrollIntoView({behavior:'smooth'});" title="Xem mặt bằng tổng thể: ${dObj.title}">📐 Mặt bằng Tầng ${grp.floor} (${dObj.system})</button>`;
        })
        .join("");

      const cardsHtml = grp.machines
        .map((m) => {
          const cadInfo = resolveMachineCadInfo(m);
          const isSelected = STATE.cad.highlightedMachineCode === m.machine_code;
          const miniSteps = STATE.stepsDef
            .map((s) => {
              const st = m.steps?.[s.code]?.status || "PENDING";
              return `<div class="mc-step-bar st-${st}" title="${s.name}: ${st}"></div>`;
            })
            .join("");

          return `
          <div class="machine-card mc-${m.current_status} ${isSelected ? "machine-card-selected" : ""}"
               data-machine-code="${m.machine_code}"
               onclick="highlightMachineOnDrawing('${m.machine_code}', false)">
            <div class="mc-top">
              <span class="mc-code">${m.machine_code}</span>
              <span class="badge ${m.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${m.system_type}</span>
            </div>
            <div class="mc-model">${m.model_key}</div>
            <div class="mc-cad-pos" title="Bấm vào thẻ máy để định vị trên bản vẽ CAD: ${cadInfo?.dwg?.code || ""}">
              📍 ${cadInfo ? cadInfo.pos_desc : m.zone}
            </div>
            <div class="mc-sn">
              <span>S/N: <strong>${m.serial_number || "Chưa gán"}</strong></span>
              <span>${m.shipment_no}</span>
            </div>
            <div class="mc-mini-steps">${miniSteps}</div>
            <div class="flex-between mt-4">
              <div class="pncb-group">
                <span class="pncb-dot ${m.power_ready ? "pncb-on" : "pncb-off"}" title="Điện">P</span>
                <span class="pncb-dot ${m.network_ready ? "pncb-on" : "pncb-off"}" title="Mạng">N</span>
                <span class="pncb-dot ${m.civil_ready ? "pncb-on" : "pncb-off"}" title="Mặt bằng">C</span>
                ${m.system_type === "HBS" 
                  ? `<span class="pncb-dot ${m.bhs_ready ? "pncb-on" : "pncb-off"}" title="BHS">B</span>` 
                  : `<span class="pncb-dot pncb-na" title="Hệ SSE không kết nối BHS">-</span>`}
              </div>
              <div class="flex-gap-4">
                <span class="status-pill st-${m.current_status}">${m.overall_progress}%</span>
                <button class="btn btn-xs btn-outline mc-edit-btn" onclick="event.stopPropagation(); openMachineModal('${m.machine_code}')" title="Mở & Cập nhật Checklist 9 bước">✏️</button>
              </div>
            </div>
          </div>
        `;
        })
        .join("");

      return `
      <div class="zone-group-card">
        <div class="zone-group-header">
          <div>
            <span class="badge badge-info">${grp.floor}</span>
            <strong style="margin-left:6px;">${grp.area_name}</strong>
            <span class="text-xs text-muted" style="margin-left:8px;">(${grp.zone} • ${grp.machines.length} máy)</span>
          </div>
          <div class="flex-gap-8">
            ${zoneDwgButtons}
            <span class="text-xs font-bold">Tiến độ khu vực: ${avgPct}%</span>
          </div>
        </div>
        <div class="zone-cards-grid">${cardsHtml}</div>
      </div>
    `;
    })
    .join("");
}

// ==========================================================================
// TAB 3: 234 MACHINES 9-STEP MATRIX TABLE
// ==========================================================================
function populateDynamicFilterDropdowns() {
  const modelSel = document.getElementById("fltModel");
  const shipSel = document.getElementById("fltShipment");
  if (!modelSel || !shipSel) return;

  const curModel = modelSel.value;
  const curShip = shipSel.value;

  const models = Array.from(new Set(STATE.machines.map((m) => m.model_key))).sort();
  modelSel.innerHTML =
    `<option value="ALL">Tất cả Model (${models.length})</option>` +
    models.map((mod) => `<option value="${mod}">${mod}</option>`).join("");
  if (models.includes(curModel)) modelSel.value = curModel;

  const ships = Array.from(new Set(STATE.machines.map((m) => m.shipment_no))).sort();
  shipSel.innerHTML =
    `<option value="ALL">Tất cả Lô hàng</option>` +
    ships.map((sh) => `<option value="${sh}">${sh}</option>`).join("");
  if (ships.includes(curShip)) shipSel.value = curShip;
}

function getFilteredMachines() {
  const q = (document.getElementById("fltSearch")?.value || "").trim().toLowerCase();
  const sys = document.getElementById("fltSystem")?.value || "ALL";
  const flr = document.getElementById("fltFloor")?.value || "ALL";
  const mod = document.getElementById("fltModel")?.value || "ALL";
  const shp = document.getElementById("fltShipment")?.value || "ALL";
  const st = document.getElementById("fltStatus")?.value || "ALL";
  const eng = document.getElementById("fltEngineer")?.value || "ALL";
  const spc = document.getElementById("fltSpecial")?.value || "ALL";

  return STATE.machines.filter((m) => {
    if (sys !== "ALL" && m.system_type !== sys) return false;
    if (flr !== "ALL" && m.floor !== flr) return false;
    if (mod !== "ALL" && m.model_key !== mod) return false;
    if (shp !== "ALL" && m.shipment_no !== shp) return false;
    if (st !== "ALL" && m.current_status !== st) return false;
    if (eng !== "ALL" && m.assigned_engineer !== eng) return false;

    if (spc === "BOQ_DIFF" && m.boq_status === "MATCHED") return false;
    if (spc === "MISSING_POWER" && m.power_ready) return false;
    if (spc === "MISSING_NET" && m.network_ready) return false;
    if (spc === "READY_TO_INSTALL" && !(m.power_ready && m.network_ready && m.civil_ready)) return false;

    if (q) {
      const hay = `${m.machine_code} ${m.model_key} ${m.model_name} ${m.serial_number} ${m.container_no} ${m.crate_no} ${m.area_name} ${m.zone} ${m.remark} ${m.boq_note}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function renderMachinesTable() {
  const list = getFilteredMachines();
  const summaryEl = document.getElementById("machinesFilterSummary");
  if (summaryEl) {
    const avg = list.length
      ? (list.reduce((s, m) => s + (m.overall_progress || 0), 0) / list.length).toFixed(1)
      : "0.0";
    summaryEl.innerHTML = `Đang hiển thị <strong>${list.length}</strong> / ${STATE.machines.length} máy • Tiến độ TB nhóm đang lọc: <strong>${avg}%</strong>`;
  }

  const tbody = document.getElementById("machinesMatrixTbody");
  tbody.innerHTML = list
    .map((m) => {
      const checked = STATE.selectedMachineCodes.has(m.machine_code) ? "checked" : "";
      const boqFlag =
        m.boq_status !== "MATCHED"
          ? `<span class="badge badge-warning" title="${m.boq_note || ""}">VO/ĐC</span>`
          : "";

      const stepCells = STATE.stepsDef
        .map((s, idx) => {
          const stObj = m.steps?.[s.code] || { status: "PENDING" };
          const st = stObj.status || "PENDING";
          let icon = "·";
          if (st === "COMPLETED") icon = "✓";
          else if (st === "IN_PROGRESS") icon = "◐";
          else if (st === "BLOCKED") icon = "!";

          const tip = `${s.name}\nTrạng thái: ${st}\nNgày: ${stObj.completed_date || "N/A"}\nBấm để chuyển nhanh trạng thái`;
          return `
          <td class="text-center">
            <button class="step-cell-btn step-cell-${st}" title="${tip}" onclick="cycleMachineStep('${m.machine_code}', '${s.code}', '${st}')">
              ${icon}
            </button>
          </td>
        `;
        })
        .join("");

      return `
      <tr>
        <td class="col-check">
          <input type="checkbox" ${checked} onchange="toggleSelectOneMachine('${m.machine_code}', this.checked)" />
        </td>
        <td>
          <a href="javascript:void(0)" class="font-bold" style="color:var(--primary);text-decoration:none;" onclick="openMachineModal('${m.machine_code}')">
            ${m.machine_code}
          </a>
          ${boqFlag}
        </td>
        <td><span class="badge ${m.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${m.system_type}</span></td>
        <td>
          <div class="font-bold">${m.model_key}</div>
          <div class="text-xs text-muted">${m.origin || ""}</div>
        </td>
        <td><span class="badge badge-info">${m.floor}</span></td>
        <td>
          <div class="font-bold">${m.area_name}</div>
          <div class="text-xs text-muted">${resolveMachineCadInfo(m)?.pos_desc || m.zone}</div>
        </td>
        <td>
          <div class="font-bold">${m.serial_number || '<span class="text-muted">Chưa gán S/N</span>'}</div>
          <div class="text-xs text-muted">${m.shipment_no} ${m.container_no ? "• " + m.container_no : ""}</div>
        </td>
        <td class="text-center">
          <div class="pncb-group">
            <span class="pncb-dot ${m.power_ready ? "pncb-on" : "pncb-off"}" title="Nguồn điện (Bấm để bật/tắt)" onclick="quickToggleReadiness('${m.machine_code}', 'power_ready', ${m.power_ready ? 0 : 1})">P</span>
            <span class="pncb-dot ${m.network_ready ? "pncb-on" : "pncb-off"}" title="Mạng Data (Bấm để bật/tắt)" onclick="quickToggleReadiness('${m.machine_code}', 'network_ready', ${m.network_ready ? 0 : 1})">N</span>
            <span class="pncb-dot ${m.civil_ready ? "pncb-on" : "pncb-off"}" title="Mặt bằng sàn (Bấm để bật/tắt)" onclick="quickToggleReadiness('${m.machine_code}', 'civil_ready', ${m.civil_ready ? 0 : 1})">C</span>
            ${m.system_type === "HBS" 
              ? `<span class="pncb-dot ${m.bhs_ready ? "pncb-on" : "pncb-off"}" title="Giao diện BHS (Bấm để bật/tắt)" onclick="quickToggleReadiness('${m.machine_code}', 'bhs_ready', ${m.bhs_ready ? 0 : 1})">B</span>`
              : `<span class="pncb-dot pncb-na" title="Hệ SSE không kết nối BHS (Không áp dụng)">-</span>`}
          </div>
        </td>
        ${stepCells}
        <td>
          <div class="flex-between text-xs">
            <strong>${m.overall_progress}%</strong>
            <span class="status-pill st-${m.current_status}" style="font-size:10px;padding:1px 5px;">${STATUS_LABELS[m.current_status] || m.current_status}</span>
          </div>
          <div class="progress-track"><div class="progress-fill fill-green" style="width:${m.overall_progress}%"></div></div>
        </td>
        <td class="text-xs font-bold">${m.assigned_engineer || ""}</td>
        <td class="text-center">
          <div class="flex-gap-4" style="justify-content:center;">
            <button class="btn btn-xs btn-accent" onclick="highlightMachineOnDrawing('${m.machine_code}', true)" title="Định vị & Highlight máy này trên Bản vẽ Kỹ thuật">📍 Bản vẽ</button>
            <button class="btn btn-xs btn-outline" onclick="openMachineModal('${m.machine_code}')">Chi tiết</button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  updateBulkBarUI();
}

function resetMachineFilters() {
  document.getElementById("fltSearch").value = "";
  document.getElementById("fltSystem").value = "ALL";
  document.getElementById("fltFloor").value = "ALL";
  document.getElementById("fltModel").value = "ALL";
  document.getElementById("fltShipment").value = "ALL";
  document.getElementById("fltStatus").value = "ALL";
  document.getElementById("fltEngineer").value = "ALL";
  document.getElementById("fltSpecial").value = "ALL";
  renderMachinesTable();
}

function quickFilterMachinesByStatus(status) {
  resetMachineFilters();
  document.getElementById("fltStatus").value = status;
  switchTab("machines");
  renderMachinesTable();
}

function quickFilterSpecial(spc) {
  resetMachineFilters();
  document.getElementById("fltSpecial").value = spc;
  switchTab("machines");
  renderMachinesTable();
}

function jumpToModelMachines(sys, modelKey) {
  resetMachineFilters();
  document.getElementById("fltSystem").value = sys;
  document.getElementById("fltModel").value = modelKey;
  switchTab("machines");
  renderMachinesTable();
}

function jumpToShipmentMachines(shipmentNo) {
  resetMachineFilters();
  document.getElementById("fltShipment").value = shipmentNo;
  switchTab("machines");
  renderMachinesTable();
}

// Direct Step Cell Click: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
async function cycleMachineStep(machineCode, stepCode, currentStatus) {
  const order = ["PENDING", "IN_PROGRESS", "COMPLETED"];
  const nextIdx = (order.indexOf(currentStatus) + 1) % order.length;
  const nextStatus = order[nextIdx];
  const todayStr = new Date().toISOString().slice(0, 10);

  try {
    const res = await apiPost("/api/machines/update-step", {
      machine_code: machineCode,
      step_code: stepCode,
      status: nextStatus,
      completed_date: nextStatus === "COMPLETED" ? todayStr : "",
    });
    if (res.ok && res.machine) {
      const idx = STATE.machines.findIndex((x) => x.machine_code === machineCode);
      if (idx >= 0) STATE.machines[idx] = res.machine;
      renderAllViews();
      showToast(`Đã cập nhật ${machineCode} (${stepCode} → ${nextStatus})`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function quickToggleReadiness(machineCode, fieldName, newVal) {
  const m = STATE.machines.find((x) => x.machine_code === machineCode);
  if (fieldName === "bhs_ready" && m && m.system_type === "SSE") {
    showToast("Hệ thống SSE không kết nối với BHS (chỉ áp dụng cho HBS)", true);
    return;
  }
  try {
    const payload = { machine_code: machineCode };
    payload[fieldName] = newVal;
    const res = await apiPost("/api/machines/update-info", payload);
    if (res.ok && res.machine) {
      const idx = STATE.machines.findIndex((x) => x.machine_code === machineCode);
      if (idx >= 0) STATE.machines[idx] = res.machine;
      renderAllViews();
      showToast(`Đã cập nhật điều kiện mặt bằng máy ${machineCode}`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// BULK SELECTION & UPDATE
// ==========================================================================
function toggleSelectOneMachine(code, isChecked) {
  if (isChecked) STATE.selectedMachineCodes.add(code);
  else STATE.selectedMachineCodes.delete(code);
  updateBulkBarUI();
}

function toggleSelectAllMachines(isChecked) {
  const list = getFilteredMachines();
  list.forEach((m) => {
    if (isChecked) STATE.selectedMachineCodes.add(m.machine_code);
    else STATE.selectedMachineCodes.delete(m.machine_code);
  });
  renderMachinesTable();
}

function clearMachineSelection() {
  STATE.selectedMachineCodes.clear();
  const chkAll = document.getElementById("chkSelectAllMachines");
  if (chkAll) chkAll.checked = false;
  renderMachinesTable();
}

function updateBulkBarUI() {
  const bar = document.getElementById("bulkActionBar");
  const cnt = STATE.selectedMachineCodes.size;
  document.getElementById("bulkSelectedCount").textContent = cnt;
  bar.classList.toggle("hidden", cnt === 0);
}

async function applyBulkStepUpdate() {
  const codes = Array.from(STATE.selectedMachineCodes);
  if (!codes.length) return;
  const stepCode = document.getElementById("bulkStepSelect").value;
  const status = document.getElementById("bulkStatusSelect").value;
  const compDate = document.getElementById("bulkDateInput").value;

  try {
    const res = await apiPost("/api/machines/bulk-update", {
      machine_codes: codes,
      action_mode: "step",
      step_code: stepCode,
      status: status,
      completed_date: compDate,
    });
    if (res.ok) {
      await refreshAllData();
      showToast(`Đã cập nhật hàng loạt ${res.updated_count} máy!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function applyBulkReadiness(val) {
  const codes = Array.from(STATE.selectedMachineCodes);
  if (!codes.length) return;
  try {
    const res = await apiPost("/api/machines/bulk-update", {
      machine_codes: codes,
      action_mode: "readiness",
      power_ready: val,
      network_ready: val,
      civil_ready: val,
    });
    if (res.ok) {
      await refreshAllData();
      showToast(`Đã đánh dấu sẵn sàng Điện/Mạng/Sàn cho ${res.updated_count} máy!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// SLIDE-OVER MODAL: MACHINE DETAIL & 9-STEP EDITOR
// ==========================================================================
function openMachineModal(machineCode) {
  const m = STATE.machines.find((x) => x.machine_code === machineCode);
  if (!m) return;
  STATE.editingMachineCode = machineCode;

  document.getElementById("mdlSysBadge").textContent = m.system_type;
  document.getElementById("mdlSysBadge").className = `badge ${m.system_type === "HBS" ? "badge-hbs" : "badge-sse"}`;
  document.getElementById("mdlMachineCode").textContent = m.machine_code;
  document.getElementById("mdlStatusBadge").textContent = STATUS_LABELS[m.current_status] || m.current_status;
  document.getElementById("mdlStatusBadge").className = `status-pill st-${m.current_status}`;
  document.getElementById("mdlModelName").textContent = `${m.model_name} (${m.model_key} • Xuất xứ: ${m.origin})`;

  // Progress bars
  document.getElementById("mdlInstPct").textContent = `${m.install_progress}% / 55%`;
  document.getElementById("mdlInstBar").style.width = `${Math.round((m.install_progress / 55) * 100)}%`;
  document.getElementById("mdlTcPct").textContent = `${m.tc_progress}% / 45%`;
  document.getElementById("mdlTcBar").style.width = `${Math.round((m.tc_progress / 45) * 100)}%`;
  document.getElementById("mdlOverallPct").textContent = `${m.overall_progress}%`;
  document.getElementById("mdlOverallBar").style.width = `${m.overall_progress}%`;

  // BOQ Alert
  const boqBox = document.getElementById("mdlBoqAlert");
  if (m.boq_status !== "MATCHED" || m.boq_note) {
    boqBox.innerHTML = `<strong>📌 Ghi chú Đối soát BOQ / Bản vẽ (${m.boq_status}):</strong> ${m.boq_note || ""} (Mã BOQ: ${m.boq_item || "N/A"} • Bản vẽ: ${m.drawing_ref || "N/A"})`;
    boqBox.classList.remove("hidden");
  } else {
    boqBox.classList.add("hidden");
  }

  // 0. Mini-CAD Location Preview
  renderModalMiniCad(m);

  // Site Readiness
  document.getElementById("mdlPowerReady").checked = !!m.power_ready;
  document.getElementById("mdlNetworkReady").checked = !!m.network_ready;
  document.getElementById("mdlCivilReady").checked = !!m.civil_ready;

  const bhsCheckbox = document.getElementById("mdlBhsReady");
  const bhsLabel = bhsCheckbox ? bhsCheckbox.parentElement : null;
  if (m.system_type === "SSE") {
    bhsCheckbox.checked = false;
    bhsCheckbox.disabled = true;
    if (bhsLabel) {
      bhsLabel.style.opacity = "0.55";
      bhsLabel.style.cursor = "not-allowed";
      bhsLabel.title = "Hệ SSE không kết nối với BHS";
      const spanTxt = bhsLabel.querySelector("span");
      if (spanTxt) spanTxt.textContent = "🔄 Giao diện BHS (K/A - Chỉ áp dụng hệ HBS)";
    }
  } else {
    bhsCheckbox.disabled = false;
    bhsCheckbox.checked = !!m.bhs_ready;
    if (bhsLabel) {
      bhsLabel.style.opacity = "1";
      bhsLabel.style.cursor = "pointer";
      bhsLabel.title = "";
      const spanTxt = bhsLabel.querySelector("span");
      if (spanTxt) spanTxt.textContent = "🔄 Giao diện Băng tải BHS / Bàn con lăn";
    }
  }

  // 9 Steps Checklist
  renderModalStepsChecklist(m);

  // Metadata fields
  document.getElementById("mdlSerialNumber").value = m.serial_number || "";
  document.getElementById("mdlShipmentNo").value = m.shipment_no || "";
  document.getElementById("mdlContainerNo").value = m.container_no || "";
  document.getElementById("mdlCrateNo").value = m.crate_no || "";
  document.getElementById("mdlFloor").value = m.floor || "GF";
  document.getElementById("mdlZone").value = m.zone || "";
  document.getElementById("mdlAreaName").value = m.area_name || "";
  document.getElementById("mdlNetworkNode").value = m.network_node || "";
  document.getElementById("mdlPowerSocket").value = m.power_socket || "";
  document.getElementById("mdlAssignedEngineer").value = m.assigned_engineer || "nho";
  document.getElementById("mdlPlannedFinish").value = m.planned_finish || "";
  document.getElementById("mdlRemark").value = m.remark || "";

  // Attachments
  renderModalAttachments(m);

  document.getElementById("machineDetailModal").classList.remove("hidden");
}

function renderModalMiniCad(m) {
  const metaEl = document.getElementById("mdlCadMetaInfo");
  const imgEl = document.getElementById("mdlMiniCadImg");
  const pinEl = document.getElementById("mdlMiniCadPin");
  const stageEl = document.getElementById("mdlMiniCadStage");
  const pdfLink = document.getElementById("mdlCadPdfLink");
  if (!metaEl || !imgEl || !pinEl || !stageEl) return;

  const info = resolveMachineCadInfo(m);
  if (!info || !info.dwg) {
    metaEl.innerHTML = `<span class="text-muted">Chưa gán bản vẽ CAD cho máy này.</span>`;
    return;
  }

  if (pdfLink) pdfLink.href = info.dwg.pdf_url;

  metaEl.innerHTML = `
    <div><strong>📍 Vị trí chi tiết trên bản vẽ:</strong> <span style="color:var(--primary);font-weight:700;">${info.pos_desc}</span></div>
    <div class="mt-4"><strong>📐 Mã bản vẽ:</strong> <code>${info.dwg.code}</code> (${info.dwg.scale}) — ${info.dwg.zone_label} • Tọa độ: <code>X=${info.x}%, Y=${info.y}%</code></div>
  `;

  imgEl.src = info.dwg.img_url;
  pinEl.className = `cad-pin st-${m.current_status} cad-pin-highlighted`;
  pinEl.style.left = `${info.x}%`;
  pinEl.style.top = `${info.y}%`;
  pinEl.innerHTML = `
    <span class="cad-pin-radar"></span>
    <span class="cad-pin-radar cad-pin-radar-delay"></span>
    <span class="cad-pin-dot">✓</span>
    <span class="cad-pin-label">${m.machine_code}</span>
  `;

  // Center the mini stage around (info.x%, info.y%) with 1.8x zoom
  const zoom = 1.75;
  const shiftX = (50 - info.x) * zoom;
  const shiftY = (50 - info.y) * zoom;
  stageEl.style.transformOrigin = "50% 50%";
  stageEl.style.transform = `translate(${shiftX}%, ${shiftY}%) scale(${zoom})`;
}

function jumpFromModalToCadViewer() {
  const code = STATE.editingMachineCode;
  closeMachineModal();
  if (code) {
    highlightMachineOnDrawing(code, true);
  }
}

function renderModalStepsChecklist(m) {
  const container = document.getElementById("mdlStepsChecklist");
  container.innerHTML = STATE.stepsDef
    .map((s) => {
      const stObj = m.steps?.[s.code] || { status: "PENDING", completed_date: "", note: "" };
      const st = stObj.status || "PENDING";
      return `
      <div class="step-row-item st-${st}" data-step-code="${s.code}">
        <div>
          <span class="badge ${s.phase === "INSTALL" ? "badge-hbs" : "badge-sse"}">${s.weight}%</span>
          <strong style="margin-left:4px;">${s.name}</strong>
        </div>
        <select class="form-select form-select-sm mdl-step-status" data-step="${s.code}" onchange="onModalStepStatusChange(this)">
          <option value="PENDING" ${st === "PENDING" ? "selected" : ""}>⚪ Chưa thực hiện</option>
          <option value="IN_PROGRESS" ${st === "IN_PROGRESS" ? "selected" : ""}>🔄 Đang thực hiện</option>
          <option value="COMPLETED" ${st === "COMPLETED" ? "selected" : ""}>✅ Hoàn thành</option>
          <option value="BLOCKED" ${st === "BLOCKED" ? "selected" : ""}>🔴 Vướng mắc</option>
        </select>
        <input type="date" class="form-input form-input-sm mdl-step-date" data-step="${s.code}" value="${stObj.completed_date || ""}" />
        <input type="text" class="form-input form-input-sm mdl-step-note" data-step="${s.code}" placeholder="Ghi chú bước này..." value="${stObj.note || ""}" />
      </div>
    `;
    })
    .join("");
}

function onModalStepStatusChange(selEl) {
  const stepCode = selEl.getAttribute("data-step");
  const newStatus = selEl.value;
  const row = selEl.closest(".step-row-item");
  if (row) {
    row.className = `step-row-item st-${newStatus}`;
  }
  const dateInput = document.querySelector(`.mdl-step-date[data-step="${stepCode}"]`);
  if (newStatus === "COMPLETED" && dateInput && !dateInput.value) {
    dateInput.value = new Date().toISOString().slice(0, 10);
  }
}

function quickSetAllModalSteps(mode) {
  const todayStr = new Date().toISOString().slice(0, 10);
  STATE.stepsDef.forEach((s) => {
    const shouldComplete = mode === "ALL_DONE" || (mode === "INST_DONE" && s.phase === "INSTALL");
    if (shouldComplete) {
      const sel = document.querySelector(`.mdl-step-status[data-step="${s.code}"]`);
      const dt = document.querySelector(`.mdl-step-date[data-step="${s.code}"]`);
      if (sel) {
        sel.value = "COMPLETED";
        onModalStepStatusChange(sel);
      }
      if (dt && !dt.value) dt.value = todayStr;
    }
  });
}

function renderModalAttachments(m) {
  const listEl = document.getElementById("mdlAttachmentsList");
  const atts = m.attachments || [];
  if (!atts.length) {
    listEl.innerHTML = `<div class="text-xs text-muted">Chưa có ảnh hiện trường hoặc biên bản PDF đính kèm cho máy này.</div>`;
    return;
  }
  listEl.innerHTML = atts
    .map(
      (a) => `
    <div class="attachment-pill">
      <div>
        <span class="badge badge-info">${a.doc_type}</span>
        <a href="${a.url}" target="_blank" class="font-bold" style="margin-left:6px;color:var(--primary);">${a.caption || a.filename}</a>
        <span class="text-xs text-muted" style="margin-left:6px;">(${a.size_kb} KB • ${a.uploaded_by} • ${a.uploaded_at})</span>
      </div>
      <button class="btn btn-xs btn-danger" onclick="deleteAttachment('${m.machine_code}', '${a.id}')">Xóa</button>
    </div>
  `
    )
    .join("");
}

async function saveMachineModal() {
  const code = STATE.editingMachineCode;
  if (!code) return;

  const editingMachine = STATE.machines.find((x) => x.machine_code === code);
  const isHBS = editingMachine ? (editingMachine.system_type === "HBS") : false;

  const stepsPayload = {};
  STATE.stepsDef.forEach((s) => {
    const st = document.querySelector(`.mdl-step-status[data-step="${s.code}"]`)?.value || "PENDING";
    const dt = document.querySelector(`.mdl-step-date[data-step="${s.code}"]`)?.value || "";
    const nt = document.querySelector(`.mdl-step-note[data-step="${s.code}"]`)?.value || "";
    stepsPayload[s.code] = { status: st, completed_date: dt, note: nt };
  });

  const payload = {
    machine_code: code,
    power_ready: document.getElementById("mdlPowerReady").checked ? 1 : 0,
    network_ready: document.getElementById("mdlNetworkReady").checked ? 1 : 0,
    civil_ready: document.getElementById("mdlCivilReady").checked ? 1 : 0,
    bhs_ready: (isHBS && document.getElementById("mdlBhsReady").checked) ? 1 : 0,
    serial_number: document.getElementById("mdlSerialNumber").value.trim(),
    shipment_no: document.getElementById("mdlShipmentNo").value.trim(),
    container_no: document.getElementById("mdlContainerNo").value.trim(),
    crate_no: document.getElementById("mdlCrateNo").value.trim(),
    floor: document.getElementById("mdlFloor").value,
    zone: document.getElementById("mdlZone").value.trim(),
    area_name: document.getElementById("mdlAreaName").value.trim(),
    network_node: document.getElementById("mdlNetworkNode").value.trim(),
    power_socket: document.getElementById("mdlPowerSocket").value.trim(),
    assigned_engineer: document.getElementById("mdlAssignedEngineer").value,
    planned_finish: document.getElementById("mdlPlannedFinish").value,
    remark: document.getElementById("mdlRemark").value.trim(),
    steps: stepsPayload,
  };

  try {
    const res = await apiPost("/api/machines/update-info", payload);
    if (res.ok && res.machine) {
      const idx = STATE.machines.findIndex((x) => x.machine_code === code);
      if (idx >= 0) STATE.machines[idx] = res.machine;
      renderAllViews();
      closeMachineModal();
      showToast(`Đã lưu toàn bộ hồ sơ & tiến độ máy ${code}!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function uploadMachineAttachment(event) {
  const file = event.target.files?.[0];
  if (!file || !STATE.editingMachineCode) return;

  const docType = document.getElementById("mdlUploadDocType").value;
  const caption = document.getElementById("mdlUploadCaption").value.trim() || file.name;

  const reader = new FileReader();
  reader.onload = async () => {
    try {
      const res = await apiPost("/api/machines/upload", {
        machine_code: STATE.editingMachineCode,
        filename: file.name,
        data_base64: reader.result,
        doc_type: docType,
        caption: caption,
      });
      if (res.ok && res.machine) {
        const idx = STATE.machines.findIndex((x) => x.machine_code === STATE.editingMachineCode);
        if (idx >= 0) STATE.machines[idx] = res.machine;
        renderModalAttachments(res.machine);
        document.getElementById("mdlUploadCaption").value = "";
        event.target.value = "";
        showToast(`Đã tải lên file ${file.name} thành công!`);
      }
    } catch (err) {
      showToast("Lỗi tải file: " + err.message, true);
    }
  };
  reader.readAsDataURL(file);
}

async function deleteAttachment(machineCode, attId) {
  try {
    const res = await apiPost("/api/machines/delete-attachment", {
      machine_code: machineCode,
      att_id: attId,
    });
    if (res.ok && res.machine) {
      const idx = STATE.machines.findIndex((x) => x.machine_code === machineCode);
      if (idx >= 0) STATE.machines[idx] = res.machine;
      renderModalAttachments(res.machine);
      showToast("Đã xóa file đính kèm.");
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function deleteCurrentMachine() {
  const code = STATE.editingMachineCode;
  if (!code) return;
  if (!confirm(`Bạn có chắc chắn muốn xóa máy [${code}] khỏi danh sách?`)) return;
  try {
    await apiPost("/api/machines/delete", { machine_code: code });
    await refreshAllData();
    closeMachineModal();
    showToast(`Đã xóa máy ${code}.`);
  } catch (err) {
    showToast(err.message, true);
  }
}

function closeMachineModal() {
  document.getElementById("machineDetailModal").classList.add("hidden");
  STATE.editingMachineCode = null;
}

// ==========================================================================
// CREATE NEW MACHINE MODAL
// ==========================================================================
function openCreateMachineModal() {
  document.getElementById("createMachineModal").classList.remove("hidden");
}

async function submitCreateMachine() {
  const code = document.getElementById("newMcCode").value.trim();
  if (!code) {
    showToast("Vui lòng nhập Mã Máy (Tag ID)", true);
    return;
  }
  try {
    const res = await apiPost("/api/machines/create", {
      machine_code: code,
      system_type: document.getElementById("newMcSys").value,
      model_key: document.getElementById("newMcModelKey").value.trim() || "CUSTOM",
      model_name: document.getElementById("newMcModelName").value.trim() || "Thiết bị bổ sung",
      floor: document.getElementById("newMcFloor").value,
      zone: document.getElementById("newMcZone").value.trim(),
      area_name: document.getElementById("newMcAreaName").value.trim(),
      serial_number: document.getElementById("newMcSn").value.trim(),
      shipment_no: document.getElementById("newMcShipment").value.trim(),
    });
    if (res.ok) {
      closeModal("createMachineModal");
      await refreshAllData();
      showToast(`Đã thêm máy ${code} thành công!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// TAB 4: AUXILIARY BATCHES TABLE
// ==========================================================================
function renderAuxTable() {
  const sysFilter = document.getElementById("auxSystemFilter")?.value || "ALL";
  const tbody = document.getElementById("auxBatchesTbody");

  const list = STATE.auxBatches.filter((b) => sysFilter === "ALL" || b.system_type === sysFilter);
  tbody.innerHTML = list
    .map((b) => {
      const target = b.qty_drawing || b.qty_boq || 1;
      const pct = Math.min(100, Math.round(((b.qty_installed * 0.5 + b.qty_tc_done * 0.5) / target) * 100));
      return `
      <tr>
        <td class="font-bold">${b.batch_code}</td>
        <td><span class="badge ${b.system_type === "HBS" ? "badge-hbs" : "badge-sse"}">${b.system_type}</span></td>
        <td>
          <div class="font-bold">${b.item_name}</div>
          <div class="text-xs text-muted">Mã: ${b.model_key} • BOQ: ${b.boq_item}</div>
        </td>
        <td>
          <span class="badge badge-info">${b.floor}</span>
          <div class="text-xs mt-4">${b.area_name}</div>
        </td>
        <td class="text-center font-bold">${b.unit}</td>
        <td class="text-center">${b.qty_boq}</td>
        <td class="text-center font-bold">${b.qty_drawing}</td>
        <td class="text-center">
          <input type="number" step="0.5" class="form-input form-input-sm text-center" id="aux_arr_${b.batch_code}" value="${b.qty_arrived}" />
        </td>
        <td class="text-center">
          <input type="number" step="0.5" class="form-input form-input-sm text-center" id="aux_inst_${b.batch_code}" value="${b.qty_installed}" />
        </td>
        <td class="text-center">
          <input type="number" step="0.5" class="form-input form-input-sm text-center" id="aux_tc_${b.batch_code}" value="${b.qty_tc_done}" />
        </td>
        <td>
          <div class="flex-between text-xs"><strong>${pct}%</strong></div>
          <div class="progress-track"><div class="progress-fill fill-blue" style="width:${pct}%"></div></div>
        </td>
        <td class="text-xs">
          <strong>${b.shipment_no}</strong>
          <div class="text-muted mt-4">${b.serial_range || ""}</div>
        </td>
        <td>
          <input type="text" class="form-input form-input-sm" id="aux_note_${b.batch_code}" value="${b.status_note || ""}" />
        </td>
        <td class="text-center">
          <button class="btn btn-xs btn-primary" onclick="saveAuxBatchRow('${b.batch_code}')">💾 Lưu</button>
        </td>
      </tr>
    `;
    })
    .join("");
}

async function saveAuxBatchRow(batchCode) {
  const arrVal = parseFloat(document.getElementById(`aux_arr_${batchCode}`).value || "0");
  const instVal = parseFloat(document.getElementById(`aux_inst_${batchCode}`).value || "0");
  const tcVal = parseFloat(document.getElementById(`aux_tc_${batchCode}`).value || "0");
  const noteVal = document.getElementById(`aux_note_${batchCode}`).value.trim();

  try {
    const res = await apiPost("/api/aux/update", {
      batch_code: batchCode,
      qty_arrived: arrVal,
      qty_installed: instVal,
      qty_tc_done: tcVal,
      status_note: noteVal,
    });
    if (res.ok && res.aux_batch) {
      const idx = STATE.auxBatches.findIndex((x) => x.batch_code === batchCode);
      if (idx >= 0) STATE.auxBatches[idx] = res.aux_batch;
      renderAuxTable();
      showToast(`Đã lưu tiến độ nhóm phụ trợ ${batchCode}!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// TAB 5: 14 SHIPMENTS TABLE
// ==========================================================================
function renderShipmentsTable() {
  const tbody = document.getElementById("shipmentsTbody");
  tbody.innerHTML = STATE.shipments
    .map((s) => {
      const linkedMachines = STATE.machines.filter((m) => m.shipment_no.includes(s.shipment_no)).length;
      return `
      <tr>
        <td class="font-bold" style="color:var(--primary);">${s.shipment_no}</td>
        <td><span class="badge ${s.category.includes("HBS") ? "badge-hbs" : "badge-sse"}">${s.category}</span></td>
        <td>${s.mode}</td>
        <td class="font-bold">${s.bl_no}</td>
        <td>${s.bl_date}</td>
        <td>${s.customs_decl_no}</td>
        <td class="font-bold text-success">${s.customs_date}</td>
        <td class="text-xs">${s.port_route}</td>
        <td class="text-center font-bold">${s.pkg_pl}</td>
        <td class="text-right">${Number(s.gw_pl || 0).toLocaleString("en-US")}</td>
        <td class="text-xs">${s.summary_note}</td>
        <td class="text-center">
          <button class="btn btn-xs btn-outline" onclick="jumpToShipmentMachines('${s.shipment_no}')">
            Xem ${linkedMachines} máy
          </button>
        </td>
      </tr>
    `;
    })
    .join("");
}

// ==========================================================================
// TAB 6: ISSUES, PUNCHLIST & RFI
// ==========================================================================
function renderIssuesList() {
  const stFilter = document.getElementById("issueStatusFilter")?.value || "ALL";
  const container = document.getElementById("issuesContainer");

  const list = STATE.issues.filter((i) => stFilter === "ALL" || i.status === stFilter);
  container.innerHTML = list
    .map(
      (iss) => `
    <div class="issue-card iss-${iss.status}">
      <div class="flex-between">
        <div class="flex-gap-8">
          <span class="badge ${iss.status === "OPEN" ? "badge-danger" : "badge-success"}">${iss.issue_code} • ${iss.status}</span>
          <span class="badge badge-info">${iss.category}</span>
          <span class="badge badge-warning">Mức độ: ${iss.severity}</span>
          ${iss.machine_code ? `<span class="badge badge-hbs">Máy: ${iss.machine_code}</span>` : ""}
          <strong>${iss.title}</strong>
        </div>
        <div class="flex-gap-4">
          <button class="btn btn-xs btn-outline" onclick="editIssue('${iss.issue_code}')">✏️ Sửa / Cập nhật</button>
          <button class="btn btn-xs ${iss.status === "OPEN" ? "btn-success" : "btn-secondary"}" onclick="toggleIssueStatus('${iss.issue_code}', '${iss.status === "OPEN" ? "RESOLVED" : "OPEN"}')">
            ${iss.status === "OPEN" ? "✅ Đánh dấu Đã xử lý" : "🔄 Mở lại"}
          </button>
        </div>
      </div>
      <p class="mt-8" style="font-size:13px;">${iss.description}</p>
      <div class="mt-8 text-xs text-muted">
        <div><strong>📄 Nguồn / Tham chiếu:</strong> ${iss.source_ref || "N/A"}</div>
        <div class="mt-4"><strong>👉 Hành động đề xuất:</strong> <span style="color:var(--text-main);font-weight:600;">${iss.action_required || "N/A"}</span></div>
        <div class="mt-4"><strong>👤 Phụ trách:</strong> ${iss.responsible_party || ""} • Cập nhật: ${iss.updated_at || ""}</div>
      </div>
    </div>
  `
    )
    .join("");
}

function openIssueModal(issueObj = null) {
  document.getElementById("issCode").value = issueObj ? issueObj.issue_code : "";
  document.getElementById("issMachineCode").value = issueObj ? issueObj.machine_code : "";
  document.getElementById("issSystem").value = issueObj ? issueObj.system_type : "ALL";
  document.getElementById("issFloor").value = issueObj ? issueObj.floor : "All";
  document.getElementById("issCategory").value = issueObj ? issueObj.category : "SITE_READINESS";
  document.getElementById("issSeverity").value = issueObj ? issueObj.severity : "HIGH";
  document.getElementById("issStatus").value = issueObj ? issueObj.status : "OPEN";
  document.getElementById("issTitle").value = issueObj ? issueObj.title : "";
  document.getElementById("issDesc").value = issueObj ? issueObj.description : "";
  document.getElementById("issSource").value = issueObj ? issueObj.source_ref : "";
  document.getElementById("issAction").value = issueObj ? issueObj.action_required : "";
  document.getElementById("issResponsible").value = issueObj
    ? issueObj.responsible_party
    : "Ban Kỹ thuật / Hàn Việt / PMU";

  document.getElementById("issueModal").classList.remove("hidden");
}

function editIssue(issueCode) {
  const iss = STATE.issues.find((x) => x.issue_code === issueCode);
  if (iss) openIssueModal(iss);
}

async function saveIssueModal() {
  const payload = {
    issue_code: document.getElementById("issCode").value.trim(),
    machine_code: document.getElementById("issMachineCode").value.trim(),
    system_type: document.getElementById("issSystem").value,
    floor: document.getElementById("issFloor").value.trim(),
    category: document.getElementById("issCategory").value,
    severity: document.getElementById("issSeverity").value,
    status: document.getElementById("issStatus").value,
    title: document.getElementById("issTitle").value.trim(),
    description: document.getElementById("issDesc").value.trim(),
    source_ref: document.getElementById("issSource").value.trim(),
    action_required: document.getElementById("issAction").value.trim(),
    responsible_party: document.getElementById("issResponsible").value.trim(),
  };

  try {
    const res = await apiPost("/api/issues/save", payload);
    if (res.ok) {
      closeModal("issueModal");
      await refreshAllData();
      showToast(`Đã lưu vướng mắc ${res.issue.issue_code}!`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

async function toggleIssueStatus(issueCode, newStatus) {
  try {
    await apiPost("/api/issues/save", { issue_code: issueCode, status: newStatus });
    await refreshAllData();
    showToast(`Đã chuyển trạng thái ${issueCode} -> ${newStatus}`);
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// TAB 7: ADMIN, USERS & AUDIT LOG
// ==========================================================================
function renderAdminTab() {
  const usersTbody = document.getElementById("usersTbody");
  if (usersTbody) {
    usersTbody.innerHTML = STATE.users
      .map(
        (u) => `
      <tr>
        <td class="font-bold">@${u.username}</td>
        <td>${u.full_name}</td>
        <td><span class="badge badge-info">${u.role}</span></td>
        <td>${u.scope}</td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="quickSwitchUser('${u.username}')">Sử dụng</button>
        </td>
      </tr>
    `
      )
      .join("");
  }

  const auditTbody = document.getElementById("auditLogTbody");
  if (auditTbody) {
    auditTbody.innerHTML = STATE.auditLogs
      .map(
        (a) => `
      <tr>
        <td class="text-xs text-muted" style="white-space:nowrap;">${a.timestamp}</td>
        <td>
          <strong>${a.username}</strong>
          <div class="text-xs text-muted">${a.user_role}</div>
        </td>
        <td><span class="badge badge-info">${a.target_id}</span></td>
        <td class="text-xs">${a.summary}</td>
      </tr>
    `
      )
      .join("");
  }
}

function openUserModal() {
  document.getElementById("userModal").classList.remove("hidden");
}

async function saveUserAccount() {
  const username = document.getElementById("usrUsername").value.trim();
  const fullName = document.getElementById("usrFullName").value.trim();
  const password = document.getElementById("usrPassword").value.trim();
  const role = document.getElementById("usrRole").value;
  const scope = document.getElementById("usrScope").value.trim();

  try {
    const res = await apiPost("/api/users/save", {
      username,
      full_name: fullName,
      password,
      role,
      scope,
    });
    if (res.ok) {
      STATE.users = res.users;
      renderAdminTab();
      closeModal("userModal");
      showToast(`Đã lưu tài khoản @${username}`);
    }
  } catch (err) {
    showToast(err.message, true);
  }
}

// ==========================================================================
// EXCEL EXPORT & IMPORT
// ==========================================================================
function downloadExcelReport() {
  showToast("Đang tạo file Báo cáo Excel (.xlsx)...");
  window.location.href = "/api/export/excel";
}

function triggerExcelImport() {
  if (STATE.isReadOnly) {
    showToast("Chế độ Chỉ xem không thể Import Excel.", true);
    return;
  }
  document.getElementById("excelFileInput").click();
}

function handleExcelImportFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = async () => {
    try {
      showToast("Đang xử lý cập nhật từ file Excel...");
      const res = await apiPost("/api/import/excel", {
        data_base64: reader.result,
      });
      event.target.value = "";
      await refreshAllData();
      showToast(res.message || `Đã cập nhật ${res.updated_count} máy!`);
    } catch (err) {
      showToast("Lỗi Import Excel: " + err.message, true);
    }
  };
  reader.readAsDataURL(file);
}

// ==========================================================================
// MOBILE QR & PUBLIC 4G TUNNEL
// ==========================================================================
async function openMobileTunnelModal() {
  const isCloud = !["localhost", "127.0.0.1"].includes(window.location.hostname) && !window.location.hostname.startsWith("192.168.");
  const curOrigin = window.location.origin;

  if (isCloud) {
    document.getElementById("txtLanUrl").value = curOrigin;
    document.getElementById("txtReadonlyUrl").value = `${curOrigin}/?view=readonly`;
    
    const sec1Title = document.querySelector(".tunnel-section h4");
    if (sec1Title) sec1Title.textContent = "1. Link truy cập trực tiếp 24/7 (Mọi mạng 4G/5G & WiFi)";

    const sec2 = document.querySelector(".tunnel-section.mt-16");
    if (sec2) {
      sec2.innerHTML = `
        <div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;padding:12px;border-radius:6px;">
          <h4 style="margin:0 0 6px 0;color:#065f46;font-size:13px;">🌐 Hệ thống đang chạy Trực tuyến 24/7 trên Cloud</h4>
          <p class="text-xs" style="margin:0;line-height:1.5;">Web App đã được đưa lên máy chủ Internet toàn cầu. Mọi thiết bị điện thoại ở hiện trường (dùng 4G/5G hoặc bất kỳ mạng Wi-Fi nào) đều truy cập trực tiếp bằng các link ở trên, <strong>hoàn toàn KHÔNG CẦN bật Tunnel trung gian nữa!</strong></p>
        </div>
      `;
    }
    document.getElementById("mobileTunnelModal").classList.remove("hidden");
    return;
  }

  const net = STATE.networkInfo || {};
  document.getElementById("txtLanUrl").value = net.lan_url || `${window.location.protocol}//${window.location.hostname}:8050`;
  document.getElementById("txtReadonlyUrl").value =
    net.readonly_url || `${window.location.protocol}//${window.location.hostname}:8050/?view=readonly`;

  updateTunnelModalUI(net.tunnel || {});
  document.getElementById("mobileTunnelModal").classList.remove("hidden");

  // Tự động kiểm tra trạng thái tunnel mới nhất từ server
  try {
    const res = await fetch("/api/tunnel/status");
    if (res.ok) {
      const tData = await res.json();
      if (!STATE.networkInfo) STATE.networkInfo = {};
      STATE.networkInfo.tunnel = tData;
      updateTunnelModalUI(tData);
    }
  } catch (err) {
    console.error("Không thể lấy trạng thái tunnel:", err);
  }
}

function updateTunnelModalUI(tunnel) {
  const badge = document.getElementById("tunnelStateBadge");
  const activeBox = document.getElementById("tunnelActiveBox");
  const errBox = document.getElementById("tunnelErrorBox");
  const btnStart = document.getElementById("btnStartTunnel");
  const btnStop = document.getElementById("btnStopTunnel");

  if (tunnel && tunnel.public_url) {
    badge.textContent = "Đang hoạt động (Online)";
    badge.className = "badge badge-success";
    activeBox.classList.remove("hidden");
    btnStop.classList.remove("hidden");
    btnStart.textContent = "🔄 Làm mới Link 4G";
    document.getElementById("txtPublicTunnelUrl").value = tunnel.public_url;
    document.getElementById("txtPublicReadonlyUrl").value = `${tunnel.public_url}/?view=readonly`;
  } else {
    badge.textContent = "Chưa bật";
    badge.className = "badge badge-warning";
    activeBox.classList.add("hidden");
    btnStop.classList.add("hidden");
    btnStart.textContent = "🚀 Bật Đường truyền 4G (Public Tunnel)";
  }

  if (tunnel && tunnel.error) {
    errBox.textContent = tunnel.error;
    errBox.classList.remove("hidden");
  } else {
    errBox.classList.add("hidden");
  }
}

async function startPublicTunnel() {
  const btn = document.getElementById("btnStartTunnel");
  btn.disabled = true;
  btn.textContent = "⏳ Đang khởi tạo đường truyền HTTPS (khoảng 5 giây)...";
  try {
    const res = await apiPost("/api/tunnel/start", {});
    STATE.networkInfo.tunnel = res;
    updateTunnelModalUI(res);
    if (res.public_url) {
      showToast("Đã bật kết nối 4G thành công: " + res.public_url);
    }
  } catch (err) {
    showToast("Lỗi bật Tunnel: " + err.message, true);
  } finally {
    btn.disabled = false;
  }
}

async function stopPublicTunnel() {
  try {
    const res = await apiPost("/api/tunnel/stop", {});
    STATE.networkInfo.tunnel = res;
    updateTunnelModalUI(res);
    showToast("Đã tắt đường truyền 4G công khai.");
  } catch (err) {
    showToast(err.message, true);
  }
}

function copyInputValue(inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.select();
  navigator.clipboard.writeText(el.value);
  showToast("Đã sao chép đường dẫn: " + el.value);
}

// ==========================================================================
// MODAL HELPERS
// ==========================================================================
function closeModal(modalId) {
  document.getElementById(modalId)?.classList.add("hidden");
}

function closeModalOnBackdrop(event, modalId) {
  if (event.target.id === modalId) {
    closeModal(modalId);
  }
}
