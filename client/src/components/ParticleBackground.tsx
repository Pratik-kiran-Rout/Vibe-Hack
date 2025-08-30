import React from 'react';

const ParticleBackground: React.FC = () => {
  return (
    <div className="particle-background">
      <div className="absolute inset-0 opacity-75" style={{background: 'var(--gradient-hero)'}}></div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ParticleBackground;