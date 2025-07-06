import { SalesRecord } from '../types/sales';
import { CommissionCEVFilters, CommissionVWFilters, CommissionVendedorFilters, CommissionSummary, WeeklyCommissionResult } from '../types/commissions';
import { parseDate, formatDate } from './dateUtils';
import { calculateWeeklyBonuses } from './commissionCalculator'; 

export function calculateCEVCommissions(records: SalesRecord[], filters: CommissionCEVFilters): CommissionSummary {
  const filteredRecords = records.filter(record => {
    const recordDate = parseDate(record.fec_emis);

    // Filtros de fecha
    if (filters.fechaInicio && recordDate < parseDate(filters.fechaInicio)) return false;
    if (filters.fechaFin && recordDate > parseDate(filters.fechaFin)) return false;

    // Excluir Mercado Libre
    const cliente = record.nombre_cliente.toLowerCase();
    if (filters.excluirMercadoLibre && (cliente.includes('mercado libre') || cliente.includes('ml'))) return false;

    // Excluir Moto Siete
    const vendedor = record.nombre_vendedor.toLowerCase();
    if (filters.excluirMotoSiete && vendedor.includes('moto siete')) return false;

    return true;
  });

  // Agrupar ventas por día
  const ventasPorDia: Record<string, number> = {};

  filteredRecords.forEach(record => {
    const dia = formatDate(parseDate(record.fec_emis)); // formato YYYY-MM-DD
    ventasPorDia[dia] = (ventasPorDia[dia] || 0) + record.total_usd;
  });

  // Ordenar por fecha ascendente
  const diasOrdenados = Object.keys(ventasPorDia).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Mapear resultados incluyendo días < $4000
  const resultados = diasOrdenados.map(dia => {
    const totalVentas = ventasPorDia[dia];
    const comision = totalVentas > 4000 ? totalVentas * (filters.porcentaje / 100) : 0;
    return {
      vendedor: dia,      // se usa como etiqueta en la tabla
      periodo: dia,       // por si lo usas también
      totalVentas,
      comision
    };
  });

  const totalVentas = resultados.reduce((acc, r) => acc + r.totalVentas, 0);
  const totalComisiones = resultados.reduce((acc, r) => acc + r.comision, 0);

  return {
    totalVentas,
    totalComisiones,
    porcentaje: filters.porcentaje,
    resultados
  };
}


export function calculateVWCommissions(
  records: SalesRecord[],
  filters: CommissionVWFilters
): CommissionSummary {
  const filteredRecords = records.filter(record => {
    const recordDate = parseDate(record.fec_emis);

    if (filters.fechaInicio && recordDate < parseDate(filters.fechaInicio)) return false;
    if (filters.fechaFin && recordDate > parseDate(filters.fechaFin)) return false;

    // Vendedores seleccionados
    if (filters.vendedores?.length && !filters.vendedores.includes(record.nombre_vendedor)) {
      return false;
    }

    // Solo VW
    const marca = record.marcas_de_vehiculos.toLowerCase();
    return marca.includes('volks') || marca.includes('vw');
  });

  const ventasPorDia: { [fecha: string]: number } = {};
  filteredRecords.forEach(record => {
    const fecha = formatDate(parseDate(record.fec_emis)); // ej: "2025-06-15"
    ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + record.total_usd;
  });

  const resultados = Object.entries(ventasPorDia).map(([fecha, totalVentas]) => ({
    vendedor: fecha, // reutilizado como etiqueta de "día"
    periodo: fecha,
    totalVentas,
    comision: totalVentas * (filters.porcentaje / 100)
  }));

  const totalVentas = resultados.reduce((acc, r) => acc + r.totalVentas, 0);
  const totalComisiones = resultados.reduce((acc, r) => acc + r.comision, 0);

  return {
    totalVentas,
    totalComisiones,
    porcentaje: filters.porcentaje,
    resultados
  };
}


export function calculateVendedorCommissions(
  records: SalesRecord[],
  filters: CommissionVendedorFilters
): { summary: CommissionSummary; weeklyResults: WeeklyCommissionResult[] } {
  const filteredRecords = records.filter(record => {
    const recordDate = parseDate(record.fec_emis);

    if (filters.fechaInicio && recordDate < parseDate(filters.fechaInicio)) return false;
    if (filters.fechaFin && recordDate > parseDate(filters.fechaFin)) return false;
    if (filters.vendedor && record.nombre_vendedor !== filters.vendedor) return false;
    if (filters.semanas && filters.semanas.length > 0 && !filters.semanas.includes(record.numero_semana)) return false;

    return true;
  });

  const { weeklyBonuses, vendorSummaries } = calculateWeeklyBonuses(filteredRecords);

  const weeklyResults: WeeklyCommissionResult[] = weeklyBonuses.map(b => ({
    vendedor: b.vendedor,
    totalVentas: b.totalVentas,
    comision: b.bonificacion, // 🔁 usamos la bonificación como comisión
    periodo: b.periodo,
    semana: b.semana,
    año: b.año,
  }));

  const summary: CommissionSummary = {
    totalVentas: vendorSummaries.reduce((acc, v) => acc + v.totalVentas, 0),
    totalComisiones: vendorSummaries.reduce((acc, v) => acc + v.totalBonificaciones, 0),
    porcentaje: 0, // Ya no se usa, pero mantenemos la estructura
    resultados: vendorSummaries.map(v => ({
      vendedor: v.vendedor,
      totalVentas: v.totalVentas,
      comision: v.totalBonificaciones,
      periodo: `${filters.fechaInicio || ''} - ${filters.fechaFin || ''}`,
    })),
  };

  return {
    summary,
    weeklyResults,
  };
}


