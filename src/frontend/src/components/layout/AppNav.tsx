import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Music, Settings, FolderOpen, Drum } from 'lucide-react';

export default function AppNav() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Music className="w-6 h-6" />
            <span className="font-bold text-xl">Thunderlab</span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={() => navigate({ to: '/projects' })} className="flex items-center gap-2">
            <Music className="w-6 h-6" />
            <span className="font-bold text-xl">Thunderlab</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={currentPath === '/projects' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/projects' })}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </Button>
            <Button
              variant={currentPath === '/beat-maker' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/beat-maker' })}
            >
              <Drum className="w-4 h-4 mr-2" />
              Beat Maker
            </Button>
            <Button
              variant={currentPath === '/settings' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => navigate({ to: '/settings' })}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
