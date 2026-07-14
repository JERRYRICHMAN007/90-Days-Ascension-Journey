import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { STORAGE_KEYS } from '../../utils/storageKeys.js';
import { AuthLayout } from './AuthLayout';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';

const SAVED_EMAIL_KEY = 'ascension_saved_email';
const REMEMBER_ME_KEY = 'ascension_remember_me';
const RATE_LIMIT_VIOLATIONS_KEY = 'ascension_rate_limit_violations';
const RATE_LIMIT_LAST_VIOLATION_KEY = 'ascension_rate_limit_last_violation';

const getRateLimitViolations = (): { count: number; lastViolation: number } => {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_VIOLATIONS_KEY);
    const lastViolation = parseInt(localStorage.getItem(RATE_LIMIT_LAST_VIOLATION_KEY) || '0', 10);
    if (stored) {
      const count = parseInt(stored, 10);
      const oneHourAgo = Date.now() - 60 * 60 * 1000;
      if (lastViolation < oneHourAgo) {
        return { count: 0, lastViolation: 0 };
      }
      return { count, lastViolation };
    }
    return { count: 0, lastViolation: 0 };
  } catch {
    return { count: 0, lastViolation: 0 };
  }
};

const incrementRateLimitViolations = (): number => {
  const { count } = getRateLimitViolations();
  const newCount = count + 1;
  localStorage.setItem(RATE_LIMIT_VIOLATIONS_KEY, newCount.toString());
  localStorage.setItem(RATE_LIMIT_LAST_VIOLATION_KEY, Date.now().toString());
  return newCount;
};

const clearRateLimitViolations = () => {
  localStorage.removeItem(RATE_LIMIT_VIOLATIONS_KEY);
  localStorage.removeItem(RATE_LIMIT_LAST_VIOLATION_KEY);
};

function PasswordToggle({
  visible,
  onToggle,
}: {
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  );
}

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const savedRememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    if (savedRememberMe) {
      const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);

      clearRateLimitViolations();

      if (rememberMe) {
        localStorage.setItem(SAVED_EMAIL_KEY, email);
        localStorage.setItem(REMEMBER_ME_KEY, 'true');
      } else {
        localStorage.removeItem(SAVED_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = err.message || 'Invalid email or password';

      if (
        errorMessage.includes('SERVICE_UNAVAILABLE') ||
        errorMessage.includes('service unavailable') ||
        errorMessage.includes('SUPABASE_UNAVAILABLE') ||
        errorMessage.includes('503') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('ERR_NETWORK') ||
        errorMessage.includes('Network request failed') ||
        errorMessage.includes('Cannot connect to server')
      ) {
        const existingAccessToken = localStorage.getItem('accessToken');
        const existingRefreshToken = localStorage.getItem('refreshToken');

        if (existingAccessToken && existingRefreshToken) {
          localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE, 'true');
          navigate('/dashboard');
          return;
        } else {
          setError(errorMessage);
          return;
        }
      } else if (
        errorMessage.toLowerCase().includes('too many') ||
        errorMessage.toLowerCase().includes('rate limit') ||
        errorMessage.toLowerCase().includes('429')
      ) {
        const violationCount = incrementRateLimitViolations();

        if (violationCount === 1) {
          errorMessage = 'Too many login attempts. Please wait 5 minutes before trying again.';
        } else {
          errorMessage = 'Too many login attempts. Please wait 15 minutes before trying again.';
        }
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="signin"
      title="Welcome Back"
      subtitle="Sign in to continue your Aether journey."
      footer={
        <p className="text-center text-xs text-[var(--text-secondary)] leading-relaxed">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      }
    >
      {error && (
        <div
          className="mb-6 p-4 rounded-lg text-sm flex items-start gap-3"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
          }}
        >
          <span className="size-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
        />

        <AuthField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          icon={<Lock className="w-4 h-4" />}
          trailing={
            <PasswordToggle
              visible={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
            />
          }
        />

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border cursor-pointer accent-[var(--neon-green)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--bg-elevated)' }}
            />
            <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
              Remember me
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-medium text-[var(--neon-cyan)] hover:text-[var(--neon-cyan-alt)] transition-colors whitespace-nowrap"
          >
            Forgot password?
          </Link>
        </div>

        <AuthSubmitButton loading={loading}>Sign In</AuthSubmitButton>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }} />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-3 text-xs text-[var(--text-secondary)]"
              style={{ background: 'var(--bg-card)' }}
            >
              Don&apos;t have an account?
            </span>
          </div>
        </div>

        <Link to="/signup" className="block">
          <AuthSubmitButton type="button" variant="outline">
            Create Account
          </AuthSubmitButton>
        </Link>
      </form>
    </AuthLayout>
  );
}
