import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, Plus, FolderOpen } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="container max-w-6xl py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Projects</h1>
          <p className="text-muted-foreground mt-1">Create and manage your music projects</p>
        </div>
        <Button size="lg">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

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
          <Button>
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
    </div>
  );
}
