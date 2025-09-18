import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative bg-white dark:bg-neutral-900 rounded-3xl shadow-soft-lg border border-neutral-200/60 dark:border-neutral-800/60 max-w-md w-full animate-scale-in',
        className
      )}>
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-neutral-200/60 dark:border-neutral-800/60">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X size={20} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};