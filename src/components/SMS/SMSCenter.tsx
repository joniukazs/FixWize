import React, { useState } from 'react';
import { MessageSquare, Send, Plus, Edit, Trash2, Users } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function SMSCenter() {
  const { smsTemplates, customers } = useData();
  const [activeTab, setActiveTab] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);

  const tabs = [
    { id: 'templates', label: 'SMS Templates', icon: MessageSquare },
    { id: 'bulk', label: 'Bulk Messages', icon: Users },
    { id: 'history', label: 'Message History', icon: Send }
  ];

  const handleSendBulkMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMessage.trim() || selectedCustomers.length === 0) return;

    // In a real app, this would send actual SMS messages
    alert(`Bulk message sent to ${selectedCustomers.length} customers!`);
    setCustomMessage('');
    setSelectedCustomers([]);
  };

  const toggleCustomerSelection = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
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
                      ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">SMS Templates</h3>
                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus className="h-4 w-4" />
                  <span>New Template</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {smsTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button className="p-1 text-gray-400 hover:text-blue-600">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {template.content}
                    </p>
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                        {template.type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bulk' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Send Bulk Messages</h3>
              
              <form onSubmit={handleSendBulkMessage} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Template (Optional)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => {
                      setSelectedTemplate(e.target.value);
                      if (e.target.value) {
                        const template = smsTemplates.find(t => t.id === e.target.value);
                        if (template) {
                          setCustomMessage(template.content);
                        }
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose a template...</option>
                    {smsTemplates.filter(t => t.isActive).map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message Content
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your message here..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Character count: {customMessage.length}/160
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Recipients ({selectedCustomers.length} selected)
                  </label>
                  <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedCustomers.length === customers.length) {
                            setSelectedCustomers([]);
                          } else {
                            setSelectedCustomers(customers.map(c => c.id));
                          }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {selectedCustomers.length === customers.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    {customers.map((customer) => (
                      <label
                        key={customer.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCustomers.includes(customer.id)}
                          onChange={() => toggleCustomerSelection(customer.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!customMessage.trim() || selectedCustomers.length === 0}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                  <span>Send to {selectedCustomers.length} recipient{selectedCustomers.length !== 1 ? 's' : ''}</span>
                </button>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Message History</h3>
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Message history will appear here</p>
                <p className="text-sm text-gray-400 mt-1">All sent messages are logged for your records</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}