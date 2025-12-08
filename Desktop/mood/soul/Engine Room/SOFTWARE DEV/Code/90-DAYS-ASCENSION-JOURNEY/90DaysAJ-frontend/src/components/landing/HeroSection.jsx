import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

export function HeroSection() {

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Join 10,000+ users transforming their lives
                </span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                  Transform Your Life
                </span>
                <br />
                <span className="text-foreground">in Just 90 Days</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl leading-relaxed"
              >
                Your all-in-one platform for body transformation, brand building, reading, writing, and software engineering growth. Start your ascension journey today.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row items-center lg:items-start gap-4 mb-12"
              >
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg bg-gradient-to-r from-primary via-accent to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                  >
                    Start Your Journey Free
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/signin">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg border-2 hover:text-blue-500 hover:border-blue-500"
                  >
                    Sign In
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span>Cancel anytime</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right: Illustration/Animation */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              {/* Gamified Progress Preview */}
              <div className="relative bg-card/80 backdrop-blur-xl rounded-3xl p-8 border border-border/50 shadow-2xl">
                {/* Progress Stats */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
                      <span className="text-sm font-bold text-primary">68%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "68%" }}
                        transition={{ delay: 1, duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary via-accent to-secondary rounded-full"
                      />
                    </div>
                  </div>

                  {/* Domain Progress Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: "Body", progress: 75, icon: "💪" },
                      { name: "Brand", progress: 60, icon: "🎨" },
                      { name: "Reading", progress: 80, icon: "📚" },
                      { name: "Writing", progress: 55, icon: "✍️" },
                      { name: "Software Engineering", progress: 70, icon: "💻" },
                    ].map((domain, index) => (
                      <motion.div
                        key={domain.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.2 + index * 0.1 }}
                        className="p-4 rounded-xl bg-muted/50 border border-border/50"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{domain.icon}</span>
                          <span className="text-sm font-semibold">{domain.name}</span>
                        </div>
                        <div className="h-2 bg-background rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${domain.progress}%` }}
                            transition={{ delay: 1.5 + index * 0.1, duration: 1 }}
                            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* XP & Level Badge */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20">
                    <div>
                      <div className="text-2xl font-bold text-primary">2,450 XP</div>
                      <div className="text-xs text-muted-foreground">Level 12 • 550 XP to next level</div>
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-xl">
                      12
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

