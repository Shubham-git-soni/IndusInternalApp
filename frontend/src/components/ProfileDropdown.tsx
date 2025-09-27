'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

const ProfileDropdown = () => {
  // Get user from localStorage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Call logout API
      await fetch('http://localhost:5153/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Clear localStorage
      localStorage.removeItem('user');

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-medium text-sm">
            {user.fullName.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900">
            {user.fullName}
          </p>
          <p className="text-xs text-gray-500">
            {user.role}
          </p>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info - Mobile Only */}
          <div className="sm:hidden px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user.fullName}
            </p>
            <p className="text-xs text-gray-500">
              {user.role}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile settings
                router.push('/profile');
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to settings
                router.push('/settings');
              }}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            <div className="border-t border-gray-200 my-1"></div>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut className="w-4 h-4" />
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
              {isLoggingOut && (
                <svg className="animate-spin ml-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;