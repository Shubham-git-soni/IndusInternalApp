'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import Modal from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAssetStats, mockRecentActivities } from '@/lib/assets-mock-data';

import {
  Package, CheckSquare, Wrench, Trash2, Box, PlusCircle, Archive,
  Filter, BarChart2, Settings, UserSquare, CreditCard,
  Receipt, MoreHorizontal
} from 'lucide-react';

// Main Page Component
export default function AssetsDashboardPage() {
  const [showActionsModal, setShowActionsModal] = useState(false);

  // KPI data for stats
  const getKPIData = () => [
    { title: "Total Assets", value: mockAssetStats.active.toString(), icon: Package, iconColorVar: "--module-blue", chartData: [], chartColor: "var(--module-blue)" },
    { title: "In Stock", value: mockAssetStats.inStock.toString(), icon: CheckSquare, iconColorVar: "--module-green", chartData: [], chartColor: "var(--module-green)" },
    { title: "Issued", value: mockAssetStats.issued.toString(), icon: Box, iconColorVar: "--module-yellow", chartData: [], chartColor: "var(--module-yellow)" },
    { title: "In Repair", value: mockAssetStats.inRepair.toString(), icon: Wrench, iconColorVar: "--module-red", chartData: [], chartColor: "var(--module-red)" },
    { title: "Scrapped", value: mockAssetStats.scrapped.toString(), icon: Trash2, iconColorVar: "--module-purple", chartData: [], chartColor: "var(--module-purple)" },
  ];

  // Color mapping from CSS variables
  const getColorStyle = (colorVar: string) => ({
    backgroundColor: `var(${colorVar})`
  });

  // All quick actions
  const allQuickActions = [
    { name: 'Asset Entry', icon: PlusCircle, path: '/assets/add', colorVar: '--module-blue' },
    { name: 'View All', icon: Archive, path: '/assets/all', colorVar: '--module-green' },
    { name: 'My Assets', icon: UserSquare, path: '/assets/my-assets', colorVar: '--module-indigo' },
    { name: 'Subscriptions', icon: CreditCard, path: '/assets/subscriptions', colorVar: '--module-purple' },
    { name: 'Expenses', icon: Receipt, path: '/assets/expenses', colorVar: '--module-amber' },
    { name: 'Reports', icon: BarChart2, path: '/assets/reports', colorVar: '--module-teal' },
    { name: 'Categories', icon: Settings, path: '/assets/categories', colorVar: '--module-red' },
  ];

  // Show first 3 actions in 2x2 grid (4th slot is More button)
  const displayedActions = allQuickActions.slice(0, 3);

  const getActivityDotColor = (action: string) => {
    switch (action) {
      case 'Issued': return 'bg-primary';
      case 'Created': return 'bg-green-500';
      case 'Returned': return 'bg-yellow-500';
      case 'Repaired': return 'bg-purple-500';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">

        {/* Header - Mobile Optimized */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">Asset Management</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage all company assets, inventory, and assignments</p>
            </div>
          </div>
        </div>

        {/* Mobile: Left/Right Split | Desktop: Horizontal KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
          {/* Left Column - KPIs Vertical (Mobile) | Horizontal (Desktop) */}
          <div className="col-span-1 lg:col-span-5 flex flex-col lg:grid lg:grid-cols-5 gap-2 lg:gap-4">
            {getKPIData().map((kpi, index) => (
              <KPICard key={index} {...kpi} variant="minimal" />
            ))}
          </div>

          {/* Right Column - Quick Actions (Mobile Only) */}
          <div className="lg:hidden col-span-1">
            <div className="bg-card rounded-xl p-3 shadow-sm border border-border">
              <div className="grid grid-cols-2 gap-2">
                {displayedActions.map((action, index) => {
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

        {/* Desktop: 2-Column Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-6">
          {/* Quick Actions Section */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="grid grid-cols-3 gap-3">
                {allQuickActions.map((action, index) => {
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

          {/* Recent Activities */}
          <Card className="bg-card rounded-xl p-0 shadow-sm border border-border">
            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-border">
              <CardTitle className="text-lg font-semibold text-foreground">Recent Activities</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Filter size={14} className="mr-2" /> Filter</Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {mockRecentActivities.slice(0, 6).map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${getActivityDotColor(activity.action)}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground"><strong>{activity.assetName}</strong> was {activity.action.toLowerCase()} by <strong>{activity.user}</strong></p>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                        <Badge variant="secondary" className="text-[10px]">{activity.category}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mobile: Recent Activities */}
        <Card className="lg:hidden bg-card rounded-xl p-0 shadow-sm border border-border">
          <CardHeader className="p-3 sm:p-4 pb-0">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <CardTitle className="text-base sm:text-lg font-semibold text-foreground">Recent Activities</CardTitle>
              <Button variant="outline" size="sm"><Filter size={14} /></Button>
            </div>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="space-y-2 sm:space-y-3">
              {mockRecentActivities.slice(0, 5).map(activity => (
                <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 sm:mt-2 flex-shrink-0 ${getActivityDotColor(activity.action)}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-foreground line-clamp-2"><strong>{activity.assetName}</strong> was {activity.action.toLowerCase()} by <strong>{activity.user}</strong></p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[10px] sm:text-xs text-muted-foreground">{activity.timestamp}</p>
                      <Badge variant="secondary" className="text-[9px] sm:text-[10px]">{activity.category}</Badge>
                    </div>
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
          {allQuickActions.map((action, index) => {
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