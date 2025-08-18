import React, { useState } from 'react';
import { Activity, User, Calendar, Filter, Search, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

interface ActivityLogProps {
  organizationId?: string;
  memberId?: string;
  onClose?: () => void;
}

export default function ActivityLog({ organizationId, memberId, onClose }: ActivityLogProps) {
  const { activityLog, teamMembers } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Filter activities
  let filteredActivities = activityLog;

  if (organizationId) {
    filteredActivities = filteredActivities.filter(activity => activity.organizationId === organizationId);
  }

  if (memberId) {
    filteredActivities = filteredActivities.filter(activity => activity.userId === memberId);
  }

  if (searchTerm) {
    filteredActivities = filteredActivities.filter(activity =>
      activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (actionFilter !== 'all') {
    filteredActivities = filteredActivities.filter(activity => activity.action === actionFilter);
  }

  if (dateFilter !== 'all') {
    const now = new Date();
    const filterDate = new Date();
    
    switch (dateFilter) {
      case 'today':
        filterDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
    }
    
    if (dateFilter !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        new Date(activity.timestamp) >= filterDate
      );
    }
  }

  // Sort by most recent first
  filteredActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      case 'login': return 'bg-purple-100 text-purple-800';
      case 'logout': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return '➕';
      case 'update': return '✏️';
      case 'delete': return '🗑️';
      case 'login': return '🔓';
      case 'logout': return '🔒';
      default: return '📝';
    }
  };

  const uniqueActions = [...new Set(activityLog.map(a => a.action))];

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Activity Log
            {memberId && (
              <span className="ml-2 text-sm text-gray-500">
                - {teamMembers.find(m => m.id === memberId)?.name}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600">Track all system activities and changes</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Actions</option>
          {uniqueActions.map(action => (
            <option key={action} value={action}>
              {action.charAt(0).toUpperCase() + action.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">Last Week</option>
          <option value="month">Last Month</option>
        </select>
      </div>

      {/* Activity List */}
      <div className="space-y-3">
        {filteredActivities.map((activity) => (
          <div key={activity.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${getActionColor(activity.action)}`}>
                  {getActionIcon(activity.action)}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{activity.userName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getActionColor(activity.action)}`}>
                      {activity.action.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                
                {activity.details && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    <strong>Details:</strong> {activity.details}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-600">No activities match your current filters</p>
        </div>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
}