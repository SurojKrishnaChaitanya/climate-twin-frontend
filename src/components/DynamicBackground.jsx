import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function DynamicBackground() {
  const canvasRef = useRef(null);
  const { activeVariable, committedDeltaTemp, committedDeltaRain, isLoading } = useSelector((state) => state.climate);
  
  const isSimulationActive = committedDeltaTemp !== 0 || committedDeltaRain !== 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const numParticles = 75;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      length: Math.random() * 50 + 20,
      speed: Math.random() * 0.6 + 0.3,
      opacity: Math.random() * 0.4 + 0.15
    }));

    const getThemeColors = () => {
      if (isLoading) return 'rgba(148, 163, 184, '; // Cool slate lines when network is thinking
      if (activeVariable === 'lst_celsius') {
        return isSimulationActive ? 'rgba(239, 68, 68, ' : 'rgba(34, 211, 238, ';
      }
      if (activeVariable === 'sst_celsius') {
        return 'rgba(167, 139, 250, ';
      }
      return 'rgba(59, 130, 246, ';
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const baseColor = getThemeColors();

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.strokeStyle = `${baseColor}${p.opacity})`;
        ctx.lineWidth = 1.5;
        
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y + (activeVariable.includes('temp') ? 0 : Math.sin(p.x * 0.01) * 5));
        ctx.stroke();

        // Accelerate pacing loops if simulation configurations are committed
        p.x += p.speed * (isSimulationActive ? 2.5 : 1) * (isLoading ? 0.5 : 1);

        if (p.x > canvas.width) {
          p.x = -p.length;
          p.y = Math.random() * canvas.height;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeVariable, isSimulationActive, isLoading]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-10 mix-blend-screen"
    />
  );
}