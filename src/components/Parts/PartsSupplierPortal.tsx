import React, { useState } from 'react';
import { Package, Search, Filter, Plus, Clock, CheckCircle, AlertCircle, Building, Phone, Mail, LogOut, Eye, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import PartQuoteModal from './PartQuoteModal';
import QuoteViewModal from './QuoteViewModal';
import TeamManagement from '../Team/TeamManagement';

export default function PartsSupplierPortal() {
  const { user, logout } = useAuth();
  const { partRequests, partQuotes, addPartQuote, updatePartQuote, updatePartRequest } = useData();
  const [activeTab, setActiveTab] = useState('requests');
  const [searchTerm, setSearchTerm] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'quoted': return 'bg-orange-100 text-orange-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'fulfilled': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = partRequests.filter(request => {
    const matchesSearch = 
      request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.garageName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUrgency = urgencyFilter === 'all' || request.urgency === urgencyFilter;
    
    return matchesSearch && matchesUrgency && request.status === 'open';
  });

  const myQuotes = partQuotes.filter(quote => quote.supplierId === user?.id);

  const handleCreateQuote = (request: any) => {
    setSelectedRequest(request);
    setShowQuoteModal(true);
  };

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setShowViewModal(true);
  };

  const handleQuoteSubmit = (quoteData: any) => {
    const newQuote = {
      ...quoteData,
      requestId: selectedRequest.id,
      supplierId: user?.id || '',
      supplierName: user?.name || 'Unknown Supplier',
      status: 'pending' as const,
      validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };

    addPartQuote(newQuote);
    
    // Update request status to 'quoted'
    updatePartRequest(selectedRequest.id, { status: 'quoted' });
    
    setShowQuoteModal(false);
    setSelectedRequest(null);
  };

  const tabs = [
    { id: 'requests', label: 'Part Requests', icon: Package },
    { id: 'quotes', label: 'My Quotes', icon: Package },
    { id: 'team', label: 'Team Management', icon: Users },
    { id: 'profile', label: 'Supplier Profile', icon: Building }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Parts Supplier Portal</h1>
                <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">Parts Supplier</p>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'requests' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Available Part Requests</h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <input
                        type="text"
                        placeholder="Search requests..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="relative">
                      <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <select
                        value={urgencyFilter}
                        onChange={(e) => setUrgencyFilter(e.target.value)}
                        className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none bg-white"
                      >
                        <option value="all">All Urgency</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-2">{request.description}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="flex items-center">
                              <Building className="h-4 w-4 mr-1" />
                              {request.garageName}
                            </span>
                            <span className="flex items-center">
                              <Package className="h-4 w-4 mr-1" />
                              Qty: {request.quantity}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                          {request.urgency.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Max Price:</span>
                          <span className="font-medium">€{request.maxPrice?.toFixed(2) || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Needed By:</span>
                          <span className="font-medium">{new Date(request.neededBy).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Requested:</span>
                          <span className="font-medium">{new Date(request.requestedDate).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                          {request.status.toUpperCase()}
                        </span>
                        <button
                          onClick={() => handleCreateQuote(request)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          Create Quote
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredRequests.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No part requests found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quotes' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">My Quotes</h3>
                
                <div className="space-y-4">
                  {myQuotes.map((quote) => {
                    const request = partRequests.find(r => r.id === quote.requestId);
                    return (
                      <div key={quote.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-2">{quote.partName}</h4>
                            <p className="text-sm text-gray-600 mb-2">{request?.garageName}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Qty: {quote.quantity}</span>
                              <span>Unit Price: €{quote.unitPrice.toFixed(2)}</span>
                              <span>Total: €{quote.totalPrice.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleViewQuote(quote)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quote.status)}`}>
                              {quote.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
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
                          <div>
                            <span className="text-gray-600">Valid Until:</span>
                            <span className="ml-2 font-medium">{new Date(quote.validUntil).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {quote.notes && (
                          <div className="mt-4 p-3 bg-gray-50 rounded">
                            <p className="text-sm text-gray-700">{quote.notes}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {myQuotes.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No quotes created yet</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'team' && (
              <TeamManagement />
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Supplier Profile</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Building className="h-4 w-4 inline mr-2" />
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Premium Auto Parts Ltd"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue="+353 1 555 0123"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue="sales@premiumautoparts.ie"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VAT Number
                    </label>
                    <input
                      type="text"
                      defaultValue="IE9876543Z"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Industrial Estate, Unit 15, Dublin 12, Ireland"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specializations
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Brake systems, Engine parts, Filters, Electrical components, Suspension parts"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Update Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showQuoteModal && selectedRequest && (
        <PartQuoteModal
          request={selectedRequest}
          onClose={() => {
            setShowQuoteModal(false);
            setSelectedRequest(null);
          }}
          onSubmit={handleQuoteSubmit}
        />
      )}

      {showViewModal && selectedQuote && (
        <QuoteViewModal
          quote={selectedQuote}
          onClose={() => {
            setShowViewModal(false);
            setSelectedQuote(null);
          }}
        />
      )}
    </div>
  );
}