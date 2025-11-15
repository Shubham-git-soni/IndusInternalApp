'use client';

import { useState } from 'react';
import { Play, MoreVertical } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import ToggleButtons from '@/components/ToggleButtons';
import DataTable from '@/components/DataTable';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Types
interface Ticket {
  id: string;
  title: string;
  customer: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Assigned' | 'In Progress' | 'Paused' | 'DevCompleted';
  expectedDate: string;
  hasAudio: boolean;
  startDate: string | null;
  totalTime: number; // in minutes
  pauseTime: number; // in minutes
  isOverdue?: boolean;
}

// Mock Data
const mockTickets: Ticket[] = [
  {
    id: 'TKT-001',
    title: 'Fix login authentication bug',
    customer: 'Acme Corp',
    priority: 'High',
    status: 'Assigned',
    expectedDate: '2025-11-08',
    hasAudio: true,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-002',
    title: 'Implement dark mode toggle',
    customer: 'TechStart Inc',
    priority: 'Medium',
    status: 'In Progress',
    expectedDate: '2025-11-10',
    hasAudio: true,
    startDate: '2025-11-06',
    totalTime: 240,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-003',
    title: 'Update database schema for users',
    customer: 'Global Solutions',
    priority: 'High',
    status: 'In Progress',
    expectedDate: '2025-11-05',
    hasAudio: false,
    startDate: '2025-11-04',
    totalTime: 480,
    pauseTime: 60,
    isOverdue: true,
  },
  {
    id: 'TKT-004',
    title: 'Create API documentation',
    customer: 'Acme Corp',
    priority: 'Low',
    status: 'Paused',
    expectedDate: '2025-11-12',
    hasAudio: true,
    startDate: '2025-11-02',
    totalTime: 120,
    pauseTime: 120,
    isOverdue: false,
  },
  {
    id: 'TKT-005',
    title: 'Fix responsive design issues',
    customer: 'TechStart Inc',
    priority: 'Medium',
    status: 'Assigned',
    expectedDate: '2025-11-09',
    hasAudio: false,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-006',
    title: 'Implement payment gateway integration',
    customer: 'Global Solutions',
    priority: 'High',
    status: 'In Progress',
    expectedDate: '2025-11-15',
    hasAudio: true,
    startDate: '2025-11-03',
    totalTime: 360,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-007',
    title: 'Write unit tests for auth module',
    customer: 'CloudFirst',
    priority: 'Medium',
    status: 'Assigned',
    expectedDate: '2025-11-11',
    hasAudio: false,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-008',
    title: 'Optimize database queries',
    customer: 'Acme Corp',
    priority: 'Low',
    status: 'DevCompleted',
    expectedDate: '2025-11-07',
    hasAudio: false,
    startDate: '2025-11-01',
    totalTime: 180,
    pauseTime: 0,
    isOverdue: false,
  },
  {
    id: 'TKT-009',
    title: 'Setup CI/CD pipeline',
    customer: 'TechStart Inc',
    priority: 'High',
    status: 'Paused',
    expectedDate: '2025-11-14',
    hasAudio: true,
    startDate: '2025-11-05',
    totalTime: 300,
    pauseTime: 60,
    isOverdue: false,
  },
  {
    id: 'TKT-010',
    title: 'Refactor legacy code in payment module',
    customer: 'Global Solutions',
    priority: 'Medium',
    status: 'Assigned',
    expectedDate: '2025-11-13',
    hasAudio: false,
    startDate: null,
    totalTime: 0,
    pauseTime: 0,
    isOverdue: false,
  },
];

// Utility Functions
const getPriorityColor = (priority: string): 'destructive' | 'default' | 'secondary' => {
  switch (priority) {
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'default';
  }
};

const getStatusColor = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'Assigned':
      return 'outline';
    case 'In Progress':
      return 'default';
    case 'Paused':
      return 'secondary';
    case 'DevCompleted':
      return 'secondary';
    default:
      return 'outline';
  }
};

const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

