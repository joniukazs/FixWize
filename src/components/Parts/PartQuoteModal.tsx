import React, { useState } from 'react';
import { X, Package, Clock, Shield } from 'lucide-react';

interface PartQuoteModalProps {
  request: any;
  onClose: () => void;
  onSubmit: (quoteData: any) => void;
}

export default function PartQuoteModal({ request, onClose, onSubmit }: PartQuoteModalProps) {
  const [formData, setFormData] = useState({
    partName: request.description.split(' - ')[0] || '',
    partNumber: '',
    quantity: request.quantity,
    unitPrice: 0,
    availability: 'In Stock',
    deliveryTime: '24-48 hours',
    warranty: '1 year',
    notes: ''
  });

  const totalPrice = formData.quantity * formData.unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      totalPrice
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create Quote</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Request Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Request Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Garage:</span>
                <span className="ml-2 font-medium">{request.garageName}</span>
              </div>
              <div>
                <span className="text-gray-600">Urgency:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                  request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                  request.urgency === 'medium' ? 'bg-orange-100 text-orange-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {request.urgency.toUpperCase()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Needed By:</span>
                <span className="ml-2 font-medium">{new Date(request.neededBy).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Max Price:</span>
                <span className="ml-2 font-medium">€{request.maxPrice?.toFixed(2) || 'Not specified'}</span>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-gray-600">Description:</span>
              <p className="mt-1 text-sm">{request.description}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="h-4 w-4 inline mr-2" />
                  Part Name
                </label>
                <input
                  type="text"
                  value={formData.partName}
                  onChange={(e) => setFormData({ ...formData, partName: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Part Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.partNumber}
                  onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., BP-VW-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline mr-2">€</span>
                  Unit Price (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                  <option value="2 weeks">2 weeks</option>
                  <option value="Special Order">Special Order</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Clock className="h-4 w-4 inline mr-2" />
                  Delivery Time
                </label>
                <select
                  value={formData.deliveryTime}
                  onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Same day">Same day</option>
                  <option value="24 hours">24 hours</option>
                  <option value="24-48 hours">24-48 hours</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1 week">1 week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="h-4 w-4 inline mr-2" />
                  Warranty
                </label>
                <select
                  value={formData.warranty}
                  onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                  <option value="2 years">2 years</option>
                  <option value="3 years">3 years</option>
                  <option value="Lifetime">Lifetime</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Price
                </label>
                <div className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-lg font-bold text-green-600">
                  €{totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Any additional information about the part, quality, specifications, etc."
              />
            </div>

            {request.maxPrice && totalPrice > request.maxPrice && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-800">
                      Your quote (€{totalPrice.toFixed(2)}) exceeds the customer's maximum price (€{request.maxPrice.toFixed(2)}).
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Quote
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}