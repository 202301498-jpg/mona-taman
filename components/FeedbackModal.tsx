
import React from 'react';
import { ResponseOption } from '../types';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  isScorCorrect: boolean;
  correctScor: string;
  selectedResponse: ResponseOption;
  staticFeedback: string;
  aiFeedback: string;
  isLoadingAI: boolean;
  isLastScenario: boolean;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  isScorCorrect,
  correctScor,
  selectedResponse,
  staticFeedback,
  aiFeedback,
  isLoadingAI,
  isLastScenario,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-brand-surface border border-brand-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brand-primary mb-6">Decision Analysis</h2>

        {/* SCOR Feedback */}
        <div className={`mb-6 p-4 rounded-lg border ${isScorCorrect ? 'bg-green-900/50 border-brand-success' : 'bg-red-900/50 border-brand-danger'}`}>
          <h3 className="text-lg font-semibold flex items-center">
            {isScorCorrect ? (
              <CheckCircleIcon className="w-6 h-6 mr-2 text-brand-success" />
            ) : (
              <XCircleIcon className="w-6 h-6 mr-2 text-brand-danger" />
            )}
            SCOR Process Identification
          </h3>
          <p className="mt-2 text-brand-text-secondary">
            {isScorCorrect
              ? 'Correct! You accurately identified the relevant SCOR stage.'
              : `That's not quite right. The primary stage(s) involved here are: ${correctScor}.`}
          </p>
        </div>

        {/* Response Feedback */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Your Response Impact</h3>
            <div className="mt-2 bg-brand-bg p-4 rounded-lg border border-brand-border">
              <p className="font-semibold text-brand-text">{selectedResponse.text}</p>
              <p className="text-sm text-brand-text-secondary">Cost: <span className="font-bold">{selectedResponse.cost > 0 ? `+${selectedResponse.cost}`: selectedResponse.cost}%</span> | Time: <span className="font-bold">{selectedResponse.time} days</span> | Risk Score: <span className="font-bold">{selectedResponse.risk}</span></p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white">Expert Feedback</h3>
            <p className="mt-2 text-brand-text-secondary bg-brand-bg p-4 rounded-lg border border-brand-border">{staticFeedback}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white">AI Analysis</h3>
            <div className="mt-2 text-brand-text-secondary bg-brand-bg p-4 rounded-lg border border-brand-border min-h-[6rem]">
              {isLoadingAI ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
                </div>
              ) : (
                <p>{aiFeedback}</p>
              )}
            </div>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="mt-8 w-full py-3 px-6 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-secondary transition-colors duration-300"
        >
          {isLastScenario ? 'View Final Score' : 'Continue to Next Scenario'}
        </button>
      </div>
    </div>
  );
};

// SVG Icon Components
const CheckCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);


export default FeedbackModal;
