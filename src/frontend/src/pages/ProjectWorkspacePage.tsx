import { useParams, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Music, Mic, AudioWaveform, Download } from 'lucide-react';
import { useListProjects } from '../hooks/useProjects';

export default function ProjectWorkspacePage() {
  const { projectId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: projects = [], isLoading } = useListProjects();

  const project = projects.find((p) => p.id.toString() === projectId);

  if (isLoading) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading project...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container max-w-6xl py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate({ to: '/projects' })}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/projects' })}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-1">Project workspace</p>
        </div>
      </div>

      {/* Project Workspace - Coming Soon */}
      <Card>
        <CardContent className="py-16 text-center">
          <div className="p-4 rounded-full bg-primary/10 inline-flex mb-4">
            <Music className="w-12 h-12 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Project Workspace</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            The full project workspace with recording, editing, and mixing features is coming soon.
          </p>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <Mic className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Record</CardTitle>
                <CardDescription>Multi-track vocal recording</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <AudioWaveform className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Edit</CardTitle>
                <CardDescription>Trim, arrange, and mix tracks</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Download className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Export</CardTitle>
                <CardDescription>Export high-quality audio</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
