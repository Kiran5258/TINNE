import React from 'react';

/**
 * Full-page premium loading screen used while data is being fetched.
 * Shows the Tinné brand logo with an animated shimmer bar and pulsing dots.
 */
export const PageLoader: React.FC<{ message?: string }> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
      {/* Brand mark */}
      <div className="flex flex-col items-center mb-10">
        <span className="text-5xl font-script font-bold text-neutral-900 tracking-wide leading-none">
          Tinné
        </span>
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400 mt-1 font-sans">
          From Grandma's Thinnai
        </span>
      </div>

      {/* Animated shimmer bar */}
      <div className="w-48 h-1 bg-neutral-100 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-transparent via-brand-accent to-transparent rounded-full"
          style={{
            animation: 'shimmer 1.6s ease-in-out infinite',
            width: '60%',
          }}
        />
      </div>

      {/* Pulsing dots */}
      <div className="flex items-center gap-2 mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-brand-accent"
            style={{
              animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <p className="text-xs text-neutral-400 uppercase tracking-widest font-sans">{message}</p>

      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(280%); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40%            { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

/**
 * Inline skeleton card — use inside grids while products/orders load.
 */
export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`rounded-2xl bg-neutral-100 animate-pulse overflow-hidden ${className}`}>
    <div className="h-56 bg-neutral-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-neutral-200 rounded-full w-3/4" />
      <div className="h-3 bg-neutral-200 rounded-full w-1/2" />
      <div className="h-8 bg-neutral-200 rounded-full w-full mt-2" />
    </div>
  </div>
);

/**
 * Inline skeleton row — use in order lists / tables while data loads.
 */
export const SkeletonRow: React.FC = () => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 animate-pulse">
    <div className="w-12 h-12 rounded-lg bg-neutral-200 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3 bg-neutral-200 rounded-full w-2/3" />
      <div className="h-3 bg-neutral-200 rounded-full w-1/3" />
    </div>
    <div className="w-16 h-6 rounded-full bg-neutral-200" />
  </div>
);
