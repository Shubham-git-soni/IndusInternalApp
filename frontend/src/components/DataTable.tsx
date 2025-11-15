import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (value: any, row: any) => ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  className?: string;
  emptyMessage?: string;
}

const DataTable = ({ columns, data, className = "", emptyMessage = "No data found" }: DataTableProps) => {
  return (
    <div className={`rounded-md border border-border bg-card ${className}`}>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted hover:bg-muted">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                className={`text-xs font-medium uppercase text-muted-foreground ${column.className || ""}`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-8 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/50 border-border">
                {columns.map((column) => (
                  <TableCell key={column.key} className={`text-sm text-foreground ${column.className || ""}`}>
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataTable;