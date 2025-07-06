import React, { useState, useMemo } from "react";
import { Calculator, DollarSign, Users, Car, TrendingUp } from "lucide-react";
import { SalesRecord } from "../types/sales";
import {
  CommissionCEVFilters,
  CommissionVWFilters,
  CommissionVendedorFilters,
  GerenteGeneralTab,
} from "../types/commissions";
import { CEVCommissionsTab } from "./commissions/CEVCommissionsTab";
import { VendedorCommissionsTab } from "./commissions/VendedorCommissionsTab";
import { VWCommissionsTab } from "./commissions/VWCommissionsTab";
import { getUniqueValues } from "../utils/analyticsCalculator";

interface CommissionsPageProps {
  salesData: SalesRecord[];
}

type TabType = "cev" | "vendedor" | "vw" | "gerente";

export function CommissionsPage({ salesData }: CommissionsPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("cev");

  const vendedores = useMemo(
    () => getUniqueValues(salesData, "nombre_vendedor"),
    [salesData]
  );

  const tabs = [
    {
      id: "cev" as TabType,
      name: "Comisiones CEV",
      icon: DollarSign,
      description: "Comisiones generales excluyendo ML y Moto Siete",
    },
    {
      id: "vendedor" as TabType,
      name: "Comisiones Vendedores",
      icon: Users,
      description: "Comisiones por vendedor y semana",
    },
    {
      id: "vw" as TabType,
      name: "Comisiones VW",
      icon: Car,
      description: "Comisiones específicas para Volkswagen",
    },
    {
      id: "gerente" as TabType,
      name: "Gerente General",
      icon: TrendingUp,
      description: "Comisiones totales y resumen de ventas para la gerente",
    },
  ];

  if (salesData.length === 0) {
    return (
      <div className="text-center py-12">
        <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Sin Datos para Comisiones
        </h3>
        <p className="text-gray-600">
          Carga datos de ventas para calcular las comisiones
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <Calculator className="w-6 h-6 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">
            Sistema de Comisiones
          </h2>
        </div>
        <p className="text-gray-600">
          Calcula comisiones para diferentes categorías y períodos de tiempo
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "cev" && (
            <CEVCommissionsTab salesData={salesData} vendedores={vendedores} />
          )}
          {activeTab === "vendedor" && (
            <VendedorCommissionsTab
              salesData={salesData}
              vendedores={vendedores}
            />
          )}
          {activeTab === "vw" && (
            <VWCommissionsTab salesData={salesData} vendedores={vendedores} />
          )}
          {activeTab === "gerente" && (
            <GerenteGeneralTab salesData={salesData} />
          )}
        </div>
      </div>
    </div>
  );
}
