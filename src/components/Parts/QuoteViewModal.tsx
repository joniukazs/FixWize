import React from 'react';
import { X, Package, Clock, Shield, Building, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface QuoteViewModalProps {
  quote: any;
  onClose: () => void;
}

export default function QuoteViewModal({ quote, onClose }: QuoteViewModalProps) {
  const { partRequests } = useData();
  
  const request = partRequests.find(r => r.id === quote.requestId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'expired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Quote Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quote Status */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Quote Status</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(quote.status)}`}>
              {quote.status.toUpperCase()}
            </span>
          </div>

          {/* Original Request */}
          {request && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Building className="h-5 w-5 mr-2" />
                Original Request from {request.garageName}
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Description:</span>
                  <p className="font-medium mt-1">{request.description}</p>
                </div>
                <div>
                  <span className="text-gray-600">Quantity Requested:</span>
                  <span className="ml-2 font-medium">{request.quantity}</span>
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
                  <span className="text-gray-600">Max Budget:</span>
                  <span className="ml-2 font-medium">€{request.maxPrice?.toFixed(2) || 'Not specified'}</span>
                </div>
              </div>
            </div>
          )}

          {/* Quote Details */}
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Your Quote Details
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Name</label>
                <p className="text-sm text-gray-900 font-medium">{quote.partName}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Part Number</label>
                <p className="text-sm text-gray-900">{quote.partNumber || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <p className="text-sm text-gray-900 font-medium">{quote.quantity}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
                <p className="text-sm text-gray-900 font-medium">€{quote.unitPrice.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                <p className="text-lg text-green-600 font-bold">€{quote.totalPrice.toFixed(2)}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <p className="text-sm text-gray-900">{quote.availability}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="h-4 w-4 inline mr-1" />
                  Delivery Time
                </label>
                <p className="text-sm text-gray-900">{quote.deliveryTime}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Shield className="h-4 w-4 inline mr-1" />
                  Warranty
                </label>
                <p className="text-sm text-gray-900">{quote.warranty || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="h-4 w-4 inline mr-1" />
                  Quote Valid Until
                </label>
                <p className="text-sm text-gray-900">{new Date(quote.validUntil).toLocaleDateString()}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote Created</label>
                <p className="text-sm text-gray-900">{new Date(quote.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {quote.notes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-700">{quote.notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Price Comparison */}
          {request?.maxPrice && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Price Comparison</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Customer's Max Budget:</span>
                  <span className="ml-2 font-medium">€{request.maxPrice.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-blue-700">Your Quote:</span>
                  <span className="ml-2 font-medium">€{quote.totalPrice.toFixed(2)}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-blue-700">Difference:</span>
                  <span className={`ml-2 font-medium ${
                    quote.totalPrice <= request.maxPrice ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {quote.totalPrice <= request.maxPrice ? '-' : '+'}€{Math.abs(quote.totalPrice - request.maxPrice).toFixed(2)}
                    {quote.totalPrice <= request.maxPrice ? ' under budget' : ' over budget'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}