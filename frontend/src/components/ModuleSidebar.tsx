'use client';

import { X, Home, Users, UserPlus, Building2, Award, Calendar, FileText, IndianRupee, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';

interface ModuleSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentModule: string;
  currentPath: string;
}

const ModuleSidebar = ({ isOpen, onClose, currentModule, currentPath }: ModuleSidebarProps) => {
  // Module configurations
  const moduleConfigs = {
    dashboard: {
      title: 'Main Menu',
      items: [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'HRM', icon: Users, path: '/hrm' },
        { name: 'CRM', icon: Building2, path: '/crm' },
        { name: 'Projects', icon: FileText, path: '/projects' },
        { name: 'Tasks', icon: Calendar, path: '/tasks' },
        { name: 'Finance', icon: IndianRupee, path: '/finance' },
      ]
    },
    hrm: {
      title: 'HRM Menu',
      items: [
        { name: 'HRM Dashboard', icon: Home, path: '/hrm' },
        { name: 'All Team Members', icon: Users, path: '/hrm/employees' },
        { name: 'Add Team Member', icon: UserPlus, path: '/hrm/employees/add' },
        { name: 'Departments', icon: Building2, path: '/hrm/departments' },
        { name: 'Designations', icon: Award, path: '/hrm/designations' },
        { name: 'Leave Management', icon: Calendar, path: '/hrm/leaves' },
        { name: 'Attendance', icon: BarChart3, path: '/hrm/attendance' },
        { name: 'Payroll', icon: IndianRupee, path: '/hrm/payroll' },
        { name: 'HR Settings', icon: Settings, path: '/hrm/settings' },
      ]
    },
    crm: {
      title: 'CRM Menu',
      items: [
        { name: 'CRM Dashboard', icon: Home, path: '/crm' },
        { name: 'Customers', icon: Users, path: '/crm/customers' },
        { name: 'Leads', icon: UserPlus, path: '/crm/leads' },
        { name: 'Sales Pipeline', icon: BarChart3, path: '/crm/pipeline' },
      ]
    },
    projects: {
      title: 'Projects Menu',
      items: [
        { name: 'Projects Dashboard', icon: Home, path: '/projects' },
        { name: 'All Projects', icon: FileText, path: '/projects/list' },
        { name: 'Create Project', icon: UserPlus, path: '/projects/create' },
        { name: 'Project Reports', icon: BarChart3, path: '/projects/reports' },
      ]
    },
    tasks: {
      title: 'Tasks Menu',
      items: [
        { name: 'Tasks Dashboard', icon: Home, path: '/tasks' },
        { name: 'My Tasks', icon: Calendar, path: '/tasks/my' },
        { name: 'Create Task', icon: UserPlus, path: '/tasks/create' },
        { name: 'Task Reports', icon: BarChart3, path: '/tasks/reports' },
      ]
    },
    finance: {
      title: 'Finance Menu',
      items: [
        { name: 'Finance Dashboard', icon: Home, path: '/finance' },
        { name: 'Invoices', icon: FileText, path: '/finance/invoices' },
        { name: 'Expenses', icon: IndianRupee, path: '/finance/expenses' },
        { name: 'Reports', icon: BarChart3, path: '/finance/reports' },
      ]
    }
  };

  const config = moduleConfigs[currentModule as keyof typeof moduleConfigs] || moduleConfigs.dashboard;

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{config.title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-2">
            {config.items.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = currentPath === item.path ||
                              (item.path !== '/dashboard' && currentPath.startsWith(item.path));

              return (
                <Link
                  key={index}
                  href={item.path}
                  onClick={onClose}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center">
            <p className="text-xs text-gray-500 mb-2">Current Module</p>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              currentModule === 'dashboard' ? 'bg-gray-200 text-gray-700' :
              currentModule === 'hrm' ? 'bg-blue-100 text-blue-700' :
              currentModule === 'crm' ? 'bg-green-100 text-green-700' :
              currentModule === 'projects' ? 'bg-purple-100 text-purple-700' :
              currentModule === 'tasks' ? 'bg-orange-100 text-orange-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentModule.toUpperCase()}
            </div>
          </div>

          {/* Quick Access to Main Dashboard */}
          {currentModule !== 'dashboard' && (
            <Link
              href="/dashboard"
              onClick={onClose}
              className="flex items-center justify-center space-x-2 mt-3 p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleSidebar;