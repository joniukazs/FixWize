import React from 'react';
import { Wrench, Users, Car, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function DashboardStats() {
  const { workOrders, customers, cars, invoices } = useData();

  const completedOrders = workOrders.filter(wo => wo.status === 'completed').length;
  const pendingOrders = workOrders.filter(wo => wo.status === 'pending').length;
  const inProgressOrders = workOrders.filter(wo => wo.status === 'in_progress').length;
  const onHoldOrders = workOrders.filter(wo => wo.status === 'on_hold').length;

  const stats = [
    {
      title: 'Total Work Orders',
      value: workOrders.length,
      icon: Wrench,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'In Progress',
      value: inProgressOrders,
      icon: Clock,
      color: 'bg-orange-500',
      change: '+5%'
    },
    {
      title: 'On Hold',
      value: onHoldOrders,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: '-2%'
    },
    {
      title: 'Total Customers',
      value: customers.length,
      icon: Users,
      color: 'bg-purple-500',
      change: '+15%'
    },
    {
      title: 'Registered Cars',
      value: cars.length,
      icon: Car,
      color: 'bg-indigo-500',
      change: '+10%'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 md:gap-6 mb-6 md:mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                <p className="text-xl md:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-2 md:p-3 rounded-lg flex-shrink-0 ml-2`}>
                <Icon className="h-4 w-4 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 md:mt-4 flex items-center">
              <span className={`text-xs md:text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-xs md:text-sm text-gray-500 ml-2">vs last month</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}