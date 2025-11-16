
import React from 'react';
import { Industry } from '../types';

interface IndustrySelectionProps {
  industries: Industry[];
  onSelect: (industry: Industry) => void;
}

const IndustrySelection: React.FC<IndustrySelectionProps> = ({ industries, onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">Select an Industry</h1>
      <p className="text-lg text-brand-text-secondary mb-12 max-w-2xl text-center">
        Each industry presents unique supply chain challenges. Choose a sector to begin your simulation.
      </p>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl"
        style={{ perspective: '1000px' }}
      >
        {industries.map((industry) => (
          <div
            key={industry.id}
            className="group relative cursor-pointer"
            onClick={() => onSelect(industry)}
          >
            <div
              className="relative w-full h-64 rounded-xl bg-brand-surface border border-brand-border p-6 text-white transition-all duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]"
            >
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                <h2 className="text-2xl font-bold text-brand-primary">{industry.name}</h2>
                <p className="mt-2 text-brand-text-secondary">{industry.description}</p>
              </div>
              <div
                className="absolute inset-0 h-full w-full rounded-xl bg-brand-bg px-6 py-4 text-center text-slate-200 [transform:rotateY(180deg)] [backface-visibility:hidden]"
              >
                <div className="flex min-h-full flex-col items-center justify-center">
                   <p className="text-lg">Start simulation for</p>
                  <p className="text-2xl font-bold text-brand-primary">{industry.name}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndustrySelection;
