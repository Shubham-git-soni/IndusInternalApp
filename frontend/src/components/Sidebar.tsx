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
  Landmark,
  Ticket,
  Package,
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
    { icon: Briefcase, label: 'CRM', href: '/CRM' },
    { icon: KanbanSquare, label: 'Projects', href: '/projectmanagement' },
    { icon: Ticket, label: 'Ticket Management', href: '/ticketmanagement' },
    { icon: Package, label: 'Assets', href: '/assets' },
    { icon: Landmark, label: 'Finance', href: '/finance' },
  ];

  const bottomItems = [
    { icon: FileText, label: 'Reports', href: '/reports' },
    { icon: Settings, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-card border-r border-border transition-all duration-300 ${
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground hover:bg-accent'
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
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
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
                    className="flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
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
        <div className="p-3 border-t border-border">
          <nav className="space-y-1">
            {bottomItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center px-3 py-2 rounded-lg text-foreground hover:bg-accent transition-colors"
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