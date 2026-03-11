import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl border bg-neutral-50 focus:bg-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 ${
          error ? 'border-red-500' : 'border-neutral-200 focus:border-brand-accent'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-xs text-red-500">{error}</p>
      )}
    </div>
  );
};