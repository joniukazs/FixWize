import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, CheckCircle, AlertTriangle, User, Car, Filter } from 'lucide-react';
import { useData } from '../../contexts/DataContext';

export default function CalendarTab() {
  const { workOrders, customers, cars, addWorkOrder, updateWorkOrder } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'today' | 'week' | 'month'>('today');

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

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      case 'on_hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
    // For now, just show work order details in alert
    const customer = customers.find(c => c.id === workOrder.customerId);
    const car = cars.find(c => c.id === workOrder.carId);
    alert(`Work Order Details:\n\nDescription: ${workOrder.description}\nCustomer: ${customer?.name}\nCar: ${car?.registration} - ${car?.make} ${car?.model}\nStatus: ${workOrder.status}\nDue: ${new Date(workOrder.dueDate).toLocaleString()}`);
  };

  const handleNewWorkOrder = () => {
    // Simple prompt-based work order creation
    const description = prompt('Enter work description:');
    if (!description) return;
    
    const customerName = prompt('Enter customer name:');
    if (!customerName) return;
    
    const customerPhone = prompt('Enter customer phone:');
    if (!customerPhone) return;
    
    const carReg = prompt('Enter car registration:');
    if (!carReg) return;
    
    const carMake = prompt('Enter car make:');
    if (!carMake) return;
    
    const carModel = prompt('Enter car model:');
    if (!carModel) return;
    
    // Create new customer
    const newCustomer = {
      name: customerName,
      phone: customerPhone,
      email: '',
      address: '',
      cars: []
    };
    
    // Add customer to data context
    const customerId = Date.now().toString();
    
    // Create new car
    const newCar = {
      registration: carReg.toUpperCase(),
      make: carMake,
      model: carModel,
      year: new Date().getFullYear(),
      customerId: customerId,
      serviceHistory: []
    };
    
    // Create work order
    const newWorkOrder = {
      customerId: customerId,
      carId: (Date.now() + 1).toString(),
      description: description,
      dueDate: selectedDate,
      status: 'pending' as const,
      priority: 'medium' as const,
      parts: [],
      images: [],
      notes: []
    };
    
    // Add to data context
    addWorkOrder(newWorkOrder);
    
    alert('Work order created successfully!');
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
          <p className="text-gray-600">Scheduled work orders overview</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle - Maintainx Style */}
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

          {/* Desktop New Work Order Button */}
          <button
            onClick={handleNewWorkOrder}
            className="hidden sm:flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Work Order</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
        {/* Today's View */}
        {viewMode === 'today' && (
          <div className="p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Clock className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                Today's Work Orders ({todaysOrders.length})
              </h3>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>

            {todaysOrders.length > 0 ? (
              <div className="space-y-4">
                {todaysOrders.map(order => (
                  <div 
                    key={order.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleWorkOrderClick(order)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(order.status)}`}></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-2">{order.description}</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            <span>{getCustomerName(order.customerId)}</span>
                          </div>
                          <div className="flex items-center">
                            <Car className="h-4 w-4 mr-2" />
                            <span>{getCarInfo(order.carId)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>{new Date(order.dueDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                        {order.estimatedCost && (
                          <div className="text-sm font-medium text-gray-900 mt-2">€{order.estimatedCost}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No work orders scheduled for today</h3>
                <p className="text-gray-600 mb-6">You're all caught up! Schedule new work orders to keep your team busy.</p>
                <button
                  onClick={handleNewWorkOrder}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Work Order
                </button>
              </div>
            )}
          </div>
        )}

        {/* Week View */}
        {viewMode === 'week' && (
          <div>
            {/* Week Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-xl">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold">
                  {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </h3>
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
                      className={`p-3 rounded text-center transition-colors ${
                        isSelected ? 'bg-white text-blue-600' : 
                        isToday ? 'bg-blue-500 text-white' : 
                        'hover:bg-blue-500'
                      }`}
                    >
                      <div className="text-xs font-medium">{dayNames[date.getDay()]}</div>
                      <div className="text-lg font-bold">{date.getDate()}</div>
                      {dayOrders.length > 0 && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Work Orders */}
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>
              
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
                          <h5 className="font-medium text-gray-900 mb-1">{order.description}</h5>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
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
                  <p className="text-sm text-gray-400 mt-1">Try selecting a different date or create a new work order</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Month View */}
        {viewMode === 'month' && (
          <div>
            {/* Month Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-xl font-bold text-gray-900">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h3>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                Today
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {dayNames.map(day => (
                  <div key={day} className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-700">
                    {day}
                  </div>
                ))}
                
                {days.map((day, index) => {
                  const ordersForDay = day ? getWorkOrdersForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={index}
                      className={`bg-white min-h-[120px] p-2 ${
                        day ? 'hover:bg-gray-50 cursor-pointer' : ''
                      } ${isToday ? 'bg-blue-50 border-2 border-blue-200' : ''} ${isSelected ? 'bg-blue-100' : ''}`}
                      onClick={() => day && setSelectedDate(day)}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${
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
                                className="text-xs p-2 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors cursor-pointer border-l-2 border-blue-500"
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

              {/* Selected Date Details */}
              {selectedDate && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">
                    Work Orders for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </h4>
                  {selectedDateOrders.length > 0 ? (
                    <div className="space-y-2">
                      {selectedDateOrders.map(order => (
                        <div 
                          key={order.id} 
                          className="flex items-center justify-between p-3 bg-white rounded border cursor-pointer hover:shadow-sm transition-shadow"
                          onClick={() => handleWorkOrderClick(order)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-4">
                              <span className="font-medium text-gray-900">
                                {new Date(order.dueDate).toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              <span className="text-gray-900">{order.description}</span>
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {getCustomerName(order.customerId)} - {getCarInfo(order.carId)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(order.status)}`}>
                              {order.status.replace('_', ' ')}
                            </span>
                            {order.estimatedCost && (
                              <span className="text-sm font-medium text-gray-900">€{order.estimatedCost}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-blue-700">No work orders scheduled for this date.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Floating Action Button */}
      <button
        onClick={handleNewWorkOrder}
        className="sm:hidden fixed bottom-6 right-6 bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center z-40"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}