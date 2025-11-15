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
import { Checkbox } from "@/components/ui/checkbox";
import { mockUnits, mockCategories } from '@/lib/assets-mock-data';
import { ArrowLeft, Plus, Edit, Trash2, Check } from 'lucide-react';

// Main Page Component
export default function AssetsCategoriesPage() {
  const router = useRouter();
  
  // States for modals
  const [categoryModal, setCategoryModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  const [unitModal, setUnitModal] = useState({ isOpen: false, mode: 'add' as 'add' | 'edit', data: null as any });
  
  // States for forms
  const [categoryFormData, setCategoryFormData] = useState({ name: '', unit: '', trackingType: 'Individual' });
  const [unitFormData, setUnitFormData] = useState({ name: '' });

  // Effects to populate form data on edit
  useEffect(() => {
    if (categoryModal.isOpen) {
      if (categoryModal.mode === 'edit' && categoryModal.data) {
        setCategoryFormData({ name: categoryModal.data.name, unit: categoryModal.data.unit, trackingType: categoryModal.data.trackingType });
      } else {
        setCategoryFormData({ name: '', unit: '', trackingType: 'Individual' });
      }
    }
  }, [categoryModal]);

  useEffect(() => {
    if (unitModal.isOpen) {
      if (unitModal.mode === 'edit' && unitModal.data) {
        setUnitFormData({ name: unitModal.data.name });
      } else {
        setUnitFormData({ name: '' });
      }
    }
  }, [unitModal]);

  // Modal handlers
  const handleOpenCategoryModal = (mode: 'add' | 'edit', category: any = null) => setCategoryModal({ isOpen: true, mode, data: category });
  const handleCloseCategoryModal = () => setCategoryModal({ isOpen: false, mode: 'add', data: null });
  const handleOpenUnitModal = (mode: 'add' | 'edit', unit: any = null) => setUnitModal({ isOpen: true, mode, data: unit });
  const handleCloseUnitModal = () => setUnitModal({ isOpen: false, mode: 'add', data: null });

  return (
    <DashboardLayout>
      <div className="pt-20 pb-8 px-4 lg:px-6 space-y-6 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Categories & Units</h1>
            <p className="text-muted-foreground">Organize your asset types and measurement units.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Categories</CardTitle>
                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    <Trash2 size={16} />
                    <span className="hidden sm:inline sm:ml-2">Delete Selected</span>
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenCategoryModal('add')}>
                    <Plus size={16} />
                    <span className="hidden sm:inline sm:ml-2">Add</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader><TableRow><TableHead className="w-[50px]"><Checkbox /></TableHead><TableHead>ID</TableHead><TableHead>Category Name</TableHead><TableHead>Unit</TableHead><TableHead>Tracking Type</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {mockCategories.map(cat => (
                      <TableRow key={cat.id}>
                        <TableCell><Checkbox /></TableCell>
                        <TableCell>{cat.id}</TableCell>
                        <TableCell>{cat.name}</TableCell>
                        <TableCell>{cat.unit}</TableCell>
                        <TableCell className="flex items-center gap-2"><Check size={16} className="text-green-600" /> {cat.trackingType}</TableCell>
                        <TableCell><Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenCategoryModal('edit', cat)}><Edit size={16} /></Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Measurement Units</CardTitle>
                 <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    <Trash2 size={16} />
                    <span className="hidden sm:inline sm:ml-2">Delete Selected</span>
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleOpenUnitModal('add')}>
                    <Plus size={16} />
                    <span className="hidden sm:inline sm:ml-2">Add</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
               <div className="overflow-x-auto">
                 <Table>
                  <TableHeader><TableRow><TableHead className="w-[50px]"><Checkbox /></TableHead><TableHead>No.</TableHead><TableHead>Unit Name</TableHead></TableRow></TableHeader>
                  <TableBody>{mockUnits.map(unit => (<TableRow key={unit.id}><TableCell><Checkbox /></TableCell><TableCell>{unit.id}</TableCell><TableCell>{unit.name}</TableCell></TableRow>))}</TableBody>
                </Table>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add/Edit Category Modal */}
      <Dialog open={categoryModal.isOpen} onOpenChange={handleCloseCategoryModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{categoryModal.mode === 'edit' ? 'Edit Category' : 'Add Category'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cat-name" className="text-right">Category Name *</Label>
              <Input id="cat-name" value={categoryFormData.name} onChange={(e) => setCategoryFormData(prev => ({...prev, name: e.target.value}))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cat-unit" className="text-right">Unit</Label>
              <Select value={categoryFormData.unit} onValueChange={(value) => setCategoryFormData(prev => ({...prev, unit: value}))}>
                <SelectTrigger className="col-span-3"><SelectValue placeholder="Select a unit..." /></SelectTrigger>
                <SelectContent>{mockUnits.map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-1">Individually Trackable?</Label>
              <div className="col-span-3 flex items-start gap-2">
                <Switch id="tracking-switch" checked={categoryFormData.trackingType === 'Individual'} onCheckedChange={(checked) => setCategoryFormData(prev => ({...prev, trackingType: checked ? 'Individual' : 'Bulk'}))} />
                <Label htmlFor="tracking-switch" className="text-xs text-muted-foreground font-normal">
                  (Check for items like Laptops. Uncheck for bulk items.)
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCategoryModal}>Cancel</Button>
            <Button onClick={handleCloseCategoryModal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Unit Modal */}
      <Dialog open={unitModal.isOpen} onOpenChange={handleCloseUnitModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>{unitModal.mode === 'edit' ? 'Edit Unit' : 'Add Unit'}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="unit-name" className="text-right">Unit Name *</Label>
              <Input id="unit-name" value={unitFormData.name} onChange={(e) => setUnitFormData({name: e.target.value})} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseUnitModal}>Cancel</Button>
            <Button onClick={handleCloseUnitModal}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}