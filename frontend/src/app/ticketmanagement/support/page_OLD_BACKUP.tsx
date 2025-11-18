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

interface SupportTicket {
  id: string;
  title: string;
  customer: string;
  sentBy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: string;
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
    status: 'PendingSupport',
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
    audioUrl: '#'
  },
  {
    id: 'TKT-1005',
    title: 'Mobile app crashes on Android 14',
    customer: 'NextGen Inc',
    sentBy: 'John Developer',
    priority: 'High',
    status: 'PendingSupport',
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
    status: 'PendingSupport',
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

const getPriorityBadgeClass = (priority: string) => {
  switch (priority) {
    case 'Critical':
      return 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
    case 'High':
      return 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800';
    case 'Medium':
      return 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    case 'Low':
      return 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export default function SupportActionCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [remarks, setRemarks] = useState('');

  const filteredTickets = mockTickets.filter(ticket =>
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.sentBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTakeAction = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setRemarks('');
    setIsDialogOpen(true);
  };

  const handleSupportVerified = () => {
    console.log('Support Verified:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleSendToQC = () => {
    console.log('Send to QC:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const handleReopenForDeveloper = () => {
    console.log('Reopen for Developer:', selectedTicket?.id, remarks);
    setIsDialogOpen(false);
    setSelectedTicket(null);
  };

  const playAudio = (audioUrl: string) => {
    console.log('Playing audio:', audioUrl);
    // Implement audio playback logic
  };

  return (
    <DashboardLayout>
      <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
        <PageHeader
          title="Support Action Center"
          description="Handle tickets sent from developers and testers requiring support team verification"
        />

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">Support Queue</h2>
                <Badge variant="secondary">{filteredTickets.length} tickets</Badge>
              </div>
              <SearchBar
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:w-64"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Sent By</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Audio</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
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
                      <TableCell>{ticket.sentBy}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={getPriorityBadgeClass(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="Pending" />
                      </TableCell>
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
                          onClick={() => handleTakeAction(ticket)}
                        >
                          Take Action
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Action Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ticket Action Center - {selectedTicket?.id}</DialogTitle>
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
                      <Badge variant="secondary" className={`ml-2 ${getPriorityBadgeClass(selectedTicket.priority)}`}>
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
                      <span className="font-medium text-muted-foreground">Sent By:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.sentBy}</span>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Created Date:</span>
                      <span className="ml-2 text-foreground">{selectedTicket.createdDate}</span>
                    </div>
                    <div className="sm:col-span-2">
                      <span className="font-medium text-muted-foreground">Description:</span>
                      <p className="ml-2 text-foreground mt-1">{selectedTicket.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* TimeTracker */}
                <Card>
                  <CardHeader>
                    <h3 className="text-sm font-semibold text-foreground">Time Tracking</h3>
                  </CardHeader>
                  <CardContent className="p-4">
                    <TimeTracker ticketId={selectedTicket.id} />
                  </CardContent>
                </Card>

                {/* Remarks */}
                <div className="space-y-2">
                  <Label htmlFor="remarks" className="text-sm font-medium">
                    Support Remarks
                  </Label>
                  <Textarea
                    id="remarks"
                    rows={4}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Enter your support remarks, findings, and recommendations..."
                    className="resize-none"
                  />
                </div>

                {/* FileUploader */}
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
                onClick={handleReopenForDeveloper}
              >
                Reopen for Developer
              </Button>
              <Button
                onClick={handleSendToQC}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Send to QC
              </Button>
              <Button
                onClick={handleSupportVerified}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Support Verified
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}