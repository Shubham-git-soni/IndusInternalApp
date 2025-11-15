'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  CheckSquare,
  AlertOctagon,
  Zap,
  FolderKanban,
  ListTodo,
  Users,
  Calendar,
  MoreHorizontal
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import Modal from '@/components/Modal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PMSDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [showActionsModal, setShowActionsModal] = useState(false);

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Mock data for KPI charts
  const projectsChartData = [
    { day: 1, value: 10 },
    { day: 2, value: 11 },
    { day: 3, value: 11 },
    { day: 4, value: 12 },
  ];

  const tasksChartData = [
    { day: 1, value: 220 },
    { day: 2, value: 225 },
    { day: 3, value: 230 },
    { day: 4, value: 234 },
  ];

  const issuesChartData = [
    { day: 1, value: 5 },
    { day: 2, value: 6 },
    { day: 3, value: 7 },
    { day: 4, value: 8 },
  ];

  // KPI data - only 3 for mobile left column
  const getKPIData = () => {
    return [
      {
        title: "Active Projects",
        value: "12",
        icon: Briefcase,
        iconColorVar: "--module-blue",
        chartData: projectsChartData,
        chartColor: "var(--module-blue)"
      },
      {
        title: "Tasks Completed",
        value: "234",
        icon: CheckSquare,
        iconColorVar: "--module-green",
        chartData: tasksChartData,
        chartColor: "var(--module-green)"
      },
      {
        title: "Issues Overdue",
        value: "8",
        icon: AlertOctagon,
        iconColorVar: "--module-red",
        chartData: issuesChartData,
        chartColor: "var(--module-red)"
      },
    ];
  };

  // Color mapping from CSS variables
  const getColorStyle = (colorVar: string) => ({
    backgroundColor: `var(${colorVar})`
  });

  // Quick actions for PM
  const quickActions = [
    { name: 'All Projects', icon: FolderKanban, path: '/projectmanagement/projects', colorVar: '--module-blue' },
    { name: 'My Tasks', icon: ListTodo, path: '/projectmanagement/tasks', colorVar: '--module-green' },
    { name: 'Team', icon: Users, path: '/projectmanagement/team', colorVar: '--module-purple' },
    { name: 'Calendar', icon: Calendar, path: '/projectmanagement/calendar', colorVar: '--module-indigo' },
    { name: 'Reports', icon: Zap, path: '/projectmanagement/reports', colorVar: '--module-teal' },
  ];

  // Active Projects data for bar chart
  const activeProjectsData = [
    { name: 'Indus Nova', progress: 75 },
    { name: 'Project Phoenix', progress: 40 },
    { name: 'Quantum Leap', progress: 90 },
    { name: 'Alpha Release', progress: 65 },
    { name: 'Beta Testing', progress: 30 },
    { name: 'Cloud Migration', progress: 85 },
  ];

  // Recent activities
  const recentActivities = [
    { description: "New commit on Indus Nova by John Doe", time: "2m ago" },
    { description: "Sprint 2 of Project Phoenix completed", time: "1h ago" },
    { description: "Deadline for Quantum Leap is tomorrow", time: "4h ago" },
  ];

  return (
    <DashboardLayout>
      {/* Main Content - Fully Responsive */}
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">

        {/* Header - Hidden on Mobile, Visible on Desktop */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-bold text-foreground">Project Management Dashboard</h1>
          <p className="text-muted-foreground mt-1">Overview of all project activities and metrics</p>
        </div>

        {/* Mobile: Left/Right Split | Desktop: Horizontal KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {/* Left Column - KPIs Vertical (Mobile) | Horizontal (Desktop) */}
          <div className="col-span-1 lg:col-span-3 flex flex-col lg:grid lg:grid-cols-3 gap-2 lg:gap-4">
            {getKPIData().map((kpi, index) => (
              <KPICard key={index} {...kpi} variant="minimal" />
            ))}
          </div>

          {/* Right Column - Quick Actions (Mobile Only) */}
          <div className="lg:hidden col-span-1">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <div className="grid grid-cols-2 gap-2">
                {quickActions.slice(0, 3).map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={index} href={action.path} className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg border border-border hover:bg-accent transition-colors">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-[9px] font-medium text-center text-foreground leading-tight">{action.name}</span>
                    </Link>
                  );
                })}
                {/* More Button */}
                <button
                  onClick={() => setShowActionsModal(true)}
                  className="flex flex-col items-center justify-center space-y-1.5 p-2 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <MoreHorizontal className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-[9px] font-medium text-foreground">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop: 2-Column Grid Layout like HRM */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Quick Actions Section */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-3">
                {quickActions.map((action, index) => {
                  const IconComponent = action.icon;
                  return (
                    <Link key={index} href={action.path} className="flex flex-col items-center justify-center space-y-2 p-4 rounded-lg border border-border hover:bg-accent transition-colors group">
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs font-medium text-center text-foreground leading-tight">{action.name}</span>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Projects Bar Chart */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Active Projects Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-64 overflow-x-auto">
                <div className="min-w-[400px]">
                  <ResponsiveContainer width="100%" height={256}>
                    <BarChart data={activeProjectsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                      <XAxis
                        type="number"
                        domain={[0, 100]}
                        tick={{ fill: 'currentColor', fontSize: 11 }}
                        className="text-muted-foreground"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fill: 'currentColor', fontSize: 11 }}
                        className="text-muted-foreground"
                        axisLine={false}
                        tickLine={false}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          color: 'hsl(var(--foreground))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                        formatter={(value) => [`${value}%`, 'Progress']}
                      />
                      <Bar dataKey="progress" fill="var(--chart-projects)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Active Projects Chart */}
        <Card className="lg:hidden bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 pb-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Active Projects Progress</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-48 overflow-x-auto">
              <div className="min-w-[350px]">
                <ResponsiveContainer width="100%" height={192}>
                  <BarChart data={activeProjectsData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border" />
                    <XAxis
                      type="number"
                      domain={[0, 100]}
                      tick={{ fill: 'currentColor', fontSize: 10 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: 'currentColor', fontSize: 10 }}
                      className="text-muted-foreground"
                      axisLine={false}
                      tickLine={false}
                      width={100}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        borderRadius: '8px',
                        fontSize: '11px'
                      }}
                      formatter={(value) => [`${value}%`, 'Progress']}
                    />
                    <Bar dataKey="progress" fill="var(--chart-projects)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity - Responsive */}
        <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 lg:p-6 pb-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</CardTitle>
              <Link href="#" className="text-xs sm:text-sm font-medium text-primary hover:underline">View All</Link>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 lg:p-6 pt-0">
            <div className="space-y-2 sm:space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-2 h-2 bg-primary rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground line-clamp-2">{activity.description}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Quick Actions Modal */}
      <Modal
        isOpen={showActionsModal}
        onClose={() => setShowActionsModal(false)}
        title="All Quick Actions"
        className="max-w-2xl"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                href={action.path}
                onClick={() => setShowActionsModal(false)}
                className="flex flex-col items-center justify-center space-y-3 p-4 sm:p-5 rounded-lg border border-border hover:bg-accent transition-colors group"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg flex items-center justify-center" style={getColorStyle(action.colorVar)}>
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                </div>
                <span className="text-sm sm:text-base font-medium text-center text-foreground">{action.name}</span>
              </Link>
            );
          })}
        </div>
      </Modal>
    </DashboardLayout>
  );
}
