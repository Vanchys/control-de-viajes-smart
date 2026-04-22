/* Smart Dashboard - App Principal (Mobile First) */
/* global loadAllData, formatMoney, formatDateStr, ROUTE_LABELS */

const APP = {
  allData: [],
  filteredData: [],
  currentPage: 1,
  pageSize: 50,
  sortCol: "fecha",
  sortAsc: false,
  searchTerm: "",
  auditCtx: {
    routeAction: "custom",   // custom | all | none
    unitAction: "custom",    // custom | all | none
    driverAction: "custom",  // custom | all | none
    lastMonthPick: null      // { year, monthIndex, monthName }
  }
};

const SPLASH_MS = 1500;

function buildAuditFiltersDetails() {
  const df = document.getElementById("filter-date-from")?.value || "";
  const dt = document.getElementById("filter-date-to")?.value || "";
  const dateInfo = (df && dt) ? `Fechas: ${df} → ${dt}` : "Fechas: (vacías)";

  const checkedRoutes = [...document.querySelectorAll("#filter-route-container input:checked")].map(cb => cb.value);
  const checkedUnits = [...document.querySelectorAll(".unit-cb:checked")].map(cb => cb.value);

  const driverAllChecked = document.getElementById("driver-all")?.checked;
  const checkedDrivers = [...document.querySelectorAll(".driver-cb:checked")].map(cb => cb.value);

  const monthInfo = APP.auditCtx.lastMonthPick
    ? `Mes: ${APP.auditCtx.lastMonthPick.monthName} ${APP.auditCtx.lastMonthPick.year}`
    : "Mes: (no seleccionado)";

  const routesInfo = `Rutas (${APP.auditCtx.routeAction}): [${checkedRoutes.join(", ") || "—"}]`;
  const unitsInfo = `Unidades (${APP.auditCtx.unitAction}): [${checkedUnits.join(", ") || "—"}]`;

  let driversList = "—";
  if (driverAllChecked) driversList = "Todos";
  else if (checkedDrivers.length) driversList = checkedDrivers.join(", ");
  const driversInfo = `Conductores (${APP.auditCtx.driverAction}): [${driversList}]`;

  return `${dateInfo} | ${monthInfo} | ${routesInfo} | ${unitsInfo} | ${driversInfo}`;
}

