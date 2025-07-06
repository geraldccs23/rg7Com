import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { SalesAnalytics } from '../types/sales';

interface ChartsSectionProps {
  analytics: SalesAnalytics;
}

export function ChartsSection({ analytics }: ChartsSectionProps) {
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899', '#14B8A6'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const topVendedores = analytics.totalPorVendedor
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const topTiendas = analytics.totalPorTienda
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  const topClientes = analytics.totalPorCliente
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  const topMarcas = analytics.totalPorMarca
    .filter(item => item.marca && item.marca !== '')
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Vendedores</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topVendedores}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="vendedor" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Sucursal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topTiendas}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ tienda, percent }) => `${tienda} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total"
            >
              {topTiendas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Clientes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topClientes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="cliente" 
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Marca</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topMarcas}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ marca, percent }) => `${marca} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="total"
            >
              {topMarcas.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ventas por Mes</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analytics.totalPorMes}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={formatCurrency} />
            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
            <Bar dataKey="total" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}