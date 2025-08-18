import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, CheckCircle, AlertTriangle, User, Car, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import WorkOrderModal from '../WorkOrder/WorkOrderModal';

export default function CalendarView() {
  const { workOrders, customers, cars } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getWorkOrdersForDate = (date: Date) => {
    return workOrders.filter(wo => {
      const orderDate = new Date(wo.dueDate);
      return orderDate.toDateString() === date.toDateString();
    });
  };

  const getTodaysWorkOrders = () => {
    const today = new Date();
    return workOrders.filter(wo => {
      const orderDate = new Date(wo.dueDate);
      return orderDate.toDateString() === today.toDateString();
    });
  };

  const getThisWeekWorkOrders = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return workOrders.filter(wo => {
      const orderDate = new Date(wo.dueDate);
      return orderDate >= startOfWeek && orderDate <= endOfWeek;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(selectedDate.getDate() - 7);
    } else {
      newDate.setDate(selectedDate.getDate() + 7);
    }
    setSelectedDate(newDate);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer?.name || 'Unknown Customer';
  };

  const getCarInfo = (carId: string) => {
    const car = cars.find(c => c.id === carId);
    return car ? `${car.registration} - ${car.make} ${car.model}` : 'Unknown Car';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-orange-500';
      case 'pending': return 'bg-blue-500';
      case 'on_hold': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'on_hold': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleWorkOrderClick = (workOrder: any) => {
    setSelectedWorkOrder(workOrder);
    setShowModal(true);
  };

  const handleWorkOrderSaved = () => {
    setShowModal(false);
    setSelectedWorkOrder(null);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 3000);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const todaysOrders = getTodaysWorkOrders();
  const thisWeekOrders = getThisWeekWorkOrders();
  const selectedDateOrders = getWorkOrdersForDate(selectedDate);

  // Get week dates for week view
  const getWeekDates = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Work order created successfully!</span>
          </div>
        </div>
      )}

      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Calendar</h1>
            <p className="text-sm text-gray-600">Scheduled work orders overview</p>
          </div>
          
          {/* Desktop New Work Order Button */}
          <button
            onClick={() => {
              setSelectedWorkOrder(null);
              setShowModal(true);
            }}
            className="hidden md:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Work Order</span>
          </button>
        </div>

        {/* View Mode Toggle - Maintainx Style */}
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('today')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'today' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'month' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {/* Today's View */}
        {viewMode === 'today' && (
          <div className="h-full">
            {/* Today's Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Today's Work Orders ({todaysOrders.length})
                </h2>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            {/* Today's Work Orders */}
            <div className="flex-1 overflow-y-auto">
              {todaysOrders.length > 0 ? (
                <div className="p-4 space-y-3">
                  {todaysOrders.map(order => (
                    <div 
                      key={order.id} 
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleWorkOrderClick(order)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(order.status)}`}></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">{order.description}</h3>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="h-3 w-3 mr-2" />
                              <span>{getCustomerName(order.customerId)}</span>
                            </div>
                            <div className="flex items-center">
                              <Car className="h-3 w-3 mr-2" />
                              <span>{getCarInfo(order.carId)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-2" />
                              <span>{new Date(order.dueDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ')}
                          </span>
                          {order.estimatedCost && (
                            <div className="text-sm font-medium text-gray-900 mt-1">€{order.estimatedCost}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Clock className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders scheduled for today</h3>
                  <p className="text-gray-600 mb-6">You're all caught up! Schedule new work orders to keep your team busy.</p>
                  <button
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Schedule Work Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <div className="h-full">
            {/* Week Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h2>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              
              {/* Week Days */}
              <div className="grid grid-cols-7 gap-1">
                {weekDates.map((date, index) => {
                  const isToday = date.toDateString() === new Date().toDateString();
                  const isSelected = date.toDateString() === selectedDate.toDateString();
                  const dayOrders = getWorkOrdersForDate(date);
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDate(date)}
                      className={`p-2 rounded text-center transition-colors ${
                        isSelected ? 'bg-white text-blue-600' : 
                        isToday ? 'bg-blue-500 text-white' : 
                        'hover:bg-blue-500'
                      }`}
                    >
                      <div className="text-xs">{dayNames[date.getDay()]}</div>
                      <div className="text-lg font-semibold">{date.getDate()}</div>
                      {dayOrders.length > 0 && (
                        <div className="w-1 h-1 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Work Orders */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                
                {selectedDateOrders.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateOrders.map(order => (
                      <div 
                        key={order.id} 
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleWorkOrderClick(order)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(order.status)}`}></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 mb-1">{order.description}</h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center">
                                <User className="h-3 w-3 mr-2" />
                                <span>{getCustomerName(order.customerId)}</span>
                              </div>
                              <div className="flex items-center">
                                <Car className="h-3 w-3 mr-2" />
                                <span>{getCarInfo(order.carId)}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-2" />
                                <span>{new Date(order.dueDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                            {order.estimatedCost && (
                              <div className="text-sm font-medium text-gray-900 mt-1">€{order.estimatedCost}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No work orders found for this date</p>
                    <p className="text-sm text-gray-400 mt-1">Try selecting a different date or adjusting filters</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <div className="h-full flex flex-col">
            {/* Month Header */}
            <div className="bg-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h2 className="text-lg font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white">
              <div className="grid grid-cols-7 border-b border-gray-200">
                {dayNames.map(day => (
                  <div key={day} className="p-3 text-center text-xs font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 h-full">
                {days.map((day, index) => {
                  const ordersForDay = day ? getWorkOrdersForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && day.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`min-h-[80px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                        day ? 'hover:bg-gray-50 cursor-pointer' : 'bg-gray-50'
                      } ${isToday ? 'bg-blue-50 border-blue-200' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-1 ${
                            isToday ? 'text-blue-600' : 'text-gray-900'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {ordersForDay.slice(0, 2).map(order => (
                              <div
                                key={order.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWorkOrderClick(order);
                                }}
                                className="text-xs p-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer border-l-2 border-blue-500"
                                title={`${order.description} - ${getCustomerName(order.customerId)}`}
                              >
                                <div className="font-medium truncate">{order.description}</div>
                                <div className="text-xs opacity-75 truncate">
                                  {new Date(order.dueDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            ))}
                            {ordersForDay.length > 2 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{ordersForDay.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => {
          setSelectedWorkOrder(null);
          setShowModal(true);
        }}
        className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Work Order Modal */}
      {showModal && (
        <WorkOrderModal
          onClose={handleWorkOrderSaved}
          workOrder={selectedWorkOrder}
          initialDate={selectedDate}
        />
      )}
    </div>
  );
}