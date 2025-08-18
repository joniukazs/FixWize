import React from 'react';
import { 
  Calendar, 
  Wrench, 
  Users, 
  Car, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Bell,
  Package,
  UserCheck,
  CheckSquare,
  X,
  Menu
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  const { user } = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, roles: ['admin', 'technician'] },
    { id: 'todo', label: 'To-Do List', icon: CheckSquare, roles: ['admin', 'technician', 'manager', 'receptionist'] },
    { id: 'calendar', label: 'Calendar', icon: Calendar, roles: ['admin', 'technician'] },
    { id: 'work-orders', label: 'Work Orders', icon: Wrench, roles: ['admin', 'technician'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'technician'] },
    { id: 'cars', label: 'Cars', icon: Car, roles: ['admin', 'technician'] },
    { id: 'parts', label: 'Parts', icon: Package, roles: ['admin', 'technician', 'parts_supplier'] },
    { id: 'invoices', label: 'Invoices', icon: FileText, roles: ['admin'] },
    { id: 'team', label: 'Team', icon: UserCheck, roles: ['admin', 'parts_supplier'] },
    { id: 'chat', label: 'Team Chat', icon: MessageSquare, roles: ['admin', 'technician', 'parts_supplier'] },
    { id: 'sms', label: 'SMS Center', icon: Bell, roles: ['admin'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['admin'] }
  ];

  const filteredItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const handleItemClick = (itemId: string) => {
    onTabChange(itemId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 md:z-auto
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
        text-white w-64 min-h-screen p-4 flex flex-col
      `} style={{ backgroundColor: '#2c5c8c' }}>
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#1e3a5f' }}>
                <Wrench className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">FIXWIZE</h1>
                <p className="text-xs text-gray-300 hidden sm:block">Developed by RJS version: v14A6x8</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={onToggle}
              className="md:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  activeTab === item.id
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
                style={activeTab === item.id ? { backgroundColor: '#1e3a5f' } : {}}
                onMouseEnter={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.backgroundColor = '#1e3a5f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== item.id) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer info for mobile */}
        <div className="mt-auto pt-4 border-t border-white border-opacity-20 md:hidden">
          <p className="text-xs text-gray-300 text-center">
            Developed by RJS version: v14A6x8
          </p>
        </div>
      </div>
    </>
  );
}