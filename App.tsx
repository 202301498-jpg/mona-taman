
import React, { useState, useCallback } from 'react';
import { Industry, Scenario, Difficulty } from './types';
import { INDUSTRIES } from './constants';
import WelcomeScreen from './components/WelcomeScreen';
import IndustrySelection from './components/IndustrySelection';
import DifficultySelection from './components/DifficultySelection';
import GameScreen from './components/GameScreen';

type GameState = 'welcome' | 'industry_select' | 'difficulty_select' | 'in_game' | 'results';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [activeScenarios, setActiveScenarios] = useState<Scenario[]>([]);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [scores, setScores] = useState({ cost: 0, time: 0, risk: 0 });

  const handleStartGame = useCallback(() => {
    setGameState('industry_select');
  }, []);

  const handleSelectIndustry = useCallback((industry: Industry) => {
    setSelectedIndustry(industry);
    setGameState('difficulty_select');
  }, []);

  const handleSelectDifficulty = useCallback((difficulty: Difficulty) => {
    if (!selectedIndustry) return;

    setSelectedDifficulty(difficulty);
    const filteredScenarios = selectedIndustry.scenarios.filter(
      s => s.difficulty === difficulty
    );
    setActiveScenarios(filteredScenarios);
    setCurrentScenarioIndex(0);
    setScores({ cost: 0, time: 0, risk: 0 });
    setGameState('in_game');
  }, [selectedIndustry]);

  const handleBackToIndustrySelect = useCallback(() => {
    setGameState('industry_select');
    setSelectedIndustry(null);
  }, []);

  const handleScenarioComplete = useCallback((cost: number, time: number, risk: number) => {
    setScores(prev => ({
      cost: prev.cost + cost,
      time: prev.time + time,
      risk: prev.risk + risk,
    }));

    if (activeScenarios && currentScenarioIndex < activeScenarios.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setGameState('results');
    }
  }, [activeScenarios, currentScenarioIndex]);
  
  const handleRestart = useCallback(() => {
    setGameState('difficulty_select');
    setCurrentScenarioIndex(0);
    setScores({ cost: 0, time: 0, risk: 0 });
  }, []);

  const handleMainMenu = useCallback(() => {
    setGameState('welcome');
    setSelectedIndustry(null);
    setSelectedDifficulty(null);
    setActiveScenarios([]);
    setCurrentScenarioIndex(0);
    setScores({ cost: 0, time: 0, risk: 0 });
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'welcome':
        return <WelcomeScreen onStart={handleStartGame} />;
      case 'industry_select':
        return <IndustrySelection industries={INDUSTRIES} onSelect={handleSelectIndustry} />;
      case 'difficulty_select':
        return <DifficultySelection industry={selectedIndustry!} onSelect={handleSelectDifficulty} onBack={handleBackToIndustrySelect} />;
      case 'in_game':
        if (selectedIndustry && activeScenarios.length > 0) {
          const scenario = activeScenarios[currentScenarioIndex];
          return (
            <GameScreen
              key={scenario.id}
              scenario={scenario}
              onComplete={handleScenarioComplete}
              currentScenario={currentScenarioIndex + 1}
              totalScenarios={activeScenarios.length}
              scores={scores}
            />
          );
        }
        if (selectedIndustry) {
             return (
                <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center animate-fadeIn">
                    <h2 className="text-2xl font-semibold mb-4 text-white">No Scenarios Available</h2>
                    <p className="text-lg text-brand-text-secondary mb-8 max-w-md">
                        There are no '{selectedDifficulty}' difficulty scenarios for the {selectedIndustry.name} industry at this time.
                    </p>
                    <button onClick={() => setGameState('difficulty_select')} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors duration-300">
                      Choose Another Difficulty
                    </button>
                </div>
            );
        }
        return null;
      case 'results':
        return (
          <div className="flex flex-col items-center justify-center min-h-screen p-4 animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-primary mb-4">Simulation Complete</h1>
            <p className="text-lg text-brand-text-secondary mb-8 text-center max-w-lg">You have completed all {selectedDifficulty} scenarios for the {selectedIndustry?.name} industry.</p>
            <div className="bg-brand-surface border border-brand-border rounded-lg p-6 w-full max-w-md text-center">
              <h2 className="text-2xl font-semibold mb-4 text-white">Final Score</h2>
              <div className="space-y-3 text-left">
                <p className="text-lg"><span className="font-bold text-brand-danger">Total Cost Impact:</span> {scores.cost}%</p>
                <p className="text-lg"><span className="font-bold text-brand-warning">Total Time Delay:</span> {scores.time} days</p>
                <p className="text-lg"><span className="font-bold text-brand-primary">Total Risk Score:</span> {scores.risk} points</p>
              </div>
            </div>
            <div className="mt-8 flex space-x-4">
               <button onClick={handleRestart} className="px-6 py-3 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors duration-300">Play Again</button>
               <button onClick={handleMainMenu} className="px-6 py-3 bg-brand-surface border border-brand-border text-brand-text font-bold rounded-lg hover:bg-brand-border transition-colors duration-300">Main Menu</button>
            </div>
          </div>
        );
      default:
        return <WelcomeScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
