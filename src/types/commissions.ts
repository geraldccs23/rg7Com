export interface CommissionFilters {
  fechaInicio?: string;
  fechaFin?: string;
  vendedor?: string;
  semanas?: number[];
  porcentaje: number;
}

export interface CommissionCEVFilters extends CommissionFilters {
  excluirMercadoLibre: boolean;
  excluirMotoSiete: boolean;
}

export interface CommissionVWFilters extends CommissionFilters {
  // Específico para VW
}

export interface CommissionVendedorFilters extends CommissionFilters {
  // Específico para vendedores
}

export interface CommissionResult {
  vendedor: string;
  totalVentas: number;
  comision: number;
  periodo: string;
}

export interface WeeklyCommissionResult extends CommissionResult {
  semana: number;
  año: number;
}

export interface CommissionSummary {
  totalVentas: number;
  totalComisiones: number;
  porcentaje: number;
  resultados: CommissionResult[];
}