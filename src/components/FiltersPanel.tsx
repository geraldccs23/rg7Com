import React from 'react';
import { Filter, X } from 'lucide-react';
import { SalesFilters } from '../types/sales';

interface FiltersPanelProps {
  filters: SalesFilters;
  onFiltersChange: (filters: SalesFilters) => void;
  vendedores: string[];
  tiendas: string[];
  clientes: string[];
  marcas: string[];
  tiposDocumento: string[];
  tiposVenta: string[];
  onClearFilters: () => void;
}

export function FiltersPanel({ 
  filters, 
  onFiltersChange, 
  vendedores, 
  tiendas,
  clientes,
  marcas,
  tiposDocumento,
  tiposVenta,
  onClearFilters 
}: FiltersPanelProps) {
  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Filter className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center px-3 py-1 text-sm text-red-600 hover:text-red-700 transition-colors duration-200"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filters.fechaInicio || ''}
            onChange={(e) => onFiltersChange({ ...filters, fechaInicio: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filters.fechaFin || ''}
            onChange={(e) => onFiltersChange({ ...filters, fechaFin: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vendedor
          </label>
          <select
            value={filters.vendedor || ''}
            onChange={(e) => onFiltersChange({ ...filters, vendedor: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los vendedores</option>
            {vendedores.map(vendedor => (
              <option key={vendedor} value={vendedor}>{vendedor}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sucursal
          </label>
          <select
            value={filters.tienda || ''}
            onChange={(e) => onFiltersChange({ ...filters, tienda: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las sucursales</option>
            {tiendas.map(tienda => (
              <option key={tienda} value={tienda}>{tienda}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente
          </label>
          <select
            value={filters.cliente || ''}
            onChange={(e) => onFiltersChange({ ...filters, cliente: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los clientes</option>
            {clientes.slice(0, 50).map(cliente => (
              <option key={cliente} value={cliente}>{cliente}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca
          </label>
          <select
            value={filters.marca || ''}
            onChange={(e) => onFiltersChange({ ...filters, marca: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todas las marcas</option>
            {marcas.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo Documento
          </label>
          <select
            value={filters.tipoDocumento || ''}
            onChange={(e) => onFiltersChange({ ...filters, tipoDocumento: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            {tiposDocumento.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo Venta
          </label>
          <select
            value={filters.tipoVenta || ''}
            onChange={(e) => onFiltersChange({ ...filters, tipoVenta: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos los tipos</option>
            {tiposVenta.map(tipo => (
              <option key={tipo} value={tipo}>{tipo}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}