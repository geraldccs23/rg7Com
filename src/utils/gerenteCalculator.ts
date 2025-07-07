import { SalesRecord } from "../types/sales";
import { parseDate, formatDate } from "./dateUtils";
import { GerenteResult, GerenteCommissionSummary } from "../types/commissions";

export function calculateGerenteCommissions(
  records: SalesRecord[],
  fechaInicio?: string,
  fechaFin?: string
): GerenteCommissionSummary {
  const agrupadoPorDia: Record<string, number> = {};

  records.forEach((record) => {
    const fecha = formatDate(parseDate(record.fec_emis));
    const dateObj = parseDate(record.fec_emis);

    if (fechaInicio && dateObj < parseDate(fechaInicio)) return;
    if (fechaFin && dateObj > parseDate(fechaFin)) return;

    agrupadoPorDia[fecha] = (agrupadoPorDia[fecha] || 0) + record.total_usd;
  });

  const resultados: GerenteResult[] = Object.entries(agrupadoPorDia)
    .map(([fecha, totalVentas]) => {
      let comision = 0;

      if (totalVentas >= 3000 && totalVentas < 4000) comision = 15;
      else if (totalVentas >= 4000 && totalVentas < 5000)
        comision = Math.floor(totalVentas / 4000) * 20;
      else if (totalVentas >= 5000) comision = 30;

      return { fecha, totalVentas, comision };
    })
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const totalVentas = resultados.reduce((acc, r) => acc + r.totalVentas, 0);
  const totalComisiones = resultados.reduce((acc, r) => acc + r.comision, 0);

  return {
    totalVentas,
    totalComisiones,
    resultados,
  };
}
