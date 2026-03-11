import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right';
}

export const Reveal: React.FC<RevealProps> = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = 'up' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (!isVisible) {
      switch(direction) {
        case 'up': return 'translate-y-16 opacity-0';
        case 'left': return '-translate-x-16 opacity-0';
        case 'right': return 'translate-x-16 opacity-0';
        default: return 'translate-y-16 opacity-0';
      }
    }
    return 'translate-x-0 translate-y-0 opacity-100';
  };

  return (
    <div 
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${getTransform()} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};