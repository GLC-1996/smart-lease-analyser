'use client';

import { useState } from 'react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  icon?: string;
  badge?: {
    text: string;
    color: string;
  };
}

export default function Accordion({ 
  title, 
  children, 
  defaultOpen = false,
  icon,
  badge 
}: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center">
          {icon && <span className="text-xl mr-2">{icon}</span>}
          <span className="font-medium text-gray-900">{title}</span>
          {badge && (
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
              {badge.text}
            </span>
          )}
        </div>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      <div className={`transition-all duration-200 ease-in-out ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-3 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
} 