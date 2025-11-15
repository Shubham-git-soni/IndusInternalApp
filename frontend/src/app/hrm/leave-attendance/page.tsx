"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DashboardLayout from '@/components/DashboardLayout';
import KPICard from '@/components/KPICard';
import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import ToggleButtons from '@/components/ToggleButtons';
import Modal from '@/components/Modal';
import DataTable from '@/components/DataTable';
import { Calendar, Clock, Users, FileText, Filter, Download, Plus, Check, X } from "lucide-react";

type UserRole = "user" | "lead" | "admin";

export default function LeaveAttendancePage() {
  const [activeTab, setActiveTab] = useState("history");
  const [historyToggle, setHistoryToggle] = useState("my");
  const [approvalToggle, setApprovalToggle] = useState("my");
  const [filterType, setFilterType] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock user role - would come from auth context
  const [userRole] = useState<UserRole>("lead");

  // Simple dummy data
  const kpiData = {
    user: {
      leaveBalance: { casual: 8, sick: 10, earned: 15 },
      attendanceMonth: { present: 18, wfh: 2, absent: 1 },
      pendingRequests: 2
    },
    lead: {
      teamOnLeave: 3,
      pendingApprovals: 5,
      teamAttendance: { present: 45, absent: 3, wfh: 8 }
    }
  };

  // History data based on user role and toggle
  const myHistoryData = [
    { date: "2024-01-15", punchIn: "09:00", punchOut: "18:00", totalHours: "9h", status: "Present", employee: "Me" },
    { date: "2024-01-14", punchIn: "09:15", punchOut: "18:00", totalHours: "8h 45m", status: "Late", employee: "Me" },
    { date: "2024-01-13", punchIn: "-", punchOut: "-", totalHours: "-", status: "On Leave", employee: "Me" },
    { date: "2024-01-12", punchIn: "Home", punchOut: "Home", totalHours: "8h", status: "WFH", employee: "Me" },
  ];

  const teamHistoryData = [
    { date: "2024-01-15", punchIn: "09:00", punchOut: "18:00", totalHours: "9h", status: "Present", employee: "John Doe" },
    { date: "2024-01-15", punchIn: "09:30", punchOut: "18:30", totalHours: "9h", status: "Present", employee: "Jane Smith" },
    { date: "2024-01-15", punchIn: "Home", punchOut: "Home", totalHours: "8h", status: "WFH", employee: "Mike Johnson" },
    { date: "2024-01-14", punchIn: "09:45", punchOut: "18:00", totalHours: "8h 15m", status: "Late", employee: "Sarah Wilson" },
    { date: "2024-01-14", punchIn: "-", punchOut: "-", totalHours: "-", status: "On Leave", employee: "Robert Chen" },
  ];

  // Get current history data
  const getCurrentHistoryData = () => {
    if (userRole === "user") {
      return myHistoryData; // Regular users only see their own history
    }
    return historyToggle === "team" ? teamHistoryData : myHistoryData;
  };

  const historyData = getCurrentHistoryData();

  const myApprovalData = [
    { id: 1, type: "Leave", employee: "Me", startDate: "2024-01-20", endDate: "2024-01-22", reason: "Personal work", manager: "Mike Smith", status: "Pending" },
    { id: 2, type: "WFH", employee: "Me", startDate: "2024-01-18", endDate: "2024-01-18", reason: "Internet installation", manager: "Mike Smith", status: "Pending" },
  ];

  const teamApprovalData = [
    { id: 3, type: "Leave", employee: "John Doe", startDate: "2024-01-20", endDate: "2024-01-22", reason: "Personal work", manager: "Mike Smith", status: "Pending" },
    { id: 4, type: "WFH", employee: "Jane Smith", startDate: "2024-01-18", endDate: "2024-01-18", reason: "Internet installation", manager: "Mike Smith", status: "Pending" },
    { id: 5, type: "Leave", employee: "Robert Chen", startDate: "2024-01-25", endDate: "2024-01-26", reason: "Family function", manager: "Mike Smith", status: "Pending" },
  ];

  // Get current approval data based on toggle
  const getCurrentApprovalData = () => {
    return approvalToggle === "team" ? teamApprovalData : myApprovalData;
  };

  // Filter approvals by type
  const approvalData = getCurrentApprovalData().filter(approval => {
    if (filterType === 'all') return true;
    return approval.type.toLowerCase() === filterType.toLowerCase();
  });


  const openDialog = () => {
    setDialogType("");
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType("");
  };

  const renderForm = () => {
    switch (dialogType) {
      case "leave":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="leaveType">Leave Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select leave type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casual">Casual Leave</SelectItem>
                  <SelectItem value="sick">Sick Leave</SelectItem>
                  <SelectItem value="earned">Earned Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input type="date" id="endDate" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for leave"
                rows={3}
              />
            </div>
          </div>
        );
      case "wfh":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input type="date" id="startDate" />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input type="date" id="endDate" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for WFH"
                rows={3}
              />
            </div>
          </div>
        );
      case "onsite":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input type="date" id="date" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                placeholder="Enter location"
              />
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for on-site duty"
                rows={3}
              />
            </div>
          </div>
        );
      case "regularization":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="dateToCorrect">Date to Correct</Label>
              <Input type="date" id="dateToCorrect" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="punchIn">Punch In Time</Label>
                <Input type="time" id="punchIn" />
              </div>
              <div>
                <Label htmlFor="punchOut">Punch Out Time</Label>
                <Input type="time" id="punchOut" />
              </div>
            </div>
            <div>
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for regularization"
                rows={3}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="pt-16 pb-20 lg:pb-4 px-3 sm:px-4 space-y-4 sm:space-y-6">
        {/* Header */}
        <PageHeader
          title="Leave & Attendance"
          subtitle="Manage leave requests and attendance records"
          primaryAction={{
            label: "Apply",
            onClick: openDialog,
            icon: Plus
          }}
        />

        {/* KPIs Section - Horizontal Scroll on Mobile */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-3 scrollbar-hide">
          {userRole === "user" ? (
            <>
              <KPICard
                title="Leave Balance"
                value=""
                icon={Calendar}
                iconColor="bg-emerald-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Casual</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.casual}/12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Sick</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.sick}/12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Earned</span>
                    <span className="text-[9px] font-bold text-foreground">{kpiData.user.leaveBalance.earned}/20</span>
                  </div>
                </div>
              </KPICard>

              <KPICard
                title="This Month"
                value=""
                icon={Clock}
                iconColor="bg-primary"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Present</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{kpiData.user.attendanceMonth.present}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">WFH</span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{kpiData.user.attendanceMonth.wfh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Absent</span>
                    <span className="text-[9px] font-bold text-destructive">{kpiData.user.attendanceMonth.absent}</span>
                  </div>
                </div>
              </KPICard>

              <KPICard
                title="Pending Requests"
                value={kpiData.user.pendingRequests}
                subtitle="Awaiting approval"
                icon={FileText}
                iconColor="bg-amber-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto sm:col-span-2 lg:col-span-1"
              />
            </>
          ) : (
            <>
              <KPICard
                title="Team on Leave Today"
                value={kpiData.lead.teamOnLeave}
                subtitle="Team members"
                icon={Users}
                iconColor="bg-emerald-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              />

              <KPICard
                title="Pending Approvals"
                value={kpiData.lead.pendingApprovals}
                subtitle="Need attention"
                icon={Clock}
                iconColor="bg-primary"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              />

              <KPICard
                title="Team Summary"
                value=""
                icon={Users}
                iconColor="bg-violet-500"
                variant="minimal"
                className="w-[calc(33.333%-7px)] min-w-[105px] flex-shrink-0 sm:w-auto"
              >
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Present</span>
                    <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">{kpiData.lead.teamAttendance.present}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">WFH</span>
                    <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400">{kpiData.lead.teamAttendance.wfh}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground">Absent</span>
                    <span className="text-[9px] font-bold text-destructive">{kpiData.lead.teamAttendance.absent}</span>
                  </div>
                </div>
              </KPICard>
            </>
          )}
        </div>

        {/* Custom CSS to hide scrollbar */}
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>

        {/* Request Type Selection Modal */}
        <Modal
          isOpen={dialogOpen && !dialogType}
          onClose={closeDialog}
          title="Select Request Type"
        >
          <div className="space-y-2">
            <button
              onClick={() => setDialogType("leave")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Apply for Leave</div>
              <div className="text-xs text-muted-foreground">Request time off from work</div>
            </button>
            <button
              onClick={() => setDialogType("wfh")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request WFH</div>
              <div className="text-xs text-muted-foreground">Work from home request</div>
            </button>
            <button
              onClick={() => setDialogType("onsite")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request On-site Duty</div>
              <div className="text-xs text-muted-foreground">Work from client location</div>
            </button>
            <button
              onClick={() => setDialogType("regularization")}
              className="w-full text-left px-4 py-3 hover:bg-accent rounded-md transition-colors border border-border hover:border-border"
            >
              <div className="font-medium text-foreground">Request Attendance Regularization</div>
              <div className="text-xs text-muted-foreground">Correct punch in/out times</div>
            </button>
          </div>
        </Modal>

        {/* Action Bar & Main Content */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              {/* Tabs */}
              <div className="flex-1">
                <ToggleButtons
                  options={[
                    { value: "history", label: "History" },
                    { value: "approvals", label: "Approvals" }
                  ]}
                  value={activeTab}
                  onChange={(value) => {
                    if (userRole !== "user" || value === "history") {
                      setActiveTab(value);
                    }
                  }}
                />
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "history" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  {userRole !== "user" && (
                    <div className="flex items-center space-x-3">
                      <ToggleButtons
                        options={[
                          { value: "my", label: "My History" },
                          { value: "team", label: "Team History" }
                        ]}
                        value={historyToggle}
                        onChange={setHistoryToggle}
                      />
                      <div className="text-xs text-muted-foreground">
                        Showing {historyToggle === "team" ? "team member" : "personal"} records
                      </div>
                    </div>
                  )}
                  {userRole === "user" && (
                    <div className="text-sm text-foreground font-medium">
                      My Attendance History
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>

                <SearchBar
                  placeholder="Search records..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                />

                <DataTable
                  columns={[
                    ...(userRole !== "user" && historyToggle === "team" ? [{
                      key: "employee",
                      label: "Employee",
                      className: "font-medium"
                    }] : []),
                    { key: "date", label: "Date" },
                    { key: "punchIn", label: "Punch In" },
                    { key: "punchOut", label: "Punch Out" },
                    { key: "totalHours", label: "Total Hours" },
                    {
                      key: "status",
                      label: "Status",
                      render: (value: string) => (
                        <Badge variant={value === 'Present' ? 'default' : value === 'Absent' ? 'destructive' : 'secondary'}>
                          {value}
                        </Badge>
                      )
                    }
                  ]}
                  data={historyData}
                  emptyMessage="No attendance records found"
                />
              </div>
            )}

            {activeTab === "approvals" && userRole !== "user" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-foreground">My Approvals</span>
                    <Switch
                      checked={approvalToggle === "team"}
                      onCheckedChange={(checked) => setApprovalToggle(checked ? "team" : "my")}
                    />
                    <span className="text-sm text-foreground">Team Approvals</span>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="px-3 py-2 bg-background text-foreground border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Types</option>
                      <option value="leave">Leave</option>
                      <option value="wfh">WFH</option>
                      <option value="onsite">On-site</option>
                      <option value="regularization">Regularization</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {approvalData.map((request) => (
                    <Card key={request.id} className="border border-border">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{request.employee}</h4>
                            <p className="text-sm text-muted-foreground">{request.type}</p>
                          </div>
                          <Badge variant="outline">{request.type}</Badge>
                        </div>
                        <div className="text-sm text-foreground space-y-1 mb-4">
                          <div><strong>Period:</strong> {request.startDate} to {request.endDate}</div>
                          <div><strong>Reason:</strong> {request.reason}</div>
                          <div><strong>Manager:</strong> {request.manager}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white flex-1">
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-950">
                            <X className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-card rounded-xl shadow-sm border border-border">
          <div className="p-4 sm:p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 max-h-48 overflow-y-auto">
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Users className="w-4 h-4 text-blue-500" />
                <span>John Doe applied for casual leave</span>
                <span className="text-muted-foreground text-xs">2 hours ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <FileText className="w-4 h-4 text-emerald-500" />
                <span>Jane Smith&apos;s WFH request was approved</span>
                <span className="text-muted-foreground text-xs">4 hours ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>Mike Johnson punched in late</span>
                <span className="text-muted-foreground text-xs">1 day ago</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-foreground">
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>Sarah Wilson requested attendance regularization</span>
                <span className="text-muted-foreground text-xs">2 days ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Dialog */}
        <Modal
          isOpen={dialogOpen && !!dialogType}
          onClose={closeDialog}
          title={
            dialogType === "leave" ? "Apply for Leave" :
            dialogType === "wfh" ? "Request Work From Home" :
            dialogType === "onsite" ? "Request On-site Duty" :
            dialogType === "regularization" ? "Request Attendance Regularization" : ""
          }
          showBackButton
          onBack={() => setDialogType("")}
          actions={
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={closeDialog}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={closeDialog}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white border-0"
              >
                Submit
              </Button>
            </div>
          }
        >
          {renderForm()}
        </Modal>
      </div>
    </DashboardLayout>
  );
}