'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { mockExpenses, mockTeamMembers } from '@/lib/assets-mock-data';
import { ArrowLeft, Plus, Edit, Trash2, Search, Save, IndianRupee, Clock, CheckCircle, Check, X, Settings } from 'lucide-react';
import Link from 'next/link';

// ===== CATEGORY AUR SUBCATEGORY KA DATA YAHAN DEFINE KIYA GAYA HAI =====
// NOTE: In a real app, this would be fetched from the backend master table.
const expenseCategories = {
  'Office Supplies': ['Stationery', 'Pantry Supplies', 'Cleaning Supplies'],
  'Travel': ['Cab Fare', 'Flight Tickets', 'Train Tickets', 'Bus Tickets', 'Hotel Stay', 'Client Meal'],
  'Food & Beverages': ['Team Lunch', 'Snacks & Refreshments', 'Office Party'],
  'Software & Subscriptions': ['SaaS Tools', 'Domain & Hosting', 'Software Licenses'],
  'Hardware Purchase': ['Laptops', 'Monitors', 'Peripherals (Mouse, Keyboard)', 'Cables & Adapters'],
  'Cloud Services': ['AWS', 'Azure', 'Google Cloud'],
  'Marketing & Advertising': ['Online Ads', 'Social Media Promotion', 'Events & Sponsorships'],
  'Employee Welfare': ['Gifts & Rewards', 'Health & Wellness'],
  'Miscellaneous': ['Courier Charges', 'Bank Charges', 'Other'],
};
// =====================================================================

