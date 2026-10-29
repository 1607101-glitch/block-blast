import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface ParticleEmitterHandle {
  emitBurst: (x: number, y: number, color: string, count?: number) => void;
  emitComboStars: (x: number, y: number, comboCount: number) => void;
  clear: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  rotSpeed: number;
  shape: 'square' | 'circle' | 'sparkle';
  gravity: number;
}

export const ParticleCanvas = forwardRef<ParticleEmitterHandle, { className?: string }>(
  ({ className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particlesRef = useRef<Particle[]>([]);
    const animFrameIdRef = useRef<number | null>(null);

    // Resize handler to match container
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const updateSize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
      };

      updateSize();
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }, []);

    const startAnimationLoop = () => {
      if (animFrameIdRef.current !== null) return;

      const loop = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const particles = particlesRef.current;
        if (particles.length === 0) {
          animFrameIdRef.current = null;
          return;
        }

        ctx.save();
        ctx.scale(dpr, dpr);

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.vy += p.gravity;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.rotation += p.rotSpeed;
          p.alpha -= p.decay;

          if (p.alpha <= 0) {
            particles.splice(i, 1);
            continue;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;

          if (p.shape === 'square') {
            const half = p.size / 2;
            ctx.fillRect(-half, -half, p.size, p.size);
          } else if (p.shape === 'sparkle') {
            // Draw 4-point sparkle star
            const s = p.size;
            ctx.beginPath();
            ctx.moveTo(0, -s);
            ctx.quadraticCurveTo(0, 0, s, 0);
            ctx.quadraticCurveTo(0, 0, 0, s);
            ctx.quadraticCurveTo(0, 0, -s, 0);
            ctx.quadraticCurveTo(0, 0, 0, -s);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

        ctx.restore();

        animFrameIdRef.current = requestAnimationFrame(loop);
      };

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    useImperativeHandle(ref, () => ({
      emitBurst: (x: number, y: number, color: string, count: number = 14) => {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 5 + 2;
          const isSpark = Math.random() > 0.4;

          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 1.5,
            size: isSpark ? Math.random() * 6 + 3 : Math.random() * 8 + 4,
            color,
            alpha: 1,
            decay: Math.random() * 0.025 + 0.015,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.25,
            shape: isSpark ? 'sparkle' : 'square',
            gravity: 0.12,
          });
        }
        startAnimationLoop();
      },

      emitComboStars: (x: number, y: number, comboCount: number) => {
        const starCount = Math.min(comboCount * 6 + 10, 36);
        const palette = ['#f59e0b', '#fbbf24', '#f43f5e', '#a855f7', '#38bdf8', '#ffffff'];

        for (let i = 0; i < starCount; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = Math.random() * 7 + 3;
          const color = palette[Math.floor(Math.random() * palette.length)];

          particlesRef.current.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 2.5,
            size: Math.random() * 10 + 5,
            color,
            alpha: 1,
            decay: Math.random() * 0.02 + 0.01,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.3,
            shape: 'sparkle',
            gravity: 0.15,
          });
        }
        startAnimationLoop();
      },

      clear: () => {
        particlesRef.current = [];
        if (animFrameIdRef.current) {
          cancelAnimationFrame(animFrameIdRef.current);
          animFrameIdRef.current = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      },
    }));

    return (
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-30 h-full w-full ${className || ''}`}
      />
    );
  }
);

ParticleCanvas.displayName = 'ParticleCanvas';
