/* Smart Dashboard - App Principal */
/* global Chart, loadAllData, formatMoney, formatDateStr, ROUTE_LABELS */

const APP = {
  allData: [],
  filteredData: [],
  charts: {},
  currentPage: 1,
  pageSize: 50,
  sortCol: "fecha",
  sortAsc: false,
  viewMode: "daily"
};

// --- INICIO ---
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const loginScreen = document.getElementById("login-screen");
  const loadingScreen = document.getElementById("loading-screen");

  // Sistema de Login básico (sin validación por ahora)
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Evitar recarga de página
    
    // Ocultar login y mostrar pantalla de carga
    loginScreen.classList.add("hidden");
    loadingScreen.classList.remove("hidden");

    try {
      const statusEl = document.getElementById("loading-status");
      APP.allData = await loadAllData((msg) => {
        statusEl.textContent = msg;
      });
      statusEl.textContent = `${APP.allData.length} registros cargados. Preparando dashboard...`;
      initFilters();
      APP.filteredData = [...APP.allData];
      renderAll();
      loadingScreen.classList.add("hidden");
      document.getElementById("last-update").textContent =
        `Actualizado: ${new Date().toLocaleTimeString("es-MX")}`;
    } catch (err) {
      document.getElementById("loading-status").textContent =
        `Error: ${err.message}`;
    }
    setupEvents();
  });
});

// --- FILTROS ---
function initFilters() {
  const units = [...new Set(APP.allData.map((r) => r.unidad))].sort();
  const drivers = [...new Set(APP.allData.map((r) => r.conductor))].sort();
  const dates = APP.allData.map((r) => r.fecha).filter(Boolean);
  const minDate = new Date(Math.min(...dates));
  const maxDate = new Date(Math.max(...dates));

  // Fechas
  const fmt = (d) => d.toISOString().split("T")[0];
  document.getElementById("filter-date-from").value = fmt(minDate);
  document.getElementById("filter-date-to").value = fmt(maxDate);

  // Unidades con checkboxes
  const container = document.getElementById("filter-units-container");
  container.innerHTML = units.map((u) =>
    `<label class="checkbox-item">
      <input type="checkbox" value="${u}" checked> ${u}
    </label>`
  ).join("");

  // Conductores
  const driverSel = document.getElementById("filter-driver");
  drivers.forEach((d) => {
    const opt = document.createElement("option");
    opt.value = d;
    opt.textContent = d;
    driverSel.appendChild(opt);
  });
}

function getFilteredData() {
  const dateFrom = new Date(document.getElementById("filter-date-from").value + "T00:00:00");
  const dateTo = new Date(document.getElementById("filter-date-to").value + "T23:59:59");
  const route = document.getElementById("filter-route").value;
  const driver = document.getElementById("filter-driver").value;
  const checkedUnits = [...document.querySelectorAll("#filter-units-container input:checked")]
    .map((cb) => cb.value);

  return APP.allData.filter((r) => {
    if (r.fecha < dateFrom || r.fecha > dateTo) return false;
    if (route !== "all") {
      if (route === "Teh-Pue-both" && r.ruta !== "Teh-Pue" && r.ruta !== "Pue-Teh") return false;
      if (route === "Teh-Mex-both" && r.ruta !== "Teh-Mex" && r.ruta !== "Mex-Teh") return false;
      if (!route.includes("both") && r.ruta !== route) return false;
    }
    if (driver !== "all" && r.conductor !== driver) return false;
    if (!checkedUnits.includes(r.unidad)) return false;
    return true;
  });
}

