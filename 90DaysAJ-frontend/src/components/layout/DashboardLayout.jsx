import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { cn } from '../../lib/utils';

export function DashboardLayout({ children, className }) {
  return (
    <div className="flex min-h-screen bg-background overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-0 min-w-0 overflow-x-hidden">
        <TopNav />
        <main className={cn(
          "flex-1 relative z-0 overflow-x-hidden w-full",
          "px-4 sm:px-6 lg:px-8",
          "py-6 sm:py-8 lg:py-10",
          className
        )}>
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

