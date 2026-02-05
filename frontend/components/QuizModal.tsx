import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { playSound } from '../utils/sound';

interface QuizModalProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onClose: () => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, onComplete, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    
    if (idx === questions[currentIndex].correctAnswer) {
      setScore(s => s + 1);
      playSound('success');
    } else {
      playSound('click'); // Or a gentle error sound
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      playSound('complete');
    }
  };

  const finish = () => {
    onComplete(score);
    onClose();
  };

  if (showResult) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">Day Complete!</h2>
          <div className="text-6xl mb-4">
            {percentage >= 70 ? '🎉' : '📚'}
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            You scored {score} out of {questions.length}
          </p>
          {percentage < 70 && (
             <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-lg mb-6 flex items-start gap-2 text-left">
                <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                    Suggestion: Review today's resources before moving to tomorrow.
                </p>
             </div>
          )}
          <button 
            onClick={finish}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all"
          >
            Finish Day
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">
                Question {currentIndex + 1} / {questions.length}
            </h3>
        </div>

        <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>

        <div className="space-y-3 mb-8">
          {currentQ.options.map((opt, idx) => {
            let btnClass = "w-full p-4 rounded-xl border-2 text-left transition-all font-medium ";
            if (isAnswered) {
                if (idx === currentQ.correctAnswer) btnClass += "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300";
                else if (idx === selectedOption) btnClass += "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300";
                else btnClass += "border-slate-200 dark:border-slate-700 opacity-50";
            } else {
                btnClass += "border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(idx)}
                className={btnClass}
                disabled={isAnswered}
              >
                <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {isAnswered && idx === currentQ.correctAnswer && <CheckCircle size={20} className="text-green-600" />}
                </div>
              </button>
            );
          })}
        </div>

        {isAnswered && (
            <div className="flex justify-end">
                 <button 
                    onClick={handleNext}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
                  >
                    {currentIndex === questions.length - 1 ? "Show Results" : "Next Question"}
                  </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default QuizModal;