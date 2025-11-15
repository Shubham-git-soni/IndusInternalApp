'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockAssetStats, mockRecentActivities } from '@/lib/assets-mock-data';

import { 
  Package, CheckSquare, Wrench, Trash2, Box, PlusCircle, Archive, 
  Filter, Download, BarChart2, Settings, UserSquare, CreditCard, 
  Receipt
} from 'lucide-react';

// Main Page Component
export default function AssetsDashboardPage() {
  const router = useRouter();

  const getActivityDotColor = (action: string) => {
    switch (action) {
      case 'Issued': return 'bg-blue-500 dark:bg-blue-400';
      case 'Created': return 'bg-green-500 dark:bg-green-400';
      case 'Returned': return 'bg-yellow-500 dark:bg-yellow-400';
      case 'Repaired': return 'bg-purple-500 dark:bg-purple-400';
      default: return 'bg-muted-foreground';
    }
  };

  return (
    <DashboardLayout>
      <div className="pt-20 pb-20 sm:pb-8 px-4 lg:px-6 space-y-6 bg-background min-h-screen">

        <div>
            <h1 className="text-3xl font-bold text-foreground">Asset Management</h1>
            <p className="text-muted-foreground">Manage all company assets, inventory, and assignments.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Link href="/assets/list/all" className="col-span-1"><Card className="hover:shadow-md transition-shadow h-full"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Assets</CardTitle><div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"><Package className="w-5 h-5" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{mockAssetStats.active}</div><p className="text-xs text-muted-foreground">All company assets</p></CardContent></Card></Link>
          <Link href="/assets/list/in-stock" className="col-span-1"><Card className="hover:shadow-md transition-shadow h-full"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Stock</CardTitle><div className="p-2 rounded-lg bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"><CheckSquare className="w-5 h-5" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{mockAssetStats.inStock}</div><p className="text-xs text-muted-foreground">Available to be issued</p></CardContent></Card></Link>
          <Link href="/assets/list/issued" className="col-span-1"><Card className="hover:shadow-md transition-shadow h-full"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Issued</CardTitle><div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400"><Box className="w-5 h-5" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{mockAssetStats.issued}</div><p className="text-xs text-muted-foreground">Currently assigned</p></CardContent></Card></Link>
          <Link href="/assets/list/in-repair" className="col-span-1"><Card className="hover:shadow-md transition-shadow h-full"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Repair</CardTitle><div className="p-2 rounded-lg bg-destructive/10 text-destructive"><Wrench className="w-5 h-5" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{mockAssetStats.inRepair}</div><p className="text-xs text-muted-foreground">Under maintenance</p></CardContent></Card></Link>
          <Link href="/assets/list/scrapped" className="col-span-2 sm:col-span-1"><Card className="hover:shadow-md transition-shadow h-full"><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Scrapped</CardTitle><div className="p-2 rounded-lg bg-muted text-muted-foreground"><Trash2 className="w-5 h-5" /></div></CardHeader><CardContent><div className="text-2xl font-bold">{mockAssetStats.scrapped}</div><p className="text-xs text-muted-foreground">End of life assets</p></CardContent></Card></Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Link href="/assets/add" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent"><div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 flex items-center justify-center"><PlusCircle className="w-6 h-6" /></div><span className="text-sm font-medium">Asset Entry</span></Link>
              <Link href="/assets/all" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent"><div className="w-12 h-12 rounded-lg bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 flex items-center justify-center"><Archive className="w-6 h-6" /></div><span className="text-sm font-medium">View All Assets</span></Link>

              {/* ===== NAYE BUTTONS YAHAN ADD KIYE GAYE HAIN ===== */}
              <Link href="/assets/my-assets" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 flex items-center justify-center"><UserSquare className="w-6 h-6" /></div>
                <span className="text-sm font-medium">My Assets</span>
              </Link>
              <Link href="/assets/subscriptions" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent">
                <div className="w-12 h-12 rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400 flex items-center justify-center"><CreditCard className="w-6 h-6" /></div>
                <span className="text-sm font-medium">Subscriptions</span>
              </Link>
              {/* ============================================= */}

    {/* ===== YEH NAYA BUTTON ADD KIYA GAYA HAI ===== */}
              <Link href="/assets/expenses" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent">
                <div className="w-12 h-12 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400 flex items-center justify-center"><Receipt className="w-6 h-6" /></div>
                <span className="text-sm font-medium"> Expenses Management</span>
              </Link>
              {/* ============================================= */}
              <Link href="/assets/reports" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent"><div className="w-12 h-12 rounded-lg bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400 flex items-center justify-center"><BarChart2 className="w-6 h-6" /></div><span className="text-sm font-medium">View Reports</span></Link>
              <Link href="/assets/categories" className="h-auto flex flex-col items-center justify-center gap-2 p-4 rounded-lg hover:bg-accent"><div className="w-12 h-12 rounded-lg bg-muted text-muted-foreground flex items-center justify-center"><Settings className="w-6 h-6" /></div><span className="text-sm font-medium">Manage Categories</span></Link>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Activities ({mockRecentActivities.length})</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><Filter size={14} className="mr-2" /> Filter</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700"><Download size={14} className="mr-2" /> Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockRecentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`mt-1.5 size-2.5 rounded-full ${getActivityDotColor(activity.action)}`}></div>
                    <div className="flex-1">
                      <p className="text-sm"><strong>{activity.assetName}</strong> was {activity.action.toLowerCase()} by <strong>{activity.user}</strong>.</p>
                      <div className="flex items-center gap-2 mt-1"><p className="text-xs text-muted-foreground">{activity.timestamp}</p><Badge variant="secondary" className="cursor-pointer">{activity.category}</Badge></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </DashboardLayout>
  );
}