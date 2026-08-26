import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hoverEffect = true,
  ...props
}) => {
  return (
    <motion.div
      whileHover={
        hoverEffect
          ? {
              y: -4,
              scale: 1.01,
              boxShadow: '0 20px 40px -12px rgba(30, 58, 138, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
              borderColor: 'rgba(191, 219, 254, 0.9)',
            }
          : undefined
      }
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className={`glass-card rounded-2xl relative overflow-hidden transition-colors ${className}`}
      {...props}
    >
      {/* Delicate inner light sheen */}
      <div className="pointer-events-none absolute -inset-px rounded-2xl border border-white/60 bg-gradient-to-b from-white/40 via-transparent to-transparent opacity-90" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};
