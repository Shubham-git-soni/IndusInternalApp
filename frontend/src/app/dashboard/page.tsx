'use client';

import {
  Users,
  Briefcase,
  KanbanSquare,
  ClipboardCheck,
  Landmark,
  Bot,
  TrendingUp,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
const Dashboard = () => {
  // Get user from localStorage
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;

  // Mock data for charts
  const performanceData = [
    { week: 'Week 1', tasks: 12, leads: 5 },
    { week: 'Week 2', tasks: 19, leads: 8 },
    { week: 'Week 3', tasks: 15, leads: 12 },
    { week: 'Week 4', tasks: 25, leads: 15 },
  ];

  // KPI data based on user role
  const getKPIData = () => {
    const baseKPIs = [
      { title: "My Open Tasks", value: "8", icon: ClipboardCheck, color: "bg-blue-500" },
      { title: "Completed Today", value: "5", icon: CheckCircle, color: "bg-green-500" },
      { title: "Pending Approvals", value: "3", icon: Clock, color: "bg-yellow-500" },
      { title: "This Month Target", value: "85%", icon: Target, color: "bg-purple-500" }
    ];

    if (user?.role === 'Admin') {
      return [
        { title: "Total Employees", value: "45", icon: Users, color: "bg-blue-500" },
        { title: "Active Projects", value: "12", icon: KanbanSquare, color: "bg-green-500" },
        { title: "Pending Tasks", value: "28", icon: ClipboardCheck, color: "bg-yellow-500" },
        { title: "Revenue (Month)", value: "₹2.5L", icon: TrendingUp, color: "bg-purple-500" }
      ];
    }

    return baseKPIs;
  };

  const modules = [
    { name: 'HRM', icon: Users, path: '/hrm', color: 'bg-blue-100 text-blue-600' },
    { name: 'CRM', icon: Briefcase, path: '/crm', color: 'bg-green-100 text-green-600' },
    { name: 'Projects', icon: KanbanSquare, path: '/projects', color: 'bg-purple-100 text-purple-600' },
    { name: 'Tasks', icon: ClipboardCheck, path: '/tasks', color: 'bg-orange-100 text-orange-600' },
    { name: 'Finance', icon: Landmark, path: '/finance', color: 'bg-red-100 text-red-600' },
  ];

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="pt-16 pb-20 lg:pb-4 px-4 space-y-6">
        {/* Welcome Section */}
        <div className="pt-4">
          {/* <h1 className="text-2xl font-bold text-gray-900">
            Welcome  {user?.fullName || 'User'}!
          </h1> */}
          {/* <p className="text-gray-600">
            Here's what's happening today
          </p> */}
        </div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {getKPIData().map((kpi, index) => {
            const IconComponent = kpi.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${kpi.color} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Module Navigation and Performance Chart Row for Desktop */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-6 space-y-6 lg:space-y-0">
          {/* Module Navigation */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Applications</h2>
            <div className="grid grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2">
            {modules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <Link
                  key={index}
                  href={module.path}
                  className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${module.color} flex items-center justify-center`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{module.name}</span>
                </Link>
                );
              })}
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">My Performance Overview</h2>
            <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="week"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tasks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Tasks Completed"
                />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Leads Generated"
                />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Bot Button */}
      <button className="fixed bottom-24 lg:bottom-6 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40">
        <Bot className="w-6 h-6" />
      </button>
    </DashboardLayout>
  );
};

export default Dashboard;