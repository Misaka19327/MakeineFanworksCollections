import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  className?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, showCloseButton = true, className = '', children }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className={`bg-white dark:bg-warm-900 text-warm-900 dark:text-warm-100 rounded-2xl shadow-2xl border border-warm-100 dark:border-warm-800 overflow-hidden ${className}`}>
          {showCloseButton && (
            <div className="absolute right-3 top-3">
              <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-warm-100 dark:hover:bg-warm-800">✕</button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default Modal;
