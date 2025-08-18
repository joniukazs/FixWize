import React from 'react';
import { Clock, User, Car, Wrench } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function RecentActivity() {
  const { workOrders, customers, cars } = useData();

  // Get recent work orders (last 5)
  const recentOrders = workOrders
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getCarInfo = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.make} ${car.model} (${car.registration})` : 'Unknown Car';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-blue-600" />
        Recent Activity
      </h3>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Wrench className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {order.description}
                </p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {getCustomerName(order.customerId)}
                </div>
                <div className="flex items-center">
                  <Car className="h-3 w-3 mr-1" />
                  {getCarInfo(order.carId)}
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Updated {new Date(order.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {recentOrders.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity</p>
        </div>
      )}
    </div>
  );
}