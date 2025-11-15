
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Edit, Plus, Trash2 } from 'lucide-react';

import PageHeader from '@/components/PageHeader';
import SearchBar from '@/components/SearchBar';
import FilterExportBar from '@/components/FilterExportBar';
import ViewToggle, { ViewMode } from '@/components/ViewToggle';
import ColumnToggle, { ColumnConfig } from '@/components/ColumnToggle';
import BulkActions, { BulkAction } from '@/components/BulkActions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';
// import { apiClient } from '@/services/api'; // Uncomment for backend integration

// --- MOCK DATA ---
const mockProjects = [
  {
    id: 'PROJ-001',
    name: 'Indus Nova - HRMS & CRM Platform',
    status: 'In Progress',
    lead: 'Alia Bhatt',
    startDate: '2023-01-15',
    endDate: '2023-09-30',
    progress: 75,
  },
  {
    id: 'PROJ-002',
    name: 'Project Phoenix - Mobile App',
    status: 'On Hold',
    lead: 'Ranbir Kapoor',
    startDate: '2023-03-01',
    endDate: '2023-12-31',
    progress: 40,
  },
  {
    id: 'PROJ-003',
    name: 'Quantum Leap - AI Integration',
    status: 'Completed',
    lead: 'Deepika Padukone',
    startDate: '2022-09-01',
    endDate: '2023-06-30',
    progress: 100,
  },
  {
    id: 'PROJ-004',
    name: 'E-commerce Platform Upgrade',
    status: 'In Progress',
    lead: 'Shah Rukh Khan',
    startDate: '2023-05-20',
    endDate: '2024-01-15',
    progress: 60,
  },
  {
    id: 'PROJ-005',
    name: 'Data Analytics Dashboard',
    status: 'Planning',
    lead: 'Priyanka Chopra',
    startDate: '2023-08-01',
    endDate: '2024-02-28',
    progress: 10,
  },
];

const statusVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  'In Progress': 'default',
  'On Hold': 'secondary',
  Completed: 'outline',
  Planning: 'secondary',
};

// --- END MOCK DATA ---

export default function ProjectsListPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    // const fetchedProjects = await apiClient.getProjects({ status: statusFilter, search: searchTerm });
    const filtered = mockProjects
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(p => statusFilter === 'all' || p.status === statusFilter);
    setProjects(filtered);
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter]);

  const filterConfig = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'all', label: 'All Statuses' },
        { value: 'Planning', label: 'Planning' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'On Hold', label: 'On Hold' },
        { value: 'Completed', label: 'Completed' },
      ],
      value: statusFilter,
      onChange: setStatusFilter,
    },
  ];

  return (
    <div className="pt-20 sm:pt-20 lg:pt-20 pb-20 lg:pb-6 px-4 lg:px-6 space-y-4 lg:space-y-6">
      <PageHeader
        title="Projects"
        description="Manage and track all company projects"
        primaryAction={{
          content: 'Create Project',
          href: '/projectmanagement/projects/create',
          icon: Plus,
        }}
      />

      <SearchBar
        placeholder="Search projects by name..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      <FilterExportBar filters={filterConfig} />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Project Lead</TableHead>
                <TableHead className="hidden lg:table-cell">Timeline</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="animate-pulse">
                    <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                    <TableCell className="hidden md:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>
                    <TableCell className="hidden lg:table-cell"><div className="h-4 bg-muted rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                    <TableCell><div className="h-4 bg-muted rounded"></div></TableCell>
                  </TableRow>
                ))
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium text-foreground">{project.name}</div>
                      <div className="text-sm text-muted-foreground">{project.id}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[project.status] || 'default'}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{project.lead}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {project.startDate} - {project.endDate}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={project.progress} className="h-2" />
                        <span className="text-sm font-medium text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link href={`/projectmanagement/projects/${project.id}`}>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/projectmanagement/projects/${project.id}/edit`}>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
