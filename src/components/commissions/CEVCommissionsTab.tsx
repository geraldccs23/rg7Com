import React, { useState, useMemo } from 'react';
import { DollarSign, Filter, Download, Eye, EyeOff } from 'lucide-react';
import { SalesRecord } from '../../types/sales';
import { CommissionCEVFilters } from '../../types/commissions';
import { calculateCEVCommissions } from '../../utils/commissionCalculator';
import { CommissionResults } from './CommissionResults';

interface CEVCommissionsTabProps {
  salesData: SalesRecord[];
  vendedores: string[];
}

export function CEVCommissionsTab({ salesData, vendedores }: CEVCommissionsTabProps) {
  const [filters, setFilters] = useState<CommissionCEVFilters>({
    porcentaje: 5,
    excluirMercadoLibre: true,
    excluirMotoSiete: true
  });

  const [showResults, setShowResults] = useState(false);

  const commissionData = useMemo(() => {
    if (!showResults) return null;
    return calculateCEVCommissions(salesData, filters);
  }, [salesData, filters, showResults]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleExport = () => {
    if (!commissionData) return;
    
    const csvContent = [
      ['Vendedor', 'Total Ventas', 'Comisión', 'Período'].join(','),
      ...commissionData.resultados.map(result => [
        result.vendedor,
        result.totalVentas.toFixed(2),
        result.comision.toFixed(2),
        result.periodo
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `comisiones_cev_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Comisiones CEV</h3>
        <p className="text-blue-700">
          Calcula comisiones sobre el total de ventas con opciones para excluir Mercado Libre y el vendedor Moto Siete.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Filter className="w-5 h-5 text-gray-600 mr-2" />
          <h4 className="text-lg font-medium text-gray-900">Configuración</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filters.fechaInicio || ''}
              onChange={(e) => setFilters({ ...filters, fechaInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filters.fechaFin || ''}
              onChange={(e) => setFilters({ ...filters, fechaFin: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porcentaje de Comisión (%)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={filters.porcentaje}
              onChange={(e) => setFilters({ ...filters, porcentaje: parseFloat(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Exclusiones
            </label>
            
            <div className="flex items-center">
              <button
                onClick={() => setFilters({ ...filters, excluirMercadoLibre: !filters.excluirMercadoLibre })}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filters.excluirMercadoLibre
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}
              >
                {filters.excluirMercadoLibre ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Mercado Libre
              </button>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setFilters({ ...filters, excluirMotoSiete: !filters.excluirMotoSiete })}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  filters.excluirMotoSiete
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-green-100 text-green-800 border border-green-200'
                }`}
              >
                {filters.excluirMotoSiete ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                Moto Siete
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleCalculate}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <DollarSign className="w-5 h-5 mr-2" />
            Calcular Comisiones
          </button>

          {commissionData && (
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {commissionData && (
        <CommissionResults 
          data={commissionData} 
          title="Resultados Comisiones CEV"
          type="cev"
        />
      )}
    </div>
  );
}