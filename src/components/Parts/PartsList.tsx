import React, { useState } from 'react';
import { Search, Filter, Plus, Edit, Trash2, Package, AlertCircle, CheckCircle, Clock, Send, Bell } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import PartsModal from './PartsModal';
import PartRequestModal from './PartRequestModal';
import PartsQuoteNotifications from './PartsQuoteNotifications';

export default function PartsList() {
  const { parts, deletePart, addPartRequest, partQuotes, partRequests } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPart, setSelectedPart] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showQuotesModal, setShowQuotesModal] = useState(false);
  const [requestingPart, setRequestingPart] = useState(null);
  const [quotesPartId, setQuotesPartId] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800';
      case 'low_stock': return 'bg-orange-100 text-orange-800';
      case 'out_of_stock': return 'bg-red-100 text-red-800';
      case 'ordered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock': return <CheckCircle className="h-4 w-4" />;
      case 'low_stock': return <AlertCircle className="h-4 w-4" />;
      case 'out_of_stock': return <AlertCircle className="h-4 w-4" />;
      case 'ordered': return <Clock className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  // Check if part has pending quotes
  const getPartQuoteCount = (partId: string) => {
    const requests = partRequests.filter(req => req.partId === partId);
    const quotes = partQuotes.filter(quote => 
      requests.some(req => req.id === quote.requestId) && 
      quote.status === 'pending'
    );
    return quotes.length;
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (part.partNumber && part.partNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (part.supplier && part.supplier.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || part.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (part: any) => {
    setSelectedPart(part);
    setShowModal(true);
  };

  const handleDelete = (partId: string) => {
    if (window.confirm('Are you sure you want to delete this part?')) {
      deletePart(partId);
    }
  };

  const handleRequestPart = (part: any) => {
    setRequestingPart(part);
    setShowRequestModal(true);
  };

  const handleViewQuotes = (partId: string) => {
    setQuotesPartId(partId);
    setShowQuotesModal(true);
  };

  const lowStockParts = parts.filter(part => part.status === 'low_stock' || part.status === 'out_of_stock');
  const totalValue = parts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Parts</p>
              <p className="text-2xl font-bold text-gray-900">{parts.length}</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-gray-900">{lowStockParts.length}</p>
            </div>
            <div className="bg-orange-500 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Inventory Value</p>
              <p className="text-2xl font-bold text-gray-900">€{totalValue.toFixed(2)}</p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Stock</p>
              <p className="text-2xl font-bold text-gray-900">
                {parts.filter(p => p.status === 'in_stock').length}
              </p>
            </div>
            <div className="bg-green-500 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parts Management</h2>
          <p className="text-gray-600">Manage your parts inventory</p>
        </div>
        <button
          onClick={() => {
            setSelectedPart(null);
            setShowModal(true);
          }}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Part</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search parts..."
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
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="ordered">Ordered</option>
          </select>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Part Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Supplier
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredParts.map((part) => {
                const quoteCount = getPartQuoteCount(part.id);
                return (
                  <tr key={part.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{part.name}</div>
                        {part.description && (
                          <div className="text-sm text-gray-500">{part.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.partNumber || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">€{part.unitPrice.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        €{(part.quantity * part.unitPrice).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(part.status)}`}>
                        {getStatusIcon(part.status)}
                        <span className="ml-1 capitalize">{part.status.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{part.supplier || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(part)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {(part.status === 'out_of_stock' || part.status === 'low_stock') && (
                          <button
                            onClick={() => handleRequestPart(part)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Request from Suppliers"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        {quoteCount > 0 && (
                          <button
                            onClick={() => handleViewQuotes(part.id)}
                            className="relative text-orange-600 hover:text-orange-900 p-1"
                            title={`${quoteCount} quote(s) available`}
                          >
                            <Bell className="h-4 w-4" />
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                              {quoteCount}
                            </span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(part.id)}
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

        {filteredParts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No parts found</p>
          </div>
        )}
      </div>

      {showModal && (
        <PartsModal
          onClose={() => {
            setShowModal(false);
            setSelectedPart(null);
          }}
          part={selectedPart}
        />
      )}

      {showRequestModal && requestingPart && (
        <PartRequestModal
          part={requestingPart}
          onClose={() => {
            setShowRequestModal(false);
            setRequestingPart(null);
          }}
          onSubmit={(requestData) => {
            addPartRequest({
              partId: requestingPart.id,
              workOrderId: '', // Can be linked to specific work order if needed
              garageId: 'garage-1',
              garageName: 'FIXWIZE Main',
              ...requestData,
              status: 'open',
              quotes: []
            });
            setShowRequestModal(false);
            setRequestingPart(null);
          }}
        />
      )}

      {showQuotesModal && quotesPartId && (
        <PartsQuoteNotifications
          partId={quotesPartId}
          onClose={() => {
            setShowQuotesModal(false);
            setQuotesPartId(null);
          }}
        />
      )}
    </div>
  );
}