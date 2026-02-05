import React, { useState, useEffect } from 'react';
import { Moon, Sun, Volume2, Paperclip, Check, ChevronDown, ChevronUp, Trophy, BookOpen, AlertTriangle, Loader2, Sparkles, ArrowRight, RefreshCw } from 'lucide-react';
import { Task, DayPlan, UserState } from './types';
import { playSound, speakText } from './utils/sound';
import { generateCurriculum } from './services/geminiService';
import QuizModal from './components/QuizModal';
import AiTutor from './components/AiTutor';

// Initial state
const INITIAL_STATE: UserState = {
  currentDay: 1,
  completedTaskIds: [],
  quizScores: {},
  attachments: {},
  streak: 0,
  darkMode: false,
  weakAreas: []
};

export default function App() {
  const [state, setState] = useState<UserState>(() => {
    const saved = localStorage.getItem('marathonState');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  
  // Setup State
  const [inputTopic, setInputTopic] = useState('');
  const [inputDays, setInputDays] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('marathonState', JSON.stringify(state));
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  const toggleTask = (taskId: string) => {
    setExpandedTask(expandedTask === taskId ? null : taskId);
    playSound('click');
  };

  const completeTask = (taskId: string) => {
    if (!state.completedTaskIds.includes(taskId)) {
      setState(prev => ({
        ...prev,
        completedTaskIds: [...prev.completedTaskIds, taskId]
      }));
      playSound('success');
    }
  };

  const handleFileUpload = (taskId: string, fileName: string) => {
    setState(prev => ({
      ...prev,
      attachments: { ...prev.attachments, [taskId]: fileName }
    }));
    playSound('click');
  };

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, darkMode: !prev.darkMode }));
    playSound('click');
  };

  const handleDayCompletion = (score: number) => {
    if (!state.curriculum) return;
    
    const currentDayPlan = state.curriculum.find(d => d.day === state.currentDay);
    if (!currentDayPlan) return;

    const isPassing = score / currentDayPlan.quiz.length >= 0.7;
    const nextDay = state.currentDay < (state.curriculum.length) ? state.currentDay + 1 : state.currentDay;
    
    setState(prev => ({
      ...prev,
      quizScores: { ...prev.quizScores, [prev.currentDay]: score },
      streak: prev.streak + 1,
      currentDay: nextDay,
      weakAreas: isPassing ? prev.weakAreas : [...prev.weakAreas, `Day ${prev.currentDay} Review Needed`]
    }));
    setShowQuiz(false);
  };

  const handleGenerate = async () => {
    if (!inputTopic.trim()) return;
    
    setIsGenerating(true);
    setGenerationError(null);
    playSound('click');

    try {
      const plan = await generateCurriculum(inputTopic, inputDays);
      setState(prev => ({
        ...prev,
        topic: inputTopic,
        curriculum: plan,
        currentDay: 1,
        completedTaskIds: [],
        weakAreas: [],
        quizScores: {}
      }));
      playSound('complete'); // Celebration sound for start
    } catch (err) {
      console.error(err);
      setGenerationError("Failed to generate curriculum. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    if (window.confirm("This will delete your current progress and curriculum. Are you sure?")) {
      setState(INITIAL_STATE);
      localStorage.removeItem('marathonState');
    }
  };

  // --------------------------------------------------------------------------
  // SETUP VIEW
  // --------------------------------------------------------------------------
  if (!state.curriculum) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${state.darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
        
        {/* Dark Mode Toggle Absolute */}
        <button 
            onClick={toggleDarkMode}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
        >
          {state.darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <div className="bg-indigo-600 p-8 text-center">
             <div className="mx-auto bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                <Trophy className="text-white" size={32} />
             </div>
             <h1 className="text-3xl font-bold text-white mb-2">Marathon Agent</h1>
             <p className="text-indigo-100">Design your intensive learning path</p>
          </div>

          <div className="p-8">
            {generationError && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200 rounded-xl text-sm flex items-center gap-2">
                <AlertTriangle size={16} className="shrink-0" />
                {generationError}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  What do you want to learn?
                </label>
                <input
                  type="text"
                  value={inputTopic}
                  onChange={(e) => setInputTopic(e.target.value)}
                  placeholder="e.g. Node.js, Pottery, Quantum Physics..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white transition-all"
                  disabled={isGenerating}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                  Duration: {inputDays} Days
                </label>
                <input
                  type="range"
                  min="1"
                  max="7"
                  value={inputDays}
                  onChange={(e) => setInputDays(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  disabled={isGenerating}
                />
                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                  <span>1 Day</span>
                  <span>7 Days</span>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputTopic.trim()}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Designing Curriculum...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Start Marathon
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN APP VIEW
  // --------------------------------------------------------------------------
  
  // Safe check if curriculum exists (it should due to the guard clause above)
  const currentDayPlan: DayPlan = state.curriculum.find(d => d.day === state.currentDay) || state.curriculum[0];
  const completedToday = currentDayPlan.tasks.filter(t => state.completedTaskIds.includes(t.id)).length;
  const isDayFinished = completedToday === currentDayPlan.tasks.length;
  const totalDays = state.curriculum.length;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${state.darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-40 border-b border-slate-100 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="bg-indigo-600 text-white p-2 rounded-lg font-bold shadow-sm">
                MA
             </div>
             <div>
                <h1 className="text-lg md:text-xl font-bold text-slate-800 dark:text-white leading-tight">
                  {state.topic || 'Learning'} Marathon
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Day {state.currentDay} of {totalDays}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs md:text-sm font-semibold">
              <Trophy size={14} />
              <span className="hidden md:inline">{state.streak} Day Streak</span>
              <span className="md:hidden">{state.streak}</span>
            </div>
            
            <button 
              onClick={resetApp}
              className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-colors"
              title="Reset Progress"
            >
              <RefreshCw size={18} />
            </button>

            <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                aria-label="Toggle Dark Mode"
            >
              {state.darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Day Header */}
        <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-wider text-xs md:text-sm uppercase bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">
                  Day {currentDayPlan.day}
                </span>
                <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                    {completedToday} / {currentDayPlan.tasks.length} Tasks
                </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">{currentDayPlan.title}</h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{currentDayPlan.description}</p>
            
            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mt-6 overflow-hidden">
                <div 
                    className="h-full bg-indigo-600 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    style={{ width: `${(completedToday / currentDayPlan.tasks.length) * 100}%` }}
                />
            </div>
            
            {state.weakAreas.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl flex items-start gap-3">
                    <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                    <div className="text-sm text-red-800 dark:text-red-200">
                        <strong>Focus Area:</strong> Based on previous quizzes, prioritize reviewing: {state.weakAreas.join(', ')}
                    </div>
                </div>
            )}
        </div>

        {/* Task List */}
        <div className="space-y-4">
            {currentDayPlan.tasks.map((task, index) => {
                const isCompleted = state.completedTaskIds.includes(task.id);
                const isExpanded = expandedTask === task.id;
                const hasAttachment = state.attachments[task.id];

                return (
                    <div 
                        key={task.id} 
                        className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-300 ${
                            isCompleted 
                            ? 'border-green-200 dark:border-green-900 shadow-sm' 
                            : isExpanded 
                                ? 'border-indigo-500 dark:border-indigo-500 shadow-md ring-1 ring-indigo-500 dark:ring-indigo-400' 
                                : 'border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700'
                        }`}
                    >
                        {/* Task Header */}
                        <div 
                            onClick={() => toggleTask(task.id)}
                            className="p-5 flex items-center justify-between cursor-pointer group"
                        >
                            <div className="flex items-center gap-4 overflow-hidden">
                                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                    isCompleted 
                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 scale-110' 
                                    : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600'
                                }`}>
                                    {isCompleted ? <Check size={18} /> : index + 1}
                                </div>
                                <h3 className={`font-semibold text-lg truncate pr-4 ${isCompleted ? 'text-slate-500 line-through decoration-2 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                                    {task.title}
                                </h3>
                            </div>
                            <div className={`text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        </div>

                        {/* Task Details (Expandable) */}
                        <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                            <div className="px-5 pb-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                                <div className="flex justify-between items-start mb-4">
                                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm md:text-base">
                                        {task.description}
                                    </p>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); speakText(task.description); }}
                                        className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ml-2 p-1"
                                        title="Read aloud"
                                    >
                                        <Volume2 size={20} />
                                    </button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Learning Outcome</div>
                                        <p className="text-sm text-slate-700 dark:text-slate-200">{task.learningOutcome}</p>
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                        <div className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider mb-1">Evaluation</div>
                                        <p className="text-sm text-slate-700 dark:text-slate-200">{task.evaluationMethod}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resources</div>
                                    <div className="flex flex-wrap gap-2">
                                        {task.resources.map((res, i) => (
                                            <a 
                                                key={i} 
                                                href={res.url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-xs bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-2 rounded-md hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-800"
                                            >
                                                <BookOpen size={14} />
                                                {res.title}
                                            </a>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                                    {/* Attachment Section */}
                                    <div className="w-full sm:w-auto">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-500 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800">
                                            <Paperclip size={18} />
                                            <span className="truncate max-w-[200px]">
                                                {hasAttachment ? `Attached: ${hasAttachment}` : "Attach Screenshot / File"}
                                            </span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) {
                                                        handleFileUpload(task.id, e.target.files[0].name);
                                                    }
                                                }}
                                            />
                                        </label>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => completeTask(task.id)}
                                        disabled={isCompleted}
                                        className={`w-full sm:w-auto px-6 py-2.5 rounded-lg font-bold shadow-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                                            isCompleted 
                                            ? 'bg-green-100 text-green-700 cursor-default dark:bg-green-900 dark:text-green-300 border border-green-200 dark:border-green-800' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-500/20'
                                        }`}
                                    >
                                        {isCompleted ? (
                                          <>
                                            <Check size={18} /> Well Done!
                                          </>
                                        ) : "Mark Complete"}
                                    </button>
                                </div>
                            </div>
                          </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* End of Day Button */}
        <div className="mt-8 flex justify-center">
            <button
                disabled={!isDayFinished}
                onClick={() => setShowQuiz(true)}
                className={`px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center gap-2 ${
                    isDayFinished 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 hover:shadow-indigo-500/50 animate-pulse cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                }`}
            >
                {state.currentDay === totalDays && isDayFinished ? "Finish Course" : "Unlock Daily Quiz"}
                {isDayFinished && <ArrowRight size={20} />}
            </button>
        </div>

        {/* Quiz Modal */}
        {showQuiz && (
            <QuizModal 
                questions={currentDayPlan.quiz} 
                onClose={() => setShowQuiz(false)}
                onComplete={handleDayCompletion}
            />
        )}

        {/* AI Tutor */}
        <AiTutor currentContext={currentDayPlan.title + ": " + currentDayPlan.description} />
      </main>
    </div>
  );
}