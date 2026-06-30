import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../services/useAuthStore';
import { validateEmail, validateRequired } from '../utils/validation';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  // If coming from protected route
  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};
    if (!validateEmail(email)) newErrors.email = 'Invalid email address';
    if (!validateRequired(password)) newErrors.password = 'Password is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      try {
        // REAL login API call
        await login({ email, password });

        navigate(from, { replace: true });
      } catch (err: any) {
        console.log("Login Error:", err);
        if (err?.requiresVerification) {
          navigate("/verify-otp", { state: { email: err.email } });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FEFCE8] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#FCFBF8] border border-amber-900/10 p-10 rounded-3xl shadow-sm">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-neutral-900">Welcome back</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Or{' '}
            <Link to="/signup" className="font-medium text-brand-accent hover:text-yellow-600">
              create a new account
            </Link>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-accent focus:ring-brand-accent border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-brand-dark hover:text-brand-accent">
                Forgot password?
              </a>
            </div>
          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await googleLogin();
                    navigate(from, { replace: true });
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-neutral-300 rounded-xl bg-white hover:bg-neutral-50 transition-colors text-neutral-700 font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.99 5.99 0 0 1 8 12.5a5.99 5.99 0 0 1 5.99-6.012c1.49 0 2.858.547 3.918 1.453l3.05-3.05C19.043 3.12 16.69 2 13.99 2 8.156 2 3.42 6.702 3.42 12.5s4.736 10.5 10.57 10.5c5.762 0 10.28-4.086 10.28-10.457 0-.702-.08-1.395-.23-2.258H12.24Z"
                  />
                </svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
