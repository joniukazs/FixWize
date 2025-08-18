import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Eye, UserPlus, Activity, Shield, Phone, Mail, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import TeamMemberModal from './TeamMemberModal';
import ActivityLog from './ActivityLog';

export default function TeamManagement() {
  const { user } = useAuth();
  const { teamMembers, addTeamMember, updateTeamMember, deleteTeamMember, activityLog } = useData();
  const [activeTab, setActiveTab] = useState('members');
  const [selectedMember, setSelectedMember] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [selectedMemberActivity, setSelectedMemberActivity] = useState<string | null>(null);

  // Filter team members by current user's organization (use user ID as organization ID)
  const organizationId = user?.id || 'default-org';
  const myTeamMembers = teamMembers.filter(member => member.organizationId === organizationId);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      case 'technician': return 'bg-green-100 text-green-800';
      case 'receptionist': return 'bg-orange-100 text-orange-800';
      case 'parts_manager': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (member: any) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDelete = (memberId: string) => {
    if (window.confirm('Are you sure you want to remove this team member?')) {
      deleteTeamMember(memberId);
    }
  };

  const handleViewActivity = (memberId: string) => {
    setSelectedMemberActivity(memberId);
    setShowActivityLog(true);
  };

  const tabs = [
    { id: 'members', label: 'Team Members', icon: Users },
    { id: 'activity', label: 'Activity Log', icon: Activity },
    { id: 'permissions', label: 'Permissions', icon: Shield }
  ];

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
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Team Members</h3>
                  <p className="text-sm text-gray-600">Manage your team members and their access</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedMember(null);
                    setShowModal(true);
                  }}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Add Team Member</span>
                </button>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Members</p>
                      <p className="text-2xl font-bold text-blue-900">{myTeamMembers.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Shield className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Active</p>
                      <p className="text-2xl font-bold text-green-900">
                        {myTeamMembers.filter(m => m.status === 'active').length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-orange-600">This Month</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {myTeamMembers.filter(m => 
                          new Date(m.createdAt).getMonth() === new Date().getMonth()
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Online Now</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {myTeamMembers.filter(m => m.lastActive && 
                          new Date().getTime() - new Date(m.lastActive).getTime() < 5 * 60 * 1000
                        ).length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myTeamMembers.map((member) => (
                  <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{member.name}</h4>
                          <p className="text-sm text-gray-500">@{member.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleViewActivity(member.id)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Activity"
                        >
                          <Activity className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(member)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Member"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Remove Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                          {member.role.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                          {member.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-3 w-3" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail className="h-3 w-3" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-3 w-3" />
                          <span>Joined {new Date(member.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      {member.lastActive && (
                        <div className="text-xs text-gray-500">
                          Last active: {new Date(member.lastActive).toLocaleString()}
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-100">
                        <h5 className="text-xs font-medium text-gray-700 mb-1">Permissions:</h5>
                        <div className="flex flex-wrap gap-1">
                          {member.permissions.slice(0, 3).map((permission, index) => (
                            <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              {permission.replace('_', ' ')}
                            </span>
                          ))}
                          {member.permissions.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{member.permissions.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {myTeamMembers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
                  <p className="text-gray-600 mb-4">Start building your team by adding members</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add First Team Member
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <ActivityLog organizationId={organizationId} />
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Role Permissions</h3>
              
              <div className="space-y-4">
                {[
                  {
                    role: 'admin',
                    name: 'Administrator',
                    description: 'Full access to all features and settings',
                    permissions: ['manage_team', 'manage_customers', 'manage_work_orders', 'manage_invoices', 'manage_parts', 'view_reports', 'manage_settings']
                  },
                  {
                    role: 'manager',
                    name: 'Manager',
                    description: 'Manage operations and team members',
                    permissions: ['manage_customers', 'manage_work_orders', 'manage_invoices', 'view_reports', 'manage_parts']
                  },
                  {
                    role: 'technician',
                    name: 'Technician',
                    description: 'Handle work orders and customer service',
                    permissions: ['view_customers', 'manage_work_orders', 'view_parts', 'update_work_status']
                  },
                  {
                    role: 'receptionist',
                    name: 'Receptionist',
                    description: 'Customer service and appointment management',
                    permissions: ['manage_customers', 'view_work_orders', 'manage_appointments', 'send_sms']
                  },
                  {
                    role: 'parts_manager',
                    name: 'Parts Manager',
                    description: 'Manage inventory and supplier relationships',
                    permissions: ['manage_parts', 'manage_suppliers', 'view_work_orders', 'manage_part_requests']
                  }
                ].map((roleInfo) => (
                  <div key={roleInfo.role} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">{roleInfo.name}</h4>
                        <p className="text-sm text-gray-600">{roleInfo.description}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(roleInfo.role)}`}>
                        {roleInfo.name.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {roleInfo.permissions.map((permission) => (
                        <span key={permission} className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                          {permission.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TeamMemberModal
          onClose={() => {
            setShowModal(false);
            setSelectedMember(null);
          }}
          member={selectedMember}
          organizationId={organizationId}
        />
      )}

      {showActivityLog && selectedMemberActivity && (
        <ActivityLog
          organizationId={organizationId}
          memberId={selectedMemberActivity}
          onClose={() => {
            setShowActivityLog(false);
            setSelectedMemberActivity(null);
          }}
        />
      )}
    </div>
  );
}