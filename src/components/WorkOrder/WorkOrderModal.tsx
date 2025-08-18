import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Car, Clock, DollarSign, FileText, Plus, AlertTriangle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface WorkOrderModalProps {
  onClose: () => void;
  workOrder?: any;
  initialDate?: Date;
}

export default function WorkOrderModal({ 
  onClose, 
  workOrder,
  initialDate
}: WorkOrderModalProps) {
  const { customers, cars, addWorkOrder, updateWorkOrder, addCustomer, addCar, updateCar, updateCustomer } = useData();
  const [activeTab, setActiveTab] = useState('basic');
  const [customerMode, setCustomerMode] = useState<'existing' | 'new'>('existing');
  
  const [formData, setFormData] = useState({
    customerId: '',
    carId: '',
    description: '',
    dueDate: '',
    dueTime: '09:00',
    estimatedCost: '',
    status: 'pending',
    priority: 'medium',
    assignedTo: '',
    notes: '',
    // New customer fields
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    customerAddress: '',
    // Car details
    registration: '',
    make: '',
    model: '',
    year: new Date().getFullYear()
  });

  const [filteredCars, setFilteredCars] = useState(cars);

  useEffect(() => {
    if (workOrder) {
      // Load existing work order data for editing
      const dueDate = workOrder.dueDate ? new Date(workOrder.dueDate) : null;
      
      // Find customer and car info
      const customer = customers.find(c => c.id === workOrder.customerId);
      const car = cars.find(c => c.id === workOrder.carId);
      
      setFormData({
        customerId: workOrder.customerId || '',
        carId: workOrder.carId || '',
        description: workOrder.description || '',
        dueDate: dueDate ? dueDate.toISOString().split('T')[0] : '',
        dueTime: dueDate ? dueDate.toTimeString().slice(0, 5) : '09:00',
        estimatedCost: workOrder.estimatedCost?.toString() || '',
        status: workOrder.status || 'pending',
        priority: workOrder.priority || 'medium',
        assignedTo: workOrder.assignedTo || '',
        notes: workOrder.notes?.join('\n') || '',
        customerName: customer?.name || '',
        customerPhone: customer?.phone || '',
        customerEmail: customer?.email || '',
        customerAddress: customer?.address || '',
        registration: car?.registration || '',
        make: car?.make || '',
        model: car?.model || '',
        year: car?.year || new Date().getFullYear()
      });
      
      setCustomerMode('existing');
      
      // Filter cars for selected customer
      if (workOrder.customerId) {
        const customerCars = cars.filter(c => c.customerId === workOrder.customerId);
        setFilteredCars(customerCars);
      }
    } else {
      // Reset form for new work order
      const defaultDate = initialDate || new Date();
      const defaultDateStr = defaultDate.toISOString().split('T')[0];
      
      setFormData({
        customerId: '',
        carId: '',
        description: '',
        dueDate: defaultDateStr,
        dueTime: '09:00',
        estimatedCost: '',
        status: 'pending',
        priority: 'medium',
        assignedTo: '',
        notes: '',
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        customerAddress: '',
        registration: '',
        make: '',
        model: '',
        year: new Date().getFullYear()
      });
      
      setFilteredCars(cars);
      setCustomerMode('existing');
    }
  }, [workOrder, cars, customers, initialDate]);

  const handleCustomerChange = (customerId: string) => {
    setFormData({ ...formData, customerId, carId: '' });
    const customerCars = cars.filter(c => c.customerId === customerId);
    setFilteredCars(customerCars);
    
    // Load customer details for editing
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setFormData(prev => ({
        ...prev,
        customerId,
        carId: '',
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email || '',
        customerAddress: customer.address || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let finalCustomerId = formData.customerId;
      let finalCarId = formData.carId;

      // Create new customer if needed
      if (customerMode === 'new' && formData.customerName && formData.customerPhone) {
        // Generate unique IDs
        const newCustomerId = `customer-${Date.now()}`;
        const newCarId = `car-${Date.now()}`;
        
        const newCustomer = {
          id: newCustomerId,
          name: formData.customerName,
          phone: formData.customerPhone,
          email: formData.customerEmail || undefined,
          address: formData.customerAddress || undefined,
          cars: [],
          createdAt: new Date()
        };
        
        addCustomer(newCustomer);
        finalCustomerId = newCustomerId;
        
        // Create new car if details provided
        if (formData.registration && formData.make && formData.model) {
          const newCar = {
            id: newCarId,
            registration: formData.registration,
            make: formData.make,
            model: formData.model,
            year: Number(formData.year),
            customerId: finalCustomerId,
            serviceHistory: []
          };
          
          addCar(newCar);
          finalCarId = newCarId;
        }
      } else if (customerMode === 'existing' && formData.customerId) {
        // Update existing customer if data was modified
        const existingCustomer = customers.find(c => c.id === formData.customerId);
        if (existingCustomer && (
          existingCustomer.name !== formData.customerName ||
          existingCustomer.phone !== formData.customerPhone ||
          existingCustomer.email !== formData.customerEmail ||
          existingCustomer.address !== formData.customerAddress
        )) {
          updateCustomer(formData.customerId, {
            name: formData.customerName,
            phone: formData.customerPhone,
            email: formData.customerEmail || undefined,
            address: formData.customerAddress || undefined
          });
        }
        
        // Update existing car if data was modified
        if (formData.carId) {
          const existingCar = cars.find(c => c.id === formData.carId);
          if (existingCar && (
            existingCar.registration !== formData.registration ||
            existingCar.make !== formData.make ||
            existingCar.model !== formData.model ||
            existingCar.year !== Number(formData.year)
          )) {
            updateCar(formData.carId, {
              registration: formData.registration,
              make: formData.make,
              model: formData.model,
              year: Number(formData.year)
            });
          }
        }
        
        finalCustomerId = formData.customerId;
        finalCarId = formData.carId;
      }

      // Validate required fields
      if (!finalCustomerId) {
        alert('Please select or create a customer');
        return;
      }

      if (!formData.description.trim()) {
        alert('Please enter work description');
        return;
      }

      if (!formData.dueDate) {
        alert('Please select due date');
        return;
      }

      // Create work order data
      const dueDateTime = new Date(`${formData.dueDate}T${formData.dueTime}`);


      const workOrderData = {
        customerId: finalCustomerId,
        carId: finalCarId,
        description: formData.description.trim(),
        dueDate: dueDateTime,
        status: formData.status as any,
        priority: formData.priority as any,
        estimatedCost: parseFloat(formData.estimatedCost) || undefined,
        assignedTo: formData.assignedTo || undefined,
        parts: workOrder?.parts || [],
        images: workOrder?.images || [],
        notes: formData.notes ? formData.notes.split('\n').filter(note => note.trim()) : []
      };

      if (workOrder) {
        // Update existing work order
        updateWorkOrder(workOrder.id, workOrderData);
      } else {
        // Create new work order
        addWorkOrder(workOrderData);
      }
      
      // Close modal immediately after successful save
      onClose();
    } catch (error) {
      console.error('Error saving work order:', error);
      alert('Error saving work order. Please try again.');
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'details', label: 'Details' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {workOrder ? 'Update Work Order' : 'Create Work Order'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div>
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Customer
                  </label>
                  
                  {/* Customer Mode Toggle */}
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setCustomerMode('new')}
                      className={`text-sm font-medium transition-colors ${
                        customerMode === 'new' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      New Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomerMode('existing')}
                      className={`text-sm font-medium transition-colors ${
                        customerMode === 'existing' ? 'text-blue-600' : 'text-gray-500 hover:text-blue-600'
                      }`}
                    >
                      Select Existing
                    </button>
                  </div>

                  {customerMode === 'existing' ? (
                    <>
                      <select
                        value={formData.customerId}
                        onChange={(e) => handleCustomerChange(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required={customerMode === 'existing'}
                      >
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name} - {customer.phone}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setCustomerMode('new')}
                        className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add New Customer
                      </button>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Customer Name"
                        required={customerMode === 'new'}
                      />
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Phone Number"
                        required={customerMode === 'new'}
                      />
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Email (optional)"
                      />
                      <textarea
                        value={formData.customerAddress}
                        onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                        rows={2}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Address (optional)"
                      />
                    </div>
                  )}
                </div>

                {/* Vehicle Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Car className="h-4 w-4 inline mr-2" />
                    Vehicle
                  </label>
                  
                  {customerMode === 'existing' && formData.customerId ? (
                    <>
                      <select
                        value={formData.carId}
                        onChange={(e) => {
                          setFormData({ ...formData, carId: e.target.value });
                          // Load car details for editing
                          const car = cars.find(c => c.id === e.target.value);
                          if (car) {
                            setFormData(prev => ({
                              ...prev,
                              carId: e.target.value,
                              registration: car.registration,
                              make: car.make,
                              model: car.model,
                              year: car.year
                            }));
                          }
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Vehicle</option>
                        {filteredCars.map(car => (
                          <option key={car.id} value={car.id}>
                            {car.registration} - {car.make} {car.model}
                          </option>
                        ))}
                      </select>
                      
                      {/* Show car details for editing */}
                      {formData.carId && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Vehicle Details (editable)</h4>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={formData.registration}
                              onChange={(e) => setFormData({ ...formData, registration: e.target.value.toUpperCase() })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Registration"
                            />
                            <input
                              type="number"
                              value={formData.year}
                              onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                             placeholder="Year (e.g., 2020)"
                              type="text"
                              value={formData.make}
                              onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Make"
                            />
                            <input
                              type="text"
                              value={formData.model}
                              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Model"
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : customerMode === 'existing' && !formData.customerId ? (
                    <p className="text-sm text-gray-500 italic py-2 border border-gray-200 rounded-lg px-3">
                      Please select a customer first
                    </p>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600 mb-3">
                        Vehicle details will be added with the new customer
                      </p>
                      <input
                        type="text"
                        value={formData.registration}
                        onChange={(e) => setFormData({ ...formData, registration: e.target.value.toUpperCase() })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Registration Number (e.g., 24-D-12345)"
                        required={customerMode === 'new'}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={formData.make}
                          onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Make (e.g., Toyota)"
                          required={customerMode === 'new'}
                        />
                        <input
                          type="text"
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Model (e.g., Corolla)"
                          required={customerMode === 'new'}
                        />
                      </div>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                       placeholder="Any year (e.g., 1995, 2024)"
                        max={new Date().getFullYear() + 1}
                        required={customerMode === 'new'}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Work Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe the work to be done..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="h-4 w-4 inline mr-2" />
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <User className="h-4 w-4 inline mr-2" />
                    Assign To
                  </label>
                  <select
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Unassigned</option>
                    <option value="2">Mike Johnson</option>
                    <option value="tm1">Sarah Connor</option>
                    <option value="tm2">Tom Wilson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on_hold">On Hold</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <span className="inline mr-2">€</span>
                    Estimated Cost (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                  />
                </div>
              </div>

              {/* Customer Details (editable when existing customer selected) */}
              {customerMode === 'existing' && formData.customerId && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-3">Customer Details (editable)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Customer Name"
                    />
                    <input
                      type="tel"
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Phone Number"
                    />
                    <input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Email"
                    />
                    <textarea
                      value={formData.customerAddress}
                      onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
                      rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Address"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 inline mr-2" />
                  Notes & Instructions
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={8}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add any notes or special instructions for this work order..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  Each line will be saved as a separate note entry.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-900 mb-1">Parts & Materials</h4>
                    <p className="text-sm text-orange-700">
                      You can add parts and materials to this work order after it's created. 
                      Parts will be tracked in inventory and included in invoices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {workOrder ? 'Update Work Order' : 'Create Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}