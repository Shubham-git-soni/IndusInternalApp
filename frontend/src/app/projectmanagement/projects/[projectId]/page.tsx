
'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { User, Calendar, Flag, CheckSquare, BarChart2, Plus, Edit, Trash2, Eye, MoreVertical, GripVertical, Flame, CheckCircle2, Circle, Bug, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import FilterExportBar from '@/components/FilterExportBar';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
// DashboardLayout is already applied in projectmanagement/layout.tsx

const projects = [
    {
      id: 'PROJ-001',
      name: 'Indus Nova - HRMS & CRM Platform',
      status: 'In Progress',
      lead: 'Alia Bhatt',
      startDate: '2023-01-15',
      endDate: '2023-09-30',
      progress: 75,
      description: 'A comprehensive platform for managing human resources and customer relationships. The project is currently in the development phase, with the backend API completed and frontend development in progress.',
      team: [
        { name: 'Ranbir Kapoor', role: 'Backend Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { name: 'Deepika Padukone', role: 'Frontend Lead', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
        { name: 'Shah Rukh Khan', role: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
        { name: 'Priyanka Chopra', role: 'QA Engineer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
      ],
      sprints: [
        { name: 'Sprint 1 - Backend API', status: 'Completed' },
        { name: 'Sprint 2 - Frontend Boilerplate', status: 'Completed' },
        { name: 'Sprint 3 - HRMS Module', status: 'In Progress' },
        { name: 'Sprint 4 - CRM Module', status: 'Upcoming' },
      ]
    },
];

const statusVariant: { [key: string]: 'default' | 'secondary' | 'outline' } = {
    'Completed': 'default',
    'In Progress': 'secondary',
    'Upcoming': 'outline',
};

// Mock tasks data for Gantt chart (in real app, fetch by projectId)
const projectTasks = [
  {
    id: 'T1',
    name: 'Design Database',
    startDate: '2023-01-15',
    endDate: '2023-02-15',
    progress: 100,
  },
  {
    id: 'T2',
    name: 'Develop API',
    startDate: '2023-02-16',
    endDate: '2023-04-10',
    progress: 100,
  },
  {
    id: 'T3',
    name: 'Design UI',
    startDate: '2023-02-01',
    endDate: '2023-03-15',
    progress: 100,
  },
  {
    id: 'T4',
    name: 'Develop Frontend',
    startDate: '2023-03-16',
    endDate: '2023-06-30',
    progress: 85,
  },
  {
    id: 'T5',
    name: 'Integration Testing',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    progress: 60,
  },
];

const getDaysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
};

const getOffsetDays = (projectStartDate: string, taskStartDate: string) => {
  const projStart = new Date(projectStartDate);
  const taskStart = new Date(taskStartDate);
  return (taskStart.getTime() - projStart.getTime()) / (1000 * 60 * 60 * 24);
};

// Mock data for Tasks tab
const mockTasks = [
  {
    id: 'TASK-8782',
    title: 'Fix button alignment on the login page',
    status: 'In Progress',
    priority: 'High',
    assignee: { name: 'Alia Bhatt', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    dueDate: '2024-12-15',
  },
  {
    id: 'TASK-5463',
    title: 'Implement new dashboard chart',
    status: 'To Do',
    priority: 'Medium',
    assignee: { name: 'Ranbir Kapoor', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    dueDate: '2024-12-20',
  },
  {
    id: 'TASK-2344',
    title: 'Update API documentation',
    status: 'Done',
    priority: 'Low',
    assignee: { name: 'Deepika Padukone', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    dueDate: '2024-11-30',
  },
];

// Mock data for Teams tab
const teamMembers = [
  { id: 'U1', name: 'Alia Bhatt', role: 'Frontend Developer', currentTasks: 3, capacity: 5, avatar: '/avatars/01.png' },
  { id: 'U2', name: 'Ranbir Kapoor', role: 'Backend Developer', currentTasks: 6, capacity: 5, avatar: '/avatars/02.png' },
  { id: 'U3', name: 'Deepika Padukone', role: 'UI/UX Designer', currentTasks: 2, capacity: 4, avatar: '/avatars/03.png' },
  { id: 'U4', name: 'Shah Rukh Khan', role: 'QA Engineer', currentTasks: 4, capacity: 4, avatar: '/avatars/04.png' },
];

// Mock data for Backlogs tab
const backlogItems = [
  {
    id: 'EPIC-001',
    type: 'Epic',
    title: 'User Authentication & Authorization',
    priority: 'High',
    icon: Flame,
    children: [
      { id: 'STORY-001', type: 'Story', title: 'As a user, I want to be able to sign up with my email and password', priority: 'High', storyPoints: 8, icon: CheckCircle2 },
      { id: 'STORY-002', type: 'Story', title: 'As a user, I want to be able to log in with my credentials', priority: 'High', storyPoints: 5, icon: CheckCircle2 },
      { id: 'BUG-001', type: 'Bug', title: 'Password reset link is not working', priority: 'Critical', storyPoints: 3, icon: Bug },
    ],
  },
];

// Mock data for Roadmap tab
const roadmapQuarters = [
  {
    id: 'Q1-2024',
    quarter: 'Q1 2024',
    projects: [
      { id: 'P1', name: 'Phase 1 - Backend API', status: 'Completed', startDate: '2024-01-01', endDate: '2024-03-31', color: 'bg-primary' },
      { id: 'P2', name: 'Phase 2 - Frontend Development', status: 'In Progress', startDate: '2024-02-01', endDate: '2024-04-30', color: 'bg-secondary' },
    ],
  },
  {
    id: 'Q2-2024',
    quarter: 'Q2 2024',
    projects: [
      { id: 'P3', name: 'Phase 3 - Integration & Testing', status: 'Upcoming', startDate: '2024-04-01', endDate: '2024-06-30', color: 'bg-accent' },
    ],
  },
];

type Status = 'In Progress' | 'To Do' | 'Done' | 'Backlog';
type Priority = 'High' | 'Medium' | 'Low' | 'Critical';
type IssueType = 'Epic' | 'Story' | 'Task' | 'Bug';

const statusVariants: Record<Status, 'default' | 'secondary' | 'outline'> = {
  'In Progress': 'default',
  'To Do': 'secondary',
  'Done': 'outline',
  'Backlog': 'secondary',
};

const priorityVariants: Record<Priority, 'destructive' | 'secondary' | 'outline'> = {
  'Critical': 'destructive',
  'High': 'destructive',
  'Medium': 'secondary',
  'Low': 'outline',
};

const typeVariant: { [key in IssueType]: 'default' | 'secondary' | 'destructive' | 'outline'} = {
  Epic: 'default',
  Story: 'secondary',
  Task: 'outline',
  Bug: 'destructive',
};

const roadmapStatusVariant: { [key: string]: 'secondary' | 'outline' | 'default' } = {
  'In Progress': 'secondary',
  'Planning': 'outline',
  'Upcoming': 'default',
  'Completed': 'outline',
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const { projectId } = params;

  // State for view modes
  const [tasksViewMode, setTasksViewMode] = useState<ViewMode>('table');
  const [teamsViewMode, setTeamsViewMode] = useState<ViewMode>('card');

  // State for filters
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');

  const project = projects.find(p => p.id === projectId as string);

  // Filter configurations
  const taskFilters = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'To Do', label: 'To Do' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Done', label: 'Done' },
      ],
      value: taskStatusFilter,
      onChange: setTaskStatusFilter,
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'all', label: 'All Priorities' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
      value: taskPriorityFilter,
      onChange: setTaskPriorityFilter,
    },
  ];

  if (!project) {
    return (
        
            <div className="py-3 lg:py-4 space-y-3 lg:space-y-4 flex items-center justify-center">
                <p>Project not found.</p>
            </div>
        
    );
  }

  return (
    
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
            title={project.name}
            description={`ID: ${project.id}`}
            actions={[
                {
                    label: 'Add',
                    onClick: () => console.log('Add item'),
                    icon: Plus,
                },
                {
                    label: 'Edit',
                    onClick: () => console.log('Edit project'),
                    icon: Edit,
                },
                {
                    label: 'Delete',
                    onClick: () => console.log('Delete project'),
                    icon: Trash2,
                    variant: 'destructive'
                }
            ]}
        />

        <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5 sm:w-auto gap-1">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="teams">Teams</TabsTrigger>
                <TabsTrigger value="backlogs">Backlogs</TabsTrigger>
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Gantt Chart */}
                        <Card>
                            <CardHeader><CardTitle>Project Timeline</CardTitle></CardHeader>
                            <CardContent className="p-4 overflow-x-auto">
                                <div className="min-w-[800px]">
                                    {(() => {
                                        const totalProjectDays = getDaysBetween(project.startDate, project.endDate);
                                        return (
                                            <>
                                                {/* Header for Dates */}
                                                <div className="grid grid-cols-[200px_1fr] gap-x-2 pb-2 border-b">
                                                    <div className="font-semibold text-sm text-muted-foreground">Task Name</div>
                                                    <div className="grid" style={{ gridTemplateColumns: `repeat(${Math.min(totalProjectDays, 60)}, minmax(0, 1fr))` }}>
                                                        {Array.from({ length: Math.min(totalProjectDays, 60) }).map((_, i) => {
                                                            const date = new Date(project.startDate);
                                                            date.setDate(date.getDate() + (i * Math.ceil(totalProjectDays / 60)));
                                                            return (
                                                                <div key={i} className="text-center text-xs text-muted-foreground border-l first:border-l-0">
                                                                    <span className={date.getDate() === 1 ? 'font-bold' : ''}>{date.getDate()}</span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Task Rows */}
                                                <div className="grid grid-cols-[200px_1fr] gap-x-2 gap-y-3 pt-3">
                                                    {projectTasks.map(task => {
                                                        const taskDays = getDaysBetween(task.startDate, task.endDate);
                                                        const offsetDays = getOffsetDays(project.startDate, task.startDate);

                                                        return (
                                                            <div key={task.id} className="contents">
                                                                <div className="font-medium text-sm truncate pr-2">{task.name}</div>
                                                                <div className="relative h-8 flex items-center">
                                                                    <div
                                                                        className="absolute h-full"
                                                                        style={{
                                                                            left: `${(offsetDays / totalProjectDays) * 100}%`,
                                                                            width: `${(taskDays / totalProjectDays) * 100}%`
                                                                        }}
                                                                    >
                                                                        <div className="relative w-full h-full bg-primary/20 rounded-md border border-primary/50 flex items-center overflow-hidden">
                                                                            <div
                                                                                className="absolute left-0 top-0 h-full bg-primary/60 rounded-md transition-all"
                                                                                style={{ width: `${task.progress}%` }}
                                                                            />
                                                                            <span className="absolute w-full text-center text-xs font-semibold text-foreground px-2 truncate z-10">
                                                                                {task.progress}%
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader><CardTitle>Description</CardTitle></CardHeader>
                            <CardContent><p className="text-muted-foreground">{project.description}</p></CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader><CardTitle>Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start"><User className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Project Lead</p><p className="font-semibold">{project.lead}</p></div></div>
                                <div className="flex items-start"><Flag className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Status</p><p className="font-semibold">{project.status}</p></div></div>
                                <div className="flex items-start"><Calendar className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Start Date</p><p className="font-semibold">{project.startDate}</p></div></div>
                                <div className="flex items-start"><CheckSquare className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">End Date</p><p className="font-semibold">{project.endDate}</p></div></div>
                                <div className="flex items-start"><BarChart2 className="w-5 h-5 text-muted-foreground mr-3 mt-1" /><div className="flex-1"><p className="text-sm text-muted-foreground">Progress</p><Progress value={project.progress} className="mt-2" /></div></div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabsContent>

            {/* Tasks Tab */}
            <TabsContent value="tasks" className="space-y-4">
                {/* Toolbar - Filters, Export, View Toggle in one line */}
                <div className="flex items-center gap-3">
                    <FilterExportBar filters={taskFilters} />
                    <ViewToggle
                        view={tasksViewMode}
                        onViewChange={setTasksViewMode}
                        modes={['table', 'card']}
                    />
                </div>

                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-28">Task ID</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Priority</TableHead>
                                        <TableHead className="hidden md:table-cell">Assignee</TableHead>
                                        <TableHead className="hidden lg:table-cell">Due Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockTasks.map((task) => (
                                        <TableRow key={task.id}>
                                            <TableCell className="font-medium text-foreground">{task.id}</TableCell>
                                            <TableCell className="font-medium text-foreground">{task.title}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariants[task.status as Status]}>{task.status}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={priorityVariants[task.priority as Priority]}>{task.priority}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                                        <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium text-foreground">{task.assignee.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{task.dueDate}</TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit Task
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Teams Tab */}
            <TabsContent value="teams" className="space-y-4">
                {/* Toolbar - Export and View Toggle in one line */}
                <div className="flex items-center gap-3">
                    <FilterExportBar filters={[]} />
                    <ViewToggle
                        view={teamsViewMode}
                        onViewChange={setTeamsViewMode}
                        modes={['card']}
                    />
                </div>

                <Card>
                    <CardHeader><CardTitle>Team Member Overview</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {teamMembers.map(member => {
                            const workloadPercentage = (member.currentTasks / member.capacity) * 100;
                            const isOverloaded = member.currentTasks > member.capacity;
                            return (
                                <div key={member.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                    <Avatar className="h-12 w-12 shrink-0">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <p className="font-semibold text-foreground">{member.name}</p>
                                            <p className="text-sm text-muted-foreground">{member.role}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Current Tasks</p>
                                            <p className={`font-semibold ${isOverloaded ? 'text-destructive' : 'text-foreground'}`}>
                                                {member.currentTasks} / {member.capacity}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-2">Workload</p>
                                            <Progress value={Math.min(workloadPercentage, 100)} className="h-2.5" />
                                            {isOverloaded && (
                                                <p className="text-xs text-destructive flex items-center mt-1">
                                                    <AlertTriangle className="w-3 h-3 mr-1" /> Overloaded
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0">
                                        <BarChart2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Backlogs Tab */}
            <TabsContent value="backlogs" className="space-y-4">
                {/* Toolbar - Export only */}
                <FilterExportBar filters={[]} />

                <Card>
                    <CardContent className="p-2 md:p-4">
                        <Accordion type="multiple" defaultValue={['EPIC-001']} className="w-full">
                            {backlogItems.map(item => {
                                const TypedIcon = item.icon;
                                return (
                                    <AccordionItem value={item.id} key={item.id}>
                                        <AccordionTrigger className="hover:bg-muted/50 px-4 rounded-lg">
                                            <div className="flex items-center flex-1">
                                                <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                                                <TypedIcon className="w-5 h-5 text-primary mr-4 flex-shrink-0" />
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between text-left">
                                                    <span className="font-semibold text-base sm:mr-4">{item.title}</span>
                                                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                                        <Badge variant={typeVariant[item.type as IssueType]} className="w-16 justify-center">{item.type}</Badge>
                                                        <Badge variant={priorityVariants[item.priority as Priority]} className="w-20 justify-center">{item.priority}</Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 pl-8 pr-2 space-y-2">
                                            {item.children?.map(child => {
                                                const ChildIcon = child.icon || Circle;
                                                return (
                                                    <div key={child.id} className="flex items-center p-3 bg-background rounded-lg mb-2 border">
                                                        <GripVertical className="w-5 h-5 text-muted-foreground mr-2 flex-shrink-0" />
                                                        <ChildIcon className="w-4 h-4 text-muted-foreground mr-3 flex-shrink-0" />
                                                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                                            <span className="font-medium text-sm mb-2 sm:mb-0 sm:mr-4">{child.title}</span>
                                                            <div className="flex items-center space-x-4">
                                                                <Badge variant={typeVariant[child.type as IssueType]} className="w-16 justify-center">{child.type}</Badge>
                                                                <Badge variant={priorityVariants[child.priority as Priority]} className="w-20 justify-center">{child.priority}</Badge>
                                                                {child.storyPoints && <span className="ml-4 text-sm font-bold text-foreground w-12 text-right">{child.storyPoints} SP</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Roadmap Tab */}
            <TabsContent value="roadmap" className="space-y-4">
                {/* Toolbar - Export only */}
                <FilterExportBar filters={[]} />

                <Card>
                    <CardHeader><CardTitle>Project Roadmap</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        {roadmapQuarters.map(quarter => (
                            <div key={quarter.id}>
                                <h3 className="text-lg font-semibold text-foreground mb-4">{quarter.quarter}</h3>
                                <div className="space-y-3">
                                    {quarter.projects.map(roadmapProject => (
                                        <div key={roadmapProject.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center flex-1">
                                                <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full mr-3 sm:mr-4 ${roadmapProject.color} shrink-0`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-foreground truncate">{roadmapProject.name}</p>
                                                    <p className="text-xs sm:text-sm text-muted-foreground">{roadmapProject.startDate} - {roadmapProject.endDate}</p>
                                                </div>
                                            </div>
                                            <Badge variant={roadmapStatusVariant[roadmapProject.status]} className="w-fit sm:ml-4">
                                                {roadmapProject.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
      </div>
    
  );
}
