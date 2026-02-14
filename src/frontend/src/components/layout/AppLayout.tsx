import { ReactNode } from 'react';
import { Outlet } from '@tanstack/react-router';
import AppNav from './AppNav';
import AppFooter from './AppFooter';

interface AppLayoutProps {
  children?: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <AppNav />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      <AppFooter />
    </div>
  );
}
