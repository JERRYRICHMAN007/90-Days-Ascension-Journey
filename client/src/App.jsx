import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DashboardLayout } from "./components/layout/DashboardLayout";
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
import { migrateLegacyStorage } from "./utils/storageKeys.js";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { hydrateFromBackend } from "./utils/hydrateFromBackend.js";
import { flushQueue } from "./utils/offlineQueue.js";

// Run migration synchronously before React mounts so a bad key cannot white-screen the app
migrateLegacyStorage();

async function runPostAuthSync() {
  try {
    await hydrateFromBackend();
  } catch (e) {
    console.error("Forge184: hydration failed, continuing without sync", e);
  }
  try {
    await flushQueue();
  } catch (e) {
    console.error("Forge184: queue flush failed", e);
  }
}

function App() {
  useEffect(() => {
    const handleUserAuthenticated = () => {
      setTimeout(() => {
        runPostAuthSync();
      }, 500);
    };

    if (localStorage.getItem("accessToken")) {
      runPostAuthSync();
    }

    window.addEventListener("user-authenticated", handleUserAuthenticated);
    return () => window.removeEventListener("user-authenticated", handleUserAuthenticated);
  }, []);

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
                    <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
                    <p className="text-muted-foreground">Loading...</p>
                  </div>
                </div>
              }
            >
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signin" element={<SignInForm />} />
                <Route path="/signup" element={<SignUpForm />} />
                <Route path="/forgot-password" element={<ForgotPasswordForm />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />

                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Routes>
                          <Route path="/dashboard" element={<HomePage />} />
                          <Route path="/body-transformation" element={<JourneyDetail journeyId="body-transformation" />} />
                          <Route path="/dual-brand" element={<JourneyDetail journeyId="dual-brand" />} />
                          <Route path="/reading" element={<JourneyDetail journeyId="reading" />} />
                          <Route path="/writers" element={<JourneyDetail journeyId="writers" />} />
                          <Route path="/software-engineering" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/discipline/:discipline" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/discipline/:discipline/lesson/:lessonId" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/project/:projectId" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/reflections" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/reflections/day/:dayNumber" element={<JourneyDetail journeyId="software-engineering" />} />
                          <Route path="/analytics" element={<AnalyticsPage />} />
                          <Route path="/analytics/:journeyId" element={<AnalyticsPage />} />
                          <Route path="/achievements" element={<AchievementsPage />} />
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/journey/:journeyId" element={<JourneyDetail />} />
                          <Route path="*" element={<Navigate to="/dashboard" replace />} />
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