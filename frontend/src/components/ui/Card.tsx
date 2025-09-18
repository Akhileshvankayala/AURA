import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, hover = false }) => {
  return (
    <div
      className={cn(
        'bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-soft',
        hover && 'hover:shadow-soft-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};