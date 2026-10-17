import React from 'react';

interface HeroMotionBackgroundProps {
  theme?: 'home' | 'work' | 'rabbit-holes';
}

export const HeroMotionBackground: React.FC<HeroMotionBackgroundProps> = ({ theme = 'home' }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Dynamic ambient gradients */}
      <div
        className={`absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] opacity-25 ${
          theme === 'rabbit-holes'
            ? 'bg-purple-600'
            : theme === 'work'
            ? 'bg-sky-600'
            : 'bg-amber-500'
        }`}
      />
      <div
        className={`absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-15 ${
          theme === 'rabbit-holes' ? 'bg-fuchsia-600' : 'bg-indigo-600'
        }`}
      />
      <div className="absolute bottom-0 left-[-5%] w-[450px] h-[450px] rounded-full blur-[130px] opacity-15 bg-teal-600" />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
};