// Función de Alerta Personalizada
let alertTimeout;
window.showAlert = function(message) {
  const modal = document.getElementById("custom-alert-modal");
  const msgEl = document.getElementById("alert-message");
  if (modal && msgEl) {
    msgEl.innerHTML = message.replace(/\n/g, "<br>");
    modal.classList.remove("hidden");
    
    // Auto-ocultar a los 3/4 de segundo
    if (alertTimeout) clearTimeout(alertTimeout);
    alertTimeout = setTimeout(() => {
      modal.classList.add("hidden");
    }, 750);
  }
};

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const loadingScreen = document.getElementById("loading-screen");
  const versionEl = document.getElementById("app-version");
  const loginVersionEl = document.getElementById("login-version");
  if (versionEl && window.SMART_DASHBOARD_RELEASE) {
    versionEl.textContent = `v${window.SMART_DASHBOARD_RELEASE.version} · ${window.SMART_DASHBOARD_RELEASE.type}`;
  }
  if (loginVersionEl && window.SMART_DASHBOARD_RELEASE) {
    loginVersionEl.textContent = `v${window.SMART_DASHBOARD_RELEASE.version} · ${window.SMART_DASHBOARD_RELEASE.type}`;
  }

  // Sistema de Login con Autenticación (auth.js)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const userSel = document.getElementById("username").value;
    const passVal = document.getElementById("password").value;
    
    if (!userSel) { showAlert("Selecciona un usuario"); return; }
    
    const user = users.find(u => u.username === userSel);
    
    // --- LÓGICA DE DESBLOQUEO OCULTO (Easter Egg) ---
    // Si elige a Iván e introduce la contraseña de desbloqueo (Ivan1.1), se desbloquea el usuario admin
    const superadmin = users.find(u => u.role === "superadmin");
    const UNLOCK_ADMIN_PASSWORD = "Ivan1.1";
    if (userSel === "Ivan" && passVal === UNLOCK_ADMIN_PASSWORD && superadmin) {
      const select = document.getElementById("username");
      if (![...select.options].some(o => o.value === superadmin.username)) {
        const opt = document.createElement("option");
        opt.value = superadmin.username;
        opt.textContent = superadmin.username;
        select.appendChild(opt);
      }
      select.value = superadmin.username;
      document.getElementById("password").value = "";
      showAlert("🚀 Modo Administrador Desbloqueado.\nSelecciona 'admin' e ingresa su contraseña (Ivan1.1).");
      return;
    }

    if (!user || user.password !== passVal) {
      showAlert("Contraseña incorrecta");
      return;
    }
    
    // Guardar sesión globalmente
    currentUser = { ...user, passwordUsed: passVal };
    logAction("Inicio de Sesión", "Ingreso exitoso.");
    resetSessionTimer();

    loginScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden"); // Muestra splash animation

    // Reiniciar y sincronizar animaciones visuales exactamente al dar click
    const van = document.querySelector(".van-animation");
    const bar = document.querySelector(".progress-bar-fill");
    if (van && bar) {
      van.style.animation = 'none';
      bar.style.animation = 'none';
      void van.offsetWidth; // Forzar reinicio del navegador
      van.style.animation = `drive ${SPLASH_MS}ms linear forwards`;
      bar.style.animation = `progress ${SPLASH_MS}ms ease-in-out forwards`;
    }

    // Animación de 1.5 segundos
    setTimeout(async () => {
      loadingScreen.classList.add("hidden");
      document.getElementById("main-header").style.display = "flex";
      document.getElementById("app-container").style.display = "flex";
      
      // Sincronización silenciosa
      const syncStatus = document.getElementById("header-sync-status");
      const syncText = document.getElementById("sync-text");
      syncStatus.classList.remove("hidden");
      
      try {
        APP.allData = await loadAllData((msg) => {
          syncText.textContent = "Sincronizando...";
        });
        syncText.textContent = "¡Listo!";
        setTimeout(() => syncStatus.classList.add("hidden"), 3000);
        
        initFilters();
        APP.filteredData = []; // Vacio por default
        renderAll();
        document.getElementById("last-update").textContent =
          `Act: ${new Date().toLocaleTimeString("es-MX", {hour: '2-digit', minute:'2-digit'})}`;
      } catch (err) {
        syncText.textContent = "Error de conexión";
      }
      setupEvents();
      setupMonthPicker();
    }, SPLASH_MS);
  });
});

// --- FILTROS Y EVENTOS ---
function initFilters() {
  const units = [...new Set(APP.allData.map((r) => r.unidad))]
    .sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });
  const drivers = [...new Set(APP.allData.map((r) => r.conductor))].sort();

  // Fechas vacías
  document.getElementById("filter-date-from").value = "";
  document.getElementById("filter-date-to").value = "";

  // Desmarcar rutas por defecto
  document.querySelectorAll("#filter-route-container input").forEach(cb => cb.checked = false);
  APP.auditCtx.routeAction = "none";

  const container = document.getElementById("filter-units-container");
  container.innerHTML = units.map((u) => `<label class="checkbox-item"><input type="checkbox" class="unit-cb" value="${u}"> ${u}</label>`).join("");
  APP.auditCtx.unitAction = "none";

  const driverContainer = document.getElementById("filter-driver-container");
  if(driverContainer) {
    let drvHtml = `<label class="checkbox-item"><input type="checkbox" id="driver-all" value="all" checked> Todos</label>`;
    drvHtml += drivers.map((d) => `<label class="checkbox-item"><input type="checkbox" class="driver-cb" value="${d}"> ${d}</label>`).join("");
    driverContainer.innerHTML = drvHtml;
    APP.auditCtx.driverAction = "all";

    const driverAll = document.getElementById("driver-all");
    const driverCbs = document.querySelectorAll(".driver-cb");
    driverAll.addEventListener("change", (e) => { if(e.target.checked) driverCbs.forEach(cb => cb.checked = false); });
    driverCbs.forEach(cb => { cb.addEventListener("change", () => { if(cb.checked) driverAll.checked = false; }); });
  }
}

