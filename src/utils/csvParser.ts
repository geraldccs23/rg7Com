import { SalesRecord } from '../types/sales';
import { parseDate, formatDate, getDayOfWeek, getWeekNumber, getMonthName, getQuarter, getSemester } from './dateUtils';

export function parseCsvFile(csvContent: string): SalesRecord[] {
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(/[\t,;]/).map(h => h.trim());
  
  const records: SalesRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    
    if (values.length >= 4) {
      const record: any = {};
      
      // Map headers to values
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      
      // Parse date and create additional fields
      const date = parseDate(record.fec_emis);
      
      const salesRecord: SalesRecord = {
        id_documento: record.id_documento || '',
        tipo_documento: record.tipo_documento || '',
        doc_num: record.doc_num || '',
        fec_emis: record.fec_emis || '',
        co_ven: record.co_ven || '',
        nombre_vendedor: record.nombre_vendedor || '',
        co_cond: record.co_cond || '',
        co_cli: record.co_cli || '',
        nombre_cliente: record.nombre_cliente || '',
        tipo_venta: record.tipo_venta || '',
        tasa: parseFloat(record.tasa) || 0,
        co_sucu_in: record.co_sucu_in || '',
        nombre_sucursal: record.nombre_sucursal || '',
        co_art: record.co_art || '',
        des_art: record.des_art || '',
        total_art: parseFloat(record.total_art) || 0,
        prec_vta: parseFloat(record.prec_vta) || 0,
        reng_neto: parseFloat(record.reng_neto) || 0,
        monto_imp: parseFloat(record.monto_imp) || 0,
        total_usd: parseFloat(record.total_usd) || 0,
        marcas_de_vehiculos: record['Marcas de Vehiculos'] || record.marcas_de_vehiculos || '',
        fecha_formatted: formatDate(date),
        dia_semana: getDayOfWeek(date),
        numero_semana: getWeekNumber(date),
        mes: getMonthName(date),
        trimestre: getQuarter(date),
        semestre: getSemester(date),
      };
      
      records.push(salesRecord);
    }
  }
  
  return records;
}

export function validateCsvHeaders(csvContent: string): boolean {
  const lines = csvContent.trim().split('\n');
  if (lines.length < 2) return false;
  
  const headers = lines[0].split('\t').map(h => h.trim().toLowerCase());
  const requiredHeaders = ['fec_emis', 'nombre_vendedor', 'nombre_sucursal', 'total_usd'];
  
  return requiredHeaders.every(header => headers.includes(header));
}

export function generateSampleCsv(): string {
  const sampleData = [
    [
      'id_documento', 'tipo_documento', 'doc_num', 'fec_emis', 'co_ven', 'nombre_vendedor',
      'co_cond', 'co_cli', 'nombre_cliente', 'tipo_venta', 'tasa', 'co_sucu_in',
      'nombre_sucursal', 'co_art', 'des_art', 'total_art', 'prec_vta', 'reng_neto',
      'monto_imp', 'total_usd', 'Marcas de Vehiculos'
    ],
    [
      'FAC001', 'FACTURA', 'F-2024-001', '2024-01-15', 'V001', 'Juan Pérez',
      'CONTADO', 'C001', 'AutoDealer Central', 'DIRECTA', '1.00', 'S001',
      'Sucursal Centro', 'ART001', 'Aceite Motor 5W30', '2', '45.50', '91.00',
      '14.56', '105.56', 'Toyota'
    ],
    [
      'FAC002', 'FACTURA', 'F-2024-002', '2024-01-16', 'V002', 'María García',
      'CREDITO', 'C002', 'Repuestos Norte SA', 'MAYORISTA', '1.00', 'S002',
      'Sucursal Norte', 'ART002', 'Filtro de Aire', '5', '28.75', '143.75',
      '23.00', '166.75', 'Honda'
    ],
    [
      'FAC003', 'FACTURA', 'F-2024-003', '2024-01-17', 'V003', 'Carlos López',
      'CONTADO', 'C003', 'Taller Mecánico Sur', 'DIRECTA', '1.00', 'S003',
      'Sucursal Sur', 'ART003', 'Pastillas de Freno', '1', '85.00', '85.00',
      '13.60', '98.60', 'Ford'
    ],
    [
      'FAC004', 'FACTURA', 'F-2024-004', '2024-01-18', 'V001', 'Juan Pérez',
      'CREDITO', 'C004', 'AutoPartes Express', 'MAYORISTA', '1.00', 'S001',
      'Sucursal Centro', 'ART004', 'Batería 12V', '3', '120.00', '360.00',
      '57.60', '417.60', 'Chevrolet'
    ],
    [
      'FAC005', 'FACTURA', 'F-2024-005', '2024-01-19', 'V004', 'Ana Rodríguez',
      'CONTADO', 'C005', 'Lubricantes del Este', 'DIRECTA', '1.00', 'S002',
      'Sucursal Norte', 'ART005', 'Llanta 195/65R15', '4', '95.25', '381.00',
      '60.96', '441.96', 'Nissan'
    ],
    [
      'FAC006', 'FACTURA', 'F-2024-006', '2024-01-20', 'V002', 'María García',
      'CONTADO', 'C006', 'Servicios Automotrices', 'DIRECTA', '1.00', 'S003',
      'Sucursal Sur', 'ART006', 'Amortiguador Delantero', '2', '150.00', '300.00',
      '48.00', '348.00', 'Hyundai'
    ]
  ];
  
  return sampleData.map(row => row.join('\t')).join('\n');
}