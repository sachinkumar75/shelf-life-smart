import { ReactNode } from 'react';
import { BottomNav } from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  showNav?: boolean;
}

export function AppLayout({ children, title, showNav = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {title && (
        <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur-sm safe-area-pt">
          <div className="flex h-14 items-center px-4">
            <h1 className="text-lg font-semibold">{title}</h1>
          </div>
        </header>
      )}
      <main className={cn(showNav ? 'pb-20' : '', 'min-h-screen')}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
