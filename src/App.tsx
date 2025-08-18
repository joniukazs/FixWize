import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginForm from './components/Auth/LoginForm';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import DashboardStats from './components/Dashboard/DashboardStats';
import RecentActivity from './components/Dashboard/RecentActivity';
import CalendarView from './components/Calendar/CalendarView';
import WorkOrderList from './components/WorkOrder/WorkOrderList';
import WorkOrdersTab from './components/WorkOrder/WorkOrdersTab';
import CalendarTab from './components/Calendar/CalendarTab';
import TeamChat from './components/Chat/TeamChat';
import SMSCenter from './components/SMS/SMSCenter';
import InvoiceList from './components/Invoice/InvoiceList';
import CustomerList from './components/Customer/CustomerList';
import CarList from './components/Car/CarList';
import PartsList from './components/Parts/PartsList';
import CustomerPortal from './components/Customer/CustomerPortal';
import PartsSupplierPortal from './components/Parts/PartsSupplierPortal';
import TeamManagement from './components/Team/TeamManagement';
import Settings from './components/Settings/Settings';
import TodoList from './components/Todo/TodoList';

function AppContent() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('calendar');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <LoginForm />;
  }

  // Show customer portal for customer users
  if (user.role === 'customer') {
    return <CustomerPortal />;
  }

  // Show parts supplier portal for parts supplier users
  if (user.role === 'parts_supplier') {
    return <PartsSupplierPortal />;
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'todo': return 'To-Do List';
      case 'calendar': return 'Calendar';
      case 'work-orders': return 'Work Orders';
      case 'customers': return 'Customers';
      case 'cars': return 'Cars';
      case 'parts': return 'Parts Management';
      case 'invoices': return 'Invoices';
      case 'team': return 'Team Management';
      case 'chat': return 'Team Chat';
      case 'sms': return 'SMS Center';
      case 'settings': return 'Settings';
      default: return 'FIXWIZE';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <DashboardStats />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('work-orders')}
                    className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-medium text-blue-900">Create Work Order</div>
                    <div className="text-sm text-blue-600">Schedule new service</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('todo')}
                    className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="font-medium text-green-900">Add Task</div>
                    <div className="text-sm text-green-600">Create reminder or to-do</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="w-full text-left p-3 bg-black bg-opacity-5 rounded-lg hover:bg-black hover:bg-opacity-10 transition-colors"
                  >
                    <div className="font-medium text-gray-900">Add Customer</div>
                    <div className="text-sm text-gray-600">Register new customer</div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('invoices')}
                    className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <div className="font-medium text-blue-900">Create Invoice</div>
                    <div className="text-sm text-blue-600">Generate new invoice</div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'todo':
        return <TodoList />;
      case 'calendar':
        return <CalendarTab />;
      case 'work-orders':
        return <WorkOrdersTab />;
      case 'customers':
        return <CustomerList />;
      case 'cars':
        return <CarList />;
      case 'parts':
        return <PartsList />;
      case 'team':
        return <TeamManagement />;
      case 'chat':
        return <TeamChat />;
      case 'sms':
        return <SMSCenter />;
      case 'invoices':
        return <InvoiceList />;
      case 'settings':
        return <Settings />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;