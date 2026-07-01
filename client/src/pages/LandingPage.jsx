import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Dumbbell, 
  Palette, 
  BookOpen, 
  PenTool, 
  Code,
  ArrowRight,
  Target,
  TrendingUp,
  Zap,
  CheckCircle2,
  Github,
  Twitter,
  Linkedin,
  Mail
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { HeroSection } from '../components/landing/HeroSection';
import { LandingCtaButtons } from '../components/landing/LandingCtaButtons';
import { FeatureCard } from '../components/landing/FeatureCard';
import { TestimonialCarousel } from '../components/landing/TestimonialCarousel';
import { NewsletterForm } from '../components/landing/NewsletterForm';
import { ThemeToggle } from '../components/landing/ThemeToggle';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: Dumbbell,
    title: 'Body Transformation',
    description: 'Track your fitness journey with personalized workouts, nutrition plans, and progress monitoring.',
    gradient: 'from-orange-500 to-red-500',
    benefits: [
      'Custom workout routines',
      'Nutrition tracking',
      'Progress analytics',
      'Hydration & step logs'
    ]
  },
  {
    icon: Palette,
    title: 'Dual Brand Development',
    description: 'Build and grow your personal and professional brands simultaneously with strategic planning tools.',
    gradient: 'from-blue-500 to-purple-500',
    benefits: [
      'Content planning',
      'Brand board',
      'Portfolio tracking',
      'Audience insights'
    ]
  },
  {
    icon: BookOpen,
    title: 'Reading Journey',
    description: 'Expand your knowledge with curated reading lists, progress tracking, and note-taking features.',
    gradient: 'from-green-500 to-teal-500',
    benefits: [
      'Book tracker',
      'Reading streaks',
      'Notes & summaries',
      'Progress logs'
    ]
  },
  {
    icon: PenTool,
    title: 'Writing Journey',
    description: 'Hone your writing skills with daily prompts, draft management, and writing timer tools.',
    gradient: 'from-pink-500 to-rose-500',
    benefits: [
      'Writing timer',
      'Draft storage',
      'Topic generator',
      'Writing streaks'
    ]
  },
  {
    icon: Code,
    title: 'Software Engineering',
    description: 'Level up your coding skills with practice logs, project boards, and skill progression tracking.',
    gradient: 'from-indigo-500 to-blue-500',
    benefits: [
      'Practice logs',
      'Project boards',
      'Skill map',
      'Learning resources'
    ]
  }
];

const benefits = [
  {
    icon: Target,
    title: 'Goal-Oriented',
    description: 'Set and track goals across all your growth areas with clear milestones and progress indicators.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Visualize your journey with detailed analytics, charts, and insights across all domains.'
  },
  {
    icon: Zap,
    title: 'Gamification',
    description: 'Stay motivated with XP points, daily streaks, badges, achievements, and level progression.'
  },
  {
    icon: CheckCircle2,
    title: 'Daily Habits',
    description: 'Build lasting habits with daily tasks, reminders, and completion tracking.'
  }
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Fitness Enthusiast',
    content: 'I\'ve transformed my body and built consistent habits in just 60 days. The gamification keeps me motivated every single day!',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Software Developer',
    content: 'The software engineering tracking helped me stay consistent with my coding practice. I\'ve completed 3 projects since starting!',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Content Creator',
    content: 'Managing both my personal and professional brand has never been easier. The dual brand features are a game-changer.',
    rating: 5
  },
  {
    name: 'David Kim',
    role: 'Writer & Reader',
    content: 'I\'ve read 12 books and written 30+ articles since joining. The reading and writing journeys keep me accountable.',
    rating: 5
  }
];

export function LandingPage() {
  const { user, loading } = useAuth();

  // Redirect authenticated users to dashboard
  if (!loading && user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen mesh-gradient-bg overflow-x-hidden">
      <nav className="sticky top-0 z-50 glass-nav">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-2.5"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="text-sm sm:text-base md:text-lg lg:text-xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Forge90
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3 md:gap-4"
          >
            <ThemeToggle />
            <Link to="/signin" className="hidden sm:block">
              <Button variant="ghost" size="sm" className="hover:bg-white hover:text-black text-xs sm:text-sm transition-colors">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-gradient-to-r from-primary via-accent to-secondary text-white hover:shadow-lg transition-all text-xs sm:text-sm px-3 sm:px-4">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1.5 sm:ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent px-2">
            Five Pillars of Growth
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Comprehensive development across all areas of your life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto px-1 sm:px-0">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              gradient={feature.gradient}
              delay={index * 0.1}
              benefits={feature.benefits}
            />
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20 bg-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent px-2">
            Why Choose Us?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            Everything you need to track and accelerate your growth
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -3 }}
                className="text-center p-3.5 sm:p-5 md:p-6 bg-card/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-border/50 shadow-md sm:shadow-lg hover:shadow-xl transition-all w-full"
              >
                <div className="inline-flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-2.5 sm:mb-4">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent px-2">
            Loved by Thousands
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto px-2">
            See what our community is saying about their transformation journey
          </p>
        </motion.div>

        <TestimonialCarousel testimonials={testimonials} />
      </section>

      {/* CTA Section with Newsletter */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 rounded-2xl sm:rounded-3xl p-6 sm:p-10 md:p-16 text-center border border-primary/20"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands of others who are transforming their lives one day at a time
          </p>
          
          <div className="mb-6 sm:mb-8">
            <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">Stay updated with tips and updates</p>
            <NewsletterForm />
          </div>

          <LandingCtaButtons
            primaryLabel="Create Free Account"
            align="center"
          />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 sm:px-6 py-10 sm:py-12 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-center sm:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Forge90
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Transform your life in 90 days across five core domains.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
              </a>
              <a href="#" className="p-2 rounded-lg hover:bg-muted transition-colors" aria-label="Email">
                <Mail className="w-5 h-5 text-muted-foreground hover:text-blue-500 transition-colors" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Features</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Roadmap</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Updates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">About</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Blog</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Careers</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Privacy</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Terms</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Security</Link></li>
              <li><Link to="/signup" className="hover:text-blue-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 sm:gap-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 Forge90. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Made with ❤️ for your transformation journey
          </p>
        </div>
      </footer>
    </div>
  );
}
