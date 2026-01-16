import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
}

// Context to share state between Select components
const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  displayValue: string;
  setDisplayValue: (value: string) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
  displayValue: '',
  setDisplayValue: () => {},
});

export const Select: React.FC<SelectProps> = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState('');

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen, displayValue, setDisplayValue }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger: React.FC<SelectTriggerProps> = ({ id, className = '', children }) => {
  const context = React.useContext(SelectContext);
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={triggerRef}
      id={id}
      type="button"
      className={`flex items-center justify-between ${className}`}
      onClick={() => context.setIsOpen(!context.isOpen)}
    >
      <span className={context.displayValue ? 'text-gray-900' : 'text-gray-400'}>
        {context.displayValue || context.placeholder || 'Select an option'}
      </span>
      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${context.isOpen ? 'rotate-180' : ''}`} />
      {children}
    </button>
  );
};

export const SelectValue: React.FC<SelectValueProps> = ({ placeholder }) => {
  const context = React.useContext(SelectContext);
  
  React.useEffect(() => {
    if (placeholder && context) {
      (context as any).placeholder = placeholder;
    }
  }, [placeholder, context]);
  
  return null;
};

export const SelectContent: React.FC<SelectContentProps> = ({ children }) => {
  const context = React.useContext(SelectContext);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
        const trigger = document.querySelector('[role="combobox"]');
        if (trigger && !trigger.contains(event.target as Node)) {
          context.setIsOpen(false);
        }
      }
    };

    if (context.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [context.isOpen, context]);

  if (!context.isOpen) return null;

  return (
    <div
      ref={contentRef}
      className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg animate-in fade-in-0 zoom-in-95"
    >
      <div className="max-h-[240px] overflow-y-auto p-1">
        {children}
      </div>
    </div>
  );
};

export const SelectItem: React.FC<SelectItemProps> = ({ children, value }) => {
  const context = React.useContext(SelectContext);
  const isSelected = context.value === value;

  const handleClick = () => {
    context.onValueChange?.(value);
    context.setDisplayValue(children as string);
    context.setIsOpen(false);
  };

  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-3 py-2 text-sm outline-none transition-colors hover:bg-blue-50 hover:text-blue-900 ${
        isSelected ? 'bg-blue-100 text-blue-900 font-medium' : 'text-gray-900'
      }`}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default Select
