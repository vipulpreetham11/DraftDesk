import React from 'react';
import { PlusCircle } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const EmptyState: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        
        {/* Placeholder Illustration */}
        <div className="relative w-full max-w-[240px] aspect-square mb-8">
          <div className="w-full h-full bg-warm-100 rounded-3xl border-2 border-dashed border-warm-200 flex items-center justify-center">
             <div className="text-warm-300">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
             </div>
          </div>
          {/* Subtle atmosphere effect */}
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-coral-400 opacity-[0.08] blur-[40px] rounded-full"></div>
        </div>

        {/* Messaging */}
        <h3 className="font-heading text-2xl font-bold text-charcoal mb-2">No scripts yet.</h3>
        <p className="font-body text-base text-warm-500 mb-8">Let's create your first one.</p>

        {/* CTA */}
        <button 
          onClick={() => navigate('/new')}
          className="flex items-center justify-center gap-2 bg-coral-400 hover:bg-coral-600 text-white px-8 py-3.5 rounded-[10px] font-body text-base font-semibold transition-all transform active:scale-[0.98] shadow-md shadow-coral-400/20"
        >
          <PlusCircle className="w-5 h-5" />
          Create your first script
        </button>

        {/* Micro-hint */}
        <div className="mt-12 pt-6 border-t border-warm-200 w-full">
          <p className="font-body text-sm text-warm-400 italic">
            Drafting ideas, planning schedules, and organizing content starts here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
