import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, Calendar, User, Tag, MoreVertical, Edit, Trash2, Bell } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import TodoModal from './TodoModal';
import { TodoTask } from '../../types';

export default function TodoList() {
  const { user } = useAuth();
  const { todoTasks, customers, cars, workOrders, updateTodoTask, deleteTodoTask } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<TodoTask | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'upcoming' | 'all'>('today');

  // Filter tasks based on current user's organization
  const organizationId = user?.id || 'default-org';
  const myTasks = todoTasks.filter(task => task.organizationId === organizationId);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'customer': return 'bg-blue-100 text-blue-800';
      case 'parts': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'follow_up': return 'bg-green-100 text-green-800';
      case 'order': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isUpcoming = (date: Date) => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return date > today && date <= nextWeek;
  };

  const isOverdue = (date: Date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date < today;
  };

  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    const matchesCategory = categoryFilter === 'all' || task.category === categoryFilter;

    let matchesView = true;
    if (viewMode === 'today' && task.dueDate) {
      matchesView = isToday(task.dueDate) || isOverdue(task.dueDate);
    } else if (viewMode === 'upcoming' && task.dueDate) {
      matchesView = isUpcoming(task.dueDate);
    }

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesView;
  });

  const handleToggleComplete = (task: TodoTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    updateTodoTask(task.id, { 
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date() : undefined
    });
  };

  const handleEdit = (task: TodoTask) => {
    setSelectedTask(task);
    setShowModal(true);
  };

  const handleDelete = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTodoTask(taskId);
    }
  };

  const getRelatedInfo = (task: TodoTask) => {
    let info = '';
    if (task.relatedCustomerId) {
      const customer = customers.find(c => c.id === task.relatedCustomerId);
      info += customer ? `Customer: ${customer.name}` : '';
    }
    if (task.relatedCarId) {
      const car = cars.find(c => c.id === task.relatedCarId);
      if (car) {
        info += info ? ` | Car: ${car.registration}` : `Car: ${car.registration}`;
      }
    }
    if (task.relatedWorkOrderId) {
      const workOrder = workOrders.find(wo => wo.id === task.relatedWorkOrderId);
      if (workOrder) {
        info += info ? ` | Work Order: ${workOrder.description.substring(0, 30)}...` : `Work Order: ${workOrder.description.substring(0, 30)}...`;
      }
    }
    return info;
  };

  // Get today's stats
  const todayTasks = myTasks.filter(task => task.dueDate && isToday(task.dueDate));
  const overdueTasks = myTasks.filter(task => task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed');
  const completedToday = myTasks.filter(task => task.completedAt && isToday(task.completedAt));

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-blue-600">Today's Tasks</p>
              <p className="text-2xl font-bold text-blue-900">{todayTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-red-600">Overdue</p>
              <p className="text-2xl font-bold text-red-900">{overdueTasks.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-green-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-900">{completedToday.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-orange-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-900">
                {myTasks.filter(t => t.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">To-Do List</h2>
            <p className="text-gray-600">Manage your daily tasks and reminders</p>
          </div>
          
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center space-x-4 mt-6 border-b border-gray-200">
          {[
            { id: 'today', label: 'Today', count: todayTasks.length + overdueTasks.length },
            { id: 'upcoming', label: 'Upcoming', count: myTasks.filter(t => t.dueDate && isUpcoming(t.dueDate)).length },
            { id: 'all', label: 'All Tasks', count: myTasks.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setViewMode(tab.id as any)}
              className={`flex items-center space-x-2 pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                viewMode === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                viewMode === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="customer">Customer</option>
            <option value="parts">Parts</option>
            <option value="maintenance">Maintenance</option>
            <option value="follow_up">Follow Up</option>
            <option value="order">Order</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isTaskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completed';
          const relatedInfo = getRelatedInfo(task);
          
          return (
            <div
              key={task.id}
              className={`bg-white rounded-lg border p-4 hover:shadow-md transition-shadow ${
                isTaskOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                <button
                  onClick={() => handleToggleComplete(task)}
                  className={`mt-1 p-1 rounded-full transition-colors ${
                    task.status === 'completed'
                      ? 'text-green-600 bg-green-100'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-100'
                  }`}
                >
                  <CheckCircle className="h-5 w-5" />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className={`font-medium ${
                        task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      {relatedInfo && (
                        <p className="text-xs text-blue-600 mt-1">{relatedInfo}</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.category)}`}>
                        {task.category.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {task.dueDate && (
                        <div className={`flex items-center space-x-1 ${
                          isTaskOverdue ? 'text-red-600 font-medium' : ''
                        }`}>
                          <Calendar className="h-3 w-3" />
                          <span>
                            {isToday(task.dueDate) ? 'Today' : task.dueDate.toLocaleDateString()}
                            {task.dueDate.getHours() !== 0 && ` at ${task.dueDate.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}`}
                          </span>
                          {isTaskOverdue && <span className="text-red-600 font-medium">(Overdue)</span>}
                        </div>
                      )}
                      {task.reminderTime && (
                        <div className="flex items-center space-x-1">
                          <Bell className="h-3 w-3" />
                          <span>Reminder: {task.reminderTime.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{task.userName}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEdit(task)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Task"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Task"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {task.tags.length > 0 && (
                    <div className="flex items-center space-x-2 mt-2">
                      <Tag className="h-3 w-3 text-gray-400" />
                      <div className="flex flex-wrap gap-1">
                        {task.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
          <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-4">
            {viewMode === 'today' ? "You don't have any tasks for today. Great job!" : 
             viewMode === 'upcoming' ? "No upcoming tasks in the next 7 days." :
             "No tasks match your current filters."}
          </p>
          <button
            onClick={() => {
              setSelectedTask(null);
              setShowModal(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Task
          </button>
        </div>
      )}

      {showModal && (
        <TodoModal
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          organizationId={organizationId}
        />
      )}
    </div>
  );
}