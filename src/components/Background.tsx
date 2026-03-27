import React, { useEffect, useState, useMemo } from 'react';

export const Background: React.FC = React.memo(() => {
  const particles = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 10 + 5,
      tx: Math.random() * 20 - 10,
      ty: Math.random() * 20 - 10,
    }));
  }, []);

  return (
    <div className="glow-bg">
      <div className="halo" style={{ width: '600px', height: '600px', top: '-100px', left: '-100px' }} />
      <div className="halo" style={{ width: '800px', height: '800px', bottom: '-200px', right: '-200px', animationDelay: '-4s' }} />
      <div className="halo" style={{ width: '400px', height: '400px', top: '40%', left: '60%', animationDelay: '-2s' }} />
      
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animation: `float ${p.duration}s infinite ease-in-out`,
            boxShadow: `0 0 ${p.size * 2}px var(--color-tech-blue)`,
            '--tx': `${p.tx}px`,
            '--ty': `${p.ty}px`
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
});
