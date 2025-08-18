import React, { useState } from 'react';
import { CheckCircle, X, Eye, Clock, DollarSign, Package } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface PartsQuoteNotificationsProps {
  partId: string;
  onClose: () => void;
}

export default function PartsQuoteNotifications({ partId, onClose }: PartsQuoteNotificationsProps) {
  const { partRequests, partQuotes, updatePartQuote, updatePartRequest, parts } = useData();
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);

  // Find requests for this part
  const relevantRequests = partRequests.filter(req => req.partId === partId);
  const part = parts.find(p => p.id === partId);

  // Get all quotes for these requests
  const availableQuotes = partQuotes.filter(quote => 
    relevantRequests.some(req => req.id === quote.requestId) && 
    quote.status === 'pending'
  );

  const handleAcceptQuote = (quote: any) => {
    // Update quote status to accepted
    updatePartQuote(quote.id, { status: 'accepted' });
    
    // Update request status to accepted
    updatePartRequest(quote.requestId, { status: 'accepted' });
    
    // Reject other quotes for the same request
    partQuotes
      .filter(q => q.requestId === quote.requestId && q.id !== quote.id)
      .forEach(q => updatePartQuote(q.id, { status: 'rejected' }));

    alert(`Quote from ${quote.supplierName} has been accepted!`);
    onClose();
  };

  const handleRejectQuote = (quote: any) => {
    updatePartQuote(quote.id, { status: 'rejected' });
    alert(`Quote from ${quote.supplierName} has been rejected.`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (availableQuotes.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
          <div className="p-6 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Quotes Available</h3>
            <p className="text-gray-600 mb-4">No supplier quotes are currently available for this part.</p>
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Supplier Quotes</h2>
            <p className="text-sm text-gray-600">{part?.name} - {availableQuotes.length} quote(s) available</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {availableQuotes.map((quote) => {
              const request = relevantRequests.find(req => req.id === quote.requestId);
              const isSelected = selectedQuote === quote.id;
              
              return (
                <div 
                  key={quote.id} 
                  className={`border rounded-lg p-6 transition-all cursor-pointer ${
                    isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedQuote(isSelected ? null : quote.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{quote.supplierName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                          {quote.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{quote.partName}</p>
                      {quote.partNumber && (
                        <p className="text-xs text-gray-500">Part #: {quote.partNumber}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">€{quote.totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">€{quote.unitPrice.toFixed(2)} per unit</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-gray-600">Quantity:</span>
                      <span className="ml-2 font-medium">{quote.quantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Availability:</span>
                      <span className="ml-2 font-medium">{quote.availability}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Delivery:</span>
                      <span className="ml-2 font-medium">{quote.deliveryTime}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Warranty:</span>
                      <span className="ml-2 font-medium">{quote.warranty || 'N/A'}</span>
                    </div>
                  </div>

                  {quote.notes && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-700">{quote.notes}</p>
                    </div>
                  )}

                  {/* Price comparison with request budget */}
                  {request?.maxPrice && (
                    <div className="mb-4 p-3 bg-blue-50 rounded">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">Your max budget:</span>
                        <span className="font-medium">€{request.maxPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-700">This quote:</span>
                        <span className={`font-medium ${
                          quote.totalPrice <= request.maxPrice ? 'text-green-600' : 'text-red-600'
                        }`}>
                          €{quote.totalPrice.toFixed(2)}
                          {quote.totalPrice <= request.maxPrice ? ' ✓' : ' ⚠️'}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>Valid until {new Date(quote.validUntil).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRejectQuote(quote);
                        }}
                        className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-colors text-sm"
                      >
                        Reject
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcceptQuote(quote);
                        }}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center space-x-1"
                      >
                        <CheckCircle className="h-3 w-3" />
                        <span>Accept</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">How it works:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Review quotes from different suppliers</li>
              <li>• Compare prices, delivery times, and warranties</li>
              <li>• Accept the best quote for your needs</li>
              <li>• The supplier will be notified and will process your order</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}