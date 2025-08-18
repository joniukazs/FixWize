import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import CarModal from './CarModal';

export default function CarList() {
  const { cars, customers, deleteCar } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const isNCTExpiringSoon = (nctExpiry?: Date) => {
    if (!nctExpiry) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return nctExpiry <= thirtyDaysFromNow;
  };

  const isNCTExpired = (nctExpiry?: Date) => {
    if (!nctExpiry) return false;
    return nctExpiry < new Date();
  };

  const filteredCars = cars.filter(car =>
    car.registration.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getCustomerName(car.customerId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (car: any) => {
    setSelectedCar(car);
    setShowModal(true);
  };

  const handleDelete = (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car? This will also delete all associated work orders.')) {
      deleteCar(carId);
    }
  };

  const getNCTStatus = (nctExpiry?: Date) => {
    if (!nctExpiry) return { status: 'unknown', color: 'bg-gray-100 text-gray-800', text: 'No NCT Date' };
    
    if (isNCTExpired(nctExpiry)) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', text: 'Expired' };
    } else if (isNCTExpiringSoon(nctExpiry)) {
      return { status: 'expiring', color: 'bg-orange-100 text-orange-800', text: 'Expiring Soon' };
    } else {
      return { status: 'valid', color: 'bg-green-100 text-green-800', text: 'Valid' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Car Management</h2>
          <p className="text-gray-600">Manage registered vehicles</p>
        </div>
        <button
          onClick={() => {
            setSelectedCar(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Car</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search cars..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Cars Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NCT Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NCT Expiry
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCars.map((car) => {
                const nctStatus = getNCTStatus(car.nctExpiry);
                return (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {car.registration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {car.make} {car.model}
                        </div>
                        <div className="text-sm text-gray-500">
                          Year: {car.year}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getCustomerName(car.customerId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${nctStatus.color}`}>
                        {nctStatus.status === 'expired' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {nctStatus.status === 'expiring' && <AlertTriangle className="h-3 w-3 mr-1" />}
                        {nctStatus.status === 'valid' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {nctStatus.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {car.nctExpiry ? new Date(car.nctExpiry).toLocaleDateString() : 'Not set'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(car)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(car.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredCars.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500">No cars found</p>
          </div>
        )}
      </div>

      {showModal && (
        <CarModal
          onClose={() => {
            setShowModal(false);
            setSelectedCar(null);
          }}
          car={selectedCar}
        />
      )}
    </div>
  );
}