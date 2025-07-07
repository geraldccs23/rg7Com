import React, { useState, useMemo } from "react";
import { SalesRecord } from "../../types/sales";
import { calculateGerenteCommissions } from "../../utils/gerenteCalculator";
import { DollarSign, Download } from "lucide-react";
import { GerenteCommissionSummary } from "../../types/commissions";

interface GerenteGeneralTabProps {
  salesData: SalesRecord[];
  vendedores: string[];
}

export function GerenteGeneralTab({
  salesData,
  vendedores,
}: GerenteGeneralTabProps) {
  const [filters, setFilters] = useState<{
    fechaInicio: string;
    fechaFin: string;
    vendedores: string[];
  }>({
    fechaInicio: "",
    fechaFin: "",
    vendedores: [],
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);

  const commissionResults = useMemo<GerenteCommissionSummary>(() => {
    if (!mostrarResultados) {
      return {
        totalVentas: 0,
        totalComisiones: 0,
        resultados: [],
      };
    }

    const dataFiltrada = salesData.filter((r) => {
      const fecha = r.fec_emis;
      if (!r.nombre_vendedor) return false;
      if (filters.fechaInicio && fecha < filters.fechaInicio) return false;
      if (filters.fechaFin && fecha > filters.fechaFin) return false;
      if (
        filters.vendedores.length > 0 &&
        !filters.vendedores.includes(r.nombre_vendedor)
      )
        return false;
      return true;
    });

    return calculateGerenteCommissions(dataFiltrada);
  }, [salesData, filters, mostrarResultados]);

  const handleExport = () => {
    if (!commissionResults) return;

    const csv = [
      ["Fecha", "Total Ventas", "Comisión"],
      ...commissionResults.resultados.map((r) => [
        r.fecha,
        r.totalVentas,
        r.comision,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comisiones-gerente-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
  };

  const totalVentas = commissionResults.totalVentas;
  const totalComisiones = commissionResults.totalComisiones;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-gray-50 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Comisiones de Gerente General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.fechaInicio}
              onChange={(e) =>
                setFilters({ ...filters, fechaInicio: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.fechaFin}
              onChange={(e) =>
                setFilters({ ...filters, fechaFin: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          {/* <div className="h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white mb-4">
            {vendedores.map((vendedor) => (
              <label
                key={vendedor}
                className="flex items-center space-x-2 text-sm text-gray-800 mb-1"
              >
                <input
                  type="checkbox"
                  value={vendedor}
                  checked={filters.vendedores.includes(vendedor)}
                  onChange={(e) => {
                    const selected = new Set(filters.vendedores);
                    if (e.target.checked) {
                      selected.add(vendedor);
                    } else {
                      selected.delete(vendedor);
                    }
                    setFilters({
                      ...filters,
                      vendedores: Array.from(selected),
                    });
                  }}
                  className="accent-purple-600"
                />
                <span>{vendedor}</span>
              </label>
            ))}
          </div>*/}
          <div className="flex items-end">
            <button
              onClick={() => setMostrarResultados(true)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <DollarSign className="inline w-4 h-4 mr-2" />
              Calcular Comisiones
            </button>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {Array.isArray(commissionResults.resultados) &&
        commissionResults.resultados.length > 0 && (
          <div className="space-y-6">
            {/* Totales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                <h4 className="text-sm text-gray-500 mb-1">Total Ventas</h4>
                <p className="text-xl font-bold text-gray-800">
                  ${totalVentas.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                <h4 className="text-sm text-gray-500 mb-1">Total Comisiones</h4>
                <p className="text-xl font-bold text-green-600">
                  ${totalComisiones.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow border border-gray-100">
                <h4 className="text-sm text-gray-500 mb-1">Porcentaje</h4>
                <p className="text-xl font-bold text-blue-600">5%</p>
              </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Fecha
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Total Ventas
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                      Comisión
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {commissionResults.resultados.map((r) => (
                    <tr key={r.fecha}>
                      <td className="px-4 py-2">{r.fecha}</td>
                      <td className="px-4 py-2">${r.totalVentas.toFixed(2)}</td>
                      <td className="px-4 py-2 text-green-600 font-medium">
                        ${r.comision.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Botón exportar */}
            <div className="flex justify-end">
              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
