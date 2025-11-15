'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import StatusBadge from '@/components/StatusBadge';
import TimeTracker from '@/components/TimeTracker';
import FileUploader from '@/components/FileUploader';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Volume2 } from 'lucide-react';

interface TestingTicket {
  id: string;
  title: string;
  customer: string;
  assignedDeveloper: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'PendingQC' | 'In-Testing';
  description: string;
  sentToQCDate: string;
  createdDate: string;
  audioUrl?: string;
  developerNotes?: string;
}

const mockTickets: TestingTicket[] = [
  {
    id: 'TKT-2001',
    title: 'User profile update feature',
    customer: 'Acme Corp',
    assignedDeveloper: 'John Developer',
    priority: 'High',
    status: 'PendingQC',
    description: 'Implemented new feature allowing users to update their profile information including avatar upload.',
    sentToQCDate: '2025-11-06',
    createdDate: '2025-11-02',
    audioUrl: '#',
    developerNotes: 'All validations implemented. Test with different file formats for avatar.'
  },
  {
    id: 'TKT-2002',
    title: 'Invoice generation module',
    customer: 'Tech Solutions',
    assignedDeveloper: 'Mike Smith',
    priority: 'Critical',
    status: 'In-Testing',
    description: 'New invoice generation system with PDF export and email functionality.',
    sentToQCDate: '2025-11-05',
    createdDate: '2025-10-30',
    audioUrl: '#',
    developerNotes: 'PDF generation tested locally. Email templates ready.'
  },
  {
    id: 'TKT-2003',
    title: 'Dark mode implementation',
    customer: 'Global Systems',
    assignedDeveloper: 'Emily Chen',
    priority: 'Medium',
    status: 'PendingQC',
    description: 'Implemented dark mode theme across the entire application with user preference storage.',
    sentToQCDate: '2025-11-05',
    createdDate: '2025-11-01',
    audioUrl: '#',
    developerNotes: 'Theme switcher in header. Check all pages for proper contrast.'
  },
  {
    id: 'TKT-2004',
    title: 'Real-time notifications',
    customer: 'Innovate Ltd',
    assignedDeveloper: 'Robert Jones',
    priority: 'High',
    status: 'PendingQC',
    description: 'WebSocket-based real-time notification system for user alerts and updates.',
    sentToQCDate: '2025-11-04',
    createdDate: '2025-10-28',
    audioUrl: '#',
    developerNotes: 'Test with multiple browser tabs. Check notification persistence.'
  },
  {
    id: 'TKT-2005',
    title: 'Advanced search filters',
    customer: 'NextGen Inc',
    assignedDeveloper: 'Alex Kumar',
    priority: 'Medium',
    status: 'In-Testing',
    description: 'Enhanced search functionality with multiple filters, date ranges, and saved searches.',
    sentToQCDate: '2025-11-04',
    createdDate: '2025-10-25',
    audioUrl: '#',
    developerNotes: 'All filter combinations tested. Check performance with large datasets.'
  },
  {
    id: 'TKT-2006',
    title: 'Two-factor authentication',
    customer: 'CloudBase',
    assignedDeveloper: 'Sarah Developer',
    priority: 'Critical',
    status: 'PendingQC',
    description: 'Implemented 2FA using TOTP (Time-based One-Time Password) with QR code generation.',
    sentToQCDate: '2025-11-03',
    createdDate: '2025-10-20',
    audioUrl: '#',
    developerNotes: 'Test with Google Authenticator and Microsoft Authenticator apps.'
  },
  {
    id: 'TKT-2007',
    title: 'Bulk data import',
    customer: 'DataFlow Systems',
    assignedDeveloper: 'John Developer',
    priority: 'High',
    status: 'PendingQC',
    description: 'CSV and Excel file import with validation, error reporting, and progress tracking.',
    sentToQCDate: '2025-11-03',
    createdDate: '2025-10-22',
    audioUrl: '#',
    developerNotes: 'Test with files up to 10MB. Check error handling for invalid data.'
  },
  {
    id: 'TKT-2008',
    title: 'API rate limiting',
    customer: 'SearchPro',
    assignedDeveloper: 'Mike Smith',
    priority: 'Medium',
    status: 'In-Testing',
    description: 'Implemented rate limiting on all API endpoints to prevent abuse and ensure fair usage.',
    sentToQCDate: '2025-11-02',
    createdDate: '2025-10-18',
    audioUrl: '#',
    developerNotes: 'Limits set per user role. Test rate limit headers in response.'
  },
  {
    id: 'TKT-2009',
    title: 'Mobile responsive dashboard',
    customer: 'Acme Corp',
    assignedDeveloper: 'Emily Chen',
    priority: 'High',
    status: 'PendingQC',
    description: 'Fully responsive dashboard design optimized for mobile devices with touch gestures.',
    sentToQCDate: '2025-11-02',
    createdDate: '2025-10-15',
    audioUrl: '#',
    developerNotes: 'Test on iOS and Android devices. Check landscape orientation.'
  },
  {
    id: 'TKT-2010',
    title: 'Activity audit log',
    customer: 'Tech Solutions',
    assignedDeveloper: 'Robert Jones',
    priority: 'Medium',
    status: 'PendingQC',
    description: 'Comprehensive activity logging system tracking all user actions with timestamp and IP address.',
    sentToQCDate: '2025-11-01',
    createdDate: '2025-10-12',
    audioUrl: '#',
    developerNotes: 'Logs stored securely. Test export functionality.'
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

export default function TestingWorkflow() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<TestingTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PendingQC' | 'In-Testing'>('all');

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch =
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.assignedDeveloper.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleStartTesting = (ticket: TestingTicket) => {
    setSelectedTicket(ticket);
    setRemarks('');
    setIsDialogOpen(true);
  };

  const handlePass = () => {
    console.log('Test Passed:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleFail = () => {
    console.log('Test Failed:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const playAudio = (audioUrl: string) => {
    console.log('Playing audio:', audioUrl);
    // Implement audio playback logic
  };

  const getStatusBadgeText = (status: string) => {
    if (status === 'PendingQC') return 'Pending';
    if (status === 'In-Testing') return 'In Testing';
    return status;
  };

  return (
    <DashboardLayout>
      <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        <PageHeader
          title="Testing/QC Workflow"
          description="Verify and test tickets sent from developers"
        />

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-foreground">Testing Queue</h2>
                  <Badge variant="secondary">{filteredTickets.length} tickets</Badge>
                </div>
                <SearchBar
                  placeholder="Search tickets..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-full sm:w-64"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === 'PendingQC' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('PendingQC')}
                >
                  Pending QC
                </Button>
                <Button
                  variant={statusFilter === 'In-Testing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('In-Testing')}
                >
                  In Testing
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Developer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent to QC</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                      No tickets found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{ticket.title}</div>
                        </div>
                      </TableCell>
                      <TableCell>{ticket.customer}</TableCell>
                      <TableCell>{ticket.assignedDeveloper}</TableCell>
                      <TableCell>
                        <Badge variant={getPriorityVariant(ticket.priority)} className="text-xs">
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusBadgeText(ticket.status)} />
                      </TableCell>
                      <TableCell>{ticket.sentToQCDate}</TableCell>
                      <TableCell>
                        {ticket.audioUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => playAudio(ticket.audioUrl!)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleStartTesting(ticket)}
                        >
                          {ticket.status === 'In-Testing' ? 'View Details' : 'Start Testing'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Testing Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Testing Center - {selectedTicket?.id}</DialogTitle>
            </DialogHeader>

            {selectedTicket && (
              <div className="space-y-4">
                {/* Ticket Details Card */}
                <Card>
                  <CardHeader>
                    <h3 className="text-sm font-semibold text-foreground">Ticket Details</h3>
                  </CardHeader>
                  <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Ticket ID:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Priority:</span>
                      <Badge variant={getPriorityVariant(selectedTicket.priority)} className="ml-2">
                        {selectedTicket.priority}
                      </Badge>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-muted-foreground">Title:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.title}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Customer:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.customer}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Assigned Developer:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.assignedDeveloper}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Created Date:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.createdDate}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Sent to QC:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.sentToQCDate}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-muted-foreground">Description:</span>
                      <p className="ml-2 text-foreground mt-1">{selectedTicket.description}</p>
                    </div>
                    {selectedTicket.developerNotes && (
                      <div className="sm:col-span-2">
                        <span className="font-medium text-muted-foreground">Developer Notes:</span>
                        <p className="ml-2 text-foreground mt-1 italic">{selectedTicket.developerNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* TimeTracker */}
                <Card>
                  <CardHeader>
                    <h3 className="text-sm font-semibold text-foreground">Testing Time Tracking</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <TimeTracker ticketId={selectedTicket.id} />
                  </CardContent>
                </Card>

                {/* Tester Remarks */}
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-sm font-medium">
                    Testing Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter test results, issues found, edge cases tested, or reasons for failure..."
                    className="resize-none"
                  />
                </div>

                {/* FileUploader for Screenshots */}
                <FileUploader />
              </div>
            )}

            {/* Action Buttons */}
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleFail}
              >
                Fail - Reopen for Developer
              </Button>
              <Button
                onClick={handlePass}
                variant="default"
              >
                Pass - Mark Complete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}