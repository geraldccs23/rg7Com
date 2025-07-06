import React from "react";
import { SalesRecord } from "../../types/sales";

interface GerenteGeneralTabProps {
  salesData: SalesRecord[];
}

export function GerenteGeneralTab({ salesData }: GerenteGeneralTabProps) {
  // Aquí vendrá la lógica de comisiones de la gerente
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Comisiones de Gerente General
      </h3>
      <p className="text-gray-600">
        Aquí se mostrarán las comisiones totales, sin filtrar por vendedor.
      </p>
      {/* Aquí agregaremos la lógica de cálculo y tabla más adelante */}
      <pre className="text-sm bg-gray-100 p-4 rounded">
        {JSON.stringify(salesData.slice(0, 5), null, 2)}
      </pre>
    </div>
  );
}