function getFilteredData() {
  const df = document.getElementById("filter-date-from").value;
  const dt = document.getElementById("filter-date-to").value;
  
  const checkedRoutes = [...document.querySelectorAll("#filter-route-container input:checked")].map((cb) => cb.value);
  const checkedUnits = [...document.querySelectorAll(".unit-cb:checked")].map((cb) => cb.value);
  
  const driverAllChecked = document.getElementById("driver-all")?.checked;
  const checkedDrivers = [...document.querySelectorAll(".driver-cb:checked")].map((cb) => cb.value);

  // Todo vacío = nada (excepto si están en "Todos" los conductores)
  if (!df || !dt || checkedRoutes.length === 0 || checkedUnits.length === 0) return [];
  if (!driverAllChecked && checkedDrivers.length === 0) return [];

  const dateFrom = new Date(df + "T00:00:00");
  const dateTo = new Date(dt + "T23:59:59");

  return APP.allData.filter((r) => {
    if (r.fecha < dateFrom || r.fecha > dateTo) return false;
    if (!checkedRoutes.includes(r.ruta)) return false;
    if (!checkedUnits.includes(r.unidad)) return false;
    if (!driverAllChecked && !checkedDrivers.includes(r.conductor)) return false;
    return true;
  });
}

function setupEvents() {
  // Mobile Sidebar Toggle
  const filtersPanel = document.getElementById("filters-panel");
  const filtersOverlay = document.getElementById("filters-overlay");
  
  function toggleSidebar() {
    filtersPanel.classList.toggle("open");
    filtersOverlay.classList.toggle("hidden");
  }

  document.getElementById("btn-toggle-filters").addEventListener("click", toggleSidebar);
  filtersOverlay.addEventListener("click", toggleSidebar);
  const btnCloseFilters = document.getElementById("btn-close-filters");
  if (btnCloseFilters) btnCloseFilters.addEventListener("click", toggleSidebar);

  // Swipe down to close (bottom sheet)
  let touchStartY = null;
  let touchStartX = null;
  filtersPanel.addEventListener("touchstart", (e) => {
    const t = e.touches && e.touches[0];
    if (!t) return;
    touchStartY = t.clientY;
    touchStartX = t.clientX;
  }, { passive: true });
  filtersPanel.addEventListener("touchend", (e) => {
    const t = e.changedTouches && e.changedTouches[0];
    if (!t || touchStartY == null || touchStartX == null) return;
    const dy = t.clientY - touchStartY;
    const dx = t.clientX - touchStartX;
    touchStartY = null;
    touchStartX = null;

    // solo si es un swipe hacia abajo claro
    if (Math.abs(dx) < 60 && dy > 80 && filtersPanel.classList.contains("open")) {
      toggleSidebar();
    }
  }, { passive: true });

  // Si el usuario marca/desmarca manualmente, lo consideramos "custom"
  document.querySelectorAll("#filter-route-container input").forEach((cb) => {
    cb.addEventListener("change", () => { APP.auditCtx.routeAction = "custom"; });
  });

  // Settings Modal (Engranaje)
  const settingsModal = document.getElementById("settings-modal");
  document.getElementById("btn-settings").addEventListener("click", () => {
    openSettingsModal(); // Lógica dinámica dependiendo del rol
  });
  document.getElementById("btn-close-settings").addEventListener("click", () => {
    settingsModal.classList.add("hidden");
  });

  // Filtros aplicados
  document.getElementById("btn-apply-filters").addEventListener("click", () => {
    APP.filteredData = getFilteredData();
    APP.currentPage = 1;
    renderAll();
    
    // Registro de auditoría
    logAction("Filtros Aplicados", buildAuditFiltersDetails());

    if (window.innerWidth < 768) toggleSidebar(); // Cerrar sidebar en móvil al aplicar
  });

  document.getElementById("btn-clear-filters").addEventListener("click", () => {
    document.getElementById("filter-date-from").value = "";
    document.getElementById("filter-date-to").value = "";
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = false; });
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = false; });
    document.querySelectorAll("#filter-driver-container input").forEach((cb) => { cb.checked = false; });
    const driverAll = document.getElementById("driver-all");
    if(driverAll) driverAll.checked = true;
    
    // Limpiar seleccion de meses
    document.querySelectorAll('.month-btn').forEach(b => b.classList.remove("active-month"));
    
    APP.filteredData = [];
    APP.currentPage = 1;
    renderAll();
    logAction("Filtros Limpiados", buildAuditFiltersDetails());
  });

  // Unidades manual = custom
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t && t.classList && t.classList.contains("unit-cb")) APP.auditCtx.unitAction = "custom";
    if (t && t.id === "driver-all") APP.auditCtx.driverAction = t.checked ? "all" : "custom";
    if (t && t.classList && t.classList.contains("driver-cb")) APP.auditCtx.driverAction = "custom";
  });

  document.getElementById("btn-select-all-routes").addEventListener("click", () => {
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = true; });
    APP.auditCtx.routeAction = "all";
    logAction("Rutas: Todas", buildAuditFiltersDetails());
  });
  document.getElementById("btn-deselect-all-routes").addEventListener("click", () => {
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = false; });
    APP.auditCtx.routeAction = "none";
    logAction("Rutas: Ninguna", buildAuditFiltersDetails());
  });
  
  document.getElementById("btn-select-all-units").addEventListener("click", () => {
    document.querySelectorAll(".unit-cb").forEach((cb) => { cb.checked = true; });
    APP.auditCtx.unitAction = "all";
    logAction("Unidades: Todas", buildAuditFiltersDetails());
  });
  document.getElementById("btn-deselect-all-units").addEventListener("click", () => {
    document.querySelectorAll(".unit-cb").forEach((cb) => { cb.checked = false; });
    APP.auditCtx.unitAction = "none";
    logAction("Unidades: Ninguna", buildAuditFiltersDetails());
  });
  
  document.getElementById("btn-select-all-drivers").addEventListener("click", () => { 
    document.querySelectorAll(".driver-cb").forEach((cb) => { cb.checked = true; }); 
    const driverAll = document.getElementById("driver-all");
    if(driverAll) driverAll.checked = false;
    APP.auditCtx.driverAction = "custom";
    logAction("Conductores: Selección", buildAuditFiltersDetails());
  });
  document.getElementById("btn-deselect-all-drivers").addEventListener("click", () => { 
    document.querySelectorAll(".driver-cb").forEach((cb) => { cb.checked = false; }); 
    const driverAll = document.getElementById("driver-all");
    if(driverAll) driverAll.checked = true; // Si no hay nada, asumo que prefiere "Todos"
    APP.auditCtx.driverAction = "all";
    logAction("Conductores: Todos", buildAuditFiltersDetails());
  });

  const btnExport = document.getElementById("btn-export-pdf");
  if (btnExport) {
    btnExport.addEventListener("click", () => {
      if (APP.filteredData.length === 0) {
        showAlert("⚠️ Aplica filtros para descargar datos.");
        logAction("PDF: Intento sin filtros", buildAuditFiltersDetails());
        return;
      }
      document.getElementById("pdf-confirm-modal").classList.remove("hidden");
      logAction("PDF: Modal abierto", `Registros: ${APP.filteredData.length} | ${buildAuditFiltersDetails()}`);
    });
  }


  document.getElementById("btn-refresh").addEventListener("click", async () => {
    const syncStatus = document.getElementById("header-sync-status");
    const syncText = document.getElementById("sync-text");
    syncStatus.classList.remove("hidden");
    
    try {
      APP.allData = await loadAllData((msg) => { syncText.textContent = "Sincronizando..."; });
      syncText.textContent = "¡Listo!";
      setTimeout(() => syncStatus.classList.add("hidden"), 3000);
      
      APP.filteredData = getFilteredData();
      renderAll();
      document.getElementById("last-update").textContent = `Act: ${new Date().toLocaleTimeString("es-MX", {hour: '2-digit', minute:'2-digit'})}`;
      
      // Reinicializar el month picker para activar/desactivar meses
      setupMonthPicker();
    } catch(e) {
      syncText.textContent = "Error";
    }
  });

  // Tabla ordenamiento y búsqueda
  document.querySelectorAll("#data-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (APP.sortCol === col) { APP.sortAsc = !APP.sortAsc; }
      else { APP.sortCol = col; APP.sortAsc = true; }
      APP.currentPage = 1;
      renderTable();
    });
  });

  document.getElementById("table-search").addEventListener("input", (e) => {
    APP.searchTerm = e.target.value.toLowerCase();
    APP.currentPage = 1;
    renderTable();
  });

  document.getElementById("btn-prev-page").addEventListener("click", () => {
    if (APP.currentPage > 1) { APP.currentPage--; renderTable(); }
  });
  document.getElementById("btn-next-page").addEventListener("click", () => {
    const total = Math.ceil(getTableData().length / APP.pageSize);
    if (APP.currentPage < total) { APP.currentPage++; renderTable(); }
  });
}

