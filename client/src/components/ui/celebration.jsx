import { useEffect, useState } from 'react';

export function CelebrationOverlay({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const colors = ['#667eea', '#764ba2', '#38ef7d', '#f5af19', '#f5576c'];
    const next = Array.from({ length: 12 }, (_, i) => ({
      id: `${trigger}-${i}`,
      left: `${10 + Math.random() * 80}%`,
      delay: Math.random() * 0.3,
      color: colors[i % colors.length],
    }));
    setParticles(next);
    const t = setTimeout(() => setParticles([]), 1200);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-1/3 w-2 h-2 rounded-full animate-[confetti-burst_1s_ease-out_forwards]"
          style={{
            left: p.left,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function showXpFloat(element, amount = '+XP') {
  if (!element) return;
  const float = document.createElement('span');
  float.textContent = amount;
  float.className = 'fixed z-[100] text-sm font-bold text-primary pointer-events-none animate-[xp-float_1s_ease-out_forwards]';
  const rect = element.getBoundingClientRect();
  float.style.left = `${rect.left + rect.width / 2}px`;
  float.style.top = `${rect.top}px`;
  document.body.appendChild(float);
  setTimeout(() => float.remove(), 1000);
}
