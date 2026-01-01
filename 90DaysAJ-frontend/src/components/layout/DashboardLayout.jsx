import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '../../lib/utils';

export function DashboardLayout({ children, className }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0">
        <TopNav />
        <main className={cn("flex-1 p-6 md:p-8 relative z-0", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}

