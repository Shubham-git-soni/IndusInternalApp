'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Eye, Edit, Trash2, Mail, Phone, Building2, Calendar } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import FilterExportBar from '@/components/FilterExportBar';
import SearchBar from '@/components/SearchBar';
import Link from 'next/link';
import { apiClient, type Employee } from '@/services/api';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewType, setViewType] = useState<'card' | 'grid' | 'table'>('card');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees and departments from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [employeeData, departmentData] = await Promise.all([
          apiClient.getEmployees({
            search: searchTerm || undefined,
            department: filterDepartment !== 'all' ? filterDepartment : undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined
          }),
          apiClient.getDepartments()
        ]);
        setEmployees(employeeData);
        setDepartments(departmentData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // No fallback - show empty arrays if API fails
        setEmployees([]);
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchTerm, filterDepartment, filterStatus]); // Re-fetch when filters change

  // Since backend handles filtering, we can use employees directly
  // But we keep local filtering for immediate UI feedback before API calls
  const filteredEmployees = employees;

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status.toLowerCase()) {
      case 'active':
        return `${baseClasses} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`;
      case 'inactive':
        return `${baseClasses} bg-destructive/10 text-destructive`;
      case 'resigned':
        return `${baseClasses} bg-muted text-muted-foreground`;
      default:
        return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Handle export functionality
  const handleExport = (format: 'excel' | 'csv' | 'pdf') => {
    const dataToExport = filteredEmployees.map(employee => ({
      'Full Name': employee.fullName,
      'Email': employee.email,
      'Phone Number': employee.phoneNumber,
      'Department': employee.department,
      'Designation': employee.designation,
      'Joining Date': employee.joiningDate,
      'Status': employee.status,
      'Manager Name': employee.managerName || 'N/A'
    }));

    // In a real app, you would use a library like xlsx, csv-writer, or jsPDF
    // For now, we'll just show an alert
    alert(`Exporting ${filteredEmployees.length} team members to ${format.toUpperCase()} format...`);
    console.log('Data to export:', dataToExport);
  };

  // Filter configuration for FilterExportBar
  const filterConfig = [
    {
      key: 'department',
      label: 'Department',
      options: [
        { value: 'all', label: 'All Departments' },
        ...departments.map(dept => ({ value: dept.name, label: dept.name }))
      ],
      value: filterDepartment,
      onChange: setFilterDepartment
    },
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'resigned', label: 'Resigned' }
      ],
      value: filterStatus,
      onChange: setFilterStatus
    }
  ];

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Team Member Directory</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and view all team members</p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/hrm/employees/add"
                className="inline-flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Team Member</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary flex-shrink-0" />
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Team Members</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">{employees.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-emerald-500 rounded-full"></div>
              </div>
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Active</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">{employees.filter(e => e.status === 'Active').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Building2 className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500 flex-shrink-0" />
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Departments</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">{departments.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-border">
            <div className="flex items-center">
              <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-amber-500 flex-shrink-0" />
              <div className="ml-2 sm:ml-3 min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">New This Month</p>
                <p className="text-lg sm:text-xl font-bold text-foreground">
                  {employees.filter(e => {
                    const joiningMonth = new Date(e.joiningDate).getMonth();
                    const joiningYear = new Date(e.joiningDate).getFullYear();
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    return joiningMonth === currentMonth && joiningYear === currentYear;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-card rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-border">
          <SearchBar
            placeholder="Search team members by name, code, or email..."
            value={searchTerm}
            onChange={setSearchTerm}
            className="w-full"
          />
        </div>

        {/* Filter, Export and View Toggle - Compact Mobile Layout */}
        <FilterExportBar
          filters={filterConfig}
          onExport={handleExport}
          showViewToggle={true}
          viewToggleProps={{
            currentView: viewType,
            onViewChange: setViewType
          }}
          className="shadow-sm"
        />

        {/* Employee List - Dual View Support */}
        <div className="bg-card rounded-lg sm:rounded-xl shadow-sm border border-border">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-border">
            <h2 className="text-base sm:text-lg font-semibold text-foreground">
              Team Members ({filteredEmployees.length})
            </h2>
          </div>

          {/* Card View */}
          {viewType === 'card' && (
            <div className="p-4 sm:p-6">
              {loading ? (
                // Loading skeleton for cards
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="bg-card border border-border rounded-lg p-4 sm:p-5 animate-pulse">
                      <div className="flex flex-col items-center text-center mb-4">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredEmployees.map((employee) => (
                  <div key={employee.userId} className="bg-card border border-border rounded-lg p-4 sm:p-5 hover:shadow-md hover:border-primary/20 transition-all duration-200">
                    {/* Profile Section */}
                    <div className="flex flex-col items-center text-center mb-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mb-3">
                        <span className="text-primary-foreground font-bold text-lg sm:text-xl">
                          {getInitials(employee.fullName)}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 truncate w-full">
                        {employee.fullName}
                      </h3>
                      <span className={`${getStatusBadge(employee.status)} text-xs mb-2`}>
                        {employee.status}
                      </span>
                      <p className="text-sm text-muted-foreground truncate w-full">
                        {employee.designation}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee.department}
                      </p>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 mb-4 text-xs sm:text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{employee.email}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Phone className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{employee.phoneNumber}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Calendar className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span>Joined {new Date(employee.joiningDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/hrm/employees/${employee.userId}`}
                        className="flex items-center justify-center px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Link>
                      <Link
                        href={`/hrm/employees/${employee.userId}/edit`}
                        className="flex items-center justify-center px-3 py-1.5 text-xs bg-emerald-500/10 text-emerald-600 rounded-md hover:bg-emerald-500/20 transition-colors"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Link>
                      <button
                        className="flex items-center justify-center px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                  ))}
                </div>
              )}

              {/* No Data State for Card View */}
              {!loading && filteredEmployees.length === 0 && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-12">
                    <Users className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Team Members Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get started by adding your first team member to the system.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/hrm/employees/add"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grid/List View */}
          {viewType === 'grid' && (
            <div className="divide-y divide-border">
              {loading ? (
                // Loading skeleton for grid
                Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="p-4 sm:p-6 animate-pulse">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                filteredEmployees.map((employee) => (
                <div key={employee.userId} className="p-4 sm:p-6 hover:bg-accent">
                  <div className="flex items-start sm:items-center justify-between gap-3">
                    <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      {/* Profile Picture */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                          {getInitials(employee.fullName)}
                        </span>
                      </div>

                      {/* Team Member Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1 sm:mb-2">
                          <h3 className="text-base sm:text-lg font-medium text-foreground truncate">{employee.fullName}</h3>
                          <span className={`${getStatusBadge(employee.status)} text-xs`}>{employee.status}</span>
                        </div>

                        {/* Mobile: Stack info vertically */}
                        <div className="space-y-1 sm:space-y-0 sm:flex sm:flex-col lg:flex-row lg:items-center lg:space-x-6 text-xs sm:text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                            <span className="truncate">{employee.department} • {employee.designation}</span>
                          </span>
                          <span className="flex items-center sm:hidden">
                            <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                            <span className="truncate">{employee.email}</span>
                          </span>
                          <span className="hidden sm:flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            {employee.email}
                          </span>
                          <span className="hidden sm:flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {employee.phoneNumber}
                          </span>
                        </div>

                        {/* Hide detailed info on mobile, show on desktop */}
                        <div className="mt-1 text-xs sm:text-sm text-muted-foreground hidden sm:block">
                          Team Member •
                          Joined: {new Date(employee.joiningDate).toLocaleDateString()} •
                          {employee.managerName && ` Manager: ${employee.managerName}`}
                        </div>
                      </div>
                    </div>

                    {/* Actions - Vertical on Mobile */}
                    <div className="flex sm:flex-row flex-col sm:items-center sm:space-x-1 space-y-1 sm:space-y-0 flex-shrink-0">
                      <Link
                        href={`/hrm/employees/${employee.userId}`}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/hrm/employees/${employee.userId}/edit`}
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-lg transition-colors"
                        title="Edit Team Member"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-1.5 sm:p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Team Member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                ))
              )}

              {/* No Data State for Grid View */}
              {!loading && filteredEmployees.length === 0 && (
                <div className="p-4 sm:p-6">
                  <div className="text-center py-12">
                    <Users className="mx-auto h-16 w-16 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-foreground">No Team Members Found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Get started by adding your first team member to the system.
                    </p>
                    <div className="mt-6">
                      <Link
                        href="/hrm/employees/add"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Team Member
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modern Table View */}
          {viewType === 'table' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Team Member
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Department
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Joining Date
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.userId} className="hover:bg-accent transition-colors">
                      {/* Team Member Column */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-foreground font-bold text-xs sm:text-sm">
                              {getInitials(employee.fullName)}
                            </span>
                          </div>
                          <div className="ml-3 sm:ml-4">
                            <div className="text-sm font-medium text-foreground truncate max-w-[120px] sm:max-w-none">
                              {employee.fullName}
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                              ID: {employee.userId}
                            </div>
                            {/* Mobile: Show department below name */}
                            <div className="text-xs text-muted-foreground sm:hidden truncate max-w-[120px]">
                              {employee.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Department Column - Hidden on mobile */}
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground">{employee.department}</div>
                        <div className="text-sm text-muted-foreground">{employee.designation}</div>
                      </td>

                      {/* Contact Column - Hidden on mobile/tablet */}
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-foreground truncate max-w-[200px]">{employee.email}</div>
                        <div className="text-sm text-muted-foreground">{employee.phoneNumber}</div>
                      </td>

                      {/* Joining Date Column - Hidden on mobile/tablet */}
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {new Date(employee.joiningDate).toLocaleDateString()}
                        {employee.managerName && (
                          <div className="text-sm text-muted-foreground">Manager: {employee.managerName}</div>
                        )}
                      </td>

                      {/* Status Column */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`${getStatusBadge(employee.status)} text-xs`}>
                          {employee.status}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <Link
                            href={`/hrm/employees/${employee.userId}`}
                            className="p-1 sm:p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                            title="View Profile"
                          >
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Link>
                          <Link
                            href={`/hrm/employees/${employee.userId}/edit`}
                            className="p-1 sm:p-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-500/10 rounded-md transition-colors"
                            title="Edit Team Member"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </Link>
                          <button
                            className="p-1 sm:p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            title="Delete Team Member"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-foreground">No team members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}