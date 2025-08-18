import React, { useState } from 'react';
import { ArrowLeft, Building, Upload, CreditCard, Check, FileText, Phone, Mail, MapPin } from 'lucide-react';

interface LicenseRegistrationProps {
  onBack: () => void;
}

export default function LicenseRegistration({ onBack }: LicenseRegistrationProps) {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro' | 'premium' | null>(null);
  const [serviceData, setServiceData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    vatNumber: '',
    description: ''
  });
  const [documents, setDocuments] = useState<File[]>([]);

  const plans = [
    {
      id: 'basic' as const,
      name: 'Basic',
      price: 30,
      features: [
        'Up to 50 work orders per month',
        'Basic customer management',
        'Simple invoicing',
        'Email support'
      ]
    },
    {
      id: 'pro' as const,
      name: 'Pro',
      price: 70,
      features: [
        'Up to 200 work orders per month',
        'Advanced customer management',
        'Professional invoicing',
        'SMS notifications',
        'Parts inventory management',
        'Priority support'
      ]
    },
    {
      id: 'premium' as const,
      name: 'Premium',
      price: 200,
      features: [
        'Unlimited work orders',
        'Complete garage management',
        'Advanced reporting & analytics',
        'Multi-location support',
        'API access',
        'Custom integrations',
        '24/7 dedicated support'
      ]
    }
  ];

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would process payment via Stripe
    alert('Registration submitted successfully! Our team will review your application and activate your account within 24-48 hours.');
    onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Get Your FIXWIZE License</h1>
              <p className="text-gray-600">Join thousands of garages using FIXWIZE</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <div className={`h-1 w-16 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 2 ? <Check className="h-4 w-4" /> : '2'}
              </div>
              <div className={`h-1 w-16 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                {step > 3 ? <Check className="h-4 w-4" /> : '3'}
              </div>
              <div className={`h-1 w-16 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                4
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Service Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Building className="h-4 w-4 inline mr-2" />
                    Service Name
                  </label>
                  <input
                    type="text"
                    value={serviceData.name}
                    onChange={(e) => setServiceData({ ...serviceData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your Garage Name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="h-4 w-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={serviceData.phone}
                    onChange={(e) => setServiceData({ ...serviceData, phone: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+353 1 234 5678"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="h-4 w-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={serviceData.email}
                    onChange={(e) => setServiceData({ ...serviceData, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="info@yourgarage.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    VAT Number
                  </label>
                  <input
                    type="text"
                    value={serviceData.vatNumber}
                    onChange={(e) => setServiceData({ ...serviceData, vatNumber: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="IE1234567T"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Business Address
                  </label>
                  <textarea
                    value={serviceData.address}
                    onChange={(e) => setServiceData({ ...serviceData, address: e.target.value })}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123 Main Street, Dublin, Ireland"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Description
                  </label>
                  <textarea
                    value={serviceData.description}
                    onChange={(e) => setServiceData({ ...serviceData, description: e.target.value })}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe your garage services, specializations, and experience..."
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!serviceData.name || !serviceData.phone || !serviceData.email || !serviceData.address}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Upload Documents
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Upload Required Documents</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Documents</h3>
                <p className="text-gray-600 mb-4">
                  Please upload the following required documents:
                </p>
                <ul className="text-sm text-gray-600 mb-6 text-left max-w-md mx-auto">
                  <li>• Business registration certificate</li>
                  <li>• Operating license</li>
                  <li>• Insurance certificates</li>
                  <li>• VAT registration (if applicable)</li>
                  <li>• Any other relevant certifications</li>
                </ul>
                
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleDocumentUpload}
                  className="hidden"
                  id="document-upload"
                />
                <label
                  htmlFor="document-upload"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-flex items-center space-x-2"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choose Files</span>
                </label>
              </div>

              {documents.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Uploaded Documents:</h4>
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm text-gray-700">{doc.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={documents.length === 0}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Choose Plan
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Choose Your Plan</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                  <div
                    key={plan.id}
                    className={`border-2 rounded-lg p-6 cursor-pointer transition-colors ${
                      selectedPlan === plan.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                      <div className="text-3xl font-bold text-blue-600 mt-2">
                        €{plan.price}
                        <span className="text-sm text-gray-600">/month</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <Check className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(2)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!selectedPlan}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Payment
                </button>
              </div>
            </div>
          )}

          {step === 4 && selectedPlan && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Payment</h2>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Plan:</span>
                    <span className="font-medium">{plans.find(p => p.id === selectedPlan)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Price:</span>
                    <span className="font-medium">€{plans.find(p => p.id === selectedPlan)?.price}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>€{plans.find(p => p.id === selectedPlan)?.price}/month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-5 w-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Payment Method</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> After payment, our team will review your application and documents. 
                  If approved, your account will be activated within 24-48 hours and you'll receive login credentials.
                </p>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep(3)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Complete Registration</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}