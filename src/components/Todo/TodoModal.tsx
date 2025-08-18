import React, { useState } from 'react';
import { X, Calendar, Clock, User, Tag, AlertTriangle, Repeat, Link } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { TodoTask } from '../../types';

interface TodoModalProps {
  onClose: () => void;
  task?: TodoTask | null;
  organizationId: string;
}

export default function TodoModal({ onClose, task, organizationId }: TodoModalProps) {
  const { user } = useAuth();
  const { customers, cars, workOrders, addTodoTask, updateTodoTask } = useData();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    status: task?.status || 'pending',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : '',
    reminderTime: task?.reminderTime ? new Date(task.reminderTime).toISOString().slice(0, 16) : '',
    category: task?.category || 'general',
    relatedCustomerId: task?.relatedCustomerId || '',
    relatedWorkOrderId: task?.relatedWorkOrderId || '',
    relatedCarId: task?.relatedCarId || '',
    tags: task?.tags.join(', ') || '',
    isRecurring: task?.isRecurring || false,
    recurringPattern: task?.recurringPattern || 'weekly'
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData = {
      organizationId,
      userId: user?.id || '',
      userName: user?.name || '',
      title: formData.title,
      description: formData.description || undefined,
      priority: formData.priority as TodoTask['priority'],
      status: formData.status as TodoTask['status'],
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      reminderTime: formData.reminderTime ? new Date(formData.reminderTime) : undefined,
      category: formData.category as TodoTask['category'],
      relatedCustomerId: formData.relatedCustomerId || undefined,
      relatedWorkOrderId: formData.relatedWorkOrderId || undefined,
      relatedCarId: formData.relatedCarId || undefined,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      isRecurring: formData.isRecurring,
      recurringPattern: formData.isRecurring ? formData.recurringPattern as TodoTask['recurringPattern'] : undefined,
      completedAt: formData.status === 'completed' ? new Date() : undefined
    };

    if (task) {
      updateTodoTask(task.id, taskData);
    } else {
      addTodoTask(taskData);
    }
    
    onClose();
  };

  const addTag = () => {
    if (tagInput.trim()) {
      const currentTags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      if (!currentTags.includes(tagInput.trim())) {
        const newTags = [...currentTags, tagInput.trim()].join(', ');
        setFormData({ ...formData, tags: newTags });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    const newTags = currentTags.filter(tag => tag !== tagToRemove).join(', ');
    setFormData({ ...formData, tags: newTags });
  };

  const currentTags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [];

  // Filter cars based on selected customer
  const availableCars = formData.relatedCustomerId 
    ? cars.filter(car => car.customerId === formData.relatedCustomerId)
    : [];

  // Filter work orders based on selected customer
  const availableWorkOrders = formData.relatedCustomerId 
    ? workOrders.filter(wo => wo.customerId === formData.relatedCustomerId)
    : workOrders;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Order headlight for BMW X5"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Additional details about the task..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AlertTriangle className="h-4 w-4 inline mr-2" />
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
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
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="general">General</option>
                <option value="customer">Customer</option>
                <option value="parts">Parts</option>
                <option value="maintenance">Maintenance</option>
                <option value="follow_up">Follow Up</option>
                <option value="order">Order</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                Due Date & Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="h-4 w-4 inline mr-2" />
                Reminder Time (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.reminderTime}
                onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Related Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Link className="h-5 w-5 mr-2" />
              Link to Related Items (Optional)
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4 inline mr-2" />
                Related Customer
              </label>
              <select
                value={formData.relatedCustomerId}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  relatedCustomerId: e.target.value,
                  relatedCarId: '', // Reset car selection when customer changes
                  relatedWorkOrderId: '' // Reset work order selection when customer changes
                })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.phone}
                  </option>
                ))}
              </select>
            </div>

            {formData.relatedCustomerId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Car
                  </label>
                  <select
                    value={formData.relatedCarId}
                    onChange={(e) => setFormData({ ...formData, relatedCarId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Car</option>
                    {availableCars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.registration} - {car.make} {car.model}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Related Work Order
                  </label>
                  <select
                    value={formData.relatedWorkOrderId}
                    onChange={(e) => setFormData({ ...formData, relatedWorkOrderId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Work Order</option>
                    {availableWorkOrders.map(wo => (
                      <option key={wo.id} value={wo.id}>
                        {wo.description.substring(0, 50)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Tag className="h-4 w-4 inline mr-2" />
              Tags
            </label>
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag and press Enter"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add
              </button>
            </div>
            {currentTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {currentTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Recurring Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRecurring"
                checked={formData.isRecurring}
                onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 flex items-center">
                <Repeat className="h-4 w-4 mr-2" />
                Make this a recurring task
              </label>
            </div>

            {formData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recurring Pattern
                </label>
                <select
                  value={formData.recurringPattern}
                  onChange={(e) => setFormData({ ...formData, recurringPattern: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
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
              {task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}