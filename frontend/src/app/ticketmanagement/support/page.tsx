'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Send, Volume2, MoreVertical } from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SupportTicket {
  id: string;
  title: string;
  customer: string;
  sentBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'PendingSupport' | 'SentToDev' | 'Resolved';
  description: string;
  assignedDeveloper: string;
  createdDate: string;
  audioUrl?: string;
}

const mockTickets: SupportTicket[] = [
  {
    id: 'TKT-1001',
    title: 'Login page not loading',
    customer: 'Acme Corp',
    sentBy: 'John Developer',
    priority: 'Critical',
    status: 'PendingSupport',
    description: 'Users are unable to access the login page. The page shows a blank screen after clicking the login button.',
    assignedDeveloper: 'John Developer',
    createdDate: '2025-11-05',
    audioUrl: '#'
  },
  {
    id: 'TKT-1002',
    title: 'Payment gateway timeout',
    customer: 'Tech Solutions',
    sentBy: 'Sarah Tester',
    priority: 'High',
    status: 'PendingSupport',
    description: 'Payment processing is timing out after 30 seconds, causing transaction failures.',
    assignedDeveloper: 'Mike Smith',
    createdDate: '2025-11-05',
    audioUrl: '#'
  },
  {
    id: 'TKT-1003',
    title: 'Dashboard widgets not refreshing',
    customer: 'Global Systems',
    sentBy: 'John Developer',
    priority: 'Medium',
    status: 'SentToDev',
    description: 'Dashboard data is not auto-refreshing as expected. Users need to manually reload the page.',
    assignedDeveloper: 'Emily Chen',
    createdDate: '2025-11-04',
    audioUrl: '#'
  },
  {
    id: 'TKT-1004',
    title: 'Export to PDF broken',
    customer: 'Innovate Ltd',
    sentBy: 'Sarah Tester',
    priority: 'Medium',
    status: 'PendingSupport',
    description: 'The export to PDF feature is generating corrupted files that cannot be opened.',
    assignedDeveloper: 'Robert Jones',
    createdDate: '2025-11-04',
  },
  {
    id: 'TKT-1005',
    title: 'Mobile app crashes on Android 14',
    customer: 'NextGen Inc',
    sentBy: 'John Developer',
    priority: 'High',
    status: 'Resolved',
    description: 'App crashes immediately after launch on Android 14 devices. Works fine on Android 13 and below.',
    assignedDeveloper: 'Alex Kumar',
    createdDate: '2025-11-03',
    audioUrl: '#'
  },
  {
    id: 'TKT-1006',
    title: 'Email notifications delayed',
    customer: 'CloudBase',
    sentBy: 'Sarah Tester',
    priority: 'Low',
    status: 'PendingSupport',
    description: 'Email notifications are being sent with 2-3 hours delay instead of immediately.',
    assignedDeveloper: 'Mike Smith',
    createdDate: '2025-11-03',
    audioUrl: '#'
  },
  {
    id: 'TKT-1007',
    title: 'Database connection pooling issue',
    customer: 'DataFlow Systems',
    sentBy: 'John Developer',
    priority: 'Critical',
    status: 'SentToDev',
    description: 'Application is running out of database connections during peak hours, causing service disruption.',
    assignedDeveloper: 'Emily Chen',
    createdDate: '2025-11-02',
    audioUrl: '#'
  },
  {
    id: 'TKT-1008',
    title: 'Search autocomplete too slow',
    customer: 'SearchPro',
    sentBy: 'Sarah Tester',
    priority: 'Medium',
    status: 'PendingSupport',
    description: 'Autocomplete suggestions take 5+ seconds to appear, significantly affecting user experience.',
    assignedDeveloper: 'Robert Jones',
    createdDate: '2025-11-02',
    audioUrl: '#'
  }
];

const getPriorityVariant = (priority: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (priority) {
    case 'Critical':
      return 'destructive';
    case 'High':
      return 'destructive';
    case 'Medium':
      return 'default';
    case 'Low':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getStatusVariant = (status: string): 'destructive' | 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'PendingSupport':
      return 'default';
    case 'SentToDev':
      return 'outline';
    case 'Resolved':
      return 'secondary';
    default:
      return 'outline';
  }
};

