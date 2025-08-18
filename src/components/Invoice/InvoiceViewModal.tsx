import React from 'react';
import { X, Download, Send, DollarSign } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface InvoiceViewModalProps {
  invoice: any;
  onClose: () => void;
}

export default function InvoiceViewModal({ invoice, onClose }: InvoiceViewModalProps) {
  const { customers } = useData();

  const customer = customers.find(c => c.id === invoice.customerId);

  const handleDownload = () => {
    alert(`Downloading invoice ${invoice.invoiceNumber}...`);
  };

  const handleSend = () => {
    alert(`Sending invoice ${invoice.invoiceNumber} to customer...`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            Invoice {invoice.invoiceNumber}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={handleSend}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Invoice Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-red-600 p-2 rounded-lg">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">FIXWIZE</h1>
                  <p className="text-sm text-gray-600">Professional Garage Services</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p>123 Main Street</p>
                <p>Dublin, Ireland</p>
                <p>Phone: +353 1 234 5678</p>
                <p>Email: info@fixwize.ie</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">Invoice #:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-medium">Issue Date:</span> {new Date(invoice.issueDate).toLocaleDateString()}</p>
                <p><span className="font-medium">Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}</p>
                <p>
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                    invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Bill To:</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium text-gray-900">{customer?.name}</p>
              <p className="text-gray-600">{customer?.phone}</p>
              {customer?.email && <p className="text-gray-600">{customer.email}</p>}
              {customer?.address && <p className="text-gray-600">{customer.address}</p>}
            </div>
          </div>

          {/* Invoice Items */}
          <div className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Description</th>
                    <th className="text-center py-3 px-4 font-semibold text-gray-900">Quantity</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Unit Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{item.description}</td>
                      <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900">€{item.unitPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right text-gray-900">€{item.total.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Invoice Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>€{invoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (23%):</span>
                  <span>€{invoice.tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total:</span>
                    <span>€{invoice.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Terms */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Terms</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Payment is due within 30 days of invoice date</p>
              <p>• Late payments may incur additional charges</p>
              <p>• Please include invoice number with payment</p>
              <p>• For questions about this invoice, contact us at info@fixwize.ie</p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8 pt-6 border-t border-gray-200">
            <p>Thank you for choosing FIXWIZE for your automotive needs!</p>
          </div>
        </div>
      </div>
    </div>
  );
}