import React, { useEffect, useState, useMemo } from 'react';

export const Background: React.FC = React.memo(() => {
  const particles = useMemo(() => {
    const colors = [
      'rgba(0, 242, 255, 0.8)', // Tech Blue
      'rgba(168, 85, 247, 0.8)', // Purple
      'rgba(59, 130, 246, 0.8)', // Blue
      'rgba(236, 72, 153, 0.8)', // Pink
      'rgba(34, 211, 238, 0.8)', // Cyan
    ];
    
    return Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 5 + 2,
      duration: Math.random() * 10 + 5,
      tx: Math.random() * 120 - 60,
      ty: Math.random() * 120 - 60,
      delay: Math.random() * -20,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
  }, []);

  return (
    <div className="glow-bg overflow-hidden">
      {/* Animated Gradient Mesh - Simplified for performance */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-tech-blue/20 blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '-2s' }} />
      </div>

      <div className="halo opacity-50" style={{ width: '800px', height: '800px', top: '-200px', left: '-200px', animationDuration: '15s' }} />
      <div className="halo opacity-40" style={{ width: '1000px', height: '1000px', bottom: '-300px', right: '-300px', animationDelay: '-5s', animationDuration: '20s' }} />
      
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            animation: `float ${p.duration}s infinite ease-in-out`,
            animationDelay: `${p.delay}s`,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`, // Simplified shadow
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
