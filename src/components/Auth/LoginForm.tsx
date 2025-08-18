import React, { useState } from 'react';
import { Phone, Mail, Lock, Wrench, Building, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import LicenseRegistration from './LicenseRegistration';

export default function LoginForm() {
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'customer' | 'parts_supplier'>('admin');
  const [showLicenseForm, setShowLicenseForm] = useState(false);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMethod === 'email') {
      if (email.trim() && password.trim()) {
        await login({ email: email.trim(), password: password.trim() });
      }
    } else {
      if (phone.trim()) {
        await login({ phone: phone.trim(), userType });
      }
    }
  };

  const quickLogin = (credentials: { email?: string; phone?: string; password?: string; userType?: 'admin' | 'customer' | 'parts_supplier' }) => {
    if (credentials.email && credentials.password) {
      login({ email: credentials.email, password: credentials.password });
    } else if (credentials.phone) {
      login({ phone: credentials.phone, userType: credentials.userType });
    }
  };

  if (showLicenseForm) {
    return <LicenseRegistration onBack={() => setShowLicenseForm(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 md:p-8 max-h-[95vh] overflow-y-auto">
        <div className="text-center mb-6 md:mb-8">
          <div className="w-32 h-32 md:w-48 md:h-48 mx-auto mb-1 flex items-center justify-center">
            <img 
              src="/logo-main.png" 
              alt="FIXWIZE" 
              className="w-32 h-32 md:w-48 md:h-48 object-contain"
            />
          </div>
          <p className="text-gray-600 text-sm md:text-base">Professional Garage Management</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          {/* Login Method Toggle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Login Method
            </label>
            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`p-2 md:p-3 rounded-lg border-2 transition-colors text-xs md:text-sm ${
                  loginMethod === 'email'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Email & Password</div>
                <div className="text-xs text-gray-500">Secure login</div>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('phone')}
                className={`p-2 md:p-3 rounded-lg border-2 transition-colors text-xs md:text-sm ${
                  loginMethod === 'phone'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium">Phone Only</div>
                <div className="text-xs text-gray-500">Demo mode</div>
              </button>
            </div>
          </div>

          {loginMethod === 'email' ? (
            <>
              {/* Email Login */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fixwize.ie"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Phone Login */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Login Type
                </label>
                <div className="grid grid-cols-1 gap-2 md:gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('admin')}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-colors text-xs md:text-sm ${
                      userType === 'admin'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Service Portal</div>
                    <div className="text-xs text-gray-500">Admin & Technicians</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('customer')}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-colors text-xs md:text-sm ${
                      userType === 'customer'
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Customer Portal</div>
                    <div className="text-xs text-gray-500">Track your services</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('parts_supplier')}
                    className={`p-2 md:p-3 rounded-lg border-2 transition-colors text-xs md:text-sm ${
                      userType === 'parts_supplier'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium">Parts Supplier Portal</div>
                    <div className="text-xs text-gray-500">Manage part requests & quotes</div>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+353 85 123 4567"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setShowLicenseForm(true)}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Building className="h-5 w-5" />
            <span>Want to get a License?</span>
          </button>
        </form>

      </div>
    </div>
  );
}