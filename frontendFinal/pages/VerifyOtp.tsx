import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../services/useAuthStore';
import { Button } from '../components/Button';
import { toast } from 'react-hot-toast';

export const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const { verifyOTP, resendOTP } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as any)?.email || '';
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if (!email) {
      toast.error("Invalid session. Redirecting to signup.");
      navigate("/signup");
    }
  }, [email, navigate]);

  // Resend OTP Timer Countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    const val = element.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);

    // Focus next input box
    if (val && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && !isNaN(Number(pasteData))) {
      const pasteArray = pasteData.split('');
      setOtp(pasteArray);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      toast.error("Please enter a valid 6-digit OTP code");
      return;
    }

    setLoading(true);
    try {
      await verifyOTP(email, otpCode);
      navigate("/");
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    try {
      await resendOTP(email);
      setResendTimer(60);
      setCanResend(false);
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-neutral-100">
        
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-neutral-900">Verify Email</h2>
          <p className="mt-3 text-sm text-neutral-600">
            We sent a verification code to <br />
            <strong className="text-neutral-950">{email}</strong>
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
          
          {/* 6 Digit Input Boxes */}
          <div className="flex justify-between gap-2 md:gap-3" onPaste={handlePaste}>
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={data}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-bold border border-neutral-200 rounded-xl bg-neutral-50 text-neutral-900 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/20 transition-all"
              />
            ))}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full text-base font-semibold" isLoading={loading}>
            Verify & Continue
          </Button>

          {/* Resend Action */}
          <div className="text-center text-sm text-neutral-500">
            Didn't receive the code?{' '}
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="font-medium text-brand-dark hover:text-brand-accent underline transition-colors"
              >
                Resend Code
              </button>
            ) : (
              <span className="font-medium text-neutral-400">
                Resend code in <strong className="text-neutral-600">{resendTimer}s</strong>
              </span>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};