export default function DailyExpensesPage() {
  const router = useRouter();
  const [modal, setModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [formData, setFormData] = useState({ date: '', category: '', subcategory: '', description: '', amount: '', paidBy: '', paymentMethod: 'UPI', status: 'Pending' });
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    if (modal.isOpen) {
      if (modal.mode === 'edit' && modal.data) {
        setFormData(modal.data);
        setSelectedCategory(modal.data.category);
      } else {
        const today = new Date().toISOString().split('T')[0];
        setFormData({ date: today, category: '', subcategory: '', description: '', amount: '', paidBy: '', paymentMethod: 'UPI', status: 'Pending' });
        setSelectedCategory('');
      }
    }
  }, [modal]);

  const handleOpenModal = (mode: 'add' | 'edit', expense: any = null) => {
    setModal({ isOpen: true, mode, data: expense });
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, mode: 'add', data: null });
  };

  const handleOpenRejectModal = (expense: any) => {
    setSelectedExpense(expense);
    setIsRejectModalOpen(true);
  };

  const totalSpent = mockExpenses.reduce((sum, exp) => exp.status === 'Approved' ? sum + exp.amount : sum, 0);
  const pendingAmount = mockExpenses.reduce((sum, exp) => exp.status === 'Pending' ? sum + exp.amount : sum, 0);
  const pendingCount = mockExpenses.filter(exp => exp.status === 'Pending').length;

  const filteredExpenses = mockExpenses.filter(exp => exp.status.toLowerCase() === activeTab);
  const subcategories = expenseCategories[selectedCategory as keyof typeof expenseCategories] || [];

  const handleCategoryChange = (value: string) => {
      setSelectedCategory(value);
      setFormData(prev => ({ ...prev, category: value, subcategory: '' })); // Subcategory reset karein
  }
  
  const handleSubcategoryChange = (value: string) => {
      setFormData(prev => ({ ...prev, subcategory: value }));
  }


  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Daily Expenses</h1>
            <p className="text-muted-foreground">Track and manage all daily company expenditures.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Spent (Approved)</CardTitle><IndianRupee className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Approval</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">₹{pendingAmount.toLocaleString('en-IN')}</div></CardContent></Card>
            <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pending Requests</CardTitle><Clock className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{pendingCount}</div></CardContent></Card>
        </div>

        <Card>
          <CardHeader className="flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <CardTitle>Expense Logs</CardTitle>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search expenses..." className="pl-9" />
              </div>
              
              <Link href="/assets/expenses/master" passHref>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Settings size={16} className="mr-2" /> Manage Master
                </Button>
              </Link>
              <Button onClick={() => handleOpenModal('add')} className="bg-green-600 hover:bg-green-700"><Plus size={16} className="mr-2" /> Add Expense</Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <div className="mt-4">
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader><TableRow>{['Date', 'Category', 'Subcategory', 'Description', 'Amount', 'Paid By', 'Actions'].map(h=><TableHead key={h}>{h}</TableHead>)}</TableRow></TableHeader>
                    <TableBody>
                      {filteredExpenses.map(exp => (
                        <TableRow key={exp.id}>
                          <TableCell>{exp.date}</TableCell><TableCell>{exp.category}</TableCell>
                          <TableCell>{exp.subcategory || '-'}</TableCell>
                          <TableCell>
                            <p className="font-medium">{exp.description}</p>
                            {exp.rejectionReason && <p className="text-xs text-red-600 mt-1">Reason: {exp.rejectionReason}</p>}
                          </TableCell>
                          <TableCell>₹{exp.amount}</TableCell>
                          <TableCell>{exp.paidBy}</TableCell>
                          <TableCell className="flex gap-2">
                            {activeTab === 'pending' && <>
                              <Button variant="outline" size="sm" className="text-green-600 border-green-600 hover:bg-green-50"><Check size={14} className="mr-1" /> Approve</Button>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleOpenRejectModal(exp)}><X size={14} className="mr-1" /> Reject</Button>
                            </>}
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenModal('edit', exp)}><Edit size={16} /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 size={16} /></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="md:hidden space-y-3">
                  {filteredExpenses.map(exp => (
                    <Card key={exp.id} className="p-4">
                      <div className="flex justify-between items-start">
                        <div><p className="font-bold">{exp.description}</p><p className="text-sm text-muted-foreground">{exp.category} {exp.subcategory ? `> ${exp.subcategory}` : ''}</p></div>
                        <p className="font-bold text-lg">₹{exp.amount}</p>
                      </div>
                      {exp.rejectionReason && (
                        <div className="mt-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-800 text-xs">
                          <p><strong>Rejected by {exp.rejectedBy}:</strong> {exp.rejectionReason}</p>
                        </div>
                      )}
                      {activeTab === 'pending' && <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 text-green-600 border-green-600 hover:bg-green-50"><Check size={14} className="mr-1" /> Approve</Button>
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 border-red-600 hover:bg-red-50" onClick={() => handleOpenRejectModal(exp)}><X size={14} className="mr-1" /> Reject</Button>
                      </div>}
                    </Card>
                  ))}
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Expense Modal (with Subcategories) */}
      <Dialog open={modal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{modal.mode === 'edit' ? 'Edit Expense' : 'Add New Expense'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto px-6">
            <div className="space-y-2"><Label>Date *</Label><Input type="date" defaultValue={formData.date} /></div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger><SelectValue placeholder="Select a category..." /></SelectTrigger>
                <SelectContent>{Object.keys(expenseCategories).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            
            {subcategories.length > 0 && (
              <div className="space-y-2">
                <Label>Subcategory *</Label>
                <Select value={formData.subcategory} onValueChange={handleSubcategoryChange}>
                  <SelectTrigger><SelectValue placeholder="Select a subcategory..." /></SelectTrigger>
                  <SelectContent>{subcategories.map(sc => <SelectItem key={sc} value={sc}>{sc}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2"><Label>Description *</Label><Input defaultValue={formData.description} /></div>
            <div className="space-y-2"><Label>Amount (INR) *</Label><Input type="number" defaultValue={formData.amount} /></div>
            <div className="space-y-2"><Label>Paid By *</Label><Select><SelectTrigger><SelectValue placeholder="Select an employee..." /></SelectTrigger><SelectContent>{mockTeamMembers.map(t => <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Payment Method *</Label><Select defaultValue={formData.paymentMethod}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="UPI">UPI</SelectItem><SelectItem value="Cash">Cash</SelectItem><SelectItem value="Credit Card">Credit Card</SelectItem><SelectItem value="Bank Transfer">Bank Transfer</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Upload Bill/Receipt</Label><Input type="file" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>Cancel</Button>
            <Button onClick={handleCloseModal}><Save size={16} className="mr-2" /> Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Modal */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Expense</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this expense request from {selectedExpense?.paidBy}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejection-reason">Reason for Rejection *</Label>
            <Textarea id="rejection-reason" placeholder="e.g., Bill not attached, Expense exceeds policy limit..." />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => setIsRejectModalOpen(false)}>Confirm Rejection</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}