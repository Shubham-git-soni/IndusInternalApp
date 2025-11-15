'use client';

import {
  Layers,
  Inbox,
  ShieldCheck,
  UserCheck,
  Clock,
  CheckCircle2,
  TestTube2,
  LifeBuoy,
  BadgeCheck,
  GitMerge,
  Bug,
  CheckCheck,
  RotateCcw,
  PauseCircle,
  XCircle,
  Archive,
  Plus
} from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import KPICard from '@/components/KPICard';

export default function TicketManagementDashboard() {
  // Mock data for ticket counts
  const ticketData = [
    {
      title: 'Total Tickets',
      value: '245',
      icon: Layers,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'bg-blue-600',
      onClick: () => console.log('Filter: Total Points')
    },
    {
      title: 'Pending',
      value: '32',
      icon: Inbox,
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      iconColor: 'bg-blue-600',
      onClick: () => console.log('Filter: Open Tasks')
    },
    {
      title: 'Pending Verification',
      value: '8',
      icon: ShieldCheck,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'bg-yellow-600',
      onClick: () => console.log('Filter: Pending Verification')
    },
     {
      title: 'Assigned',
      value: '15',
      icon: UserCheck,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      iconColor: 'bg-cyan-600',
      onClick: () => console.log('Filter: Assigned')
    },
   
    {
      title: 'In Progress',
      value: '12',
      icon: Clock,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      iconColor: 'bg-cyan-600',
      onClick: () => console.log('Filter: In Progress')
    },
    {
      title: 'Dev Completed',
      value: '18',
      icon: CheckCircle2,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'bg-green-600',
      onClick: () => console.log('Filter: Dev Completed')
    },
  
    {
      title: 'Pending Support',
      value: '4',
      icon: LifeBuoy,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'bg-yellow-600',
      onClick: () => console.log('Filter: Pending Support')
    },
    {
      title: 'Support Verified',
      value: '9',
      icon: BadgeCheck,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'bg-green-600',
      onClick: () => console.log('Filter: Support Verified')
    },
    {
      title: 'Pending Merge',
      value: '5',
      icon: GitMerge,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'bg-yellow-600',
      onClick: () => console.log('Filter: Pending Merge')
    },
      {
      title: 'Pending QC',
      value: '6',
      icon: TestTube2,
      bgColor: 'bg-yellow-50 dark:bg-yellow-950',
      iconColor: 'bg-yellow-600',
      onClick: () => console.log('Filter: Pending QC')
    },
    {
      title: 'In Testing',
      value: '7',
      icon: Bug,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950',
      iconColor: 'bg-cyan-600',
      onClick: () => console.log('Filter: In Testing')
    },
    {
      title: 'Testing Completed',
      value: '11',
      icon: CheckCheck,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'bg-green-600',
      onClick: () => console.log('Filter: Testing Completed')
    },
    {
      title: 'Reopened',
      value: '3',
      icon: RotateCcw,
      bgColor: 'bg-red-50 dark:bg-red-950',
      iconColor: 'bg-red-600',
      onClick: () => console.log('Filter: Reopened')
    },
    {
      title: 'On Hold',
      value: '2',
      icon: PauseCircle,
      bgColor: 'bg-red-50 dark:bg-red-950',
      iconColor: 'bg-red-600',
      onClick: () => console.log('Filter: On Hold')
    },
    {
      title: 'Rejected',
      value: '1',
      icon: XCircle,
      bgColor: 'bg-red-50 dark:bg-red-950',
      iconColor: 'bg-red-600',
      onClick: () => console.log('Filter: Rejected')
    },
    {
      title: 'Closed',
      value: '28',
      icon: Archive,
      bgColor: 'bg-green-50 dark:bg-green-950',
      iconColor: 'bg-green-600',
      onClick: () => console.log('Filter: Completed')
    }
  ];

  return (
    <DashboardLayout>
      <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Ticket Management"
          description="Monitor and manage all tickets across the organization"
          primaryAction={{
            content: 'Create Ticket',
            href: '/ticketmanagement/tickets/create',
            icon: Plus
          }}
        />

        {/* KPI Cards Grid - 2x8 on mobile, 4x4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {ticketData.map((ticket, index) => (
            <div
              key={index}
              className={`${ticket.bgColor} rounded-lg p-3 lg:p-4 shadow-sm border border-border hover:shadow-md transition-shadow cursor-pointer`}
              onClick={ticket.onClick}
            >
              <div className="flex items-start justify-between mb-2 lg:mb-3">
                <h3 className="text-[10px] lg:text-xs font-semibold text-muted-foreground line-clamp-2">
                  {ticket.title}
                </h3>
                <div className={`${ticket.iconColor} w-6 h-6 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ml-1.5`}>
                  <ticket.icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                </div>
              </div>
              <div className="text-base lg:text-2xl font-bold text-foreground">
                {ticket.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}