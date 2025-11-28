import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ label, value, options, onChange, className = '', icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const width = Math.max(rect.width, 180);
      
      let left = rect.left;
      if (left + width > viewportWidth - 10) {
         left = Math.max(10, viewportWidth - width - 10);
      }

      setCoords({
        top: rect.bottom + 8,
        left: left,
        width: width,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedLabel = options.find(opt => opt.value === value)?.label || label;

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex-shrink-0 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all w-full md:w-auto justify-between md:justify-start ${className} ${
          isOpen || (value !== '' && value !== 'all' && value !== 'All')
            ? 'border-warm-800 bg-warm-100 text-warm-900 ring-1 ring-warm-800/20 dark:bg-warm-800 dark:text-warm-100 dark:border-warm-600'
            : 'border-warm-200 bg-white text-warm-700 hover:bg-warm-50 hover:border-warm-300 dark:bg-warm-800 dark:border-warm-700 dark:text-warm-300 dark:hover:bg-warm-700'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          {icon && <span className="opacity-70 flex-shrink-0">{icon}</span>}
          <span className="truncate max-w-[120px]">{selectedLabel}</span>
        </div>
        <ChevronDown size={14} className={`flex-shrink-0 opacity-50 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            zIndex: 9999,
          }}
          className="overflow-hidden rounded-xl bg-white dark:bg-warm-900 p-1 shadow-xl ring-1 ring-warm-900/5 dark:ring-white/10 transition-opacity duration-100"
        >
          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
             {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  value === option.value
                    ? 'bg-warm-100/50 dark:bg-warm-800 text-warm-900 dark:text-white font-medium'
                    : 'text-warm-700 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-warm-800'
                }`}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={14} className="text-primary-700 dark:text-primary-400" />}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};