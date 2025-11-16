
import React, { useState, useCallback } from 'react';
import { Scenario, ResponseOption, SCORProcess, Difficulty } from '../types';
import { getAIFeedback } from '../services/geminiService';
import FeedbackModal from './FeedbackModal';

interface GameScreenProps {
  scenario: Scenario;
  onComplete: (cost: number, time: number, risk: number) => void;
  currentScenario: number;
  totalScenarios: number;
  scores: { cost: number; time: number; risk: number };
}

const SCOR_PROCESSES = Object.values(SCORProcess);

const difficultyColorClass = (difficulty: Difficulty) => {
  switch (difficulty) {
    case Difficulty.EASY:
      return 'bg-green-500/20 text-green-400 border border-green-500/30';
    case Difficulty.MEDIUM:
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    case Difficulty.HARD:
      return 'bg-red-500/20 text-red-400 border border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
  }
};

const GameScreen: React.FC<GameScreenProps> = ({ scenario, onComplete, currentScenario, totalScenarios, scores }) => {
  const [selectedResponse, setSelectedResponse] = useState<ResponseOption | null>(null);
  const [selectedSCOR, setSelectedSCOR] = useState<SCORProcess | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!selectedResponse || !selectedSCOR) return;

    setIsLoadingAI(true);
    setShowFeedback(true);
    const feedback = await getAIFeedback(scenario, selectedResponse);
    setAiFeedback(feedback);
    setIsLoadingAI(false);
  }, [selectedResponse, selectedSCOR, scenario]);

  const handleNext = useCallback(() => {
    if (selectedResponse) {
      onComplete(selectedResponse.cost, selectedResponse.time, selectedResponse.risk);
    }
    setShowFeedback(false);
  }, [selectedResponse, onComplete]);

  const isScorCorrect = selectedSCOR ? scenario.scorStages.includes(selectedSCOR) : false;

  return (
    <>
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col animate-fadeIn">
        <header className="mb-6 flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl md:text-3xl font-bold text-brand-primary">{scenario.title}</h1>
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${difficultyColorClass(scenario.difficulty)}`}>
                {scenario.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-brand-text-secondary mt-1">Scenario {currentScenario} of {totalScenarios}</p>
          </div>
          <div className="flex space-x-4 text-sm bg-brand-surface border border-brand-border rounded-lg p-2">
            <span>Cost: <span className="font-bold text-brand-danger">{scores.cost}%</span></span>
            <span>Time: <span className="font-bold text-brand-warning">{scores.time}d</span></span>
            <span>Risk: <span className="font-bold text-brand-primary">{scores.risk}</span></span>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
          {/* Left Panel: Scenario & SCOR */}
          <div className="bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2 text-white">Situation</h2>
              <p className="text-brand-text-secondary">{scenario.situation}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-white">Impact Details</h3>
              <ul className="list-disc list-inside space-y-1 text-brand-text-secondary">
                {scenario.impacts.map((impact, index) => <li key={index}>{impact}</li>)}
              </ul>
            </div>
            <div className="pt-4 mt-auto">
              <h3 className="text-lg font-semibold mb-4 text-white">Identify the primary SCOR Process Stage(s)</h3>
              <div className="flex flex-wrap gap-2">
                {SCOR_PROCESSES.map(process => (
                  <button
                    key={process}
                    onClick={() => setSelectedSCOR(process)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 border ${
                      selectedSCOR === process
                        ? 'bg-brand-primary border-brand-primary text-white scale-105'
                        : 'bg-brand-bg border-brand-border hover:bg-brand-border hover:border-brand-primary'
                    }`}
                  >
                    {process}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Responses */}
          <div className="bg-brand-surface border border-brand-border rounded-lg p-6 flex flex-col">
             <h2 className="text-xl font-semibold mb-4 text-white">Choose Your Response</h2>
             <div className="space-y-4 flex-grow">
               {scenario.responses.map(res => (
                 <div
                   key={res.id}
                   onClick={() => setSelectedResponse(res)}
                   className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                     selectedResponse?.id === res.id
                       ? 'bg-brand-secondary border-brand-primary shadow-lg scale-[1.02]'
                       : 'bg-brand-bg border-brand-border hover:border-brand-primary hover:bg-brand-surface'
                   }`}
                 >
                   <p className="font-bold text-white">{res.id}. {res.text}</p>
                   <p className="text-sm text-brand-text-secondary mt-1">Impact: {res.impact}</p>
                 </div>
               ))}
             </div>
             <button
               onClick={handleSubmit}
               disabled={!selectedResponse || !selectedSCOR}
               className="mt-6 w-full py-3 px-6 bg-brand-primary text-white font-bold rounded-lg disabled:bg-brand-border disabled:text-brand-text-secondary disabled:cursor-not-allowed hover:bg-brand-secondary transition-colors duration-300"
             >
               Submit Decision
             </button>
          </div>
        </main>
      </div>

      {showFeedback && selectedResponse && (
        <FeedbackModal
          isOpen={showFeedback}
          onClose={handleNext}
          isScorCorrect={isScorCorrect}
          correctScor={scenario.scorStages.join(', ')}
          selectedResponse={selectedResponse}
          staticFeedback={scenario.feedback}
          aiFeedback={aiFeedback}
          isLoadingAI={isLoadingAI}
          isLastScenario={currentScenario === totalScenarios}
        />
      )}
    </>
  );
};

export default GameScreen;
