import React, { useState, useMemo } from "react";
import { Users, Filter, Download, Calendar } from "lucide-react";
import { SalesRecord } from "../../types/sales";
import { CommissionVendedorFilters } from "../../types/commissions";
import {
  calculateVendedorCommissions,
  getAvailableWeeks,
} from "../../utils/commissionCalculator";
import { calculateWeeklyBonuses } from "../../utils/commissionCalculator";
import { CommissionResults } from "./CommissionResults";
import { WeeklyCommissionResults } from "./WeeklyCommissionResults";

interface VendedorCommissionsTabProps {
  salesData: SalesRecord[];
  vendedores: string[];
}

export function VendedorCommissionsTab({
  salesData,
  vendedores,
}: VendedorCommissionsTabProps) {
  const [filters, setFilters] = useState<CommissionVendedorFilters>({
    porcentaje: 3,
    semanas: [],
  });

  const [showResults, setShowResults] = useState(false);
  const [viewMode, setViewMode] = useState<"summary" | "weekly">("summary");

  const availableWeeks = useMemo(
    () => getAvailableWeeks(salesData),
    [salesData]
  );

  const commissionData = useMemo(() => {
    if (!showResults) return null;
    return calculateVendedorCommissions(salesData, filters);
  }, [salesData, filters, showResults]);

  const { weeklyBonuses, vendorSummaries } = useMemo(() => {
    if (!showResults) return { weeklyBonuses: [], vendorSummaries: [] };
    return calculateWeeklyBonuses(salesData);
  }, [salesData, showResults]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleWeekToggle = (week: number) => {
    const currentWeeks = filters.semanas || [];
    const newWeeks = currentWeeks.includes(week)
      ? currentWeeks.filter((w) => w !== week)
      : [...currentWeeks, week];

    setFilters({ ...filters, semanas: newWeeks });
  };

  const handleSelectAllWeeks = () => {
    setFilters({ ...filters, semanas: availableWeeks });
  };

  const handleClearWeeks = () => {
    setFilters({ ...filters, semanas: [] });
  };

  const handleExport = () => {
    if (!commissionData) return;

    const csvContent =
      viewMode === "summary"
        ? [
            ["Vendedor", "Total Ventas", "Comisión", "Período"].join(","),
            ...commissionData.summary.resultados.map((result) =>
              [
                result.vendedor,
                result.totalVentas.toFixed(2),
                result.comision.toFixed(2),
                result.periodo,
              ].join(",")
            ),
          ].join("\n")
        : [
            ["Vendedor", "Semana", "Total Ventas", "Comisión"].join(","),
            ...commissionData.weeklyResults.map((result) =>
              [
                result.vendedor,
                result.semana,
                result.totalVentas.toFixed(2),
                result.comision.toFixed(2),
              ].join(",")
            ),
          ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `comisiones_vendedores_${viewMode}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-900 mb-2">
          Comisiones por Vendedor
        </h3>
        <p className="text-green-700">
          Calcula comisiones individuales por vendedor con análisis semanal.
          Ideal para combinar semanas cortas.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Configuración</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.fechaInicio || ""}
              onChange={(e) =>
                setFilters({ ...filters, fechaInicio: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.fechaFin || ""}
              onChange={(e) =>
                setFilters({ ...filters, fechaFin: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vendedor (Opcional)
            </label>
            <div className="h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
              {vendedores.map((vendedor) => (
                <label
                  key={vendedor}
                  className="flex items-center space-x-2 text-sm text-gray-800 mb-1"
                >
                  <input
                    type="checkbox"
                    value={vendedor}
                    checked={filters.vendedores?.includes(vendedor) || false}
                    onChange={(e) => {
                      const selected = new Set(filters.vendedores || []);
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
            </div>
          </div>
        </div>

        {/* Week Selection */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Seleccionar Semanas (Opcional)
            </label>
            <div className="space-x-2">
              <button
                onClick={handleSelectAllWeeks}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Seleccionar Todas
              </button>
              <button
                onClick={handleClearWeeks}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="grid grid-cols-6 md:grid-cols-10 lg:grid-cols-15 gap-2 max-h-32 overflow-y-auto">
            {availableWeeks.map((week) => (
              <button
                key={week}
                onClick={() => handleWeekToggle(week)}
                className={`px-3 py-2 text-sm rounded-md border transition-colors duration-200 ${
                  (filters.semanas || []).includes(week)
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {week}
              </button>
            ))}
          </div>

          {(filters.semanas || []).length > 0 && (
            <p className="text-sm text-gray-600 mt-2">
              Semanas seleccionadas:{" "}
              {(filters.semanas || []).sort((a, b) => a - b).join(", ")}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handleCalculate}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            Calcular Comisiones
          </button>

          {commissionData && (
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("summary")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    viewMode === "summary"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Resumen
                </button>
                <button
                  onClick={() => setViewMode("weekly")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                    viewMode === "weekly"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Por Semana
                </button>
              </div>

              <button
                onClick={handleExport}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      {commissionData && (
        <>
          {viewMode === "summary" ? (
            <CommissionResults
              data={commissionData.summary}
              title="Resumen Comisiones por Vendedor"
              type="vendedor"
            />
          ) : (
            <WeeklyCommissionResults
              data={commissionData.weeklyResults}
              title="Comisiones Semanales por Vendedor"
            />
          )}
        </>
      )}
    </div>
  );
}
