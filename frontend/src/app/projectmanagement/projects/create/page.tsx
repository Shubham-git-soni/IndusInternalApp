
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function CreateProjectPage() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [projectLead, setProjectLead] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setProjectName(name);
    // Auto-generate key from project name
    const key = name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 4);
    setProjectKey(key);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ projectName, projectKey, projectLead, startDate, endDate, description });
    router.push('/projectmanagement/projects');
  };

  return (
    <DashboardLayout>
      <div className="py-3 lg:py-4 space-y-3 lg:space-y-4">
        <PageHeader
          title="Create New Project"
          description="Add a new project to your workspace"
        />

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Project Name */}
                <div className="md:col-span-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    type="text"
                    id="projectName"
                    value={projectName}
                    onChange={handleProjectNameChange}
                    required
                    placeholder="Enter project name"
                  />
                </div>

                {/* Project Key */}
                <div>
                  <Label htmlFor="projectKey">Project Key</Label>
                  <Input
                    type="text"
                    id="projectKey"
                    value={projectKey}
                    onChange={(e) => setProjectKey(e.target.value.toUpperCase())}
                    maxLength={4}
                    required
                    placeholder="Auto-generated"
                    className="bg-muted"
                  />
                </div>

                {/* Project Lead */}
                <div>
                  <Label htmlFor="projectLead">Project Lead</Label>
                  <Select value={projectLead} onValueChange={setProjectLead}>
                    <SelectTrigger id="projectLead">
                      <SelectValue placeholder="Select a lead" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alia-bhatt">Alia Bhatt</SelectItem>
                      <SelectItem value="ranbir-kapoor">Ranbir Kapoor</SelectItem>
                      <SelectItem value="deepika-padukone">Deepika Padukone</SelectItem>
                      <SelectItem value="shah-rukh-khan">Shah Rukh Khan</SelectItem>
                      <SelectItem value="priyanka-chopra">Priyanka Chopra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Start Date */}
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    placeholder="Enter project description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Project</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
