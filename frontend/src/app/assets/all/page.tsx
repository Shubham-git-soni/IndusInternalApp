'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { mockAssets } from '@/lib/assets-mock-data';
import { ArrowLeft, Search, Download, Columns, Filter, Edit, Trash2, ArrowRightLeft, Wrench, History, List, LayoutGrid } from 'lucide-react';
import AssetModals from '../AssetModals';

// Custom Hook to check screen size
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) { setMatches(media.matches); }
    const listener = () => setMatches(media.matches);
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [matches, query]);
  return matches;
};

export default function AllAssetsPage() {
  const router = useRouter();
  const [modalState, setModalState] = useState({ open: false, type: null as any, data: null as any });
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'table' | 'card'>('table');
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Screen size ke hisaab se default view set karein
  useEffect(() => {
    if (!isDesktop) {
      setCurrentView('card'); // Mobile par default card view
    } else {
      setCurrentView('table'); // Desktop par default table view
    }
  }, [isDesktop]);

  const allColumns = [
    { key: 'assetId', label: 'Asset ID' }, { key: 'assetName', label: 'Asset Name' }, { key: 'qty', label: 'Qty' }, 
    { key: 'category', label: 'Category' }, { key: 'cost', label: 'Cost' }, { key: 'procuredBy', label: 'Procured By' }, 
    { key: 'serialNumber', label: 'Serial Number' }, { key: 'issuedTo', label: 'Issued To' }, 
    { key: 'issueDate', label: 'Issue Date' }, { key: 'status', label: 'Status' }
  ];
  const [visibleColumns, setVisibleColumns] = useState(
    allColumns.reduce((acc, col) => ({ ...acc, [col.key]: true }), {})
  );

  const handleSelectRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? [] : [id]);
  };

  const handleSelectAll = (checked: boolean | 'indeterminate') => {
    setSelectedRows(checked ? mockAssets.map(asset => asset.id) : []);
  };

  const selectedAsset = mockAssets.find(a => a.id === selectedRows[0]);

  const handleEdit = () => { if (selectedAsset) router.push(`/assets/edit/${selectedAsset.assetId.split('-')[0]}`); };
  const handleIssue = () => { if (selectedAsset && selectedAsset.status === 'In Stock') setModalState({ open: true, type: 'issue', data: selectedAsset }); else alert('Only "In Stock" assets can be issued.'); };
  const handleReturn = () => { if (selectedAsset && selectedAsset.status === 'Issued') setModalState({ open: true, type: 'return', data: selectedAsset }); else alert('Only "Issued" assets can be returned.'); };
  const handleRepair = () => { if (selectedAsset) setModalState({ open: true, type: 'repair', data: selectedAsset }); };
  const handleHistory = () => { if (selectedAsset) setModalState({ open: true, type: 'history', data: selectedAsset }); };
  const handleScrap = () => { if (selectedRows.length > 0) setModalState({ open: true, type: 'scrap', data: selectedAsset }); };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 bg-background min-h-screen">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">All Company Assets</h1>
            <p className="text-muted-foreground">View and manage all assets in the inventory.</p>
          </div>
        </div>
        <Card className="p-0">
          <div className="p-4 border-b space-y-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search all assets..." className="pl-9" />
              </div>
              {/* ===== VIEW TOGGLE BUTTON YAHAN HAI ===== */}
              <div className="inline-flex rounded-md border bg-background p-0.5">
                  <Button variant={currentView === 'table' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('table')}><List className="h-4 w-4" /></Button>
                  <Button variant={currentView === 'card' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setCurrentView('card')}><LayoutGrid className="h-4 w-4" /></Button>
              </div>
            </div>
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2 whitespace-nowrap">
                <Button size="sm" variant="outline" onClick={handleIssue} disabled={!selectedAsset || selectedAsset.status !== 'In Stock'}><ArrowRightLeft size={14} className="mr-2" /> Issue</Button>
                <Button size="sm" variant="outline" onClick={handleReturn} disabled={!selectedAsset || selectedAsset.status !== 'Issued'}>Return</Button>
                <Button size="sm" variant="outline" onClick={handleRepair} disabled={!selectedAsset}><Wrench size={14} className="mr-2" /> Send to Repair</Button>
                <Button size="sm" variant="outline" onClick={handleHistory} disabled={!selectedAsset}><History size={14} className="mr-2" /> History</Button>
                <Button size="sm" variant="outline" onClick={handleEdit} disabled={!selectedAsset}><Edit size={14} className="mr-2" /> Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" onClick={handleScrap} disabled={selectedRows.length === 0}>Scrap</Button>
                <Button size="sm" variant="destructive" disabled={selectedRows.length === 0}><Trash2 size={14} className="mr-2" /> Delete</Button>
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Download size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem>Export to Excel</DropdownMenuItem></DropdownMenuContent></DropdownMenu>
                <DropdownMenu><DropdownMenuTrigger asChild><Button variant="outline" size="icon"><Columns size={16} /></Button></DropdownMenuTrigger><DropdownMenuContent align="end">{allColumns.map(col => (<DropdownMenuCheckboxItem key={col.key} checked={(visibleColumns as any)[col.key]} onCheckedChange={(checked) => setVisibleColumns(prev => ({...prev, [col.key]: checked}))}>{col.label}</DropdownMenuCheckboxItem>))}</DropdownMenuContent></DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Conditional Rendering for Table and Card View */}
          {currentView === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"><Checkbox onCheckedChange={handleSelectAll} /></TableHead>
                    {allColumns.filter(c => (visibleColumns as any)[c.key]).map(c => (<TableHead key={c.key}><div className="flex items-center gap-1">{c.label} <Filter size={12} /></div></TableHead>))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAssets.map((asset) => (
                    <TableRow key={asset.id} data-state={selectedRows.includes(asset.id) && "selected"}>
                      <TableCell><Checkbox checked={selectedRows.includes(asset.id)} onCheckedChange={() => handleSelectRow(asset.id)} /></TableCell>
                      { (visibleColumns as any).assetId && <TableCell>{asset.assetId}</TableCell> }
                      { (visibleColumns as any).assetName && <TableCell>{asset.assetName}</TableCell> }
                      { (visibleColumns as any).qty && <TableCell>{asset.qty}</TableCell> }
                      { (visibleColumns as any).category && <TableCell>{asset.category}</TableCell> }
                      { (visibleColumns as any).cost && <TableCell>₹{asset.cost}</TableCell> }
                      { (visibleColumns as any).procuredBy && <TableCell>{asset.procuredBy}</TableCell> }
                      { (visibleColumns as any).serialNumber && <TableCell>{asset.serialNumber || '-'}</TableCell> }
                      { (visibleColumns as any).issuedTo && <TableCell>{asset.issuedTo || '-'}</TableCell> }
                      { (visibleColumns as any).issueDate && <TableCell>{asset.issueDate || '-'}</TableCell> }
                      { (visibleColumns as any).status && <TableCell><Badge>{asset.status}</Badge></TableCell> }
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {mockAssets.map(asset => (
                <Card key={asset.id} className={`p-3 border rounded-lg ${selectedRows.includes(asset.id) ? 'border-primary ring-2 ring-primary' : ''}`} onClick={() => handleSelectRow(asset.id)}>
                  <div className="flex items-start gap-3">
                    <Checkbox checked={selectedRows.includes(asset.id)} onCheckedChange={() => handleSelectRow(asset.id)} className="mt-1" />
                    <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div><p className="text-xs text-muted-foreground">Asset ID</p><p className="font-medium">{asset.assetId}</p></div>
                      <div><p className="text-xs text-muted-foreground">Asset Name</p><p className="font-medium">{asset.assetName}</p></div>
                      <div><p className="text-xs text-muted-foreground">Qty</p><p className="font-medium">{asset.qty}</p></div>
                      <div><p className="text-xs text-muted-foreground">Category</p><p className="font-medium">{asset.category}</p></div>
                      <div className="col-span-2"><p className="text-xs text-muted-foreground">Status</p><Badge>{asset.status}</Badge></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
      <AssetModals modalState={modalState} setModalState={setModalState} />
    </DashboardLayout>
  );
}