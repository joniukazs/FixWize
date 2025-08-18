import React, { useState } from 'react';
import { Bell, Search, LogOut, Menu, X, CheckCircle, Clock, AlertTriangle, User, Car, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';

interface HeaderProps {
  title: string;
  onMenuToggle: () => void;
}

export default function Header({ title, onMenuToggle }: HeaderProps) {
  const { user, logout } = useAuth();
  const { workOrders, customers, cars, parts, todoTasks } = useData();
  const [showNotifications, setShowNotifications] = useState(false);

  // Generate notifications based on system data
  const generateNotifications = () => {
    const notifications = [];
    const now = new Date();

    // Work order notifications
    workOrders.forEach(wo => {
      const dueDate = new Date(wo.dueDate);
      const customer = customers.find(c => c.id === wo.customerId);
      const car = cars.find(c => c.id === wo.carId);
      
      // Overdue work orders
      if (dueDate < now && wo.status !== 'completed') {
        notifications.push({
          id: `overdue-${wo.id}`,
          type: 'overdue',
          title: 'Work Order Overdue',
          message: `${wo.description} for ${customer?.name} (${car?.registration}) is overdue`,
          timestamp: dueDate,
          icon: AlertTriangle,
          color: 'text-red-600'
        });
      }
      
      // Due today
      if (dueDate.toDateString() === now.toDateString() && wo.status !== 'completed') {
        notifications.push({
          id: `due-today-${wo.id}`,
          type: 'due_today',
          title: 'Work Order Due Today',
          message: `${wo.description} for ${customer?.name} (${car?.registration}) is due today`,
          timestamp: dueDate,
          icon: Clock,
          color: 'text-orange-600'
        });
      }
      
      // Recently completed
      if (wo.status === 'completed' && wo.updatedAt) {
        const updatedDate = new Date(wo.updatedAt);
        const hoursSinceUpdate = (now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60);
        if (hoursSinceUpdate < 24) {
          notifications.push({
            id: `completed-${wo.id}`,
            type: 'completed',
            title: 'Work Order Completed',
            message: `${wo.description} for ${customer?.name} (${car?.registration}) has been completed`,
            timestamp: updatedDate,
            icon: CheckCircle,
            color: 'text-green-600'
          });
        }
      }
    });

    // Low stock notifications
    parts.forEach(part => {
      if (part.status === 'low_stock' || part.status === 'out_of_stock') {
        notifications.push({
          id: `stock-${part.id}`,
          type: 'stock',
          title: part.status === 'out_of_stock' ? 'Part Out of Stock' : 'Low Stock Alert',
          message: `${part.name} is ${part.status === 'out_of_stock' ? 'out of stock' : 'running low'} (${part.quantity} remaining)`,
          timestamp: now,
          icon: AlertTriangle,
          color: part.status === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'
        });
      }
    });

    // Todo task reminders
    todoTasks.forEach(task => {
      if (task.dueDate && task.status !== 'completed') {
        const dueDate = new Date(task.dueDate);
        if (dueDate.toDateString() === now.toDateString()) {
          notifications.push({
            id: `todo-${task.id}`,
            type: 'todo',
            title: 'Task Due Today',
            message: `${task.title} is due today`,
            timestamp: dueDate,
            icon: Clock,
            color: 'text-blue-600'
          });
        }
      }
    });

    // NCT expiry notifications
    cars.forEach(car => {
      if (car.nctExpiry) {
        const nctDate = new Date(car.nctExpiry);
        const daysUntilExpiry = Math.ceil((nctDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        const customer = customers.find(c => c.id === car.customerId);
        
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          notifications.push({
            id: `nct-${car.id}`,
            type: 'nct',
            title: 'NCT Expiring Soon',
            message: `NCT for ${car.registration} (${customer?.name}) expires in ${daysUntilExpiry} days`,
            timestamp: nctDate,
            icon: AlertTriangle,
            color: 'text-orange-600'
          });
        }
      }
    });

    // Sort by timestamp (newest first)
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const notifications = generateNotifications();
  const unreadCount = notifications.length;
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Search - hidden on small screens */}
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-colors w-64"
              style={{ focusRingColor: '#2c5c8c', focusBorderColor: '#2c5c8c' }}
            />
          </div>

          {/* Search button for mobile */}
          <button className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
            <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center" style={{ backgroundColor: '#2c5c8c' }}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Panel */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Notifications</h3>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-blue-100 hover:text-white transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">{unreadCount} notification{unreadCount !== 1 ? 's' : ''}</p>
                </div>

                <div className="max-h-80 overflow-y-auto notification-scroll">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      return (
                        <div
                          key={notification.id}
                          className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Icon className={`h-5 w-5 ${notification.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900">
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.timestamp.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      <p className="text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <button
            onClick={logout}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}