const getActionButtons = (status: string, ticketId: string) => {
  const commonProps = { size: 'sm' as const, variant: 'outline' as const };

  switch (status) {
    case 'Assigned':
      return (
        <Button
          {...commonProps}
          className="bg-green-600 hover:bg-green-700 text-white border-green-600"
          onClick={() => console.log(`Start ticket ${ticketId}`)}
        >
          Start
        </Button>
      );
    case 'In Progress':
      return (
        <div className="flex gap-2">
          <Button
            {...commonProps}
            className="bg-yellow-600 hover:bg-yellow-700 text-white border-yellow-600"
            onClick={() => console.log(`Pause ticket ${ticketId}`)}
          >
            Pause
          </Button>
          <Button
            {...commonProps}
            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
            onClick={() => console.log(`Complete ticket ${ticketId}`)}
          >
            Complete
          </Button>
        </div>
      );
    case 'Paused':
      return (
        <Button
          {...commonProps}
          className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
          onClick={() => console.log(`Resume ticket ${ticketId}`)}
        >
          Resume
        </Button>
      );
    case 'DevCompleted':
      return (
        <Badge variant="secondary" className="px-3 py-1">
          Completed
        </Badge>
      );
    default:
      return null;
  }
};

export default function MyWorkPage() {
  const [filter, setFilter] = useState<'all' | 'assigned' | 'inprogress'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets based on selected filter and search query
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesFilter = () => {
      if (filter === 'all') return true;
      if (filter === 'assigned') return ticket.status === 'Assigned';
      if (filter === 'inprogress') return ticket.status === 'In Progress';
      return true;
    };

    const matchesSearch = () => {
      const query = searchQuery.toLowerCase();
      return (
        ticket.id.toLowerCase().includes(query) ||
        ticket.title.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query)
      );
    };

    return matchesFilter() && matchesSearch();
  });

  // Table columns configuration
  const columns = [
    {
      key: 'id',
      label: 'Ticket ID',
      className: 'font-medium w-20',
    },
    {
      key: 'title',
      label: 'Title',
      className: 'hidden md:table-cell',
      render: (value: string, row: Ticket) => (
        <div className="max-w-xs truncate text-sm">{value}</div>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      className: 'hidden md:table-cell text-sm',
    },
    {
      key: 'priority',
      label: 'Priority',
      className: 'w-24',
      render: (value: string) => (
        <Badge variant={getPriorityColor(value)} className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      className: 'w-28',
      render: (value: string) => (
        <Badge variant={getStatusColor(value)} className="text-xs">
          {value}
        </Badge>
      ),
    },
    {
      key: 'expectedDate',
      label: 'Expected Date',
      className: 'hidden lg:table-cell text-sm w-28',
    },
    {
      key: 'hasAudio',
      label: 'Audio',
      className: 'w-16',
      render: (value: boolean, row: Ticket) =>
        value ? (
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto w-auto"
            onClick={() => console.log(`Play audio for ${row.id}`)}
            title="Play audio instructions"
          >
            <Play className="h-4 w-4 text-primary" />
          </Button>
        ) : (
          <span className="text-muted-foreground text-xs">-</span>
        ),
    },
    {
      key: 'id',
      label: 'Actions',
      className: 'w-48',
      render: (value: string, row: Ticket) => (
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log(`View details for ${value}`)}
          >
            Details
          </Button>
          {getActionButtons(row.status, value)}
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        {/* Page Header */}
        <PageHeader
          title="My Work"
          description="Your assigned tickets and active work queue"
        />

        {/* Filter Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:items-center sm:justify-between">
          <ToggleButtons
            options={[
              { value: 'all', label: 'All' },
              { value: 'assigned', label: 'Assigned' },
              { value: 'inprogress', label: 'In Progress' },
            ]}
            value={filter}
            onChange={(value) => setFilter(value as 'all' | 'assigned' | 'inprogress')}
            className="w-full sm:w-auto"
          />
          <div className="text-xs text-muted-foreground">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search tickets by ID, title, or customer..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Data Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredTickets}
                emptyMessage="No tickets found matching your criteria"
              />
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {filteredTickets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-muted-foreground">
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="font-medium text-foreground">
                {filteredTickets.filter((t) => t.status === 'Assigned').length}
              </div>
              <div>Assigned</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="font-medium text-foreground">
                {filteredTickets.filter((t) => t.status === 'In Progress').length}
              </div>
              <div>In Progress</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="font-medium text-foreground">
                {filteredTickets.filter((t) => t.isOverdue).length}
              </div>
              <div>Overdue</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3">
              <div className="font-medium text-foreground">
                {formatTime(filteredTickets.reduce((sum, t) => sum + t.totalTime, 0))}
              </div>
              <div>Total Time</div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}