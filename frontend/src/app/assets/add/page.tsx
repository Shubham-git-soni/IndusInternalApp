'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockTeamMembers, mockCategories } from '@/lib/assets-mock-data';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function AddAssetPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  const addNewItem = () => {
    setItems([...items, { id: Date.now(), assetId: `IN000121-25-${items.length + 1}` }]);
  };

  const warrantyTypes = ['None', 'Warranty', 'Guaranty'];
  const assetTypes = ['New', 'Used', 'Refurbished'];

  return (
    <DashboardLayout>
      <div className="pt-20 pb-8 px-4 lg:px-6 space-y-6 bg-background min-h-screen">
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Add New Asset Purchase</h1>
            <p className="text-muted-foreground">Create a new purchase entry and add assets.</p>
          </div>
        </div>

        <Card>
          <CardContent className="p-4 sm:p-6 space-y-8">
            
            <Card className="border-border shadow-none">
              <CardHeader><CardTitle>Purchase Information</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2"><Label>Entry Number</Label><Input defaultValue="IN000121" disabled /></div>
                <div className="space-y-2"><Label>Purchase Date *</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Supplier Name *</Label><Input /></div>
                <div className="space-y-2"><Label>Bill Number</Label><Input /></div>
                <div className="space-y-2"><Label>Bill Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Challan Number</Label><Input /></div>
                <div className="space-y-2"><Label>Challan Date</Label><Input type="date" /></div>
                <div className="space-y-2"><Label>Procured By *</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{mockTeamMembers.map(t => <SelectItem key={t.id} value={t.fullName}>{t.fullName}</SelectItem>)}</SelectContent></Select>
                </div>
                <div className="sm:col-span-2 lg:col-span-4 space-y-2"><Label>Attachments</Label><Input type="file" /></div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-none">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Asset Items in this Purchase</CardTitle>
                  <Button size="sm" onClick={addNewItem}><Plus size={16} className="mr-2" /> Add Row</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {['Asset ID', 'Asset Name', 'Category', 'Unit', 'Model Number', 'Serial Number', 'Warranty Type', 'Warranty(Days)', 'Expiry Date', 'Description', 'Asset Type', 'Quantity', 'Rate', 'Total', ''].map(h => <TableHead key={h}>{h}</TableHead>)}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 ? <TableRow><TableCell colSpan={15} className="text-center h-24">No items added yet.</TableCell></TableRow> :
                        items.map(item => (
                          <TableRow key={item.id}>
                            <TableCell><Input defaultValue={item.assetId} className="min-w-[140px]" /></TableCell>
                            <TableCell><Input placeholder="Asset Name" className="min-w-[150px]" /></TableCell>
                            <TableCell><Select><SelectTrigger className="min-w-[140px]"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{mockCategories.map(c => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent></Select></TableCell>
                            <TableCell><Input defaultValue="Pcs" className="w-[70px]" /></TableCell>
                            <TableCell><Input placeholder="Model" className="min-w-[120px]" /></TableCell>
                            <TableCell><Input placeholder="Serial" className="min-w-[140px]" /></TableCell>
                            <TableCell><Select><SelectTrigger className="min-w-[120px]"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{warrantyTypes.map(w => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent></Select></TableCell>
                            <TableCell><Input placeholder="e.g., 365" className="w-[120px]" /></TableCell>
                            <TableCell><Input type="date" className="min-w-[140px]" /></TableCell>
                            <TableCell><Input placeholder="Description" className="min-w-[150px]" /></TableCell>
                            <TableCell><Select><SelectTrigger className="min-w-[100px]"><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{assetTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></TableCell>
                            <TableCell><Input type="number" defaultValue={1} className="w-[80px]" /></TableCell>
                            <TableCell><Input type="number" defaultValue={0} className="w-[100px]" /></TableCell>
                            <TableCell className="min-w-[90px]">₹0.00</TableCell>
                            <TableCell><Button variant="ghost" size="icon" className="text-destructive h-8 w-8"><Trash2 size={16} /></Button></TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </div>
                <div className="text-right mt-4 font-bold text-lg">Grand Total: ₹0.00</div>
              </CardContent>
            </Card>

          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 p-4 bg-white rounded-lg shadow-sm border mt-6">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button variant="secondary">Save as Draft</Button>
            <Button className="bg-green-600 hover:bg-green-700">Save Purchase</Button>
        </div>

      </div>
    </DashboardLayout>
  );
}