// --- EVENTOS ---
function setupEvents() {
  document.getElementById("btn-apply-filters").addEventListener("click", () => {
    APP.filteredData = getFilteredData();
    APP.currentPage = 1;
    renderAll();
  });

  document.getElementById("btn-clear-filters").addEventListener("click", () => {
    document.getElementById("filter-route").value = "all";
    document.getElementById("filter-driver").value = "all";
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = true; });
    APP.filteredData = [...APP.allData];
    APP.currentPage = 1;
    renderAll();
  });

  document.getElementById("btn-select-all-units").addEventListener("click", () => {
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = true; });
  });
  document.getElementById("btn-deselect-all-units").addEventListener("click", () => {
    document.querySelectorAll("#filter-units-container input").forEach((cb) => { cb.checked = false; });
  });

  document.getElementById("btn-refresh").addEventListener("click", async () => {
    document.getElementById("loading-screen").classList.remove("hidden");
    APP.allData = await loadAllData((msg) => {
      document.getElementById("loading-status").textContent = msg;
    });
    APP.filteredData = getFilteredData();
    renderAll();
    document.getElementById("loading-screen").classList.add("hidden");
    document.getElementById("last-update").textContent =
      `Actualizado: ${new Date().toLocaleTimeString("es-MX")}`;
  });

  // Vista temporal
  document.querySelectorAll(".view-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".view-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      APP.viewMode = btn.dataset.view;
      renderChartIncome();
    });
  });

  // Tabla: ordenamiento
  document.querySelectorAll("#data-table th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (APP.sortCol === col) { APP.sortAsc = !APP.sortAsc; }
      else { APP.sortCol = col; APP.sortAsc = true; }
      APP.currentPage = 1;
      renderTable();
    });
  });

  // Tabla: búsqueda
  document.getElementById("table-search").addEventListener("input", (e) => {
    APP.searchTerm = e.target.value.toLowerCase();
    APP.currentPage = 1;
    renderTable();
  });

  // Paginación
  document.getElementById("btn-prev-page").addEventListener("click", () => {
    if (APP.currentPage > 1) { APP.currentPage--; renderTable(); }
  });
  document.getElementById("btn-next-page").addEventListener("click", () => {
    const total = Math.ceil(getTableData().length / APP.pageSize);
    if (APP.currentPage < total) { APP.currentPage++; renderTable(); }
  });
}

// --- RENDER PRINCIPAL ---
function renderAll() {
  renderKPIs();
  renderChartIncome();
  renderChartRoutes();
  renderChartUnits();
  renderChartDrivers();
  renderUnitAnalysis();
  renderTable();
}

// --- KPIs ---
function renderKPIs() {
  const d = APP.filteredData;
  const bruto = d.reduce((s, r) => s + r.totalBruto, 0);
  const neto = d.reduce((s, r) => s + r.totalNeto, 0);
  const pax = d.reduce((s, r) => s + r.totalPasajeros, 0);
  const voucher = d.reduce((s, r) => s + r.voucher, 0);
  const avg = d.length > 0 ? Math.round(neto / d.length) : 0;

  document.getElementById("kpi-bruto-value").textContent = formatMoney(bruto);
  document.getElementById("kpi-neto-value").textContent = formatMoney(neto);
  document.getElementById("kpi-passengers-value").textContent = pax.toLocaleString("es-MX");
  document.getElementById("kpi-trips-value").textContent = d.length.toLocaleString("es-MX");
  document.getElementById("kpi-voucher-value").textContent = formatMoney(voucher);
  document.getElementById("kpi-avg-value").textContent = formatMoney(avg);
}

// --- GRÁFICA: Ingresos por periodo ---
function renderChartIncome() {
  const d = APP.filteredData;
  const grouped = {};

  d.forEach((r) => {
    let key;
    if (APP.viewMode === "daily") {
      key = formatDateStr(r.fecha);
    } else if (APP.viewMode === "weekly") {
      key = `Sem ${r.semana}`;
    } else {
      key = r.docMonth || "Sin mes";
    }
    if (!grouped[key]) grouped[key] = { bruto: 0, neto: 0, voucher: 0 };
    grouped[key].bruto += r.totalBruto;
    grouped[key].neto += r.totalNeto;
    grouped[key].voucher += r.voucher;
  });

  const labels = Object.keys(grouped);
  const brutoData = labels.map((k) => grouped[k].bruto);
  const netoData = labels.map((k) => grouped[k].neto);
  const voucherData = labels.map((k) => grouped[k].voucher);

  if (APP.charts.income) APP.charts.income.destroy();
  APP.charts.income = new Chart(
    document.getElementById("chart-income"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "BRUTO", data: brutoData, backgroundColor: "rgba(59,130,246,0.7)", borderRadius: 4 },
          { label: "NETO", data: netoData, backgroundColor: "rgba(16,185,129,0.7)", borderRadius: 4 },
          { label: "Voucher", data: voucherData, backgroundColor: "rgba(245,158,11,0.5)", borderRadius: 4 }
        ]
      },
      options: chartOptions("Pesos ($)")
    }
  );
}

