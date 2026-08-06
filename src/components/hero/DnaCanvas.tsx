import React, { useEffect, useRef } from 'react';

export const DnaCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    let mouseX = width * 0.7;
    let mouseY = height * 0.5;

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const numPairs = 24; // Optimized pair count for smooth 60fps
    const radius = Math.min(width, height) * 0.16;
    let angleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width * 0.72;
      const centerY = height * 0.5;

      angleOffset += 0.008;

      const offsetX = (mouseX - width / 2) * 0.015;
      const offsetY = (mouseY - height / 2) * 0.015;

      for (let i = 0; i < numPairs; i++) {
        const yFrac = i / numPairs - 0.5;
        const y = centerY + yFrac * (height * 0.8);

        const currentAngle = angleOffset + yFrac * Math.PI * 3;

        const x1 = centerX + Math.cos(currentAngle) * radius + offsetX;
        const z1 = Math.sin(currentAngle) * radius;

        const x2 = centerX + Math.cos(currentAngle + Math.PI) * radius + offsetX;
        const z2 = Math.sin(currentAngle + Math.PI) * radius;

        const scale1 = (z1 + radius * 2) / (radius * 3);
        const scale2 = (z2 + radius * 2) / (radius * 3);

        // Base connecting strand
        ctx.beginPath();
        ctx.moveTo(x1, y + offsetY);
        ctx.lineTo(x2, y + offsetY);
        ctx.strokeStyle = 'rgba(110, 168, 254, 0.15)';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node 1 (Soft Blue)
        ctx.beginPath();
        ctx.arc(x1, y + offsetY, Math.max(2, 4 * scale1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(110, 168, 254, ${0.4 + scale1 * 0.5})`;
        ctx.fill();

        // Node 2 (Soft Coral)
        ctx.beginPath();
        ctx.arc(x2, y + offsetY, Math.max(2, 4 * scale2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(242, 139, 130, ${0.4 + scale2 * 0.5})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10 w-full h-full opacity-60"
    />
  );
};
