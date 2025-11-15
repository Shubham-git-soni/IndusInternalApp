"use client"

import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Timer } from "lucide-react" // Import Timer
import { formatDateTime } from "@/lib/date-format"
import { Badge } from "@/components/ui/badge"

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: any[] | null;
  dataType: string;
}

function DetailItem({ item, dataType }: { item: any, dataType: string }) {
    switch (dataType) {
        case 'NewLead':
            return (
                <div>
                    <p className="font-medium">{item.company_name} <Badge variant="outline">{item.status}</Badge></p>
                    <p className="text-xs text-muted-foreground">Contact: {item.contact_name || 'N/A'} ({item.contact_phone || 'N/A'})</p>
                    <p className="text-xs text-muted-foreground">Assigned on: {formatDateTime(item.created_at)}</p>
                </div>
            );
        case 'Meeting':
            return (
                <div>
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{item.company_name}</p>
                        {item.duration_minutes > 0 && <Badge variant="secondary" className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration_minutes} min</Badge>}
                    </div>
                    <p className="text-xs mt-1">{item.remark || "No remarks."}</p>
                    <p className="text-xs text-muted-foreground">On: {formatDateTime(item.event_time)}</p>
                </div>
            );
        case 'Demo':
            return (
                 <div>
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{item.company_name}</p>
                        {item.duration_minutes > 0 && <Badge variant="secondary" className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration_minutes} min</Badge>}
                    </div>
                    <p className="text-xs mt-1">{item.remark || "No remarks."}</p>
                    <p className="text-xs text-muted-foreground">On: {formatDateTime(item.start_time)}</p>
                </div>
            );
        case 'Activity':
            return (
                <div>
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{item.company_name || "N/A"} <Badge variant="outline">{item.activity_type}</Badge></p>
                        {item.duration_minutes > 0 && <Badge variant="secondary" className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration_minutes} min</Badge>}
                    </div>
                    <p className="text-xs mt-1">{item.details}</p>
                    <p className="text-xs text-muted-foreground">On: {formatDateTime(item.created_at)}</p>
                </div>
            );
        case 'Task':
            return (
                 <div>
                    <div className="flex justify-between items-start">
                        <p className="font-medium">{item.title} <Badge variant="outline">{item.company_names || 'General'}</Badge></p>
                         {item.duration_minutes > 0 && <Badge variant="secondary" className="flex items-center gap-1"><Timer className="h-3 w-3" />{item.duration_minutes} min</Badge>}
                    </div>
                    <p className="text-xs mt-1">{item.details || "No details provided."}</p>
                    <p className="text-xs text-muted-foreground">Completed: {formatDateTime(item.completed_at)}</p>
                </div>
            );
        case 'DealWon':
            return <p>{item.company_name} (Source: {item.source})</p>;
        default:
            return <p>{item.company_name || item.title || 'Unknown record'}</p>;
    }
}


export function ReportDetailModal({ isOpen, onClose, title, data, dataType }: ReportDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!searchTerm) return data;
    const lowercasedFilter = searchTerm.toLowerCase();
    return data.filter(item => 
      Object.values(item).some(val => 
        String(val).toLowerCase().includes(lowercasedFilter)
      )
    );
  }, [data, searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Showing {filteredData.length} of {data?.length || 0} records for the selected period.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Filter results..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="max-h-[60vh] overflow-y-auto pr-2">
            {filteredData.length > 0 ? (
              <ul className="space-y-2">
                {filteredData.map((item, index) => (
                  <li key={item.id || item.client_id || index} className="text-sm p-3 bg-muted/50 rounded-md">
                    <DetailItem item={item} dataType={dataType} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground py-8">No matching records found.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}