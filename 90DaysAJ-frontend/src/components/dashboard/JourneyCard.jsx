import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Progress } from '../ui/progress';
import { useNavigate } from 'react-router-dom';

export function JourneyCard({ journey, journeyProgress, index }) {
  const navigate = useNavigate();

  // Map journey colors to Tailwind gradient classes
  const colorMap = {
    '#667eea': 'from-purple-500 to-indigo-500',
    '#f093fb': 'from-pink-500 to-purple-500',
    '#4facfe': 'from-blue-500 to-cyan-500',
    '#43e97b': 'from-green-500 to-emerald-500',
    '#fa709a': 'from-pink-500 to-rose-500',
  };

  const gradientClass = colorMap[journey.color] || 'from-purple-500 to-pink-500';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
        rotateX: 5,
      }}
      onClick={() => navigate(`/journey/${journey.id}`)}
      className="glass-card rounded-2xl p-6 cursor-pointer relative overflow-hidden group"
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      
      {/* Glow effect on hover */}
      <div className={`absolute -inset-1 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300`} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="text-5xl mb-2 float-animation">{journey.icon}</div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{journeyProgress.completed}/{journeyProgress.total} days</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-all">
              {journey.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {journey.description}
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-semibold">{journeyProgress.percentage}%</span>
            </div>
            <div className="relative">
              <Progress value={journeyProgress.percentage} className="h-2" />
              <div 
                className={`absolute top-0 left-0 h-2 bg-gradient-to-r ${gradientClass} rounded-full transition-all duration-500`}
                style={{ width: `${journeyProgress.percentage}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground">
              {journey.timeBlock}
            </span>
            <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>

      {/* Radial progress indicator */}
      <div className="absolute top-4 right-4 w-12 h-12">
        <svg className="transform -rotate-90 w-12 h-12">
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            className="text-muted opacity-20"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            stroke="url(#gradient-progress)"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - journeyProgress.percentage / 100)}`}
            className="transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
        <defs>
          <linearGradient id="gradient-progress" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#667eea" />
            <stop offset="100%" stopColor="#764ba2" />
          </linearGradient>
        </defs>
      </div>
    </motion.div>
  );
}
