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

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const loadingScreen = document.getElementById("loading-screen");

  // Sistema de Login con Autenticación (auth.js)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga de página
    
    const userSel = document.getElementById("username").value;
    const passVal = document.getElementById("password").value;
    
    if (!userSel) { alert("Selecciona un usuario."); return; }
    
    const user = users.find(u => u.username === userSel);
    if (!user || user.password !== passVal) {
      alert("Contraseña incorrecta.");
      return;
    }
    
    // Guardar sesión globalmente
    currentUser = { ...user, passwordUsed: passVal };
    logAction("Inicio de Sesión", "Ingreso exitoso.");
    resetSessionTimer();

    loginScreen.classList.add("hidden");
    document.getElementById("main-header").style.display = "flex";
    document.getElementById("app-container").style.display = "flex";
    loadingScreen.classList.remove("hidden");

    try {
      const statusEl = document.getElementById("loading-status");
      APP.allData = await loadAllData((msg) => {
        statusEl.textContent = msg;
      });
      statusEl.textContent = `Preparando dashboard...`;
      initFilters();
      APP.filteredData = [...APP.allData];
      renderAll();
      loadingScreen.classList.add("hidden");
      document.getElementById("last-update").textContent =
        `Act: ${new Date().toLocaleTimeString("es-MX", {hour: '2-digit', minute:'2-digit'})}`;
    } catch (err) {
      document.getElementById("loading-status").textContent = `Error: ${err.message}`;
    }
    setupEvents();
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
  const dates = APP.allData.map((r) => r.fecha).filter(Boolean);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  const fmt = (d) => d.toISOString().split("T")[0];
  document.getElementById("filter-date-from").value = fmt(minDate);
  document.getElementById("filter-date-to").value = fmt(maxDate);

  const container = document.getElementById("filter-units-container");
  container.innerHTML = units.map((u) =>
    `<label class="checkbox-item"><input type="checkbox" value="${u}" checked> ${u}</label>`
  ).join("");

  const driverSel = document.getElementById("filter-driver");
  drivers.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    driverSel.appendChild(opt);
  });
}

function getFilteredData() {
  const dateFrom = new Date(document.getElementById("filter-date-from").value + "T00:00:00");
  const dateTo = new Date(document.getElementById("filter-date-to").value + "T23:59:59");
  const checkedRoutes = [...document.querySelectorAll("#filter-route-container input:checked")].map((cb) => cb.value);
  const driver = document.getElementById("filter-driver").value;
  const checkedUnits = [...document.querySelectorAll("#filter-units-container input:checked")].map((cb) => cb.value);

  return APP.allData.filter((r) => {
    if (r.fecha < dateFrom || r.fecha > dateTo) return false;
    if (!checkedRoutes.includes(r.ruta)) return false;
    if (driver !== "all" && r.conductor !== driver) return false;
    if (!checkedUnits.includes(r.unidad)) return false;
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
    const driver = document.getElementById("filter-driver").value;
    logAction("Filtros Aplicados", `Rutas: [${routes}] | Conductor: ${driver}`);

    if (window.innerWidth < 768) toggleSidebar(); // Cerrar sidebar en móvil al aplicar
  });

  document.getElementById("btn-clear-filters").addEventListener("click", () => {
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = true; });
    document.getElementById("filter-driver").value = "all";
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = true; });
    APP.filteredData = [...APP.allData];
    APP.currentPage = 1;
    renderAll();
  });

  document.getElementById("btn-select-all-routes").addEventListener("click", () => {
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = true; });
  });
  document.getElementById("btn-deselect-all-routes").addEventListener("click", () => {
    document.querySelectorAll("#filter-route-container input").forEach((cb) => { cb.checked = false; });
  });

  document.getElementById("btn-select-all-units").addEventListener("click", () => {
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = true; });
  });
  document.getElementById("btn-deselect-all-units").addEventListener("click", () => {
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = false; });
  });

  document.getElementById("btn-refresh").addEventListener("click", async () => {
    document.getElementById("loading-screen").classList.remove("hidden");
    APP.allData = await loadAllData((msg) => { document.getElementById("loading-status").textContent = msg; });
    APP.filteredData = getFilteredData();
    renderAll();
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("last-update").textContent = `Act: ${new Date().toLocaleTimeString("es-MX", {hour: '2-digit', minute:'2-digit'})}`;
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
    data = data.filter((r) =>
      r.conductor.toLowerCase().includes(APP.searchTerm) || r.unidad.toLowerCase().includes(APP.searchTerm) || r.ruta.toLowerCase().includes(APP.searchTerm)
    );
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
