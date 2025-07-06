import React, { useState, useMemo } from 'react';
import { Car, Filter, Download } from 'lucide-react';
import { SalesRecord } from '../../types/sales';
import { CommissionVWFilters } from '../../types/commissions';
import { calculateVWCommissions } from '../../utils/commissionCalculator';
import { CommissionResults } from './CommissionResults';

interface VWCommissionsTabProps {
  salesData: SalesRecord[];
  vendedores: string[];
}

export function VWCommissionsTab({ salesData, vendedores }: VWCommissionsTabProps) {
  const [filters, setFilters] = useState<CommissionVWFilters>({
    porcentaje: 2
  });

  const [showResults, setShowResults] = useState(false);

  const commissionData = useMemo(() => {
    if (!showResults) return null;
    return calculateVWCommissions(salesData, filters);
  }, [salesData, filters, showResults]);

  const vwSalesCount = useMemo(() => {
    return salesData.filter(record => 
      record.marcas_de_vehiculos.toLowerCase().includes('volkswagen') ||
      record.marcas_de_vehiculos.toLowerCase().includes('vw')
    ).length;
  }, [salesData]);

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleExport = () => {
    if (!commissionData) return;
    
    const csvContent = [
      ['Vendedor', 'Total Ventas VW', 'Comisión', 'Período'].join(','),
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
    link.download = `comisiones_vw_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-6">
      {/* Description */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Comisiones Volkswagen</h3>
        <p className="text-purple-700 mb-2">
          Comisiones específicas para ventas de la marca Volkswagen.
        </p>
        <p className="text-sm text-purple-600">
          Registros VW encontrados: <span className="font-semibold">{vwSalesCount}</span>
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
            Vendedores (multi selección)
          </label>
          <div className="h-48 overflow-y-auto border border-gray-300 rounded-md p-2 bg-white">
          {vendedores.map(vendedor => (
            <label key={vendedor} className="flex items-center space-x-2 text-sm text-gray-800 mb-1">
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
                  setFilters({ ...filters, vendedores: Array.from(selected) });
                }}
                className="accent-purple-600"
              />
              <span>{vendedor}</span>
            </label>
          ))}
          </div>
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
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handleCalculate}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <Car className="w-5 h-5 mr-2" />
            Calcular Comisiones VW
          </button>

          {commissionData && (
            <button
              onClick={handleExport}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
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
          title="Resultados Comisiones Volkswagen"
          type="vw"
        />
      )}
    </div>
  );
}