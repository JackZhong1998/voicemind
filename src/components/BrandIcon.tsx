import React from 'react';

export const BrandIcon: React.FC<{ className?: string; size?: number }> = ({ className, size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* A sharp V where the right side transitions into a sound wave pulse */}
      <path 
        d="M4 4L10 18" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
      />
      <path 
        d="M10 18L13 12L16 20L19 8L22 14" 
        stroke="currentColor" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
};
