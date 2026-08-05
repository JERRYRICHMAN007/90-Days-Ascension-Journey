import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

export function DashboardFAB() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate('/dashboard/create-journey')}
      className="fixed bottom-24 right-6 z-30 flex items-center gap-2 rounded-full bg-[var(--neon-green)] px-5 py-3.5 text-sm font-bold text-[#003d1f] shadow-[0_0_16px_rgba(110,231,183,0.4)] transition-transform hover:scale-[1.02] active:scale-95 md:bottom-10"
      aria-label="Create new journey"
    >
      <Plus className="size-5 stroke-[2.5]" />
      <span className="hidden sm:inline">New Journey</span>
    </button>
  );
}
