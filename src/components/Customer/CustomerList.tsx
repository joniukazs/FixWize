import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Phone, Mail, MapPin, Car, MoreVertical } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import CustomerModal from './CustomerModal';

export default function CustomerList() {
  const { customers, cars, deleteCustomer } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMobileActions, setShowMobileActions] = useState<string | null>(null);

  const getCustomerCars = (customerId: string) => {
    return cars.filter(car => car.customerId === customerId);
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (customer: any) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    setShowMobileActions(null);
  };

  const handleDelete = (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer? This will also delete all associated cars and work orders.')) {
      deleteCustomer(customerId);
    }
    setShowMobileActions(null);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-sm text-gray-600">Manage your customer database</p>
        </div>
        <button
          onClick={() => {
            setSelectedCustomer(null);
            setShowModal(true);
          }}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map((customer) => {
          const customerCars = getCustomerCars(customer.id);
          return (
            <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                  <p className="text-sm text-gray-500">
                    Customer since {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(customer)}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit Customer"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{customer.address}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <Car className="h-4 w-4" />
                  <span>{customerCars.length} car{customerCars.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {customerCars.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Registered Cars</h4>
                  <div className="space-y-1">
                    {customerCars.slice(0, 2).map((car) => (
                      <div key={car.id} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {car.registration} - {car.make} {car.model}
                      </div>
                    ))}
                    {customerCars.length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{customerCars.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile List View */}
      <div className="md:hidden space-y-4">
        {filteredCustomers.map((customer) => {
          const customerCars = getCustomerCars(customer.id);
          return (
            <div key={customer.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 truncate">{customer.name}</h3>
                  <p className="text-xs text-gray-500">
                    Since {new Date(customer.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="relative ml-2">
                  <button
                    onClick={() => setShowMobileActions(showMobileActions === customer.id ? null : customer.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {showMobileActions === customer.id && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                      <button
                        onClick={() => handleEdit(customer)}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Edit className="h-3 w-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Phone className="h-3 w-3" />
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{customer.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-gray-600">
                  <Car className="h-3 w-3" />
                  <span>{customerCars.length} car{customerCars.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {customerCars.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-1">
                    {customerCars.slice(0, 2).map((car) => (
                      <span key={car.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {car.registration}
                      </span>
                    ))}
                    {customerCars.length > 2 && (
                      <span className="text-xs text-gray-500">
                        +{customerCars.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No customers found</p>
        </div>
      )}

      {showModal && (
        <CustomerModal
          onClose={() => {
            setShowModal(false);
            setSelectedCustomer(null);
          }}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
}