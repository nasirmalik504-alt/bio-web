import React, { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let outerX = -100;
    let outerY = -100;
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }

      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button';

      if (outerRef.current) {
        if (isInteractive) {
          outerRef.current.classList.add('scale-125', 'bg-[#6EA8FE]/20', 'border-[#6EA8FE]/50');
        } else {
          outerRef.current.classList.remove('scale-125', 'bg-[#6EA8FE]/20', 'border-[#6EA8FE]/50');
        }
      }
    };

    const render = () => {
      outerX += (mouseX - outerX) * 0.25;
      outerY += (mouseY - outerY) * 0.25;

      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outerX}px, ${outerY}px, 0) translate(-50%, -50%)`;
      }

      animId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      {/* Outer Ring - Highest Z-Index z-[10000] */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 w-8 h-8 bg-[#6EA8FE]/10 border border-[#6EA8FE]/30 rounded-full pointer-events-none z-[10000] transition-all duration-150 ease-out"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />

      {/* Inner Precision Dot - Highest Z-Index z-[10000] */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[#6EA8FE] rounded-full pointer-events-none z-[10000]"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </>
  );
};
