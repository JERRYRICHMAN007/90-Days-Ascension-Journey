import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      className="aether-auth-eye-toggle p-1 opacity-100 hover:opacity-80 transition-opacity"
      aria-label={visible ? 'Hide password' : 'Show password'}
    >
      {visible ? (
        <EyeOff className="w-4 h-4" strokeWidth={2.75} absoluteStrokeWidth />
      ) : (
        <Eye className="w-4 h-4" strokeWidth={2.75} absoluteStrokeWidth />
      )}
    </button>
  );
}

const REQ_LABELS = {
  length: '8+ chars',
  lowercase: 'Lowercase',
  uppercase: 'Uppercase',
  number: 'Number',
} as const;

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
      subtitle="Create your account — takes under a minute."
      footer={
        <p className="text-center text-[10px] text-[var(--text-secondary)] leading-relaxed">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      }
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 rounded-lg text-xs flex items-start gap-2"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171',
          }}
        >
          <span className="size-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            compact
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
            maxLength={100}
            placeholder="John Doe"
            icon={<User className="w-3.5 h-3.5" strokeWidth={2.5} />}
          />

          <AuthField
            compact
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            icon={<Mail className="w-3.5 h-3.5" strokeWidth={2.5} />}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AuthField
            compact
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="Strong password"
            icon={<Lock className="w-3.5 h-3.5" strokeWidth={2.5} />}
            trailing={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword(!showPassword)}
              />
            }
          />

          <AuthField
            compact
            label="Confirm"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Repeat password"
            icon={<Lock className="w-3.5 h-3.5" strokeWidth={2.5} />}
            trailing={
              <PasswordToggle
                visible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            error={
              confirmPassword && password !== confirmPassword ? 'Mismatch' : undefined
            }
          />
        </div>

        {password && (
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(REQ_LABELS) as Array<keyof typeof REQ_LABELS>).map((key) => {
              const met = passwordRequirements[key];
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-200"
                  style={{
                    background: met ? 'rgba(0,255,135,0.1)' : 'var(--bg-elevated)',
                    border: `1px solid ${met ? 'rgba(0,255,135,0.3)' : 'var(--border-subtle)'}`,
                    color: met ? 'var(--neon-green)' : 'var(--text-secondary)',
                  }}
                >
                  <CheckCircle2 className="w-2.5 h-2.5 shrink-0" strokeWidth={2.5} />
                  {REQ_LABELS[key]}
                </span>
              );
            })}
          </div>
        )}

        <AuthSubmitButton loading={loading}>Create Account</AuthSubmitButton>

        <p className="text-center text-xs text-[var(--text-secondary)]">
          Already have an account?{' '}
          <Link
            to="/signin"
            className="font-semibold text-[var(--neon-cyan)] hover:text-[var(--neon-cyan-alt)] transition-colors"
          >
            Sign In
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
