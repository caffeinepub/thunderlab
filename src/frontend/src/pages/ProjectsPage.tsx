import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Music, Plus, FolderOpen, Loader2 } from 'lucide-react';
import { useListProjects, useCreateProject } from '../hooks/useProjects';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';

export default function ProjectsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const { data: projects = [], isLoading } = useListProjects();
  const createProject = useCreateProject();
  const navigate = useNavigate();

  const handleCreateProject = async () => {
    const name = projectName.trim() || 'Untitled Project';
    
    try {
      await createProject.mutateAsync(name);
      toast.success('Project created successfully!');
      setIsCreateDialogOpen(false);
      setProjectName('');
    } catch (error: any) {
      console.error('Failed to create project:', error);
      const errorMessage = error?.message || 'Failed to create project';
      toast.error(errorMessage, {
        action: {
          label: 'Retry',
          onClick: () => handleCreateProject(),
        },
      });
    }
  };

  const openCreateDialog = () => {
    setProjectName('');
    setIsCreateDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground mt-1">Create and manage your music projects</p>
        </div>
        <Button size="lg" onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <>
          {/* Empty State */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 rounded-full bg-accent/10 mb-4">
                <FolderOpen className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Start creating your first music project. Record vocals, import beats, and bring your sound to life.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>

          {/* Getting Started */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Record</CardTitle>
                <CardDescription>Capture your vocals with multi-track recording</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Produce</CardTitle>
                <CardDescription>Apply effects and mix your tracks</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Share</CardTitle>
                <CardDescription>Export and share your finished music</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <Card
              key={project.id.toString()}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate({ to: `/projects/${project.id.toString()}` })}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Music className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <CardTitle className="mt-4">{project.name}</CardTitle>
                <CardDescription>Click to open project</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Give your project a name. You can always change it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                placeholder="Untitled Project"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !createProject.isPending) {
                    handleCreateProject();
                  }
                }}
                disabled={createProject.isPending}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={createProject.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateProject} disabled={createProject.isPending}>
              {createProject.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
