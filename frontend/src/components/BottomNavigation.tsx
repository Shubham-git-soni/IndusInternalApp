'use client';

import { useState } from 'react';
import { Home, ClipboardList, Plus, MessageSquare, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ModuleSidebar from './ModuleSidebar';

const BottomNavigation = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
 
  // Determine current module from path
  const getCurrentModule = () => {
    if (pathname.startsWith('/hrm')) return 'hrm';
    if (pathname.startsWith('/CRM')) return 'CRM';
    if (pathname.startsWith('/projectmanagement')) return 'projectmanagement';
    if (pathname.startsWith('/ticketmanagement')) return 'ticketmanagement';
    if (pathname.startsWith('/tasks')) return 'tasks';
    if (pathname.startsWith('/assets')) return 'assets';
    if (pathname.startsWith('/finance')) return 'finance';
    return 'dashboard';
  };

  const currentModule = getCurrentModule();

  // Check if current path is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Bottom Navigation - Mobile Only */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border px-4 py-2 shadow-lg">
        <div className="flex items-center justify-around">
          {/* Home */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center space-y-1 p-2 ${
              isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          {/* Tasks */}
          <Link
            href="/tasks"
            className={`flex flex-col items-center space-y-1 p-2 ${
              isActive('/tasks') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            <span className="text-xs">Tasks</span>
          </Link>

          {/* Create (Center FAB) */}
          <button className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center justify-center -mt-2">
            <Plus className="w-6 h-6" />
          </button>

          {/* Messages */}
          <Link
            href="/messages"
            className={`flex flex-col items-center space-y-1 p-2 ${
              isActive('/messages') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs">Messages</span>
          </Link>

          {/* Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center space-y-1 p-2 ${
              isMenuOpen ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-xs">Menu</span>
          </button>
        </div>
      </div>

      {/* Module-Specific Sidebar */}
      <ModuleSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        currentModule={currentModule}
        currentPath={pathname}
      />

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default BottomNavigation;