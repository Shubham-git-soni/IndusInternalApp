'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockSubscriptions } from '@/lib/assets-mock-data';
import { ArrowLeft, Plus, Edit, Trash2, Search, Save } from 'lucide-react';

export default function SubscriptionsPage() {
  const router = useRouter();
  const [modal, setModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [formData, setFormData] = useState({ serviceName: '', plan: '', cost: '', billingCycle: 'Monthly', nextBillingDate: '', owner: '', status: 'Active', vendorName: '', gstNumber: '', paymentMethod: 'Credit Card', paymentDetail: '', paymentDate: '', transactionId: '' });

  useEffect(() => {
    if (modal.isOpen && modal.mode === 'edit' && modal.data) {
      setFormData(modal.data);
    } else {
      setFormData({ serviceName: '', plan: '', cost: '', billingCycle: 'Monthly', nextBillingDate: '', owner: '', status: 'Active', vendorName: '', gstNumber: '', paymentMethod: 'Credit Card', paymentDetail: '', paymentDate: '', transactionId: '' });
    }
  }, [modal]);

  const handleOpenModal = (mode: 'add' | 'edit', sub: any = null) => {
    setModal({ isOpen: true, mode, data: sub });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const getStatusBadgeVariant = (status: string) => {
    if (status === 'Active') return 'default';
    if (status === 'Cancelled') return 'destructive';
    return 'secondary';
  };

  return (
    <DashboardLayout>
      <div className="pt-20 pb-8 px-4 lg:px-6 space-y-6 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Subscriptions</h1>
            <p className="text-muted-foreground">Track all recurring software and service subscriptions.</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle>All Subscriptions</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search subscriptions..." className="pl-9" />
              </div>
              <Button onClick={() => handleOpenModal('add')}><Plus size={16} className="mr-2" /> Add Subscription</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead><TableHead>Vendor</TableHead><TableHead>GST No.</TableHead>
                    <TableHead>Cost / Cycle</TableHead><TableHead>Payment Date</TableHead><TableHead>Next Billing</TableHead>
                    <TableHead>Payment Detail</TableHead><TableHead>Owner</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSubscriptions.map(sub => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.serviceName}</TableCell><TableCell>{sub.vendorName}</TableCell><TableCell>{sub.gstNumber}</TableCell>
                      <TableCell>₹{sub.cost} / {sub.billingCycle.slice(0,2)}</TableCell><TableCell>{sub.paymentDate}</TableCell><TableCell>{sub.nextBillingDate}</TableCell>
                      <TableCell>{sub.paymentDetail}</TableCell><TableCell>{sub.owner}</TableCell>
                      <TableCell><Badge variant={getStatusBadgeVariant(sub.status) as any}>{sub.status}</Badge></TableCell>
                      <TableCell className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal('edit', sub)}><Edit size={16} /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={16} /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Subscription Modal (Responsive) */}
      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader><DialogTitle>{modal.mode === 'edit' ? 'Edit Subscription' : 'Add New Subscription'}</DialogTitle></DialogHeader>
          <div className="grid gap-6 py-4 max-h-[70vh] overflow-y-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Service Name *</Label><Input defaultValue={formData.serviceName} /></div>
              <div className="space-y-2"><Label>Vendor Name</Label><Input defaultValue={formData.vendorName} /></div>
            </div>
            <div className="space-y-2"><Label>GST Number</Label><Input defaultValue={formData.gstNumber} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Plan / Tier</Label><Input defaultValue={formData.plan} /></div>
              <div className="space-y-2"><Label>Cost (INR) *</Label><Input type="number" defaultValue={formData.cost} /></div>
              <div className="space-y-2"><Label>Billing Cycle *</Label><Select defaultValue={formData.billingCycle}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Monthly">Monthly</SelectItem><SelectItem value="Yearly">Yearly</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Payment Date *</Label><Input type="date" defaultValue={formData.paymentDate} /></div>
              <div className="space-y-2"><Label>Next Billing Date *</Label><Input type="date" defaultValue={formData.nextBillingDate} /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Payment Method *</Label><Select defaultValue={formData.paymentMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Credit Card">Credit Card</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem><SelectItem value="UPI">UPI</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label>Payment Details *</Label><Input placeholder="e.g., HDFC Card **** 4567" defaultValue={formData.paymentDetail} /></div>
            </div>
            <div className="space-y-2"><Label>Transaction ID</Label><Input defaultValue={formData.transactionId} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Owner (Team/Dept) *</Label><Input defaultValue={formData.owner} /></div>
              <div className="space-y-2"><Label>Status</Label><Select defaultValue={formData.status}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Active">Active</SelectItem><SelectItem value="Cancelled">Cancelled</SelectItem></SelectContent></Select></div>
            </div>
            <div className="space-y-2"><Label>Upload Invoice</Label><Input type="file" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleCloseModal}><Save size={16} className="mr-2" /> Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}