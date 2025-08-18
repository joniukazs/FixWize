import React, { useState } from 'react';
import { X, User, Phone, Mail, Shield, Key, Eye, EyeOff } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface TeamMemberModalProps {
  onClose: () => void;
  member?: any;
  organizationId: string;
}

export default function TeamMemberModal({ onClose, member, organizationId }: TeamMemberModalProps) {
  const { addTeamMember, updateTeamMember } = useData();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: member?.name || '',
    username: member?.username || '',
    phone: member?.phone || '',
    email: member?.email || '',
    role: member?.role || 'technician',
    status: member?.status || 'active',
    password: '',
    permissions: member?.permissions || []
  });

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const rolePermissions = {
    admin: ['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings'],
    manager: ['manage_customers', 'manage_work_orders', 'manage_invoices', 'view_reports', 'manage_parts'],
    technician: ['view_customers', 'manage_work_orders', 'view_parts', 'update_work_status'],
    receptionist: ['manage_customers', 'view_work_orders', 'manage_appointments', 'send_sms'],
    parts_manager: ['manage_parts', 'manage_suppliers', 'view_work_orders', 'manage_part_requests']
  };

  const allPermissions = [
    'manage_team',
    'manage_customers', 
    'manage_work_orders',
    'manage_invoices',
    'manage_parts',
    'manage_suppliers',
    'view_reports',
    'manage_settings',
    'manage_appointments',
    'send_sms',
    'view_parts',
    'update_work_status',
    'manage_part_requests'
  ];

  const handleRoleChange = (newRole: string) => {
    setFormData({
      ...formData,
      role: newRole,
      permissions: rolePermissions[newRole as keyof typeof rolePermissions] || []
    });
  };

  const handlePermissionToggle = (permission: string) => {
    const newPermissions = formData.permissions.includes(permission)
      ? formData.permissions.filter(p => p !== permission)
      : [...formData.permissions, permission];
    
    setFormData({ ...formData, permissions: newPermissions });
  };

  const generateUsername = (name: string) => {
    const baseUsername = name.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
    let username = baseUsername;

    if (!username) {
      username = 'user' + Date.now();
    }

    return username;
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
  };

  const validateForm = () => {
    let isValid = true;

    // Reset errors
    setUsernameError('');
    setEmailError('');

    // Validate username
    if (!formData.username) {
      setUsernameError('Username is required');
      isValid = false;
    } else if (formData.username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      isValid = false;
    }

    // Validate email
    if (!formData.email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    // Validate password for new members
    if (!member && !formData.password) {
      alert('Password is required for new team members');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      if (member) {
        updateTeamMember(member.id, {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          permissions: formData.permissions,
          status: formData.status
        });
      } else {
        addTeamMember({
          organizationId,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          permissions: formData.permissions,
          status: formData.status
        });
      }
      
      alert(member ? 'Team member updated successfully!' : 'Team member created successfully!');
      onClose();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {member ? 'Edit Team Member' : 'Add New Team Member'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (!member && !formData.username) {
                    const newUsername = generateUsername(e.target.value);
                    setFormData(prev => ({ ...prev, name: e.target.value, username: newUsername }));
                  }
                }}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  const username = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '');
                  setFormData({ ...formData, username });
                  setUsernameError('');
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent ${
                  usernameError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="username"
                required
              />
              {usernameError && (
                <p className="text-red-600 text-xs mt-1">{usernameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setEmailError('');
                }}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:border-transparent ${
                  emailError ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                }`}
                required
              />
              {emailError && (
                <p className="text-red-600 text-xs mt-1">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Shield className="h-4 w-4 inline mr-2" />
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="technician">Technician</option>
                <option value="receptionist">Receptionist</option>
                <option value="parts_manager">Parts Manager</option>
                <option value="manager">Manager</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {!member && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="h-4 w-4 inline mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password"
                  required
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={generatePassword}
                    className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password will be used for email/password login
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-3">
              {allPermissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    {permission.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Login Information</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Email:</strong> {formData.email || 'Not set'}</p>
              <p><strong>Username:</strong> {formData.username || 'Not set'}</p>
              <p><strong>Phone:</strong> {formData.phone || 'Not set'}</p>
              <p className="text-xs text-blue-600 mt-2">
                This team member can login using either email/password or phone number (demo mode)
              </p>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {member ? 'Update Member' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}