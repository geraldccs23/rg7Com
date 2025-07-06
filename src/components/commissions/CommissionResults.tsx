import React from 'react';
import { DollarSign, TrendingUp, Users } from 'lucide-react';
import { CommissionSummary } from '../../types/commissions';

interface CommissionResultsProps {
  data: CommissionSummary;
  title: string;
  type: 'cev' | 'vendedor' | 'vw';
}

export function CommissionResults({ data, title, type }: CommissionResultsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const getColorScheme = () => {
    switch (type) {
      case 'cev':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-900',
          accent: 'bg-blue-500'
        };
      case 'vendedor':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-900',
          accent: 'bg-green-500'
        };
      case 'vw':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-900',
          accent: 'bg-purple-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-900',
          accent: 'bg-gray-500'
        };
    }
  };

  const colors = getColorScheme();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className={`${colors.bg} ${colors.border} border rounded-lg p-6`}>
        <h3 className={`text-xl font-bold ${colors.text} mb-6`}>{title}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`${colors.accent} rounded-lg p-2`}>
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-600">Total Ventas</h4>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalVentas)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`${colors.accent} rounded-lg p-2`}>
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-600">Total Comisiones</h4>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalComisiones)}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`${colors.accent} rounded-lg p-2`}>
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
            <h4 className="text-sm font-medium text-gray-600">Porcentaje</h4>
            <p className="text-2xl font-bold text-gray-900">{data.porcentaje}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="text-lg font-semibold text-gray-900">Detalle por Vendedor</h4>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Ventas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comisión
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  % del Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.resultados
                .sort((a, b) => b.comision - a.comision)
                .map((result, index) => {
                  const percentage = (result.totalVentas / data.totalVentas) * 100;
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {result.vendedor}
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
    </div>
  );
}