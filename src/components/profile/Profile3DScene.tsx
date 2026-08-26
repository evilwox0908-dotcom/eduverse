import React, { useEffect, useRef } from 'react';

/**
 * Lightweight 3D Canvas rendering a glowing EduVerse geometric orb
 * with orbital rings and floating particles.
 */
export const Profile3DScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 28;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      // Draw subtle orbital rings
      ctx.save();
      ctx.translate(centerX, centerY);

      // Primary Outer Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, 70, 24, angle * 0.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();

      // Secondary Inner Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, 48, 16, -angle * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();

      // Core Glass Gradient Sphere
      const sphereGrad = ctx.createRadialGradient(
        -8,
        -8,
        2,
        0,
        0,
        28
      );
      sphereGrad.addColorStop(0, 'rgba(191, 219, 254, 0.9)');
      sphereGrad.addColorStop(0.5, 'rgba(59, 130, 246, 0.75)');
      sphereGrad.addColorStop(1, 'rgba(29, 78, 216, 0.85)');

      ctx.beginPath();
      ctx.arc(0, 0, 26, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';
      ctx.shadowBlur = 16;
      ctx.fill();

      // Specular highlight
      ctx.beginPath();
      ctx.arc(-8, -8, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.shadowBlur = 4;
      ctx.fill();

      ctx.restore();

      // Render floating particle dust
      for (const p of particles) {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha})`;
        ctx.fill();
      }

      angle += 0.015;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-none rounded-2xl">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
