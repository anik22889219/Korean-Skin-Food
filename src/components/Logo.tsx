import React from 'react';
import logoImage from '../Assets/korean skin food logo.jpg';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}>
      <img 
        src={logoImage} 
        alt="Korean Skin Food Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
