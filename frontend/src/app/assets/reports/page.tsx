'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { mockTransactions, mockRepairHistory, mockWarrantyStatus } from '@/lib/assets-mock-data';
import { ArrowLeft, Search, Filter, CalendarIcon } from 'lucide-react';

export default function AssetsReportsPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Asset Reports</h1>
            <p className="text-muted-foreground">View detailed reports for all asset activities.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4">
            <Tabs defaultValue="transactions">
              <div className="overflow-x-auto pb-2">
                <TabsList>
                  <TabsTrigger value="transactions">Asset Transaction Log</TabsTrigger>
                  <TabsTrigger value="repair">Repair History</TabsTrigger>
                  <TabsTrigger value="warranty">Warranty Status</TabsTrigger>
                </TabsList>
              </div>

              {/* Transaction Log Tab */}
              <TabsContent value="transactions" className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg bg-background flex flex-col sm:flex-row flex-wrap items-center gap-4">
                  <div className="relative w-full sm:w-auto">
                    <Input type="date" className="w-full sm:w-48" />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="relative w-full sm:w-auto">
                    <Input type="date" className="w-full sm:w-48" />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <Button className="w-full sm:w-auto"><Search size={16} className="mr-2" /> Filter Report</Button>
                  <Button variant="ghost" className="w-full sm:w-auto">Clear Filter</Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>{['AssetID', 'Asset Name', 'Category', 'Member', 'Model No.', 'Serial No.', 'Description', 'Issue Date & Time', 'Qty Issued', 'Return Date & Time', 'Qty Returned'].map(h => <TableHead key={h}><div className="flex items-center gap-1">{h} <Filter size={12} /></div></TableHead>)}</TableRow>
                      <TableRow className="bg-muted">{['AssetID', 'Asset Name', 'Category', 'Member', 'Model No.', 'Serial No.', 'Description', 'Issue Date & Time', 'Qty Issued', 'Return Date & Time', 'Qty Returned'].map(h => <TableHead key={`${h}-filter`} className="p-1"><div className="relative"><Input className="h-7 text-xs" /><Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" /></div></TableHead>)}</TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTransactions.map(t => (
                        <TableRow key={t.id}>
                          <TableCell>{t.assetId}</TableCell><TableCell>{t.assetName}</TableCell><TableCell>{t.category}</TableCell><TableCell>{t.member}</TableCell><TableCell>{t.modelNo || '-'}</TableCell><TableCell>{t.serialNo || '-'}</TableCell><TableCell>{t.description || '-'}</TableCell><TableCell>{t.issueDate}</TableCell><TableCell>{t.qtyIssued}</TableCell><TableCell>{t.returnDate || '-'}</TableCell><TableCell>{t.qtyReturned}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Repair History Tab */}
              <TabsContent value="repair" className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg bg-background flex flex-col sm:flex-row flex-wrap items-center gap-4">
                  <div className="relative w-full sm:w-auto"><Input type="date" defaultValue="2025-07-03" className="w-full sm:w-48" /><CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                  <div className="relative w-full sm:w-auto"><Input type="date" defaultValue="2025-10-03" className="w-full sm:w-48" /><CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /></div>
                  <Button className="w-full sm:w-auto"><Search size={16} className="mr-2" /> Generate Report</Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>{['Asset Name', 'Vendor Name', 'Problem Description', 'Sent Date', 'Return Date', 'Cost', 'Handed Over By', 'Received By', 'Bill'].map(h=><TableHead key={h}><div className="flex items-center gap-1">{h} <Filter size={12} /></div></TableHead>)}</TableRow>
                      <TableRow className="bg-muted">{['Asset Name', 'Vendor Name', 'Problem Description', 'Sent Date', 'Return Date', 'Cost', 'Handed Over By', 'Received By', 'Bill'].map(h=><TableHead key={`${h}-filter`} className="p-1"><div className="relative"><Input className="h-7 text-xs" /><Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" /></div></TableHead>)}</TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockRepairHistory.map(r=>(<TableRow key={r.id}><TableCell>{r.assetName}</TableCell><TableCell>{r.vendorName}</TableCell><TableCell>{r.problem}</TableCell><TableCell>{r.sentDate}</TableCell><TableCell>{r.returnDate}</TableCell><TableCell>₹{r.cost}</TableCell><TableCell>{r.handedBy}</TableCell><TableCell>{r.receivedBy}</TableCell><TableCell>{r.bill || '-'}</TableCell></TableRow>))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Warranty Status Tab */}
              <TabsContent value="warranty" className="mt-4 space-y-4">
                <div className="p-4 border rounded-lg bg-background flex flex-col sm:flex-row flex-wrap items-center gap-4">
                  <Select defaultValue="30"><SelectTrigger className="w-full sm:w-64"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">Show Assets Expiring in Next 30 Days</SelectItem><SelectItem value="60">Next 60 Days</SelectItem><SelectItem value="90">Next 90 Days</SelectItem></SelectContent></Select>
                  <Button className="w-full sm:w-auto"><Search size={16} className="mr-2" /> Generate Report</Button>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>{['Asset Name', 'Category Name', 'Serial Number', 'Unit', 'Current Holder', 'Purchase Date', 'Expires On', 'Status'].map(h=><TableHead key={h}><div className="flex items-center gap-1">{h} <Filter size={12} /></div></TableHead>)}</TableRow>
                      <TableRow className="bg-muted">{['Asset Name', 'Category Name', 'Serial Number', 'Unit', 'Current Holder', 'Purchase Date', 'Expires On', 'Status'].map(h=><TableHead key={`${h}-filter`} className="p-1"><div className="relative"><Input className="h-7 text-xs" /><Search size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground" /></div></TableHead>)}</TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockWarrantyStatus.map(w=>(<TableRow key={w.id}><TableCell>{w.assetName}</TableCell><TableCell>{w.category}</TableCell><TableCell>{w.serial}</TableCell><TableCell>{w.unit}</TableCell><TableCell>{w.holder}</TableCell><TableCell>{w.purchaseDate}</TableCell><TableCell>{w.expiresOn}</TableCell><TableCell><Badge className="bg-amber-500 hover:bg-amber-600">{w.status}</Badge></TableCell></TableRow>))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}