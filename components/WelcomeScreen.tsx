
import React from 'react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      <h1 className="text-5xl md:text-7xl font-bold text-brand-primary mb-4">SCOR-RISK</h1>
      <h2 className="text-2xl md:text-3xl font-light text-brand-text mb-8">The 3D Supply Chain Simulation</h2>
      <p className="max-w-2xl text-lg text-brand-text-secondary mb-12">
        Navigate complex supply chain risks across different industries. Analyze scenarios, make critical decisions, and master the SCOR model in an interactive environment.
      </p>
      <button
        onClick={onStart}
        className="px-10 py-4 bg-brand-primary text-white font-bold rounded-lg text-xl hover:bg-brand-secondary transition-transform transform hover:scale-105 duration-300 animate-pulse"
      >
        Begin Simulation
      </button>
    </div>
  );
};

// Helper for grid background
const BgPattern: React.FC = () => (
    <div className="absolute inset-0 z-[-1] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#30363D_1px,transparent_1px)] [background-size:24px_24px]"></div>
    </div>
)


export default WelcomeScreen;