// --- RENDERIZADO VISUAL ---
function renderAll() {
  renderKPIs();
  renderUnitAnalysis();
  renderTable();
}

function renderKPIs() {
  const d = APP.filteredData;
  const bruto = d.reduce((s, r) => s + r.totalBruto, 0);
  const neto = d.reduce((s, r) => s + r.totalNeto, 0);
  const voucher = d.reduce((s, r) => s + r.voucher, 0);

  document.getElementById("kpi-bruto-value").textContent = formatMoney(bruto);
  document.getElementById("kpi-neto-value").textContent = formatMoney(neto);
  document.getElementById("kpi-voucher-value").textContent = formatMoney(voucher);
}

function renderUnitAnalysis() {
  const units = {};
  APP.filteredData.forEach((r) => {
    if (!units[r.unidad]) { units[r.unidad] = { neto: 0, bruto: 0, trips: 0, pax: 0, voucher: 0 }; }
    const u = units[r.unidad];
    u.neto += r.totalNeto; u.bruto += r.totalBruto; u.trips++; u.pax += r.totalPasajeros; u.voucher += r.voucher;
  });

  const container = document.getElementById("unit-summary-cards");
  const sorted = Object.entries(units).sort((a, b) => b[1].neto - a[1].neto);
  
  const totals = sorted.reduce((acc, [, v]) => {
    acc.neto += v.neto; acc.bruto += v.bruto; acc.trips += v.trips; acc.pax += v.pax; acc.voucher += v.voucher;
    return acc;
  }, { neto: 0, bruto: 0, trips: 0, pax: 0, voucher: 0 });

  // Tarjeta COMBINADA (muy importante)
  let desc = `Suma total basada en tus filtros actuales de ${totals.trips} viajes en ${sorted.length} unidades.`;
  let html = `<div class="unit-summary-card" style="border-color: var(--accent-blue); background: rgba(45, 116, 180, 0.03);">
    <div class="unit-card-header" style="flex-direction:column; align-items:flex-start; gap:4px;">
      <div style="display:flex; justify-content:space-between; width:100%;"><h4>📊 TOTAL COMBINADO</h4><span>${totals.trips} viajes</span></div>
      <span style="font-size:0.7rem; color:var(--text-muted);">${desc}</span>
    </div>
    <div class="unit-card-stats">
      <div class="unit-stat"><span class="unit-stat-value">${formatMoney(totals.bruto)}</span><span class="unit-stat-label">BRUTO</span></div>
      <div class="unit-stat"><span class="unit-stat-value ${totals.neto >= 0 ? "positive" : "negative"}">${formatMoney(totals.neto)}</span><span class="unit-stat-label">NETO</span></div>
      <div class="unit-stat"><span class="unit-stat-value">${totals.pax.toLocaleString()}</span><span class="unit-stat-label">Pasajeros</span></div>
      <div class="unit-stat"><span class="unit-stat-value" style="color:var(--accent-orange)">${formatMoney(totals.voucher)}</span><span class="unit-stat-label">Voucher</span></div>
    </div>
  </div>`;

  // Tarjetas individuales
  sorted.forEach(([name, v]) => {
    html += `<div class="unit-summary-card">
      <div class="unit-card-header"><h4>🚌 Unidad ${name}</h4><span>${v.trips} viajes</span></div>
      <div class="unit-card-stats">
        <div class="unit-stat"><span class="unit-stat-value">${formatMoney(v.bruto)}</span><span class="unit-stat-label">BRUTO</span></div>
        <div class="unit-stat"><span class="unit-stat-value ${v.neto >= 0 ? "positive" : "negative"}">${formatMoney(v.neto)}</span><span class="unit-stat-label">NETO</span></div>
      </div>
    </div>`;
  });
  container.innerHTML = html;
}

