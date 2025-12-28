import { Fragment, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '../../utils/helpers';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
  className?: string;
}

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  className,
}: ModalProps) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Fragment>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className={cn(
                'w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden',
                sizes[size],
                className
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {(title || showClose) && (
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    {title && (
                      <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                      </p>
                    )}
                  </div>
                  {showClose && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="p-2 -mr-2"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  )}
                </div>
              )}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </Fragment>
      )}
    </AnimatePresence>
  );
};

export default Modal;
