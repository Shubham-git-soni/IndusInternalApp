'use client';

import {
  Home,
  ClipboardList,
  MessageSquare,
  Settings,
  FileText,
  Users,
  Briefcase,
  KanbanSquare,
  ClipboardCheck,
  Landmark,
  
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const navigationItems = [
    { icon: Home, label: 'Dashboard', href: '/dashboard', active: true },
    { icon: ClipboardList, label: 'My Tasks', href: '/tasks' },
    { icon: MessageSquare, label: 'Messages', href: '/messages' },
  ];

  const moduleItems = [
    { icon: Users, label: 'HRM', href: '/hrm' },
    { icon: Briefcase, label: 'CRM', href: '/crm' },
    { icon: KanbanSquare, label: 'Projects', href: '/projects' },
    { icon: ClipboardCheck, label: 'Task Management', href: '/task-management' },
    { icon: Landmark, label: 'Finance', href: '/finance' },
  ];

  const bottomItems = [
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } hidden lg:block z-40`}>
      <div className="flex flex-col h-full">
        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    item.active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* Modules Section */}
          <div className="mt-6 px-3">
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Modules
              </h3>
            )}
            <nav className="space-y-1">
              {moduleItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="ml-3 font-medium">{item.label}</span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Items */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <nav className="space-y-1">
            {bottomItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="ml-3 font-medium">{item.label}</span>
                  )}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;