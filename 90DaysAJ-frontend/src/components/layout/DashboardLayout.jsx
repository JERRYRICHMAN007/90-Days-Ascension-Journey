import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '../../lib/utils';

export function DashboardLayout({ children, className }) {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0 min-w-0 overflow-x-hidden">
        <TopNav />
        <main className={cn("flex-1 p-3 sm:p-4 md:p-6 lg:p-8 relative z-0 overflow-x-hidden w-full", className)}>
          <div className="w-full max-w-full overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

