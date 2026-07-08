import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { AuthField } from './AuthField';
import { AuthSubmitButton } from './AuthSubmitButton';

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

export function SignUpForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-z]/.test(pwd)) return 'Password must contain a lowercase letter';
    if (!/[A-Z]/.test(pwd)) return 'Password must contain an uppercase letter';
    if (!/\d/.test(pwd)) return 'Password must contain a number';
    return null;
  };

  const passwordRequirements = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);
    try {
      await signUp(name, email, password);
      navigate('/dashboard');
    } catch (err: any) {
      let errorMessage = err.message || 'Failed to create account';

      if (
        errorMessage.includes('SERVICE_UNAVAILABLE') ||
        errorMessage.includes('service unavailable') ||
        errorMessage.includes('SUPABASE_UNAVAILABLE') ||
        errorMessage.includes('503') ||
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError')
      ) {
        errorMessage =
          'Unable to connect to authentication service. Please check your connection and try again. Account creation requires a working connection.';
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      mode="signup"
      title="Start Your Journey"
      subtitle="Create an account to begin your 184-day transformation."
      footer={
        <p className="text-center text-xs text-[var(--text-secondary)] leading-relaxed">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
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

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <AuthField
          label="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={100}
          placeholder="John Doe"
          icon={<User className="w-4 h-4" />}
        />

        <AuthField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@example.com"
          icon={<Mail className="w-4 h-4" />}
        />

        <div className="space-y-2">
          <AuthField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Create a strong password"
            icon={<Lock className="w-4 h-4" />}
            trailing={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />

          {password && (
            <div
              className="p-3 rounded-lg space-y-1.5"
              style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
            >
              <p className="text-[10px] uppercase tracking-wide text-[var(--text-secondary)] mb-2">
                Password requirements
              </p>
              {Object.entries({
                length: 'At least 8 characters',
                lowercase: 'One lowercase letter',
                uppercase: 'One uppercase letter',
                number: 'One number',
              }).map(([key, label]) => {
                const met = passwordRequirements[key as keyof typeof passwordRequirements];
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <CheckCircle2
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: met ? 'var(--neon-green)' : 'var(--text-secondary)' }}
                    />
                    <span style={{ color: met ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <AuthField
          label="Confirm Password"
          type={showConfirmPassword ? 'text' : 'password'}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="Confirm your password"
          icon={<Lock className="w-4 h-4" />}
          trailing={
            <PasswordToggle
              visible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          }
          error={
            confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined
          }
        />

        <div className="pt-1">
          <AuthSubmitButton loading={loading}>Create Account</AuthSubmitButton>
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)' }} />
          </div>
          <div className="relative flex justify-center">
            <span
              className="px-3 text-xs text-[var(--text-secondary)]"
              style={{ background: 'var(--bg-card)' }}
            >
              Already have an account?
            </span>
          </div>
        </div>

        <Link to="/signin" className="block">
          <AuthSubmitButton type="button" variant="outline">
            Sign In
          </AuthSubmitButton>
        </Link>
      </form>
    </AuthLayout>
  );
}
