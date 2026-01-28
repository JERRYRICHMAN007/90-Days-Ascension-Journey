import { useState, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./components/Dashboard";
import JourneyDetail from "./components/JourneyDetail";
import { HomePage } from "./pages/HomePage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SettingsPage } from "./pages/SettingsPage";
import { LandingPage } from "./pages/LandingPage";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { SignInForm } from "./components/auth/SignInForm";
import { SignUpForm } from "./components/auth/SignUpForm";
import { ForgotPasswordForm } from "./components/auth/ForgotPasswordForm";
import { ResetPasswordForm } from "./components/auth/ResetPasswordForm";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  const [userProgress, setUserProgress] = useState(() => {
    try {
      const saved = localStorage.getItem("ascensionProgress");
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Error parsing user progress from localStorage:", error);
      localStorage.removeItem("ascensionProgress");
      return {};
    }
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ascensionProgress", JSON.stringify(userProgress));
  }, [userProgress]);

  // Load progress from backend when user logs in
  useEffect(() => {
    const loadProgressFromBackend = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) return; // User not logged in

        const { api } = await import('./services/api');
        
        // Load progress for each journey
        const journeys = [
          'body-transformation',
          'dual-brand',
          'reading',
          'writers',
          'software-engineering',
        ];

        const backendProgress = {};

        for (const journeyId of journeys) {
          try {
            const progress = await api.getProgress(journeyId);
            if (progress?.data) {
              // Convert backend format to local format
              const completedDays = progress.data.completedDays || [];
              backendProgress[journeyId] = {};
              completedDays.forEach((dayNumber) => {
                backendProgress[journeyId][dayNumber] = true;
              });
            }
          } catch (error) {
            // If backend is unavailable, continue with local progress
            console.warn(`Failed to load progress for ${journeyId}:`, error);
          }
        }

        // Merge backend progress with local progress (backend takes precedence)
        if (Object.keys(backendProgress).length > 0) {
          setUserProgress((prev) => {
            const merged = { ...prev };
            
            // Apply backend progress
            Object.keys(backendProgress).forEach(journeyId => {
              merged[journeyId] = {
                ...(merged[journeyId] || {}),
                ...backendProgress[journeyId],
              };
            });
            
            return merged;
          });
        }
      } catch (error) {
        console.warn('Failed to load progress from backend:', error);
        // Continue with local progress if backend fails
      }
    };

    // Check if user is authenticated and load progress
    const checkAuthAndLoad = () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        loadProgressFromBackend();
      }
    };

    // Load progress when component mounts
    checkAuthAndLoad();

    // Listen for auth events
    const handleUserAuthenticated = () => {
      // Small delay to ensure tokens are stored
      setTimeout(() => {
        loadProgressFromBackend();
      }, 500);
    };

    window.addEventListener('user-authenticated', handleUserAuthenticated);
    
    return () => {
      window.removeEventListener('user-authenticated', handleUserAuthenticated);
    };
  }, []);

  const updateProgress = async (journeyId, dayIndex, completed) => {
    // Update local state immediately for responsive UI
    setUserProgress((prev) => ({
      ...prev,
      [journeyId]: {
        ...prev[journeyId],
        [dayIndex]: completed,
      },
    }));

    // Sync to backend if user is authenticated
    try {
      const { api } = await import('./services/api');
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        // Map journeyId to backend domain format
        const domainMap = {
          'body-transformation': 'body-transformation',
          'dual-brand': 'dual-brand',
          'reading': 'reading',
          'writers': 'writers',
          'software-engineering': 'software-engineering',
        };
        
        const domain = domainMap[journeyId] || journeyId;
        
        // Sync task completion to backend
        await api.completeTask(domain, dayIndex, completed);
      }
    } catch (error) {
      // If backend sync fails, progress is still saved locally
      // This allows offline functionality
      console.warn('Failed to sync progress to backend:', error);
    }
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <ErrorBoundary>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <div className="text-center space-y-4">
                    <div className="text-4xl animate-spin">🚀</div>
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              }
            >
              <Routes>
                {/* Landing page */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth routes (no layout) */}
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordForm />}
                />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                {/* Protected routes (with layout) */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route
                            path="/dashboard"
                            element={<HomePage userProgress={userProgress} />}
                          />
                          <Route
                            path="/home"
                            element={<HomePage userProgress={userProgress} />}
                          />
                          <Route
                            path="/body-transformation"
                            element={
                              <JourneyDetail
                                journeyId="body-transformation"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/dual-brand"
                            element={
                              <JourneyDetail
                                journeyId="dual-brand"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/reading"
                            element={
                              <JourneyDetail
                                journeyId="reading"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/writers"
                            element={
                              <JourneyDetail
                                journeyId="writers"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/software-engineering"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          {/* Discipline Routes */}
                          <Route
                            path="/discipline/:discipline"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          {/* Lesson Routes */}
                          <Route
                            path="/discipline/:discipline/lesson/:lessonId"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          {/* Project Routes */}
                          <Route
                            path="/project/:projectId"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          {/* Reflection Routes */}
                          <Route
                            path="/reflections"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/reflections/day/:dayNumber"
                            element={
                              <JourneyDetail
                                journeyId="software-engineering"
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          <Route
                            path="/achievements"
                            element={<AchievementsPage />}
                          />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route
                            path="/journey/:journeyId"
                            element={
                              <JourneyDetail
                                userProgress={userProgress}
                                updateProgress={updateProgress}
                              />
                            }
                          />
                          {/* Default redirect for unknown protected routes */}
                          <Route
                            path="*"
                            element={<Navigate to="/dashboard" replace />}
                          />
                        </Routes>
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </Router>
        </ErrorBoundary>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
