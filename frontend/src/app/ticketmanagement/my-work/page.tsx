'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Play, Pause, CheckCircle, RotateCcw, Eye, MoreVertical, Plus } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
];

// Utility Functions
const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' => {
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

const getStatusVariant = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
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

export default function MyWorkPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'id', label: 'Ticket ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'expectedDate', label: 'Expected Date', visible: true },
    { key: 'totalTime', label: 'Time Spent', visible: true },
    { key: 'audio', label: 'Audio', visible: true },
    { key: 'actions', label: 'Actions', visible: true },
  ]);

  // Filter config
  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'Assigned', label: 'Assigned' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Paused', label: 'Paused' },
        { value: 'DevCompleted', label: 'Dev Completed' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'complete', label: 'Mark as Completed' },
    { value: 'delete', label: 'Delete Selected', variant: 'destructive' },
  ];

  // Filter tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredTickets.map(t => t.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(tid => tid !== id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log('Bulk action:', action, 'for IDs:', selectedIds);
    setSelectedIds([]);
  };

  const handleView = (id: string) => {
    console.log('View ticket:', id);
    router.push(`/ticketmanagement/tickets/${id}`);
  };

  const handleStartTicket = (id: string) => {
    console.log('Start ticket:', id);
    // TODO: Implement start ticket
  };

  const handlePauseTicket = (id: string) => {
    console.log('Pause ticket:', id);
    // TODO: Implement pause ticket
  };

  const handleResumeTicket = (id: string) => {
    console.log('Resume ticket:', id);
    // TODO: Implement resume ticket
  };

  const handleCompleteTicket = (id: string) => {
    console.log('Complete ticket:', id);
    // TODO: Implement complete ticket
  };

  const handlePlayAudio = (id: string) => {
    console.log('Play audio for ticket:', id);
    // TODO: Implement audio playback
  };

  const getVisibleColumns = () => columns.filter(col => col.visible);

  // Action buttons based on status
  const getActionButton = (ticket: Ticket) => {
    switch (ticket.status) {
      case 'Assigned':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleStartTicket(ticket.id)}
            className="bg-primary hover:bg-primary/90"
          >
            <Play className="w-4 h-4 mr-1" />
            Start
          </Button>
        );
      case 'In Progress':
        return (
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handlePauseTicket(ticket.id)}
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => handleCompleteTicket(ticket.id)}
              className="bg-primary hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Complete
            </Button>
          </div>
        );
      case 'Paused':
        return (
          <Button
            size="sm"
            variant="default"
            onClick={() => handleResumeTicket(ticket.id)}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
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

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        {/* Page Header */}
        <PageHeader
          title="My Work"
          description="Your assigned tickets and active work queue"
        />

        {/* Search Bar */}
        <SearchBar
          placeholder="Search tickets by ID, title, or customer..."
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Toolbar Row */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          <FilterExportBar
            filters={filterConfig}
            onExport={(format) => console.log('Export as:', format)}
          />
          <div className="flex items-center gap-2">
            <ViewToggle
              view={viewMode}
              onViewChange={setViewMode}
              modes={['table', 'grid', 'card']}
            />
            {viewMode === 'table' && (
              <ColumnToggle columns={columns} onColumnChange={setColumns} />
            )}
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <BulkActions
            selectedCount={selectedIds.length}
            totalCount={filteredTickets.length}
            actions={bulkActions}
            onAction={handleBulkAction}
            onClearSelection={() => setSelectedIds([])}
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {filteredTickets.filter((t) => t.status === 'Assigned').length}
              </div>
              <div className="text-sm text-muted-foreground">Assigned</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {filteredTickets.filter((t) => t.status === 'In Progress').length}
              </div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-destructive">
                {filteredTickets.filter((t) => t.isOverdue).length}
              </div>
              <div className="text-sm text-muted-foreground">Overdue</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">
                {formatTime(filteredTickets.reduce((sum, t) => sum + t.totalTime, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Time</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Display */}
        <Card>
          <CardContent className="p-0">
            {/* Table View */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {getVisibleColumns().map((column) => {
                        if (column.key === 'checkbox') {
                          return (
                            <TableHead key={column.key} className="w-12">
                              <Checkbox
                                checked={selectedIds.length === filteredTickets.length && filteredTickets.length > 0}
                                onCheckedChange={handleSelectAll}
                              />
                            </TableHead>
                          );
                        }
                        return <TableHead key={column.key}>{column.label}</TableHead>;
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={getVisibleColumns().length} className="h-32 text-center text-muted-foreground">
                          No tickets found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTickets.map((ticket) => (
                        <TableRow key={ticket.id} className={ticket.isOverdue ? 'bg-destructive/5' : ''}>
                          {getVisibleColumns().map((column) => {
                            if (column.key === 'checkbox') {
                              return (
                                <TableCell key={column.key}>
                                  <Checkbox
                                    checked={selectedIds.includes(ticket.id)}
                                    onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                                  />
                                </TableCell>
                              );
                            }
                            if (column.key === 'id') {
                              return (
                                <TableCell key={column.key} className="font-medium">
                                  {ticket.id}
                                </TableCell>
                              );
                            }
                            if (column.key === 'title') {
                              return (
                                <TableCell key={column.key}>
                                  <div className="max-w-xs truncate">{ticket.title}</div>
                                </TableCell>
                              );
                            }
                            if (column.key === 'customer') {
                              return (
                                <TableCell key={column.key} className="text-sm text-muted-foreground">
                                  {ticket.customer}
                                </TableCell>
                              );
                            }
                            if (column.key === 'priority') {
                              return (
                                <TableCell key={column.key}>
                                  <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                                    {ticket.priority}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            if (column.key === 'status') {
                              return (
                                <TableCell key={column.key}>
                                  <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                                    {ticket.status}
                                  </Badge>
                                </TableCell>
                              );
                            }
                            if (column.key === 'expectedDate') {
                              return (
                                <TableCell key={column.key} className="text-sm">
                                  {ticket.expectedDate}
                                </TableCell>
                              );
                            }
                            if (column.key === 'totalTime') {
                              return (
                                <TableCell key={column.key} className="text-sm">
                                  {formatTime(ticket.totalTime)}
                                </TableCell>
                              );
                            }
                            if (column.key === 'audio') {
                              return (
                                <TableCell key={column.key}>
                                  {ticket.hasAudio ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handlePlayAudio(ticket.id)}
                                    >
                                      <Play className="h-4 w-4 text-primary" />
                                    </Button>
                                  ) : (
                                    <span className="text-muted-foreground text-xs">-</span>
                                  )}
                                </TableCell>
                              );
                            }
                            if (column.key === 'actions') {
                              return (
                                <TableCell key={column.key}>
                                  <div className="flex items-center gap-2">
                                    {getActionButton(ticket)}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => handleView(ticket.id)}>
                                          <Eye className="mr-2 h-4 w-4" />
                                          View Details
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </TableCell>
                              );
                            }
                            return null;
                          })}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTickets.length === 0 ? (
                  <div className="col-span-full h-32 flex items-center justify-center text-muted-foreground">
                    No tickets found
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${ticket.isOverdue ? 'border-destructive' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <Checkbox
                            checked={selectedIds.includes(ticket.id)}
                            onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                          />
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-base line-clamp-1">{ticket.id}</CardTitle>
                            <CardDescription className="text-sm line-clamp-2 mt-1">
                              {ticket.title}
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                              {ticket.priority}
                            </Badge>
                            <Badge variant={getStatusVariant(ticket.status)} className="text-xs">
                              {ticket.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Customer:</span>
                            <p className="font-medium truncate">{ticket.customer}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Due:</span>
                            <p className="font-medium">{ticket.expectedDate}</p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Time: </span>
                          <span className="font-medium">{formatTime(ticket.totalTime)}</span>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          {getActionButton(ticket)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(ticket.id)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Card View */}
            {viewMode === 'card' && (
              <div className="p-6 space-y-4">
                {filteredTickets.length === 0 ? (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No tickets found
                  </div>
                ) : (
                  filteredTickets.map((ticket) => (
                    <Card key={ticket.id} className={`hover:shadow-md transition-shadow ${ticket.isOverdue ? 'border-destructive' : ''}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Checkbox
                            checked={selectedIds.includes(ticket.id)}
                            onCheckedChange={(checked) => handleSelectOne(ticket.id, checked as boolean)}
                            className="mt-1"
                          />
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <div className="flex items-center gap-3">
                                  <h3 className="text-lg font-semibold text-foreground">{ticket.id}</h3>
                                  <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                                  <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{ticket.title}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Customer</div>
                                <div className="text-sm font-medium">{ticket.customer}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Expected Date</div>
                                <div className="text-sm font-medium">{ticket.expectedDate}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Time Spent</div>
                                <div className="text-sm font-medium">{formatTime(ticket.totalTime)}</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {getActionButton(ticket)}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(ticket.id)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </Button>
                              {ticket.hasAudio && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePlayAudio(ticket.id)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Play Audio
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
