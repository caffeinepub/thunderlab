import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginPage from './pages/LoginPage';
import UnlockPage from './pages/UnlockPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectWorkspacePage from './pages/ProjectWorkspacePage';
import SettingsPage from './pages/SettingsPage';
import BeatMakerPage from './pages/BeatMakerPage';
import AppLayout from './components/layout/AppLayout';
import UnlockGate from './components/auth/UnlockGate';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

// Public routes
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginPage,
});

const unlockRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unlock',
  component: UnlockPage,
});

// Protected routes (require authentication + unlock)
const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: () => (
    <UnlockGate>
      <ProjectsPage />
    </UnlockGate>
  ),
});

const projectWorkspaceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects/$projectId',
  component: () => (
    <UnlockGate>
      <ProjectWorkspacePage />
    </UnlockGate>
  ),
});

const beatMakerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/beat-maker',
  component: () => (
    <UnlockGate>
      <BeatMakerPage />
    </UnlockGate>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <UnlockGate>
      <SettingsPage />
    </UnlockGate>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  unlockRoute,
  projectsRoute,
  projectWorkspaceRoute,
  beatMakerRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
