export interface SalesRecord {
  id?: string;
  id_documento: string;
  tipo_documento: string;
  doc_num: string;
  fec_emis: string;
  co_ven: string;
  nombre_vendedor: string;
  co_cond: string;
  co_cli: string;
  nombre_cliente: string;
  tipo_venta: string;
  tasa: number;
  co_sucu_in: string;
  nombre_sucursal: string;
  co_art: string;
  des_art: string;
  total_art: number;
  prec_vta: number;
  reng_neto: number;
  monto_imp: number;
  total_usd: number;
  marcas_de_vehiculos: string;
  fecha_formatted: string;
  dia_semana: string;
  numero_semana: number;
  mes: string;
  trimestre: number;
  semestre: number;
  created_at?: string;
}

export interface SalesFilters {
  fechaInicio?: string;
  fechaFin?: string;
  vendedor?: string;
  tienda?: string;
  cliente?: string;
  tipoDocumento?: string;
  tipoVenta?: string;
  marca?: string;
}

export interface SalesAnalytics {
  totalHoy: number;
  totalSemana: number;
  totalMes: number;
  vendedorTop: { nombre: string; total: number };
  tiendaTop: { nombre: string; total: number };
  clienteTop: { nombre: string; total: number };
  marcaTop: { nombre: string; total: number };
  totalPorDia: { fecha: string; total: number }[];
  totalPorSemana: { semana: number; total: number }[];
  totalPorMes: { mes: string; total: number }[];
  totalPorVendedor: { vendedor: string; total: number }[];
  totalPorTienda: { tienda: string; total: number }[];
  totalPorCliente: { cliente: string; total: number }[];
  totalPorMarca: { marca: string; total: number }[];
  totalPorTipoDocumento: { tipo: string; total: number }[];
}