function getTableData() {
  let data = [...APP.filteredData];
  if (APP.searchTerm) {
    const t = APP.searchTerm.trim().toLowerCase();
    data = data.filter((r) => {
      if (/^\d+$/.test(t)) {
        return (parseInt(r.unidad) === parseInt(t)) || r.conductor.toLowerCase().includes(t);
      }
      return r.conductor.toLowerCase().includes(t) || r.unidad.toLowerCase().includes(t) || r.ruta.toLowerCase().includes(t);
    });
  }
  data.sort((a, b) => {
    let va = a[APP.sortCol], vb = b[APP.sortCol];
    if (va instanceof Date) { va = va.getTime(); vb = vb.getTime(); }
    if (typeof va === "string") { va = va.toLowerCase(); vb = vb.toLowerCase(); }
    return APP.sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
  });
  return data;
}

function renderTable() {
  const data = getTableData();
  const totalPages = Math.max(1, Math.ceil(data.length / APP.pageSize));
  if (APP.currentPage > totalPages) APP.currentPage = totalPages;
  const start = (APP.currentPage - 1) * APP.pageSize;
  const pageData = data.slice(start, start + APP.pageSize);

  const tbody = document.getElementById("data-table-body");
  tbody.innerHTML = pageData.map((r) => {
    const netoClass = r.totalNeto >= 0 ? "cell-positive" : "cell-negative";
    return `<tr>
      <td>${ROUTE_LABELS[r.ruta] || r.ruta}</td>
      <td>${formatDateStr(r.fecha)}</td>
      <td>${r.conductor}</td>
      <td><strong>${r.unidad}</strong></td>
      <td>${r.hora}</td>
      <td>${r.adultos}</td>
      <td>${r.menores}</td>
      <td>${r.cuacnopalan}</td>
      <td>${r.ventaEnLinea || "-"}</td>
      <td>${r.paquetes}</td>
      <td>${formatMoney(r.totalBruto)}</td>
      <td class="${netoClass}">${formatMoney(r.totalNeto)}</td>
      <td style="color:var(--accent-orange)">${r.voucher > 0 ? formatMoney(r.voucher) : "-"}</td>
    </tr>`;
  }).join("");

  document.getElementById("table-info").textContent = `${data.length} viajes`;
  document.getElementById("page-indicator").textContent = `${APP.currentPage}/${totalPages}`;
}

