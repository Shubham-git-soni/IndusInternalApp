"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, FileSpreadsheet, Loader2, Calendar as CalendarIcon, PlayCircle } from "lucide-react"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { api, reportApi, ApiUser, ApiReportData } from "@/lib/api"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable' 
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx';

import { KpiCardGrid } from "@/components/reports/kpi-card-grid"
import { ReportCharts } from "@/components/reports/report-charts"
import { ReportDetailModal } from "@/components/reports/report-detail-modal"
import { ReportFilters } from "@/components/reports/report-filters"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ReportsPage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<ApiUser[]>([]);
  // --- START OF CHANGE: Remove initial state for filters ---
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  // --- END OF CHANGE ---

  const [reportData, setReportData] = useState<ApiReportData | null>(null);
  const [loading, setLoading] = useState(false); // Only for report generation
  const [initialLoading, setInitialLoading] = useState(true); // For initial user fetch
  const [error, setError] = useState<string | null>(null);
  
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; data: any[] | null, dataType: string }>({ title: '', data: null, dataType: '' });

  const [isPdfExporting, setIsPdfExporting] = useState(false);
  const [isExcelExporting, setIsExcelExporting] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportDateRange, setExportDateRange] = useState<DateRange | undefined>(undefined);

  useEffect(() => {
    if (authLoading) return;
    async function fetchUsers() {
      setInitialLoading(true);
      try {
        const userList = await api.getUsers();
        setUsers(userList);
        if (currentUser?.role !== 'admin' && currentUser?.id) {
            setSelectedUserId(String(currentUser.id));
        }
      } catch (err) {
        setError("Failed to load users list.");
        toast({ title: "Error", description: "Could not fetch the list of users.", variant: "destructive"});
      } finally {
        setInitialLoading(false);
      }
    }
    fetchUsers();
  }, [currentUser, authLoading, toast]);

  const generateReport = useCallback(async () => {
    if (!selectedUserId || !dateRange?.from || !dateRange?.to) {
        toast({ title: "Missing Filters", description: "Please select a user and a date range.", variant: "destructive" });
        return;
    }
    setLoading(true);
    setError(null);
    setReportData(null);
    try {
      const data = await reportApi.getUserPerformanceReport(
        parseInt(selectedUserId),
        format(dateRange.from, "yyyy-MM-dd"),
        format(dateRange.to, "yyyy-MM-dd")
      );
      setReportData(data);
    } catch (err: any) {
      const errorMessage = err.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({ title: "Report Generation Failed", description: errorMessage, variant: "destructive"});
    } finally {
      setLoading(false);
    }
  }, [selectedUserId, dateRange, toast]);

  const handleKpiCardClick = (title: string, data: any[] | null, dataType: string) => {
    if (!data || data.length === 0) {
      toast({ title: "No Data", description: `There are no items to show for "${title}".` });
      return;
    }
    setModalContent({ title, data, dataType });
    setDetailModalOpen(true);
  };
  
  const handleExportToPDF = async () => { /* PDF logic remains the same */ };
  const handleExportToExcel = async (exportRange: DateRange | undefined) => { /* Excel logic remains the same */ };

  if (authLoading || initialLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  const canGenerateReport = selectedUserId && dateRange?.from && dateRange?.to;

  return (
    <>
      <div className="space-y-6 pb-6 px-2 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
            <div>
                <h1 className="text-xl md:text-3xl font-bold tracking-tight">User Performance Report</h1>
                <p className="text-xs md:text-base text-muted-foreground">Analyze user performance for a selected time period.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button onClick={handleExportToPDF} disabled={!reportData || isPdfExporting || loading} variant="outline"><Download className="mr-2 h-4 w-4" /> Export to PDF</Button>
                {currentUser?.role === 'admin' && <Button onClick={() => setIsExportModalOpen(true)} disabled={isExcelExporting}><FileSpreadsheet className="mr-2 h-4 w-4" /> Export Summary (Excel)</Button>}
            </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Select a user and a date range to generate the report.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReportFilters 
                users={users}
                selectedUserId={selectedUserId}
                onUserChange={setSelectedUserId}
                dateRange={dateRange}
                onDateChange={setDateRange}
                isUserSelectionDisabled={!currentUser || currentUser.role !== 'admin'}
            />
            <Button onClick={generateReport} disabled={loading || !canGenerateReport}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlayCircle className="mr-2 h-4 w-4" />}
                Generate Report
            </Button>
          </CardContent>
        </Card>
        
        {loading && <div className="text-center p-16 flex flex-col items-center justify-center"><Loader2 className="h-8 w-8 animate-spin mb-4" /><p>Generating Report...</p></div>}
        {error && <div className="text-center p-16 text-destructive bg-destructive/10 rounded-lg">{error}</div>}

        {!reportData && !loading && !error && (
            <Alert>
                <AlertDescription>Please select your filters and click "Generate Report" to view performance data.</AlertDescription>
            </Alert>
        )}

        {reportData && !loading && (
          <div className="space-y-6">
            <KpiCardGrid reportData={reportData} onCardClick={handleKpiCardClick} />
            <ReportCharts reportData={reportData} />
            <Card>
              <CardHeader>
                  <CardTitle>Deals Won Details</CardTitle>
                  <CardDescription>A list of all leads converted to clients in this period.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Table>
                      <TableHeader><TableRow><TableHead>Client Name</TableHead><TableHead>Source</TableHead><TableHead>Converted Date</TableHead><TableHead className="text-right">Time to Close (Days)</TableHead></TableRow></TableHeader>
                      <TableBody>
                          {reportData.tables.deals_won.length > 0 ? (
                              reportData.tables.deals_won.map((deal) => (
                                  <TableRow key={deal.client_id}>
                                      <TableCell className="font-medium">{deal.company_name}</TableCell>
                                      <TableCell>{deal.source}</TableCell>
                                      <TableCell>{format(new Date(deal.converted_date), "LLL dd, y")}</TableCell>
                                      <TableCell className="text-right">{deal.time_to_close}</TableCell>
                                  </TableRow>
                              ))
                          ) : (
                              <TableRow><TableCell colSpan={4} className="h-24 text-center">No deals were won in this period.</TableCell></TableRow>
                          )}
                      </TableBody>
                  </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <ReportDetailModal 
        isOpen={isDetailModalOpen} 
        onClose={() => setDetailModalOpen(false)} 
        title={modalContent.title}
        data={modalContent.data}
        dataType={modalContent.dataType}
      />
      
      <Dialog open={isExportModalOpen} onOpenChange={setIsExportModalOpen}>{/* Export Modal remains the same */}</Dialog>
    </>
  );
}