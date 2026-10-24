import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ValidationAlertProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export const ValidationAlert: React.FC<ValidationAlertProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-sm w-full shadow-2xl border border-red-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mb-5 shadow-sm">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          
          <h3 className="text-xl font-black text-[#0F172A] tracking-tight mb-2">
            Error
          </h3>
          
          <p className="text-sm font-medium text-red-600 bg-red-50/50 p-4 rounded-xl border border-red-100/50 mb-6 leading-relaxed w-full">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all cursor-pointer shadow-sm"
          >
            OK, I Understand
          </button>
        </div>
      </div>
    </div>
  );
};