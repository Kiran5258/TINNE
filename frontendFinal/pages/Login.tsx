import React, { useState } from 'react';
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

  const { login } = useAuthStore();
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
      } catch (err) {
        console.log("Login Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm">
        
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
        </form>
      </div>
    </div>
  );
};
