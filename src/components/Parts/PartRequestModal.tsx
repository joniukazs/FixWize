import React, { useState } from 'react';
import { X, Package, Calendar, AlertTriangle } from 'lucide-react';

interface PartRequestModalProps {
  part: any;
  onClose: () => void;
  onSubmit: (requestData: any) => void;
}

export default function PartRequestModal({ part, onClose, onSubmit }: PartRequestModalProps) {
  const [formData, setFormData] = useState({
    quantity: part.minQuantity || 1,
    urgency: 'medium' as 'low' | 'medium' | 'high',
    description: `${part.name} - ${part.description || 'Stock replenishment needed'}`,
    maxPrice: part.unitPrice * 1.2, // 20% markup as default max price
    neededBy: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      neededBy: new Date(formData.neededBy),
      requestedDate: new Date()
    });
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Request Part from Suppliers</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Part Information */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Part Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Name:</span>
                <span className="ml-2 font-medium">{part.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Part Number:</span>
                <span className="ml-2 font-medium">{part.partNumber || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-600">Current Stock:</span>
                <span className="ml-2 font-medium">{part.quantity}</span>
              </div>
              <div>
                <span className="text-gray-600">Min Quantity:</span>
                <span className="ml-2 font-medium">{part.minQuantity}</span>
              </div>
              <div>
                <span className="text-gray-600">Current Price:</span>
                <span className="ml-2 font-medium">€{part.unitPrice.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  part.status === 'out_of_stock' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                }`}>
                  {part.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Needed
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertTriangle className="h-4 w-4 inline mr-2" />
                  Urgency Level
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) => setFormData({ ...formData, urgency: e.target.value as any })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low - Can wait</option>
                  <option value="medium">Medium - Normal priority</option>
                  <option value="high">High - Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  Needed By Date
                </label>
                <input
                  type="date"
                  value={formData.neededBy}
                  onChange={(e) => setFormData({ ...formData, neededBy: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <span className="inline mr-2">€</span>
                  Maximum Price per Unit (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: Number(e.target.value) })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty if no price limit
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your requirements, specifications, or any additional notes..."
                required
              />
            </div>

            {/* Preview */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Request Preview</h4>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Part:</strong> {part.name}</p>
                <p><strong>Quantity:</strong> {formData.quantity} units</p>
                <p><strong>Urgency:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(formData.urgency)}`}>
                    {formData.urgency.toUpperCase()}
                  </span>
                </p>
                <p><strong>Needed by:</strong> {new Date(formData.neededBy).toLocaleDateString()}</p>
                <p><strong>Max budget:</strong> €{(formData.maxPrice * formData.quantity).toFixed(2)} total</p>
              </div>
            </div>

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
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request to Suppliers
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}