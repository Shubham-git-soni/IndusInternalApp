'use client';

import { useState } from 'react';
import { Filter, Download, X, FileText, Table, File, LayoutGrid, List, Columns } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterExportBarProps {
  filters: FilterOption[];
  onExport?: (format: 'excel' | 'csv' | 'pdf') => void;
  showExport?: boolean;
  showViewToggle?: boolean;
  viewToggleProps?: {
    currentView: 'card' | 'grid' | 'table';
    onViewChange: (view: 'card' | 'grid' | 'table') => void;
  };
  className?: string;
}

export default function FilterExportBar({
  filters,
  onExport,
  showExport = true,
  showViewToggle = false,
  viewToggleProps,
  className = '',
}: FilterExportBarProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Count active filters
  const activeFilterCount = filters.filter(
    (filter) => filter.value !== 'all' && filter.value !== ''
  ).length;

  const exportFormats = [
    { key: 'excel', label: 'Excel (.xlsx)', icon: Table },
    { key: 'csv', label: 'CSV (.csv)', icon: FileText },
    { key: 'pdf', label: 'PDF (.pdf)', icon: File },
  ];

  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    setIsExportOpen(false);
    if (onExport) {
      onExport(format);
    }
  };

  const resetFilters = () => {
    filters.forEach((filter) => {
      filter.onChange('all');
    });
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 sm:p-4 ${className}`}>
      {/* Single flex row for Filter + View Toggle + Export */}
      <div className="flex items-center justify-end gap-2 sm:gap-4">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 rounded-lg border transition-colors text-xs sm:text-sm ${
              activeFilterCount > 0
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50 text-gray-700'
            }`}
          >
            <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline font-medium">
              Filter {activeFilterCount > 0 && `(${activeFilterCount})`}
            </span>
            <span className="sm:hidden font-medium">
              {activeFilterCount > 0 ? activeFilterCount : 'Filter'}
            </span>
          </button>

 {/* Filter Dropdown */}
{isFilterOpen && (
  <div
    className="
      fixed inset-0 z-50
      bg-black/10 sm:bg-transparent
      flex justify-center items-center sm:items-start sm:pt-0
      p-4 sm:p-0
    "
    onClick={() => setIsFilterOpen(false)} // closes when clicking outside
  >
    <div
      className="
        bg-white border border-gray-200 rounded-lg shadow-lg
        w-full max-w-sm sm:max-w-[320px]
        sm:absolute sm:top-[50px] sm:right-[20px]
        max-h-[90vh] overflow-y-auto
      "
      onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Filter Options</h3>
          <button
            onClick={() => setIsFilterOpen(false)}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                {filter.label}
              </label>
              <select
                value={filter.value}
                onChange={(e) => filter.onChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {activeFilterCount > 0 && (
            <div className="pt-2 border-t border-gray-200">
              <button
                onClick={resetFilters}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
)}

</div>

        {/* View Toggle */}
        {showViewToggle && viewToggleProps && (
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-white">
            <button
              onClick={() => viewToggleProps.onViewChange('card')}
              className={`flex items-center justify-center p-1.5 sm:p-2 rounded-md transition-colors ${
                viewToggleProps.currentView === 'card'
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => viewToggleProps.onViewChange('grid')}
              className={`flex items-center justify-center p-1.5 sm:p-2 rounded-md transition-colors ${
                viewToggleProps.currentView === 'grid'
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title="List View"
            >
              <List className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => viewToggleProps.onViewChange('table')}
              className={`flex items-center justify-center p-1.5 sm:p-2 rounded-md transition-colors ${
                viewToggleProps.currentView === 'table'
                  ? 'bg-blue-100 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              title="Table View"
            >
              <Columns className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        )}

        {/* Export Button */}
        {showExport && (
          <div className="relative">
            <button
              onClick={() => setIsExportOpen(!isExportOpen)}
              className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline font-medium">Export</span>
            </button>

            {/* Export Dropdown */}
            {isExportOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  <div className="px-3 sm:px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Export Format
                  </div>
                  {exportFormats.map((format) => {
                    const IconComponent = format.icon;
                    return (
                      <button
                        key={format.key}
                        onClick={() => handleExport(format.key as 'excel' | 'csv' | 'pdf')}
                        className="flex items-center space-x-2 sm:space-x-3 w-full px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <IconComponent className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                        <span>{format.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filter Tags - Show on larger screens */}
      {activeFilterCount > 0 && (
        <div className="hidden lg:flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-200">
          {filters
            .filter((filter) => filter.value !== 'all' && filter.value !== '')
            .map((filter) => (
              <span
                key={filter.key}
                className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {filter.label}: {filter.options.find((opt) => opt.value === filter.value)?.label}
                <button
                  onClick={() => filter.onChange('all')}
                  className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
        </div>
      )}

      {/* Overlay to close dropdowns */}
      {(isFilterOpen || isExportOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsFilterOpen(false);
            setIsExportOpen(false);
          }}
        />
      )}
    </div>
  );
}