export default function SupportPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [reply, setReply] = useState('');

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { key: 'checkbox', label: 'Select', visible: true },
    { key: 'id', label: 'Ticket ID', visible: true },
    { key: 'title', label: 'Title', visible: true },
    { key: 'customer', label: 'Customer', visible: true },
    { key: 'sentBy', label: 'Sent By', visible: true },
    { key: 'priority', label: 'Priority', visible: true },
    { key: 'status', label: 'Status', visible: true },
    { key: 'createdDate', label: 'Created', visible: true },
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
        { value: 'PendingSupport', label: 'Pending Support' },
        { value: 'SentToDev', label: 'Sent to Dev' },
        { value: 'Resolved', label: 'Resolved' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      value: priorityFilter,
      onChange: setPriorityFilter,
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'Critical', label: 'Critical' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
  ];

  // Bulk actions
  const bulkActions: BulkAction[] = [
    { value: 'export', label: 'Export Selected' },
    { value: 'sendToDev', label: 'Send to Developer' },
    { value: 'resolve', label: 'Mark as Resolved' },
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

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setShowReplyDialog(true);
  };

  const handleReply = () => {
    console.log('Sending reply:', reply, 'for ticket:', selectedTicket?.id);
    setReply('');
    setShowReplyDialog(false);
  };

  const handleSendToDev = (id: string) => {
    console.log('Send to developer:', id);
  };

  const handlePlayAudio = (id: string) => {
    console.log('Play audio:', id);
  };

  const getVisibleColumns = () => columns.filter(col => col.visible);

  return (
    <DashboardLayout>
      <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        {/* Page Header */}
        <PageHeader
          title="Support Tickets"
          description="Handle support requests from developers and QA team"
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
                        <TableRow key={ticket.id}>
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
                                <TableCell key={column.key} className="text-sm">
                                  {ticket.customer}
                                </TableCell>
                              );
                            }
                            if (column.key === 'sentBy') {
                              return (
                                <TableCell key={column.key} className="text-sm text-muted-foreground">
                                  {ticket.sentBy}
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
                            if (column.key === 'createdDate') {
                              return (
                                <TableCell key={column.key} className="text-sm">
                                  {ticket.createdDate}
                                </TableCell>
                              );
                            }
                            if (column.key === 'audio') {
                              return (
                                <TableCell key={column.key}>
                                  {ticket.audioUrl ? (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => handlePlayAudio(ticket.id)}
                                    >
                                      <Volume2 className="h-4 w-4 text-primary" />
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
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleView(ticket)}
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      View
                                    </Button>
                                    {ticket.status === 'PendingSupport' && (
                                      <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => handleSendToDev(ticket.id)}
                                      >
                                        <Send className="w-4 h-4 mr-1" />
                                        Send to Dev
                                      </Button>
                                    )}
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
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
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
                            <Badge variant={getStatusVariant(ticket.status)} className="text-xs whitespace-nowrap">
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
                            <span className="text-muted-foreground">Sent By:</span>
                            <p className="font-medium truncate">{ticket.sentBy}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(ticket)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          {ticket.status === 'PendingSupport' && (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleSendToDev(ticket.id)}
                              className="flex-1"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Send
                            </Button>
                          )}
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
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
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
                                <div className="flex items-center gap-3 flex-wrap">
                                  <h3 className="text-lg font-semibold text-foreground">{ticket.id}</h3>
                                  <Badge variant={getPriorityVariant(ticket.priority)}>{ticket.priority}</Badge>
                                  <Badge variant={getStatusVariant(ticket.status)}>{ticket.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{ticket.title}</p>
                              </div>
                            </div>

                            <div className="bg-muted/50 p-3 rounded-lg">
                              <p className="text-sm text-foreground">{ticket.description}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Customer</div>
                                <div className="text-sm font-medium">{ticket.customer}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Sent By</div>
                                <div className="text-sm font-medium">{ticket.sentBy}</div>
                              </div>
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">Created</div>
                                <div className="text-sm font-medium">{ticket.createdDate}</div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleView(ticket)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View & Reply
                              </Button>
                              {ticket.status === 'PendingSupport' && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleSendToDev(ticket.id)}
                                >
                                  <Send className="w-4 h-4 mr-2" />
                                  Send to Developer
                                </Button>
                              )}
                              {ticket.audioUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handlePlayAudio(ticket.id)}
                                >
                                  <Volume2 className="w-4 h-4 mr-2" />
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

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ticket Details & Reply</DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Ticket ID:</span>
                    <p className="font-medium">{selectedTicket.id}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Customer:</span>
                    <p className="font-medium">{selectedTicket.customer}</p>
                  </div>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-sm mt-1 p-3 bg-muted rounded-lg">{selectedTicket.description}</p>
                </div>
                <div>
                  <Label htmlFor="reply">Your Reply</Label>
                  <Textarea
                    id="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your reply to the developer..."
                    className="mt-2"
                    rows={4}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply}>Send Reply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
