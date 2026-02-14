import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppPasswordPanel from '../components/settings/AppPasswordPanel';
import { User } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useQueries';

export default function SettingsPage() {
  const { data: profile } = useGetCallerUserProfile();

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and security</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium">Name</span>
              <span className="text-sm text-muted-foreground">{profile?.name || 'Not set'}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Password Section */}
      <AppPasswordPanel />

      {/* About Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Thunderlab</CardTitle>
          <CardDescription>Professional music production, anywhere</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Thunderlab brings studio-grade recording and production tools to emerging and independent artists. 
            Record multi-track vocals, import beats, apply essential effects, and share your music—all from your device.
          </p>
          <div className="pt-4 border-t">
            <p className="text-sm font-medium">Founder: Gerald Lionel LeGrange</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