// --- GRÁFICA: Comparativa por ruta ---
function renderChartRoutes() {
  const routes = {};
  APP.filteredData.forEach((r) => {
    if (!routes[r.ruta]) routes[r.ruta] = { bruto: 0, neto: 0, pax: 0, trips: 0, voucher: 0 };
    routes[r.ruta].bruto += r.totalBruto;
    routes[r.ruta].neto += r.totalNeto;
    routes[r.ruta].pax += r.totalPasajeros;
    routes[r.ruta].trips++;
    routes[r.ruta].voucher += r.voucher;
  });

  const labels = Object.keys(routes).map((k) => ROUTE_LABELS[k] || k);
  const keys = Object.keys(routes);

  if (APP.charts.routes) APP.charts.routes.destroy();
  APP.charts.routes = new Chart(
    document.getElementById("chart-routes"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "BRUTO", data: keys.map((k) => routes[k].bruto), backgroundColor: "rgba(59,130,246,0.7)", borderRadius: 4 },
          { label: "NETO", data: keys.map((k) => routes[k].neto), backgroundColor: "rgba(16,185,129,0.7)", borderRadius: 4 },
          { label: "Voucher", data: keys.map((k) => routes[k].voucher), backgroundColor: "rgba(245,158,11,0.5)", borderRadius: 4 }
        ]
      },
      options: chartOptions("Pesos ($)")
    }
  );
}

// --- GRÁFICA: Rendimiento por unidad ---
function renderChartUnits() {
  const units = {};
  APP.filteredData.forEach((r) => {
    if (!units[r.unidad]) units[r.unidad] = { neto: 0, bruto: 0, trips: 0, pax: 0, voucher: 0 };
    units[r.unidad].neto += r.totalNeto;
    units[r.unidad].bruto += r.totalBruto;
    units[r.unidad].trips++;
    units[r.unidad].pax += r.totalPasajeros;
    units[r.unidad].voucher += r.voucher;
  });

  // Ordenar por NETO descendente
  const sorted = Object.entries(units).sort((a, b) => b[1].neto - a[1].neto);
  const labels = sorted.map(([u]) => `Unidad ${u}`);

  if (APP.charts.units) APP.charts.units.destroy();
  APP.charts.units = new Chart(
    document.getElementById("chart-units"), {
      type: "bar",
      data: {
        labels,
        datasets: [
          { label: "NETO", data: sorted.map(([, v]) => v.neto), backgroundColor: sorted.map(([, v]) => v.neto >= 0 ? "rgba(16,185,129,0.7)" : "rgba(239,68,68,0.7)"), borderRadius: 4 },
          { label: "Voucher", data: sorted.map(([, v]) => v.voucher), backgroundColor: "rgba(245,158,11,0.5)", borderRadius: 4 }
        ]
      },
      options: chartOptionsHorizontal()
    }
  );
}

// --- GRÁFICA: Top conductores ---
function renderChartDrivers() {
  const drivers = {};
  APP.filteredData.forEach((r) => {
    if (!r.conductor) return;
    if (!drivers[r.conductor]) drivers[r.conductor] = { neto: 0, trips: 0, pax: 0 };
    drivers[r.conductor].neto += r.totalNeto;
    drivers[r.conductor].trips++;
    drivers[r.conductor].pax += r.totalPasajeros;
  });

  const sorted = Object.entries(drivers).sort((a, b) => b[1].neto - a[1].neto).slice(0, 10);

  if (APP.charts.drivers) APP.charts.drivers.destroy();
  APP.charts.drivers = new Chart(
    document.getElementById("chart-drivers"), {
      type: "bar",
      data: {
        labels: sorted.map(([d]) => d),
        datasets: [{
          label: "NETO Total",
          data: sorted.map(([, v]) => v.neto),
          backgroundColor: sorted.map((_, i) => {
            const colors = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316","#6366f1"];
            return colors[i % colors.length];
          }),
          borderRadius: 4
        }]
      },
      options: chartOptionsHorizontal()
    }
  );
}