// --- CONFIGURADOR MESES ---
function setupMonthPicker() {
  const modal = document.getElementById("month-picker-modal");
  const grid = document.getElementById("months-grid");
  if(!modal || !grid) return;
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  
  const availableMonths = new Set();
  let latestYear = new Date().getFullYear();
  
  APP.allData.forEach(r => {
    if (r.fecha) {
      availableMonths.add(r.fecha.getMonth());
      latestYear = r.fecha.getFullYear();
    }
  });
  
  const yearText = document.getElementById("month-picker-year");
  if(yearText) yearText.textContent = `Año: ${latestYear}`;
  
  document.getElementById("btn-open-months").addEventListener("click", () => modal.classList.remove("hidden"));
  document.getElementById("btn-close-months").addEventListener("click", () => modal.classList.add("hidden"));
  
  const currentMonth = new Date().getMonth(); 
  
  grid.innerHTML = monthNames.map((m, i) => {
    const isAvail = availableMonths.has(i);
    const disabledClass = isAvail ? "" : "disabled-month";
    const isCurrent = (i === currentMonth && isAvail) ? "active-month" : "";
    return `<button class="month-btn ${disabledClass} ${isCurrent}" data-month="${i}" ${isAvail ? '' : 'title="No hay datos"'}>${m}</button>`;
  }).join("");
  
  if(!grid.dataset.listener) {
    grid.dataset.listener = "true";
    
    grid.addEventListener("click", (e) => {
      if (e.target.classList.contains("month-btn")) {
        const btn = e.target;
        if (btn.classList.contains("disabled-month")) {
          showAlert("❌ No hay información cargada para este mes.");
          const old = btn.innerHTML;
          btn.innerHTML = "❌";
          setTimeout(() => btn.innerHTML = old, 1500);
          return;
        }
        
        if (btn.classList.contains("active-month")) {
          // Segundo toque: Confirmar y cargar
          const m = parseInt(btn.dataset.month);
          const firstDay = new Date(latestYear, m, 1);
          const lastDay = new Date(latestYear, m + 1, 0);
          
          const fmt = (d) => {
            const mm = String(d.getMonth()+1).padStart(2,'0');
            const dd = String(d.getDate()).padStart(2,'0');
            return `${d.getFullYear()}-${mm}-${dd}`;
          };
          
          document.getElementById("filter-date-from").value = fmt(firstDay);
          document.getElementById("filter-date-to").value = fmt(lastDay);

          APP.auditCtx.lastMonthPick = { year: latestYear, monthIndex: m, monthName: monthNames[m] };
          logAction("Mes seleccionado", buildAuditFiltersDetails());
          
          modal.classList.add("hidden");
        } else {
          // Primer toque: Solo seleccionar
          document.querySelectorAll('.month-btn').forEach(b => b.classList.remove("active-month"));
          btn.classList.add("active-month");
        }
      }
    });
  }
}

