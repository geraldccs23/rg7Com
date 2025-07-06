import React from 'react';
import { Database, Upload, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface DatabaseSectionProps {
  onSaveToDatabase: () => void;
  onLoadFromDatabase: () => void;
  onClearDatabase: () => void;
  loading: boolean;
  hasData: boolean;
  recordCount: number;
}

export function DatabaseSection({
  onSaveToDatabase,
  onLoadFromDatabase,
  onClearDatabase,
  loading,
  hasData,
  recordCount
}: DatabaseSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center mb-4">
        <Database className="w-5 h-5 text-blue-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Base de Datos</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            {hasData ? (
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            )}
            <span className="text-sm text-gray-600">
              {hasData ? `${recordCount} registros cargados` : 'Sin datos cargados'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={onSaveToDatabase}
            disabled={loading || !hasData}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Upload className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>

          <button
            onClick={onLoadFromDatabase}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Database className="w-4 h-4 mr-2" />
            {loading ? 'Cargando...' : 'Cargar'}
          </button>

          <button
            onClick={onClearDatabase}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {loading ? 'Limpiando...' : 'Limpiar'}
          </button>
        </div>
      </div>
    </div>
  );
}