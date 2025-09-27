'use client';

import { LayoutGrid, List } from 'lucide-react';

interface ViewToggleProps {
  currentView: 'card' | 'grid';
  onViewChange: (view: 'card' | 'grid') => void;
  className?: string;
}

export default function ViewToggle({ currentView, onViewChange, className = '' }: ViewToggleProps) {
  return (
    <div className={`inline-flex rounded-lg border border-gray-200 p-1 bg-white ${className}`}>
      <button
        onClick={() => onViewChange('card')}
        className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentView === 'card'
            ? 'bg-blue-100 text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        title="Card View"
      >
        <LayoutGrid className="w-4 h-4" />
        <span className="ml-1.5 hidden sm:inline">Cards</span>
      </button>

      <button
        onClick={() => onViewChange('grid')}
        className={`flex items-center justify-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          currentView === 'grid'
            ? 'bg-blue-100 text-blue-600 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        title="List View"
      >
        <List className="w-4 h-4" />
        <span className="ml-1.5 hidden sm:inline">List</span>
      </button>
    </div>
  );
}