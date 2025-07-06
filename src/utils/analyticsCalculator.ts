import { SalesRecord, SalesFilters, SalesAnalytics } from '../types/sales';
import { parseDate, isToday, isThisWeek, isThisMonth } from './dateUtils';

export function calculateAnalytics(records: SalesRecord[], filters?: SalesFilters): SalesAnalytics {
  // Apply filters
  let filteredRecords = records;
  
  if (filters) {
    filteredRecords = records.filter(record => {
      const recordDate = parseDate(record.fec_emis);
      
      if (filters.fechaInicio && recordDate < parseDate(filters.fechaInicio)) {
        return false;
      }
      
      if (filters.fechaFin && recordDate > parseDate(filters.fechaFin)) {
        return false;
      }
      
      if (filters.vendedor && record.nombre_vendedor !== filters.vendedor) {
        return false;
      }
      
      if (filters.tienda && record.nombre_sucursal !== filters.tienda) {
        return false;
      }
      
      if (filters.cliente && record.nombre_cliente !== filters.cliente) {
        return false;
      }
      
      if (filters.tipoDocumento && record.tipo_documento !== filters.tipoDocumento) {
        return false;
      }
      
      if (filters.tipoVenta && record.tipo_venta !== filters.tipoVenta) {
        return false;
      }
      
      if (filters.marca && record.marcas_de_vehiculos !== filters.marca) {
        return false;
      }
      
      return true;
    });
  }
  
  // Calculate totals
  const totalHoy = filteredRecords
    .filter(record => isToday(parseDate(record.fec_emis)))
    .reduce((sum, record) => sum + record.total_usd, 0);
  
  const totalSemana = filteredRecords
    .filter(record => isThisWeek(parseDate(record.fec_emis)))
    .reduce((sum, record) => sum + record.total_usd, 0);
  
  const totalMes = filteredRecords
    .filter(record => isThisMonth(parseDate(record.fec_emis)))
    .reduce((sum, record) => sum + record.total_usd, 0);
  
  // Calculate totals by dimension
  const totalPorDia = calculateTotalsByDimension(filteredRecords, 'fecha_formatted');
  const totalPorSemana = calculateTotalsByDimension(filteredRecords, 'numero_semana');
  const totalPorMes = calculateTotalsByDimension(filteredRecords, 'mes');
  const totalPorVendedor = calculateTotalsByDimension(filteredRecords, 'nombre_vendedor');
  const totalPorTienda = calculateTotalsByDimension(filteredRecords, 'nombre_sucursal');
  const totalPorCliente = calculateTotalsByDimension(filteredRecords, 'nombre_cliente');
  const totalPorMarca = calculateTotalsByDimension(filteredRecords, 'marcas_de_vehiculos');
  const totalPorTipoDocumento = calculateTotalsByDimension(filteredRecords, 'tipo_documento');
  
  // Find top performers
  const vendedorTop = totalPorVendedor.reduce((max, curr) => 
    curr.total > max.total ? { nombre: curr.nombre_vendedor, total: curr.total } : max,
    { nombre: '', total: 0 }
  );
  
  const tiendaTop = totalPorTienda.reduce((max, curr) => 
    curr.total > max.total ? { nombre: curr.nombre_sucursal, total: curr.total } : max,
    { nombre: '', total: 0 }
  );
  
  const clienteTop = totalPorCliente.reduce((max, curr) => 
    curr.total > max.total ? { nombre: curr.nombre_cliente, total: curr.total } : max,
    { nombre: '', total: 0 }
  );
  
  const marcaTop = totalPorMarca.reduce((max, curr) => 
    curr.total > max.total ? { nombre: curr.marcas_de_vehiculos, total: curr.total } : max,
    { nombre: '', total: 0 }
  );
  
  return {
    totalHoy,
    totalSemana,
    totalMes,
    vendedorTop,
    tiendaTop,
    clienteTop,
    marcaTop,
    totalPorDia: totalPorDia.map(item => ({ fecha: item.fecha_formatted, total: item.total })),
    totalPorSemana: totalPorSemana.map(item => ({ semana: item.numero_semana, total: item.total })),
    totalPorMes: totalPorMes.map(item => ({ mes: item.mes, total: item.total })),
    totalPorVendedor: totalPorVendedor.map(item => ({ vendedor: item.nombre_vendedor, total: item.total })),
    totalPorTienda: totalPorTienda.map(item => ({ tienda: item.nombre_sucursal, total: item.total })),
    totalPorCliente: totalPorCliente.map(item => ({ cliente: item.nombre_cliente, total: item.total })),
    totalPorMarca: totalPorMarca.map(item => ({ marca: item.marcas_de_vehiculos, total: item.total })),
    totalPorTipoDocumento: totalPorTipoDocumento.map(item => ({ tipo: item.tipo_documento, total: item.total })),
  };
}

function calculateTotalsByDimension(records: SalesRecord[], dimension: keyof SalesRecord): any[] {
  const totals: { [key: string]: number } = {};
  
  records.forEach(record => {
    const key = String(record[dimension]);
    if (key && key !== '') {
      totals[key] = (totals[key] || 0) + record.total_usd;
    }
  });
  
  return Object.entries(totals).map(([key, total]) => ({
    [dimension]: key,
    total,
  }));
}

export function getUniqueValues(records: SalesRecord[], field: keyof SalesRecord): string[] {
  const unique = new Set(records.map(record => String(record[field])).filter(value => value && value !== ''));
  return Array.from(unique).sort();
}