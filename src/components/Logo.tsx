import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full bg-[#feedf1] border-2 border-primary overflow-hidden ${className}`}>
      {/* Woman's face stylized SVG */}
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full p-1 fill-primary"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M50 10c22.1 0 40 17.9 40 40s-17.9 40-40 40-40-17.9-40-40 17.9-40 40-40zm0 76c19.9 0 36-16.1 36-36s-16.1-36-36-36-36 16.1-36 36 16.1 36 36 36z" opacity="0.1" />
        <path d="M55 25c-5.5 0-10 4.5-10 10s4.5 10 10 10 10-4.5 10-10-4.5-10-10-10zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8z" />
        <path d="M50 45c-15.5 0-28 12.5-28 28 0 1.1.9 2 2 2h52c1.1 0 2-.9 2-2 0-15.5-12.5-28-28-28zm-25.9 26c1.1-12.1 11.2-22 23.9-24 1.1 0 2 .9 2 2v22h-25.9zm51.8 0H52V49c12.7 2 22.8 11.9 23.9 24v-2h.1z" />
        {/* Flower detail */}
        <circle cx="65" cy="30" r="4" fill="white" />
        <path d="M65 24l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" fill="white" />
      </svg>
    </div>
  );
};
