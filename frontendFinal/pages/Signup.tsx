import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../services/useAuthStore';
import { validateEmail, validatePassword, validateRequired } from '../utils/validation';

import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const { setSignupStepOne, googleLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    // Correct validation
    if (!validateRequired(formData.fullName)) newErrors.fullName = 'Full name is required';
    if (!validateEmail(formData.email)) newErrors.email = 'Invalid email address';
    if (!validatePassword(formData.password)) newErrors.password = 'Password must be 8+ chars with a number';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);

      // Store step-1 data correctly
      setSignupStepOne({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-neutral-900">Create Account</h2>
          <p className="mt-2 text-sm text-neutral-600">
            Step 1 of 2: Account Credentials
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">

            <Input
              label="Full Name"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              placeholder="Enter your full name"
            />

            <Input
              label="Email address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
            />

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
            />

          </div>

          <Button type="submit" className="w-full" isLoading={loading}>
            Continue
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

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={async credentialResponse => {
                  await googleLogin(credentialResponse.credential!);
                  navigate("/", { replace: true });
                }}
                onError={() => {
                  toast.error("Google Login Failed");
                }}
              />
            </div>
          </div>

          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-accent hover:text-yellow-600">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
