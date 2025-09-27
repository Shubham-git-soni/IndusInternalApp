'use client';

import { useState, useEffect } from 'react';
import { Users, UserPlus, Building2, Award, Clock, TrendingUp, Plus, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import FilterExportBar from '@/components/FilterExportBar';
import Link from 'next/link';
import { apiClient, type EmployeeStats } from '@/services/api';

export default function HRMPage() {
  const [activityFilter, setActivityFilter] = useState('all');
  const [timeFilter, setTimeFilter] = useState('all');
  const [stats, setStats] = useState<EmployeeStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const employeeStats = await apiClient.getEmployeeStats();
        setStats(employeeStats);
      } catch (error) {
        console.error('Failed to fetch employee stats:', error);
        // No fallback - show zero values if API fails
        setStats({
          totalEmployees: 0,
          activeEmployees: 0,
          totalDepartments: 0,
          newThisMonth: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dynamic HRM stats based on backend data
  const hrmStats = stats ? [
    { title: "Total Team Members", value: stats.totalEmployees.toString(), icon: Users, color: "bg-blue-500", change: `${stats.activeEmployees} active` },
    { title: "New Hires", value: stats.newThisMonth.toString(), icon: UserPlus, color: "bg-green-500", change: "This month" },
    { title: "Departments", value: stats.totalDepartments.toString(), icon: Building2, color: "bg-purple-500", change: "Active" },
    { title: "Pending Leaves", value: "15", icon: Clock, color: "bg-orange-500", change: "Need approval" }
  ] : [];

  const quickActions = [
    { name: 'Add Team Member', href: '/hrm/employees/add', icon: UserPlus, color: 'bg-blue-500' },
    { name: 'View All Team Members', href: '/hrm/employees', icon: Users, color: 'bg-green-500' },
    { name: 'Departments', href: '/hrm/departments', icon: Building2, color: 'bg-purple-500' },
    { name: 'Designations', href: '/hrm/designations', icon: Award, color: 'bg-orange-500' }
  ];

  const recentActivities = [
    { activity: "John Smith joined as Software Engineer", time: "2 hours ago", type: "hire", employeeName: "John Smith", department: "Engineering" },
    { activity: "Sarah Wilson updated her profile", time: "4 hours ago", type: "update", employeeName: "Sarah Wilson", department: "Engineering" },
    { activity: "Mike Johnson applied for leave", time: "6 hours ago", type: "leave", employeeName: "Mike Johnson", department: "Human Resources" },
    { activity: "New department 'Data Science' created", time: "1 day ago", type: "department", employeeName: "Admin", department: "Administration" },
    { activity: "Emily Davis completed onboarding", time: "1 day ago", type: "onboarding", employeeName: "Emily Davis", department: "Marketing" },
    { activity: "Robert Chen submitted expense report", time: "2 days ago", type: "expense", employeeName: "Robert Chen", department: "Engineering" },
    { activity: "Lisa Brown approved leave request", time: "2 days ago", type: "approval", employeeName: "Lisa Brown", department: "Management" },
    { activity: "New team member handbook published", time: "3 days ago", type: "policy", employeeName: "HR Team", department: "Human Resources" }
  ];

  // Filter activities
  const filteredActivities = recentActivities.filter(activity => {
    const matchesType = activityFilter === 'all' || activity.type === activityFilter;
    const matchesTime = timeFilter === 'all' ||
      (timeFilter === 'today' && activity.time.includes('hours')) ||
      (timeFilter === 'week' && (activity.time.includes('hours') || activity.time.includes('1 day'))) ||
      (timeFilter === 'month');
    return matchesType && matchesTime;
  });

  // Handle export for activities
  const handleActivitiesExport = (format: 'excel' | 'csv' | 'pdf') => {
    const dataToExport = filteredActivities.map(activity => ({
      'Activity': activity.activity,
      'Type': activity.type,
      'Team Member': activity.employeeName,
      'Department': activity.department,
      'Time': activity.time
    }));
    alert(`Exporting ${filteredActivities.length} activities to ${format.toUpperCase()} format...`);
    console.log('Activities data to export:', dataToExport);
  };

  // Filter configuration for activities
  const activitiesFilterConfig = [
    {
      key: 'type',
      label: 'Activity Type',
      options: [
        { value: 'all', label: 'All Activities' },
        { value: 'hire', label: 'New Hires' },
        { value: 'update', label: 'Profile Updates' },
        { value: 'leave', label: 'Leave Requests' },
        { value: 'department', label: 'Department Changes' },
        { value: 'onboarding', label: 'Onboarding' },
        { value: 'expense', label: 'Expenses' },
        { value: 'approval', label: 'Approvals' },
        { value: 'policy', label: 'Policy Updates' }
      ],
      value: activityFilter,
      onChange: setActivityFilter
    },
    {
      key: 'time',
      label: 'Time Period',
      options: [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
      ],
      value: timeFilter,
      onChange: setTimeFilter
    }
  ];

  return (
    <DashboardLayout>
      <div className="pt-16 pb-20 lg:pb-4 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Header - Mobile Optimized */}
        <div className="pt-2 sm:pt-4">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Human Resource Management</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage team members, departments, and HR operations</p>
        </div>

        {/* Stats Cards - Mobile First */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 animate-pulse">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-2 bg-gray-200 rounded w-2/3 mt-1 hidden sm:block"></div>
                  </div>
                  <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg bg-gray-200 self-end sm:self-auto"></div>
                </div>
                <div className="h-2 bg-gray-200 rounded w-2/3 mt-2 sm:hidden"></div>
              </div>
            ))
          ) : (
            hrmStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{stat.title}</p>
                      <p className="text-lg sm:text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1 hidden sm:block">{stat.change}</p>
                    </div>
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg ${stat.color} flex items-center justify-center self-end sm:self-auto`}>
                      <IconComponent className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  {/* Show change on mobile below stats */}
                  <p className="text-xs text-gray-500 mt-2 sm:hidden">{stat.change}</p>
                </div>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Quick Actions - Mobile Optimized */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex flex-col items-center space-y-2 sm:space-y-3 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                  >
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${action.color} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-900 text-center leading-tight">{action.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activities - Mobile Optimized */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activities ({filteredActivities.length})</h2>

              {/* Filter and Export for Activities */}
              <FilterExportBar
                filters={activitiesFilterConfig}
                onExport={handleActivitiesExport}
                className="border-0 p-0 bg-transparent"
              />
            </div>

            <div className="p-4 sm:p-6 max-h-96 overflow-y-auto">
              <div className="space-y-3 sm:space-y-4">
                {filteredActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      activity.type === 'hire' ? 'bg-green-500' :
                      activity.type === 'update' ? 'bg-blue-500' :
                      activity.type === 'leave' ? 'bg-orange-500' :
                      activity.type === 'department' ? 'bg-purple-500' :
                      activity.type === 'onboarding' ? 'bg-indigo-500' :
                      activity.type === 'expense' ? 'bg-yellow-500' :
                      activity.type === 'approval' ? 'bg-emerald-500' : 'bg-gray-500'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-gray-900 leading-snug">{activity.activity}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          activity.type === 'hire' ? 'bg-green-100 text-green-800' :
                          activity.type === 'update' ? 'bg-blue-100 text-blue-800' :
                          activity.type === 'leave' ? 'bg-orange-100 text-orange-800' :
                          activity.type === 'department' ? 'bg-purple-100 text-purple-800' :
                          activity.type === 'onboarding' ? 'bg-indigo-100 text-indigo-800' :
                          activity.type === 'expense' ? 'bg-yellow-100 text-yellow-800' :
                          activity.type === 'approval' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {activity.type}
                        </span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredActivities.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No activities found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your filter criteria.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}