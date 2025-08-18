import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Eye, FileText, MoreVertical } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import WorkOrderModal from './WorkOrderModal';

export default function WorkOrderList() {
  const { workOrders, customers, cars, deleteWorkOrder, generateInvoice } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showMobileActions, setShowMobileActions] = useState<string | null>(null);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getCarInfo = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.make} ${car.model} (${car.registration})` : 'No Car Selected';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = workOrders.filter(order => {
    const matchesSearch = 
      getCustomerName(order.customerId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCarInfo(order.carId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (order: any) => {
    setSelectedWorkOrder(order);
    setShowModal(true);
    setShowMobileActions(null);
  };

  const handleDelete = (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this work order?')) {
      deleteWorkOrder(orderId);
    }
    setShowMobileActions(null);
  };

  const handleGenerateInvoice = (orderId: string) => {
    try {
      const invoice = generateInvoice(orderId);
      alert(`Invoice ${invoice.invoiceNumber} generated successfully!`);
    } catch (error: any) {
      alert(`Error generating invoice: ${error.message}`);
    }
    setShowMobileActions(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header and Filters */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">Work Orders</h2>
            <p className="text-sm text-gray-600">Manage service requests and repairs</p>
          </div>
          <button
            onClick={() => {
              setSelectedWorkOrder(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Work Order</span>
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search work orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-40"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer & Car
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {getCustomerName(order.customerId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getCarInfo(order.carId)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {order.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(order.dueDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getPriorityColor(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      €{order.estimatedCost || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(order)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleGenerateInvoice(order.id)}
                        className="text-green-600 hover:text-green-900 p-1"
                        title="Generate Invoice"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {getCustomerName(order.customerId)}
                </h3>
                <p className="text-xs text-gray-500 truncate">
                  {getCarInfo(order.carId)}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ')}
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowMobileActions(showMobileActions === order.id ? null : order.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {showMobileActions === order.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                      <button
                        onClick={() => handleEdit(order)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleGenerateInvoice(order.id)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FileText className="h-3 w-3" />
                        <span>Invoice</span>
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-900 mb-3 line-clamp-2">
              {order.description}
            </p>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-4">
                <span>Due: {new Date(order.dueDate).toLocaleDateString()}</span>
                <span className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(order.priority)}`}>
                  {order.priority}
                </span>
              </div>
              <span className="font-medium text-gray-900">€{order.estimatedCost || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No work orders found</p>
        </div>
      )}

      {showModal && (
        <WorkOrderModal
          onClose={() => {
            setShowModal(false);
            setSelectedWorkOrder(null);
          }}
          workOrder={selectedWorkOrder}
        />
      )}
    </div>
  );
}