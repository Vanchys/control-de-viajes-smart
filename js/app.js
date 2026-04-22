/* Smart Dashboard - App Principal (Mobile First) */
/* global loadAllData, formatMoney, formatDateStr, ROUTE_LABELS */

const APP = {
  allData: [],
  filteredData: [],
  currentPage: 1,
  pageSize: 50,
  sortCol: "fecha",
  sortAsc: false,
  searchTerm: ""
};

// Función de Alerta Personalizada
window.showAlert = function(message) {
  const modal = document.getElementById("custom-alert-modal");
  const msgEl = document.getElementById("alert-message");
  if (modal && msgEl) {
    msgEl.innerHTML = message.replace(/\n/g, "<br>");
    modal.classList.remove("hidden");
  }
};

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const loadingScreen = document.getElementById("loading-screen");

  // Botón OK de la alerta (Debe estar activo SIEMPRE desde el inicio)
  document.getElementById("btn-alert-ok").addEventListener("click", () => {
    document.getElementById("custom-alert-modal").classList.add("hidden");
  });

  // Sistema de Login con Autenticación (auth.js)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const userSel = document.getElementById("username").value;
    const passVal = document.getElementById("password").value;
    
    if (!userSel) { showAlert("Selecciona un usuario"); return; }
    
    const user = users.find(u => u.username === userSel);
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

    // Animación de 2 segundos
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
    }, 2000);
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

  const container = document.getElementById("filter-units-container");
  container.innerHTML = units.map((u) =>
    `<label class="checkbox-item"><input type="checkbox" value="${u}"> ${u}</label>`
  ).join("");

  const driverContainer = document.getElementById("filter-driver-container");
  if(driverContainer) {
    driverContainer.innerHTML = drivers.map((d) =>
      `<label class="checkbox-item"><input type="checkbox" value="${d}"> ${d}</label>`
    ).join("");
  }
}

function getFilteredData() {
  const df = document.getElementById("filter-date-from").value;
  const dt = document.getElementById("filter-date-to").value;
  
  const checkedRoutes = [...document.querySelectorAll("#filter-route-container input:checked")].map((cb) => cb.value);
  const checkedUnits = [...document.querySelectorAll("#filter-units-container input:checked")].map((cb) => cb.value);
  const checkedDrivers = [...document.querySelectorAll("#filter-driver-container input:checked")].map((cb) => cb.value);

  // Todo vacío = nada
  if (!df || !dt || checkedRoutes.length === 0 || checkedUnits.length === 0 || checkedDrivers.length === 0) return [];

  const dateFrom = new Date(df + "T00:00:00");
  const dateTo = new Date(dt + "T23:59:59");

  return APP.allData.filter((r) => {
    if (r.fecha < dateFrom || r.fecha > dateTo) return false;
    if (!checkedRoutes.includes(r.ruta)) return false;
    if (!checkedUnits.includes(r.unidad)) return false;
    if (!checkedDrivers.includes(r.conductor)) return false;
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
    const routes = [...document.querySelectorAll("#filter-route-container input:checked")].map(cb=>cb.value).join(", ");
    const driver = [...document.querySelectorAll("#filter-driver-container input:checked")].map(cb=>cb.value).join(", ");
    logAction("Filtros Aplicados", `Rutas: [${routes}] | Conductores: [${driver}]`);

    if (window.innerWidth < 768) toggleSidebar(); // Cerrar sidebar en móvil al aplicar
  });

  document.getElementById("btn-clear-filters").addEventListener("click", () => {
    document.getElementById("filter-date-from").value = "";
    document.getElementById("filter-date-to").value = "";
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = false; });
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = false; });
    document.querySelectorAll("#filter-driver-container input").forEach((cb) => { cb.checked = false; });
    APP.filteredData = [];
    APP.currentPage = 1;
    renderAll();
  });

  document.getElementById("btn-select-all-routes").addEventListener("click", () => { document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = true; }); });
  document.getElementById("btn-deselect-all-routes").addEventListener("click", () => { document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = false; }); });
  document.getElementById("btn-select-all-units").addEventListener("click", () => { document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = true; }); });
  document.getElementById("btn-deselect-all-units").addEventListener("click", () => { document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = false; }); });
  document.getElementById("btn-select-all-drivers").addEventListener("click", () => { document.querySelectorAll("#filter-driver-container input").forEach((cb) => { cb.checked = true; }); });
  document.getElementById("btn-deselect-all-drivers").addEventListener("click", () => { document.querySelectorAll("#filter-driver-container input").forEach((cb) => { cb.checked = false; }); });

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
    let lastTap = 0;
    
    grid.addEventListener("click", (e) => {
      if (e.target.classList.contains("month-btn")) {
        const btn = e.target;
        if (btn.classList.contains("disabled-month")) {
          showAlert("❌ No hay información cargada para este mes.");
          btn.innerHTML = "❌";
          setTimeout(() => btn.innerHTML = monthNames[btn.dataset.month], 1500);
          return;
        }
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
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
          
          document.querySelectorAll('.month-btn').forEach(b => b.classList.remove("active-month"));
          btn.classList.add("active-month");
          modal.classList.add("hidden");
          lastTap = 0;
        } else {
          lastTap = currentTime;
          document.querySelectorAll('.month-btn').forEach(b => b.style.borderColor = "");
          btn.style.borderColor = "var(--accent-blue)";
        }
      }
    });
  }
}
