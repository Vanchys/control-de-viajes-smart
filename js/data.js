/* ===================================
   Smart Dashboard - Módulo de Datos
   Carga y parseo de Google Sheets
   =================================== */

// Configuración de documentos de Google Sheets
const SHEETS_CONFIG = {
  documents: [
    {
      id: "1zp7yPfM3DwQmwmMPl-kyvBkXVgb3TRkTftLRkO-mF6w",
      name: "Smart 04 2025",
      month: "2025-04",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1lobnSDMy2xmOI8rvY26SCxZTi7YDtrUwOHmkcBj_0PM",
      name: "Smart 05 2025",
      month: "2025-05",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1RXkinb0jtL3waiArmrFUzk02oyebf7IQokpf13zPAaY",
      name: "Smart 06 2025",
      month: "2025-06",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1Wxg4GTqQZGXBULfidgBgAap034nibWr_iCdXyvuDklM",
      name: "Smart 07 2025",
      month: "2025-07",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1ChAOCZo07KfdYjPzu5zeM_7-KRzeFwqRFSLMlSv5VaI",
      name: "Smart 08 2025",
      month: "2025-08",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1y2ZF80uT0E_S-hTaSc2cjtMGG6bpb5uJgbe6LdvPFLE",
      name: "Smart 09 2025",
      month: "2025-09",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1jzUcux0UsHw8oZpRG5phkUV5LPtPJpd88MtQKVMukcY",
      name: "Smart 10 2025",
      month: "2025-10",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1NEsct2aGV2DUbSVq1pF5fdIsrB46UpBFNjVDsvW0zcI",
      name: "Smart 11 2025",
      month: "2025-11",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1WctBtZl7l4O-sBLAzgiy1J9JmEXMb04LAHxFEKjmST4",
      name: "Smart 12 2025",
      month: "2025-12",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1WJUI62LWeO1hflRktzTuKh3IAh80FytfeFSIJT2BhnU",
      name: "Smart 01 2026",
      month: "2026-01",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1d_MirCzEeCbyrjfiC-BT3e0D5qVPL6l110PrEls8Ics",
      name: "Smart 02 2026",
      month: "2026-02",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "12DKb_WTfxjAay5TDjzbhqLmWoc-ROfK-FubZbW3l5vQ",
      name: "Smart 03 2026",
      month: "2026-03",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "147v2hB-J4nm540f8E5tNA_PNduYBUX10IVanpdgzupM",
      name: "Smart 04 2026",
      month: "2026-04",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1v30CzdtOpZKCEgfeDEx5fYia06XudZRqq0FLoVDFLCE",
      name: "Smart 05 2026",
      month: "2026-05",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      // Configuración para el mes de Junio 2026
      id: "1YRmGq7lH5xp7-Op2fYuBc5XqG2DPvL4XYLwnxbCoDW4",
      name: "Smart 06 2026",
      month: "2026-06",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
    {
      id: "1_ljwZdSbLoHtTJvRRAMG7E5evcKDnuAn6rm98yGVY_g",
      name: "Smart 07 2026",
      month: "2026-07",
      sheets: [
        { name: "Hoja_Teh_Pue", route: "Teh-Pue", type: "puebla" },
        { name: "Hoja_Pue_Teh", route: "Pue-Teh", type: "puebla" },
        { name: "Hoja_Teh_Mex", route: "Teh-Mex", type: "cdmx" },
        { name: "Hoja_Mex_Teh", route: "Mex-Teh", type: "cdmx" }
      ]
    },
  ]
};

// Nombres legibles de rutas
const ROUTE_LABELS = {
  "Teh-Pue": "Tehuacán → Puebla",
  "Pue-Teh": "Puebla → Tehuacán",
  "Teh-Mex": "Tehuacán → CDMX",
  "Mex-Teh": "CDMX → Tehuacán"
};

/**
 * Parsea un valor monetario del formato de Google Sheets
 * Ejemplos: "$1.575" → 1575, "-$392" → -392, "$0" → 0
 */
function parseCurrency(value) {
  if (!value || value === "" || value === "-") return 0;
  let str = String(value).trim();
  // Detectar si es negativo
  const isNegative = str.startsWith("-");
  // Quitar signos de $, -, espacios y puntos (separador de miles)
  str = str.replace(/[-$\s.]/g, "");
  // Quitar comas si las hubiera
  str = str.replace(/,/g, "");
  const num = parseInt(str, 10) || 0;
  return isNegative ? -num : num;
}

/**
 * Parsea un entero simple (pasajeros, paquetes, etc.)
 */
function parseNum(value) {
  if (!value || value === "" || value === "-") return 0;
  return parseInt(String(value).trim(), 10) || 0;
}

/**
 * Parsea una fecha en formato DD/MM/YYYY a objeto Date
 */
function parseDate(value) {
  if (!value) return null;
  const str = String(value).trim();
  // Intentar DD/MM/YYYY
  const parts = str.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  // Intentar como date string nativo
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

/**
 * Obtiene el número de semana ISO de una fecha
 */
function getWeekNumber(date) {
  const d = new Date(Date.UTC(
    date.getFullYear(), date.getMonth(), date.getDate()
  ));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Parsea CSV crudo a array de arrays
 * Maneja comillas y comas dentro de campos
 */
function parseCSV(csvText) {
  const rows = [];
  let current = "";
  let inQuotes = false;
  const lines = csvText.split("\n");

  for (const line of lines) {
    if (inQuotes) {
      current += "\n" + line;
    } else {
      current = line;
    }
    // Contar comillas para saber si cerramos
    const quoteCount =
      (current.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      inQuotes = false;
      // Parsear la fila
      const row = [];
      let field = "";
      let inFieldQuote = false;
      for (let i = 0; i < current.length; i++) {
        const ch = current[i];
        if (ch === '"') {
          inFieldQuote = !inFieldQuote;
        } else if (ch === "," && !inFieldQuote) {
          row.push(field.trim());
          field = "";
        } else {
          field += ch;
        }
      }
      row.push(field.trim());
      rows.push(row);
    } else {
      inQuotes = true;
    }
  }
  return rows;
}

/**
 * Carga los datos CSV de una hoja de Google Sheets
 */
async function fetchSheetCSV(docId, sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${docId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Error cargando ${sheetName}: ${response.status}`
    );
  }
  return await response.text();
}

/**
 * Parsea una fila de datos tipo Puebla (22 columnas)
 * y devuelve un objeto normalizado
 */
function parseRowPuebla(row, route) {
  return {
    origen: row[0] || "",
    destino: row[1] || "",
    fecha: parseDate(row[2]),
    fechaStr: row[2] || "",
    hora: row[3] || "",
    unidad: row[4] || "",
    conductor: row[5] || "",
    adultos: parseNum(row[6]),
    menores: parseNum(row[7]),
    paquetes: 0,
    cuacnopalan: 0,
    tarifaAdultos: parseCurrency(row[8]),
    tarifaMenores: parseCurrency(row[9]),
    tarifaPaquetes: 0,
    tarifaCuacnopalan: 0,
    ventaEnLinea: row[10] || "",
    voucher: parseCurrency(row[11]),
    totalBruto: parseCurrency(row[12]),
    totalCasetas: parseCurrency(row[17]),
    totalDiesel: parseCurrency(row[18]),
    totalNomina: parseCurrency(row[19]),
    totalGastos: parseCurrency(row[20]),
    totalNeto: parseCurrency(row[21]),
    ruta: route,
    tipoRuta: "puebla",
    totalPasajeros: parseNum(row[6]) + parseNum(row[7]),
    semana: null // Se calcula después
  };
}

/**
 * Parsea una fila de datos tipo CDMX (24 columnas)
 * y devuelve un objeto normalizado
 */
function parseRowCDMX(row, route) {
  return {
    origen: row[0] || "",
    destino: row[1] || "",
    fecha: parseDate(row[2]),
    fechaStr: row[2] || "",
    hora: row[3] || "",
    unidad: row[4] || "",
    conductor: row[5] || "",
    adultos: parseNum(row[6]),
    menores: 0,
    paquetes: parseNum(row[7]),
    cuacnopalan: parseNum(row[8]),
    tarifaAdultos: parseCurrency(row[9]),
    tarifaMenores: 0,
    tarifaPaquetes: parseCurrency(row[10]),
    tarifaCuacnopalan: parseCurrency(row[11]),
    ventaEnLinea: row[12] || "",
    voucher: parseCurrency(row[13]),
    totalBruto: parseCurrency(row[14]),
    totalCasetas: parseCurrency(row[19]),
    totalDiesel: parseCurrency(row[20]),
    totalNomina: parseCurrency(row[21]),
    totalGastos: parseCurrency(row[22]),
    totalNeto: parseCurrency(row[23]),
    ruta: route,
    tipoRuta: "cdmx",
    totalPasajeros:
      parseNum(row[6]) + parseNum(row[7]) + parseNum(row[8]),
    semana: null
  };
}

/**
 * Carga TODOS los datos de todos los documentos configurados
 * Retorna un array unificado de registros normalizados
 *
 * @param {Function} onStatus - Callback de progreso que recibe:
 *   { message: string, percent: number, current: number, total: number }
 */
async function loadAllData(onStatus) {
  const allRecords = [];

  // Calcular el total de hojas antes del loop para el progreso real
  const totalSheets = SHEETS_CONFIG.documents.reduce(
    (sum, doc) => sum + doc.sheets.length, 0
  );
  let loadedSheets = 0;

  for (const doc of SHEETS_CONFIG.documents) {
    for (const sheet of doc.sheets) {

      // Notificar inicio de carga de esta hoja con porcentaje real
      if (onStatus) {
        const percent = Math.round((loadedSheets / totalSheets) * 100);
        onStatus({
          message: `Cargando ${sheet.name} (${doc.name})...`,
          percent,
          current: loadedSheets,
          total: totalSheets
        });
      }

      try {
        const csv = await fetchSheetCSV(doc.id, sheet.name);
        const rows = parseCSV(csv);

        // Saltar encabezado (fila 0) y filas vacías
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          // Verificar que tenga datos (al menos fecha y unidad)
          if (!row[2] || !row[4]) continue;

          let record;
          if (sheet.type === "puebla") {
            record = parseRowPuebla(row, sheet.route);
          } else {
            record = parseRowCDMX(row, sheet.route);
          }

          // Calcular semana si la fecha es válida
          if (record.fecha) {
            record.semana = getWeekNumber(record.fecha);
          }

          // Solo agregar si tiene fecha válida
          if (record.fecha) {
            record.docName = doc.name;
            record.docMonth = doc.month;
            allRecords.push(record);
          }
        }
      } catch (error) {
        console.error(`Error cargando ${sheet.name}:`, error);
      }

      // Contabilizar hoja terminada (con éxito o error) y notificar
      loadedSheets++;
      if (onStatus) {
        const percent = Math.round((loadedSheets / totalSheets) * 100);
        onStatus({
          message: `✓ ${sheet.name} (${doc.name})`,
          percent,
          current: loadedSheets,
          total: totalSheets
        });
      }
    }
  }

  return allRecords;
}

/**
 * Formatea un número como moneda MXN
 */
function formatMoney(amount) {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("es-MX");
  return amount < 0
    ? `-$${formatted}`
    : `$${formatted}`;
}

/**
 * Formatea una fecha como string legible
 */
function formatDateStr(date) {
  if (!date) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}
