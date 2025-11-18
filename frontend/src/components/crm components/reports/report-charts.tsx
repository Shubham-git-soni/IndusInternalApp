//frontend/components/reports/report-charts.tsx
"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart" 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LabelList } from "recharts" 
import { ApiReportData } from "@/lib/api"

interface ReportChartsProps {
  reportData: ApiReportData;
}

export function ReportCharts({ reportData }: ReportChartsProps) {
  const totalLeadsInPeriod = useMemo(() => {
    if (!reportData.visualizations.lead_outcome) return 0;
    return reportData.visualizations.lead_outcome.reduce((sum, item) => sum + item.value, 0);
  }, [reportData]);

  const chartConfig = {
      "Deals Won": { label: "Deals Won", color: "hsl(142.1, 76.2%, 41.2%)" },
      "Leads Lost": { label: "Leads Lost", color: "hsl(0, 84.2%, 60.2%)" },
      "In Progress": { label: "In Progress", color: "hsl(221.2, 83.2%, 53.3%)" },
  };

  return (
    <div id="charts-section" className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Activity Volume</CardTitle>
          <CardDescription>Comparison of key activities performed in the period.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{}} className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportData.visualizations.activity_volume} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'hsl(var(--muted))' }} />
                  <Bar dataKey="value" fill="hsl(220, 85%, 55%)" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="value" position="top" style={{ fill: "hsl(var(--foreground))", fontSize: 12 }} />
                  </Bar>
              </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Lead Outcome</CardTitle>
          <CardDescription>Status of new leads assigned in the period.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center pb-6">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
              <PieChart>
                  <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie data={reportData.visualizations.lead_outcome} dataKey="value" nameKey="name" innerRadius={60} outerRadius={80} strokeWidth={2}>
                    {reportData.visualizations.lead_outcome.map((entry) => (<Cell key={`cell-${entry.name}`} fill={chartConfig[entry.name as keyof typeof chartConfig]?.color || "#cccccc"} />))}
                  </Pie>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">{totalLeadsInPeriod.toLocaleString()}</text>
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" dy="20" className="fill-muted-foreground text-sm">New Leads</text>
              </PieChart>
          </ChartContainer>
          <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-2 text-sm font-medium pt-4">
              {reportData.visualizations.lead_outcome.map((entry) => (
                  entry.value > 0 && (
                    <div key={entry.name} className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: chartConfig[entry.name as keyof typeof chartConfig].color }} />
                        {chartConfig[entry.name as keyof typeof chartConfig].label} ({entry.value})
                    </div>
                  )
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}