// --- ANÁLISIS POR UNIDAD ---
function renderUnitAnalysis() {
  const units = {};
  APP.filteredData.forEach((r) => {
    if (!units[r.unidad]) {
      units[r.unidad] = { neto: 0, bruto: 0, trips: 0, pax: 0, voucher: 0, gastos: 0, weeks: {} };
    }
    const u = units[r.unidad];
    u.neto += r.totalNeto;
    u.bruto += r.totalBruto;
    u.trips++;
    u.pax += r.totalPasajeros;
    u.voucher += r.voucher;
    u.gastos += r.totalGastos;
    // Desglose semanal
    const wk = `Sem ${r.semana}`;
    if (!u.weeks[wk]) u.weeks[wk] = { neto: 0, bruto: 0, pax: 0, voucher: 0 };
    u.weeks[wk].neto += r.totalNeto;
    u.weeks[wk].bruto += r.totalBruto;
    u.weeks[wk].pax += r.totalPasajeros;
    u.weeks[wk].voucher += r.voucher;
  });

  // Tarjetas de resumen por unidad
  const container = document.getElementById("unit-summary-cards");
  const sorted = Object.entries(units).sort((a, b) => b[1].neto - a[1].neto);
  // Totales combinados
  const totals = sorted.reduce((acc, [, v]) => {
    acc.neto += v.neto; acc.bruto += v.bruto; acc.trips += v.trips;
    acc.pax += v.pax; acc.voucher += v.voucher; acc.gastos += v.gastos;
    return acc;
  }, { neto: 0, bruto: 0, trips: 0, pax: 0, voucher: 0, gastos: 0 });

  let html = `<div class="unit-summary-card" style="border-color: var(--accent-purple);">
    <div class="unit-card-header"><h4>📊 TOTAL COMBINADO</h4><span>${sorted.length} unidades</span></div>
    <div class="unit-card-stats">
      <div class="unit-stat"><span class="unit-stat-value">${formatMoney(totals.bruto)}</span><span class="unit-stat-label">BRUTO</span></div>
      <div class="unit-stat"><span class="unit-stat-value ${totals.neto >= 0 ? "positive" : "negative"}">${formatMoney(totals.neto)}</span><span class="unit-stat-label">NETO</span></div>
      <div class="unit-stat"><span class="unit-stat-value">${totals.pax.toLocaleString()}</span><span class="unit-stat-label">Pasajeros</span></div>
      <div class="unit-stat"><span class="unit-stat-value">${totals.trips.toLocaleString()}</span><span class="unit-stat-label">Viajes</span></div>
      <div class="unit-stat"><span class="unit-stat-value" style="color:var(--accent-orange)">${formatMoney(totals.voucher)}</span><span class="unit-stat-label">Voucher</span></div>
      <div class="unit-stat"><span class="unit-stat-value">${formatMoney(totals.gastos)}</span><span class="unit-stat-label">Gastos</span></div>
    </div>
  </div>`;

  sorted.forEach(([name, v]) => {
    html += `<div class="unit-summary-card">
      <div class="unit-card-header"><h4>🚌 Unidad ${name}</h4><span>${v.trips} viajes</span></div>
      <div class="unit-card-stats">
        <div class="unit-stat"><span class="unit-stat-value">${formatMoney(v.bruto)}</span><span class="unit-stat-label">BRUTO</span></div>
        <div class="unit-stat"><span class="unit-stat-value ${v.neto >= 0 ? "positive" : "negative"}">${formatMoney(v.neto)}</span><span class="unit-stat-label">NETO</span></div>
        <div class="unit-stat"><span class="unit-stat-value">${v.pax.toLocaleString()}</span><span class="unit-stat-label">Pasajeros</span></div>
        <div class="unit-stat"><span class="unit-stat-value" style="color:var(--accent-orange)">${formatMoney(v.voucher)}</span><span class="unit-stat-label">Voucher</span></div>
      </div>
    </div>`;
  });
  container.innerHTML = html;

  // Gráfica semanal de unidades
  const allWeeks = [...new Set(APP.filteredData.map((r) => `Sem ${r.semana}`))].sort();
  const colors = ["#3b82f6","#8b5cf6","#06b6d4","#10b981","#f59e0b","#ef4444","#ec4899","#14b8a6","#f97316","#6366f1"];
  const datasets = sorted.slice(0, 10).map(([name, v], i) => ({
    label: `Unidad ${name}`,
    data: allWeeks.map((w) => (v.weeks[w]?.neto || 0)),
    borderColor: colors[i % colors.length],
    backgroundColor: colors[i % colors.length] + "33",
    tension: 0.3,
    fill: false
  }));

  if (APP.charts.unitWeekly) APP.charts.unitWeekly.destroy();
  APP.charts.unitWeekly = new Chart(
    document.getElementById("chart-unit-weekly"), {
      type: "line",
      data: { labels: allWeeks, datasets },
      options: chartOptions("NETO ($)")
    }
  );
}

