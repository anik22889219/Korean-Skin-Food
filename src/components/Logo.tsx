import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "h-10 w-10" }) => {
  return (
    <div className={`relative flex items-center justify-center rounded-full overflow-hidden ${className}`}>
      <img 
        src="https://res.cloudinary.com/dxvmfaxeh/image/upload/q_auto/f_auto/v1778359283/korean_skin_food_logo_pgslkk.jpg" 
        alt="Korean Skin Food Logo"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
