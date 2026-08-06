import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoading(false);
            onComplete();
          }, 150);
          return 100;
        }
        return prev + 25;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }}
          className="fixed inset-0 z-100 bg-[#FAFBFD] flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Animated Soft DNA Visualizer */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            <div className="flex gap-2 items-center">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-10, 10, -10],
                    backgroundColor: i % 2 === 0 ? ['#F28B82', '#6EA8FE', '#F28B82'] : ['#6EA8FE', '#F28B82', '#6EA8FE']
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: 'easeInOut'
                  }}
                  className="w-2 h-6 rounded-full"
                />
              ))}
            </div>
          </div>

          {/* Logo Title - BIO (RED) BUSINESS (BLUE) */}
          <div className="text-center mb-4">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-display leading-none">
              <span className="text-[#F28B82]">BIO</span>
              <span className="text-[#6EA8FE]">BUSINESS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#9AA7BC] mt-1 font-mono">
              Scientific Development Agency
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="w-56 h-1.5 bg-[#E6ECF5] rounded-full overflow-hidden p-0.5 border border-[#CDD8E7]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#F28B82] to-[#6EA8FE] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.05 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