function exportToPDF() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('l', 'pt');

  doc.setFontSize(18);
  doc.setTextColor(45, 116, 180);
  doc.text("SMART TRANSPORTS - REPORTE DE VIAJES", 40, 40);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generado por: ${currentUser.username} | Fecha: ${new Date().toLocaleString('es-MX')}`, 40, 60);

  const head = [["Fecha", "Unidad", "Ruta", "Conductor", "Bruto", "Gastos", "Neto", "Voucher"]];
  const body = APP.filteredData.map(r => ([
    (r.fecha ? formatDateStr(r.fecha) : "-"),
    r.unidad ?? "-",
    r.ruta ?? "-",
    r.conductor ?? "-",
    formatMoney(r.totalBruto || 0),
    formatMoney(r.totalGastos || 0),
    formatMoney(r.totalNeto || 0),
    (r.voucher && r.voucher > 0) ? formatMoney(r.voucher) : "-"
  ]));

  doc.autoTable({
    head: head,
    body: body,
    startY: 80,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [45, 116, 180], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

    doc.save(`Reporte_Viajes_${new Date().getTime()}.pdf`);
    logAction("PDF: Descargado", `Registros: ${APP.filteredData.length} | ${buildAuditFiltersDetails()}`);
    showAlert("✅ PDF descargado exitosamente.");
  } catch (e) {
    logAction("PDF: Error", `${String(e?.message || e)} | ${buildAuditFiltersDetails()}`);
    showAlert("❌ Error al generar el PDF. Revisa tu conexión o intenta de nuevo.");
  }
}

window.confirmedExportToPDF = function() {
  exportToPDF();
}
