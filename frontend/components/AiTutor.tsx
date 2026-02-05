import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { askGeminiTutor } from '../services/geminiService';
import { playSound } from '../utils/sound';

interface AiTutorProps {
  currentContext: string;
}

const AiTutor: React.FC<AiTutorProps> = ({ currentContext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: "Hi! I'm your Marathon Agent. Stuck on a task? Ask me anything!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    playSound('click');
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await askGeminiTutor(userMsg, currentContext);
    
    setMessages(prev => [...prev, { role: 'bot', text: response }]);
    setLoading(false);
    playSound('success');
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all z-50 flex items-center justify-center animate-bounce"
        aria-label="Open AI Tutor"
      >
        <Bot size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-800 rounded-xl shadow-2xl flex flex-col z-50 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="p-4 bg-indigo-600 rounded-t-xl flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Bot size={20} />
          <h3 className="font-bold">Marathon Tutor</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-900">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-500 text-white rounded-br-none' 
                : 'bg-white dark:bg-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-600 rounded-bl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-200 dark:bg-slate-700 p-2 rounded-lg text-xs animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-xl flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiTutor;