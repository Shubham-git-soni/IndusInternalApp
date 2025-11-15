'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox"; // <-- YEH LINE ADD KI GAYI HAI
import { ArrowLeft, Plus, Edit, Trash2, Check } from 'lucide-react';
import { mockExpenses, mockTeamMembers } from '@/lib/assets-mock-data';

// Category Data for Master Page
const expenseMasterCategories = Object.keys(mockExpenses.reduce((acc, exp) => ({ ...acc, [exp.category]: true }), {})).map((name, index) => ({ id: index + 1, name }));

// Subcategory Data for Master Page
const expenseMasterSubcategories = [
    { id: 1, category: 'Travel', name: 'Cab Fare' },
    { id: 2, category: 'Travel', name: 'Flight Tickets' },
    { id: 3, category: 'Food & Beverages', name: 'Team Lunch' },
    { id: 4, category: 'Office Supplies', name: 'Stationery' },
];

export default function ExpenseMasterPage() {
  const router = useRouter();
  
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [subcategoryModal, setSubcategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });

  const handleOpenCategoryModal = (mode: 'add' | 'edit', cat: any = null) => setCategoryModal({ isOpen: true, mode, data: cat });
  const handleCloseCategoryModal = () => setCategoryModal({ isOpen: false, mode: 'add', data: null });

  const handleOpenSubcategoryModal = (mode: 'add' | 'edit', sub: any = null) => setSubcategoryModal({ isOpen: true, mode, data: sub });
  const handleCloseSubcategoryModal = () => setSubcategoryModal({ isOpen: false, mode: 'add', data: null });

  return (
    <DashboardLayout>
      <div className="pt-20 pb-8 px-4 lg:px-6 space-y-6 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expense Master Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage expense categories and subcategories.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Categories Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Expense Categories</CardTitle>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm"><Trash2 size={16} /> <span className="hidden sm:inline sm:ml-2">Delete Selected</span></Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenCategoryModal('add')}><Plus size={16} /> <span className="hidden sm:inline sm:ml-2">Add</span></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-[50px]"><Checkbox /></TableHead><TableHead>ID</TableHead><TableHead>Category Name</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {expenseMasterCategories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenCategoryModal('edit', cat)}><Edit size={16} /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Subcategories Card */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subcategories</CardTitle>
                 <div className="flex gap-2">
                  <Button variant="destructive" size="sm"><Trash2 size={16} /> <span className="hidden sm:inline sm:ml-2">Delete Selected</span></Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenSubcategoryModal('add')}><Plus size={16} /> <span className="hidden sm:inline sm:ml-2">Add</span></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                 <Table>
                  <TableHeader><TableRow><TableHead className="w-[50px]"><Checkbox /></TableHead><TableHead>Category</TableHead><TableHead>Subcategory Name</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {expenseMasterSubcategories.map(sub => (<TableRow key={sub.id}><TableCell><Checkbox /></TableCell><TableCell>{sub.category}</TableCell><TableCell>{sub.name}</TableCell><TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenSubcategoryModal('edit', sub)}><Edit size={16} /></Button></TableCell></TableRow>))}
                  </TableBody>
                </Table>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={categoryModal.isOpen} onOpenChange={handleCloseCategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>{categoryModal.mode === 'edit' ? 'Edit Category' : 'Add New Category'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2"><Label htmlFor="cat-name">Category Name *</Label><Input id="cat-name" defaultValue={categoryModal.data?.name || ''} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCategoryModal}>Cancel</Button>
            <Button onClick={handleCloseCategoryModal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Subcategory Modal */}
      <Dialog open={subcategoryModal.isOpen} onOpenChange={handleCloseSubcategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>{subcategoryModal.mode === 'edit' ? 'Edit Subcategory' : 'Add New Subcategory'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Main Category *</Label>
              <Select defaultValue={subcategoryModal.data?.category}>
                <SelectTrigger><SelectValue placeholder="Select a Category..." /></SelectTrigger>
                <SelectContent>{expenseMasterCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label htmlFor="sub-name">Subcategory Name *</Label><Input id="sub-name" defaultValue={subcategoryModal.data?.name || ''} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseSubcategoryModal}>Cancel</Button>
            <Button onClick={handleCloseSubcategoryModal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}