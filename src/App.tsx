// App.tsx
import React, { useState, useMemo, createContext, useContext } from 'react';
import { BarChart3, AlertCircle, CheckCircle, Calculator, Settings, LogOut } from 'lucide-react';
import { SalesRecord, SalesFilters } from './types/sales';
import { FileUpload } from './components/FileUpload';
import { FiltersPanel } from './components/FiltersPanel';
import { DashboardCards } from './components/DashboardCards';
import { ChartsSection } from './components/ChartsSection';
import { DatabaseSection } from './components/DatabaseSection';
import { CommissionsPage } from './components/CommissionsPage';
import { SettingsPage } from './components/settings/SettingsPage';
import { parseCsvFile, validateCsvHeaders, generateSampleCsv } from './utils/csvParser';
import { calculateAnalytics, getUniqueValues } from './utils/analyticsCalculator';
import { insertSalesRecords, fetchSalesRecords, deleteSalesRecords } from './lib/supabase';

// 🚨 IGNORAMOS LOGIN
const user = {
  full_name: 'Desarrollador Dev',
  role: 'super_admin',
  email: 'dev@localhost'
};
const signOut = () => console.log('Sesión cerrada (fake)');

type PageType = 'dashboard' | 'commissions' | 'settings';

function AppContent() {
  const [salesData, setSalesData] = useState<SalesRecord[]>([]);
  const [filters, setFilters] = useState<SalesFilters>({});
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = async (content: string, fileName: string) => {
    setLoading(true);
    try {
      if (!validateCsvHeaders(content)) {
        throw new Error('El archivo no contiene las columnas requeridas');
      }

      const records = parseCsvFile(content);
      setSalesData(records);
      showNotification('success', `Archivo "${fileName}" cargado exitosamente. ${records.length} registros procesados.`);
    } catch (error) {
      showNotification('error', error instanceof Error ? error.message : 'Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const csvContent = generateSampleCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ejemplo_ventas.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const handleSaveToDatabase = async () => {
    if (salesData.length === 0) {
      showNotification('error', 'No hay datos para guardar');
      return;
    }

    setLoading(true);
    try {
      const result = await insertSalesRecords(salesData);
      if (result.success) {
        showNotification('success', 'Datos guardados exitosamente en la base de datos');
      } else {
        showNotification('error', result.error || 'Error al guardar los datos');
      }
    } catch (error) {
      showNotification('error', 'Error de conexión con la base de datos');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFromDatabase = async () => {
    setLoading(true);
    try {
      const records = await fetchSalesRecords();
      setSalesData(records);
      showNotification('success', `${records.length} registros cargados desde la base de datos`);
    } catch (error) {
      showNotification('error', 'Error al cargar los datos desde la base de datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClearDatabase = async () => {
    if (!window.confirm('¿Estás seguro de que deseas limpiar todos los datos de la base de datos?')) return;

    setLoading(true);
    try {
      const result = await deleteSalesRecords();
      if (result.success) {
        showNotification('success', 'Base de datos limpiada exitosamente');
      } else {
        showNotification('error', result.error || 'Error al limpiar la base de datos');
      }
    } catch (error) {
      showNotification('error', 'Error de conexión con la base de datos');
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = () => setFilters({});

  const analytics = useMemo(() => calculateAnalytics(salesData, filters), [salesData, filters]);
  const vendedores = useMemo(() => getUniqueValues(salesData, 'nombre_vendedor'), [salesData]);
  const tiendas = useMemo(() => getUniqueValues(salesData, 'nombre_sucursal'), [salesData]);
  const clientes = useMemo(() => getUniqueValues(salesData, 'nombre_cliente'), [salesData]);
  const marcas = useMemo(() => getUniqueValues(salesData, 'marcas_de_vehiculos'), [salesData]);
  const tiposDocumento = useMemo(() => getUniqueValues(salesData, 'tipo_documento'), [salesData]);
  const tiposVenta = useMemo(() => getUniqueValues(salesData, 'tipo_venta'), [salesData]);

  const navigationItems = [
    { id: 'dashboard' as PageType, name: 'Dashboard', icon: BarChart3 },
    { id: 'commissions' as PageType, name: 'Comisiones', icon: Calculator },
    ...(user?.role === 'super_admin' ? [{ id: 'settings' as PageType, name: 'Configuración', icon: Settings }] : [])
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas Automotriz</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              {navigationItems.map(({ id, name, icon: Icon }) => (
                <button key={id} onClick={() => setCurrentPage(id)} className="text-sm">
                  <Icon className="inline w-4 h-4 mr-1" /> {name}
                </button>
              ))}
              <button onClick={signOut} className="text-gray-600 hover:text-gray-900">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className={`p-4 rounded-lg shadow-lg ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FileUpload onFileUpload={handleFileUpload} onDownloadSample={handleDownloadSample} loading={loading} />
              <DatabaseSection
                onSaveToDatabase={handleSaveToDatabase}
                onLoadFromDatabase={handleLoadFromDatabase}
                onClearDatabase={handleClearDatabase}
                loading={loading}
                hasData={salesData.length > 0}
                recordCount={salesData.length}
              />
            </div>

            {salesData.length > 0 && (
              <>
                <FiltersPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  vendedores={vendedores}
                  tiendas={tiendas}
                  clientes={clientes}
                  marcas={marcas}
                  tiposDocumento={tiposDocumento}
                  tiposVenta={tiposVenta}
                  onClearFilters={handleClearFilters}
                />
                <DashboardCards analytics={analytics} />
                <ChartsSection analytics={analytics} />
              </>
            )}
          </>
        )}

        {currentPage === 'commissions' && <CommissionsPage salesData={salesData} />}
        {currentPage === 'settings' && <SettingsPage />}
      </div>
    </div>
  );
}

export default AppContent;
