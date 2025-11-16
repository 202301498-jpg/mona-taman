
import React, { useMemo } from 'react';
import { Industry, Difficulty } from '../types';

interface DifficultySelectionProps {
  industry: Industry;
  onSelect: (difficulty: Difficulty) => void;
  onBack: () => void;
}

const difficultyConfig = {
  [Difficulty.EASY]: {
    color: 'brand-success',
    description: 'Familiar challenges with clearer outcomes.',
  },
  [Difficulty.MEDIUM]: {
    color: 'brand-warning',
    description: 'Complex situations with multiple trade-offs.',
  },
  [Difficulty.HARD]: {
    color: 'brand-danger',
    description: 'High-stakes scenarios with severe consequences.',
  },
};


const DifficultySelection: React.FC<DifficultySelectionProps> = ({ industry, onSelect, onBack }) => {
  const availableDifficulties = useMemo(() => {
    const difficulties = new Set(industry.scenarios.map(s => s.difficulty));
    return {
      easy: difficulties.has(Difficulty.EASY),
      medium: difficulties.has(Difficulty.MEDIUM),
      hard: difficulties.has(Difficulty.HARD),
    };
  }, [industry]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8 animate-fadeIn">
      <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">Select Difficulty</h1>
      <p className="text-lg text-brand-text-secondary mb-12 max-w-2xl text-center">
        You've chosen the <span className="font-bold text-white">{industry.name}</span> industry. Now, select the level of challenge you want to face.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mb-12">
        {(Object.keys(difficultyConfig) as Difficulty[]).map(level => {
          const config = difficultyConfig[level];
          const isAvailable = availableDifficulties[level.toLowerCase() as keyof typeof availableDifficulties];
          
          return (
            <button
              key={level}
              onClick={() => onSelect(level)}
              disabled={!isAvailable}
              className={`flex flex-col items-center justify-center p-6 border rounded-xl transition-all duration-300 transform hover:-translate-y-2 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none bg-brand-surface border-brand-border hover:border-${config.color} hover:shadow-2xl hover:shadow-${config.color}/20`}
            >
              <h2 className={`text-3xl font-bold text-${config.color}`}>{level}</h2>
              <p className="mt-2 text-brand-text-secondary text-center">{config.description}</p>
              {!isAvailable && <p className="mt-4 text-xs text-brand-text-secondary">(No scenarios available)</p>}
            </button>
          )
        })}
      </div>

      <button onClick={onBack} className="px-6 py-2 bg-brand-surface border border-brand-border text-brand-text font-bold rounded-lg hover:bg-brand-border transition-colors duration-300">
        Back to Industries
      </button>
    </div>
  );
};

export default DifficultySelection;