export function getAvailableWeeks(records: SalesRecord[]): number[] {
  const weeks = new Set<number>();
  records.forEach(record => {
    weeks.add(record.numero_semana);
  });
  return Array.from(weeks).sort((a, b) => a - b);
}

interface WeeklyBonus {
  vendedor: string;
  semana: number;
  periodo: string;
  totalVentas: number;
  bonificacion: number;
}

interface VendorSummary {
  vendedor: string;
  totalVentas: number;
  totalBonificaciones: number;
}

export function calculateWeeklyBonuses(salesData: SalesRecord[]): {
  weeklyBonuses: WeeklyBonus[];
  vendorSummaries: VendorSummary[];
} {
  const BONO_ESCALADO = [
    { min: 500, max: 1000, bonus: 10 },
    { min: 1001, max: 1500, bonus: 15 },
    { min: 1501, max: 2000, bonus: 20 },
    { min: 2001, max: 2500, bonus: 25 },
    { min: 2501, max: 3000, bonus: 30 },
    { min: 3001, max: 3500, bonus: 35 },
    { min: 3501, max: 4000, bonus: 40 },
    { min: 4001, max: 4500, bonus: 45 },
    { min: 4501, max: 5000, bonus: 50 },
    { min: 5001, max: 5500, bonus: 60 },
    { min: 5501, max: 6000, bonus: 70 },
    { min: 6001, max: 6500, bonus: 80 },
    { min: 6501, max: 7000, bonus: 90 },
    { min: 7001, max: 7500, bonus: 100 },
    { min: 7501, max: 8000, bonus: 110 },
    { min: 8001, max: 8500, bonus: 120 },
    { min: 8501, max: 9000, bonus: 130 },
    { min: 9001, max: 9500, bonus: 140 },
    { min: 9501, max: 9999999, bonus: 150 },
  ];

  const countDaysInWeek = (week: number, year: number) => {
    const dates = new Set<string>();
    salesData.forEach(record => {
      const date = parseDate(record.fec_emis);
      const weekNum = record.numero_semana;
      if (weekNum === week && date.getFullYear() === year) {
        dates.add(date.toISOString().split('T')[0]);
      }
    });
    return dates.size;
  };

  const grouped: { [key: string]: SalesRecord[] } = {};
  salesData.forEach(record => {
    const vendedor = record.nombre_vendedor;
    const semana = record.numero_semana;
    const año = parseDate(record.fec_emis).getFullYear();
    const key = `${vendedor}__${año}__${semana}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(record);
  });

  // Paso 1: Convertir a array y detectar semanas con menos de 3 días
  let groupedArray = Object.entries(grouped).map(([key, records]) => {
    const [vendedor, año, semana] = key.split('__');
    const totalVentas = records.reduce((sum, r) => sum + r.total_usd, 0);
    const diasUnicos = new Set(records.map(r => r.fec_emis.split('T')[0])).size;
    return {
      key,
      vendedor,
      semana: parseInt(semana),
      año: parseInt(año),
      dias: diasUnicos,
      totalVentas
    };
  });

  // Paso 2: Fusionar semanas con menos de 3 días con la de menor ingreso
  const fusionados: { [key: string]: WeeklyBonus } = {};

  groupedArray.forEach(entry => {
    const { vendedor, semana, año, totalVentas, dias } = entry;
    if (dias >= 3) {
      fusionados[`${vendedor}__${semana}`] = {
        vendedor,
        semana,
        periodo: `Semana ${semana}`,
        totalVentas,
        bonificacion: calcularBono(totalVentas, BONO_ESCALADO),
      };
    }
  });

  // ahora fusionamos las semanas con menos de 3 días con el menor total del mismo vendedor
  const pendientes = groupedArray.filter(e => e.dias < 3);
  pendientes.forEach(pendiente => {
    const { vendedor, semana, totalVentas } = pendiente;

    // buscar la semana existente con menor totalVentas del mismo vendedor
    const candidatas = Object.entries(fusionados)
      .filter(([k, v]) => v.vendedor === vendedor)
      .sort((a, b) => a[1].totalVentas - b[1].totalVentas);

    if (candidatas.length > 0) {
      const [keyMenor, semanaObj] = candidatas[0];
      semanaObj.totalVentas += totalVentas;
      semanaObj.bonificacion = calcularBono(semanaObj.totalVentas, BONO_ESCALADO);
    } else {
      // si no hay ninguna semana válida, igual se agrega sola
      fusionados[`${vendedor}__${semana}`] = {
        vendedor,
        semana,
        periodo: `Semana ${semana}`,
        totalVentas,
        bonificacion: calcularBono(totalVentas, BONO_ESCALADO),
      };
    }
  });

  // Agrupar por vendedor
  const resumenPorVendedor: { [key: string]: VendorSummary } = {};
  Object.values(fusionados).forEach(({ vendedor, totalVentas, bonificacion }) => {
    if (!resumenPorVendedor[vendedor]) {
      resumenPorVendedor[vendedor] = { vendedor, totalVentas: 0, totalBonificaciones: 0 };
    }
    resumenPorVendedor[vendedor].totalVentas += totalVentas;
    resumenPorVendedor[vendedor].totalBonificaciones += bonificacion;
  });

  return {
    weeklyBonuses: Object.values(fusionados),
    vendorSummaries: Object.values(resumenPorVendedor)
  };
}

function calcularBono(monto: number, escalado: { min: number; max: number; bonus: number }[]): number {
  for (const item of escalado) {
    if (monto >= item.min && monto <= item.max) {
      return item.bonus;
    }
  }
  return 0;
}