// --- TABLA ---
function getTableData() {
  let data = [...APP.filteredData];
  // Búsqueda
  if (APP.searchTerm) {
    data = data.filter((r) =>
      r.conductor.toLowerCase().includes(APP.searchTerm) ||
      r.unidad.toLowerCase().includes(APP.searchTerm) ||
      r.ruta.toLowerCase().includes(APP.searchTerm) ||
      (ROUTE_LABELS[r.ruta] || "").toLowerCase().includes(APP.searchTerm)
    );
  }
  // Ordenamiento
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
    const voucherClass = r.voucher > 0 ? "cell-voucher" : "";
    return `<tr>
      <td>${formatDateStr(r.fecha)}</td>
      <td>${r.hora}</td>
      <td>${ROUTE_LABELS[r.ruta] || r.ruta}</td>
      <td>${r.unidad}</td>
      <td>${r.conductor}</td>
      <td>${r.adultos}</td>
      <td>${r.totalPasajeros}</td>
      <td class="${voucherClass}">${r.voucher > 0 ? formatMoney(r.voucher) : "-"}</td>
      <td>${formatMoney(r.totalBruto)}</td>
      <td>${formatMoney(r.totalGastos)}</td>
      <td class="${netoClass}">${formatMoney(r.totalNeto)}</td>
    </tr>`;
  }).join("");

  document.getElementById("table-info").textContent =
    `Mostrando ${start + 1}-${Math.min(start + APP.pageSize, data.length)} de ${data.length} registros`;
  document.getElementById("page-indicator").textContent =
    `Página ${APP.currentPage} de ${totalPages}`;
}

// --- OPCIONES DE GRÁFICA COMUNES ---
function chartOptions(yLabel) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
      tooltip: {
        backgroundColor: "rgba(17,24,39,0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.raw)}`
        }
      }
    },
    scales: {
      x: { ticks: { color: "#64748b", font: { size: 10 } }, grid: { color: "rgba(255,255,255,0.03)" } },
      y: {
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          callback: (v) => formatMoney(v)
        },
        grid: { color: "rgba(255,255,255,0.05)" },
        title: { display: true, text: yLabel, color: "#64748b" }
      }
    }
  };
}

// Opciones para gráficas de barras horizontales
function chartOptionsHorizontal() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { labels: { color: "#94a3b8", font: { family: "Inter", size: 11 } } },
      tooltip: {
        backgroundColor: "rgba(17,24,39,0.95)",
        titleColor: "#f1f5f9",
        bodyColor: "#94a3b8",
        borderColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatMoney(ctx.raw)}`
        }
      }
    },
    scales: {
      x: {
        ticks: { color: "#64748b", font: { size: 10 }, callback: (v) => formatMoney(v) },
        grid: { color: "rgba(255,255,255,0.05)" }
      },
      y: {
        ticks: { color: "#94a3b8", font: { size: 10 } },
        grid: { color: "rgba(255,255,255,0.03)" }
      }
    }
  };
}
