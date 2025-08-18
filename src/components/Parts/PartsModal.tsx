import React, { useState } from 'react';
import { X, Package, Hash, Building } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface PartsModalProps {
  onClose: () => void;
  part?: any;
}

export default function PartsModal({ onClose, part }: PartsModalProps) {
  const { addPart, updatePart } = useData();
  const [formData, setFormData] = useState({
    name: part?.name || '',
    partNumber: part?.partNumber || '',
    description: part?.description || '',
    quantity: part?.quantity || 0,
    minQuantity: part?.minQuantity || 5,
    unitPrice: part?.unitPrice || 0,
    supplier: part?.supplier || '',
    status: part?.status || 'in_stock'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Determine status based on quantity
    let status = formData.status;
    if (formData.quantity === 0) {
      status = 'out_of_stock';
    } else if (formData.quantity <= formData.minQuantity) {
      status = 'low_stock';
    } else if (status === 'out_of_stock' || status === 'low_stock') {
      status = 'in_stock';
    }

    const partData = {
      ...formData,
      status: status as any,
      quantity: Number(formData.quantity),
      minQuantity: Number(formData.minQuantity),
      unitPrice: Number(formData.unitPrice)
    };

    if (part) {
      updatePart(part.id, partData);
    } else {
      addPart(partData);
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {part ? 'Edit Part' : 'Add New Part'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="h-4 w-4 inline mr-2" />
              Part Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter part name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Hash className="h-4 w-4 inline mr-2" />
              Part Number (Optional)
            </label>
            <input
              type="text"
              value={formData.partNumber}
              onChange={(e) => setFormData({ ...formData, partNumber: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter part number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter part description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Quantity
              </label>
              <input
                type="number"
                value={formData.minQuantity}
                onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                required
              />
            </div>
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
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="h-4 w-4 inline mr-2" />
              Supplier (Optional)
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="in_stock">In Stock</option>
              <option value="low_stock">Low Stock</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="ordered">Ordered</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {part ? 'Update Part' : 'Add Part'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}