import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
const skeletonProps = {
  preserveAspectRatio: 'none',
  backgroundColor: '#a6a6a6',
  foregroundColor: '#ededed',
} as const;
type SkeletonProps = typeof skeletonProps;
export const SkeletonWrapper: React.FC<{
  children: (skeletonProps: SkeletonProps) => JSX.Element;
  className: string;
}> = ({ children, className }) => {
  return (
    <AnimatePresence>
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {children(skeletonProps)}
      </motion.div>
    </AnimatePresence>
  );
};
