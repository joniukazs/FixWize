import React, { useState } from 'react';
import { Car, FileText, Clock, CheckCircle, AlertCircle, Calendar, DollarSign, LogOut, Bell, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

interface CustomerNotification {
  id: string;
  type: 'service_update' | 'invoice' | 'nct_reminder' | 'appointment' | 'completion';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  carId?: string;
  workOrderId?: string;
  invoiceId?: string;
}

export default function CustomerPortal() {
  const { user, logout } = useAuth();
  const { workOrders, cars, invoices, customers } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  // Find customer by phone (in real app, this would be by proper customer ID)
  const customer = customers.find(c => c.phone === user?.phone);
  const customerCars = customer ? cars.filter(car => car.customerId === customer.id) : [];
  const customerWorkOrders = customer ? workOrders.filter(wo => wo.customerId === customer.id) : [];
  const customerInvoices = customer ? invoices.filter(inv => inv.customerId === customer.id) : [];

  // Generate customer-specific notifications
  const generateCustomerNotifications = (): CustomerNotification[] => {
    const notifications: CustomerNotification[] = [];

    // Service completion notifications
    customerWorkOrders.forEach(wo => {
      if (wo.status === 'completed') {
        const car = customerCars.find(c => c.id === wo.carId);
        notifications.push({
          id: `service-complete-${wo.id}`,
          type: 'completion',
          title: 'Service Completed',
          message: `Your ${car?.make} ${car?.model} (${car?.registration}) service has been completed successfully. You can pick up your vehicle.`,
          timestamp: new Date(wo.updatedAt),
          read: false,
          carId: wo.carId,
          workOrderId: wo.id
        });
      }

      if (wo.status === 'in_progress') {
        const car = customerCars.find(c => c.id === wo.carId);
        notifications.push({
          id: `service-progress-${wo.id}`,
          type: 'service_update',
          title: 'Service In Progress',
          message: `Work on your ${car?.make} ${car?.model} (${car?.registration}) is currently in progress. ${wo.description}`,
          timestamp: new Date(wo.updatedAt),
          read: false,
          carId: wo.carId,
          workOrderId: wo.id
        });
      }

      if (wo.status === 'pending') {
        const car = customerCars.find(c => c.id === wo.carId);
        notifications.push({
          id: `service-scheduled-${wo.id}`,
          type: 'appointment',
          title: 'Service Scheduled',
          message: `Your ${car?.make} ${car?.model} (${car?.registration}) is scheduled for service on ${new Date(wo.dueDate).toLocaleDateString()}. Please bring your keys and any relevant documents.`,
          timestamp: new Date(wo.createdAt),
          read: false,
          carId: wo.carId,
          workOrderId: wo.id
        });
      }
    });

    // Invoice notifications
    customerInvoices.forEach(inv => {
      if (inv.status === 'sent') {
        notifications.push({
          id: `invoice-sent-${inv.id}`,
          type: 'invoice',
          title: 'New Invoice Available',
          message: `Invoice ${inv.invoiceNumber} for €${inv.total.toFixed(2)} is ready for payment. Due date: ${new Date(inv.dueDate).toLocaleDateString()}`,
          timestamp: new Date(inv.issueDate),
          read: false,
          invoiceId: inv.id
        });
      }

      if (inv.status === 'overdue') {
        notifications.push({
          id: `invoice-overdue-${inv.id}`,
          type: 'invoice',
          title: 'Payment Overdue',
          message: `Invoice ${inv.invoiceNumber} for €${inv.total.toFixed(2)} is overdue. Please make payment as soon as possible.`,
          timestamp: new Date(inv.dueDate),
          read: false,
          invoiceId: inv.id
        });
      }
    });

    // NCT expiry notifications
    customerCars.forEach(car => {
      if (car.nctExpiry) {
        const daysUntilExpiry = Math.ceil((new Date(car.nctExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry <= 30 && daysUntilExpiry > 0) {
          notifications.push({
            id: `nct-expiry-${car.id}`,
            type: 'nct_reminder',
            title: 'NCT Expiring Soon',
            message: `Your NCT for ${car.registration} expires in ${daysUntilExpiry} days on ${new Date(car.nctExpiry).toLocaleDateString()}. Please book your NCT test soon.`,
            timestamp: new Date(),
            read: false,
            carId: car.id
          });
        }
      }
    });

    // Sort by timestamp (newest first)
    return notifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const [notifications, setNotifications] = useState<CustomerNotification[]>(generateCustomerNotifications());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'on_hold':
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'completion': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'service_update': return <Clock className="h-5 w-5 text-orange-600" />;
      case 'invoice': return <FileText className="h-5 w-5 text-blue-600" />;
      case 'nct_reminder': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'appointment': return <Calendar className="h-5 w-5 text-blue-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Car },
    { id: 'work-orders', label: 'Service History', icon: Clock },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'cars', label: 'My Cars', icon: Car }
  ];

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to FIXWIZE</h2>
          <p className="text-gray-600">Your customer account is being set up. Please contact us for assistance.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Customer Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {customer.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
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
                        <div className="flex items-center space-x-2">
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-xs text-blue-100 hover:text-white transition-colors"
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            onClick={() => setShowNotifications(false)}
                            className="text-blue-100 hover:text-white transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </p>
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-600 rounded-full ml-2"></div>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {notification.timestamp.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No notifications</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Car className="h-8 w-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-blue-600">My Cars</p>
                        <p className="text-2xl font-bold text-blue-900">{customerCars.length}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <Clock className="h-8 w-8 text-orange-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-orange-600">Active Services</p>
                        <p className="text-2xl font-bold text-orange-900">
                          {customerWorkOrders.filter(wo => wo.status === 'in_progress' || wo.status === 'pending').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-green-600">Completed</p>
                        <p className="text-2xl font-bold text-green-900">
                          {customerWorkOrders.filter(wo => wo.status === 'completed').length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <DollarSign className="h-8 w-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-sm font-medium text-purple-600">Total Spent</p>
                        <p className="text-2xl font-bold text-purple-900">
                          €{customerInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {customerWorkOrders.slice(0, 3).map((workOrder) => {
                      const car = customerCars.find(c => c.id === workOrder.carId);
                      return (
                        <div key={workOrder.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className={`p-2 rounded-lg ${getStatusColor(workOrder.status)}`}>
                            {getStatusIcon(workOrder.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{workOrder.description}</p>
                            <p className="text-sm text-gray-600">
                              {car?.registration} - {car?.make} {car?.model}
                            </p>
                            <p className="text-xs text-gray-500">
                              Due: {new Date(workOrder.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                            {workOrder.status.replace('_', ' ')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'work-orders' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Service History</h3>
                {customerWorkOrders.map((workOrder) => {
                  const car = customerCars.find(c => c.id === workOrder.carId);
                  return (
                    <div key={workOrder.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{workOrder.description}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {car?.registration} - {car?.make} {car?.model}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span>Due: {new Date(workOrder.dueDate).toLocaleDateString()}</span>
                            {workOrder.estimatedCost && (
                              <span>Estimated: €{workOrder.estimatedCost}</span>
                            )}
                          </div>
                          {workOrder.notes.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700">Notes:</p>
                              <ul className="text-sm text-gray-600 mt-1">
                                {workOrder.notes.map((note, index) => (
                                  <li key={index}>• {note}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workOrder.status)}`}>
                          {workOrder.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {customerInvoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {new Date(invoice.issueDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            €{invoice.total.toFixed(2)}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                              {invoice.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'cars' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">My Cars</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {customerCars.map((car) => (
                    <div key={car.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{car.make} {car.model}</h4>
                          <p className="text-sm text-gray-600">Registration: {car.registration}</p>
                          <p className="text-sm text-gray-600">Year: {car.year}</p>
                          {car.nctExpiry && (
                            <p className="text-sm text-gray-600">
                              NCT Expires: {new Date(car.nctExpiry).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <Car className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}