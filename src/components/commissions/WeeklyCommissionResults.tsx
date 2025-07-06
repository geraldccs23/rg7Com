import React from 'react';
import { Calendar, DollarSign } from 'lucide-react';
import { WeeklyCommissionResult } from '../../types/commissions';

interface WeeklyCommissionResultsProps {
  data: WeeklyCommissionResult[];
  title: string;
}

export function WeeklyCommissionResults({ data, title }: WeeklyCommissionResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Group by vendor
  const groupedByVendor = data.reduce((acc, result) => {
    if (!acc[result.vendedor]) {
      acc[result.vendedor] = [];
    }
    acc[result.vendedor].push(result);
    return acc;
  }, {} as { [vendedor: string]: WeeklyCommissionResult[] });

  const totalVentas = data.reduce((sum, result) => sum + result.totalVentas, 0);
  const totalComisiones = data.reduce((sum, result) => sum + result.comision, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-xl font-bold text-green-900 mb-4">{title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <DollarSign className="w-5 h-5 text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-600">Total Ventas</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalVentas)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center mb-2">
              <Calendar className="w-5 h-5 text-green-500 mr-2" />
              <h4 className="text-sm font-medium text-gray-600">Total Comisiones</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalComisiones)}</p>
          </div>
        </div>
      </div>

      {/* Weekly Results by Vendor */}
      <div className="space-y-6">
        {Object.entries(groupedByVendor).map(([vendedor, results]) => {
          const vendorTotal = results.reduce((sum, r) => sum + r.totalVentas, 0);
          const vendorCommission = results.reduce((sum, r) => sum + r.comision, 0);
          
          return (
            <div key={vendedor} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-gray-900">{vendedor}</h4>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Total: {formatCurrency(vendorTotal)}</p>
                    <p className="text-sm font-semibold text-green-600">Comisión: {formatCurrency(vendorCommission)}</p>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semana
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ventas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comisión
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % del Vendedor
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results
                      .sort((a, b) => a.semana - b.semana)
                      .map((result, index) => {
                        const percentage = (result.totalVentas / vendorTotal) * 100;
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              Semana {result.semana}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(result.totalVentas)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                              {formatCurrency(result.comision)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {percentage.toFixed(1)}%
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Agrupar por semana
/*const groupedBySemana = data.reduce((acc, curr) => {
  if (!acc[curr.semana]) acc[curr.semana] = [];
  acc[curr.semana].push(curr);
  return acc;
}, {} as Record<string, typeof data>);*/

// Calcular bonificaciones por semana
/*const weeklyBonuses = Object.entries(groupedBySemana).map(([semana, registros]) => {
  const totalVentas = registros.reduce((sum, r) => sum + r.totalVentas, 0);
  const bono = totalVentas >= 4000 ? totalVentas * 0.005 : 0;
  return {
    semana,
    totalVentas,
    bono,
  };
});*/