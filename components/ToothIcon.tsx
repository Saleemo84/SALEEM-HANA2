import React from 'react';
import { STATUS_CONFIG } from '../constants';
import type { ToothData } from '../types';

interface ToothIconProps {
  id: string;
  toothData: ToothData;
  onClick: (id: string) => void;
  position: 'upper' | 'lower';
}

const ToothIcon: React.FC<ToothIconProps> = ({ id, toothData, onClick, position }) => {
    const config = STATUS_CONFIG[toothData.status] || STATUS_CONFIG['healthy'];
    const hasNote = toothData.note && toothData.note.trim().length > 0;

    const strokeColor = toothData.status === 'healthy' ? '#9CA3AF' : '#4B5563'; // Use a consistent dark border for colored teeth
    const textColorClass = ['healthy', 'crown', 'veneer'].includes(toothData.status) ? 'text-gray-800' : 'text-white';
    
    if (toothData.status === 'missing') {
        return (
            <div 
                className="w-10 h-14 md:w-11 md:h-16 flex items-center justify-center" 
                aria-label={`Tooth ${id}, status: missing`}
            >
                <span className="text-gray-400 font-semibold">-</span>
            </div>
        );
    }

    return (
        <button
            onClick={() => onClick(id)}
            className="relative w-10 h-14 md:w-11 md:h-16 flex items-center justify-center rounded-md transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary group"
            aria-label={`Tooth ${id}, status: ${config.label}${hasNote ? ', has notes' : ''}`}
        >
            <svg
                viewBox="0 0 24 30"
                className="w-full h-full"
                style={{ transform: position === 'lower' ? 'rotate(180deg)' : 'none' }}
            >
                <path
                    d="M4 14 C 2 10 3 4 8 4 C 10 4 11 2 12 2 C 13 2 14 4 16 4 C 21 4 22 10 20 14 C 22 18 20 28 16 28 C 14 28 14 24 12 24 C 10 24 10 28 8 28 C 4 28 2 18 4 14 Z"
                    fill={config.hex}
                    stroke={strokeColor}
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
            <span 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-xs pointer-events-none ${textColorClass}`}
                 style={{ textShadow: textColorClass === 'text-white' ? '0px 0px 3px rgba(0,0,0,0.6)' : 'none' }}
            >
                {id}
            </span>
            {hasNote && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-white shadow-md animate-pulseNote" title="Has notes"></span>}
        </button>
    );
};

export default ToothIcon;