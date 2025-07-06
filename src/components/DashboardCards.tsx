import React from 'react';
import { DollarSign, Calendar, TrendingUp, Store, User, Users, Car } from 'lucide-react';
import { SalesAnalytics } from '../types/sales';

interface DashboardCardsProps {
  analytics: SalesAnalytics;
}

export function DashboardCards({ analytics }: DashboardCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const cards = [
    {
      title: 'Ventas de Hoy',
      value: formatCurrency(analytics.totalHoy),
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Ventas de la Semana',
      value: formatCurrency(analytics.totalSemana),
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Ventas del Mes',
      value: formatCurrency(analytics.totalMes),
      icon: DollarSign,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Vendedor Top',
      value: analytics.vendedorTop.nombre,
      subtitle: formatCurrency(analytics.vendedorTop.total),
      icon: User,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Sucursal Top',
      value: analytics.tiendaTop.nombre,
      subtitle: formatCurrency(analytics.tiendaTop.total),
      icon: Store,
      color: 'bg-pink-500',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Cliente Top',
      value: analytics.clienteTop.nombre,
      subtitle: formatCurrency(analytics.clienteTop.total),
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      title: 'Marca Top',
      value: analytics.marcaTop.nombre,
      subtitle: formatCurrency(analytics.marcaTop.total),
      icon: Car,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div key={index} className={`${card.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} rounded-lg p-3`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
          <p className="text-xl font-bold text-gray-900 mb-1 truncate" title={card.value}>
            {card.value}
          </p>
          {card.subtitle && (
            <p className="text-sm text-gray-500">{card.subtitle}</p>
          )}
        </div>
      ))}
    </div>
  );
}