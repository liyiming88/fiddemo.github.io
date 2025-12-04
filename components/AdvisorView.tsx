import React, { useState, useEffect, useRef } from 'react';
import { FinancialProfile, ChatMessage } from '../types';
import { generateFinancialAdvice, analyzePortfolioHealth } from '../services/geminiService';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';

interface AdvisorViewProps {
  profile: FinancialProfile;
}

const AdvisorView: React.FC<AdvisorViewProps> = ({ profile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'init',
        role: 'model',
        text: `Hello! I'm your PlanView AI assistant. I have access to your current plan (Age: ${profile.currentAge}, Retirement: ${profile.retirementAge}). How can I help you optimize your financial future today?`,
        timestamp: new Date()
      }]);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Convert messages to history format for Gemini
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const responseText = await generateFinancialAdvice(profile, userMsg.text, history);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
       const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm sorry, I encountered an issue connecting to the service.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const runQuickAnalysis = async () => {
      setIsLoading(true);
      const analysisMsg: ChatMessage = {
          id: Date.now().toString(),
          role: 'user',
          text: "Can you analyze my current portfolio health?",
          timestamp: new Date()
      };
      setMessages(prev => [...prev, analysisMsg]);

      const result = await analyzePortfolioHealth(profile);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: result,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
      setIsLoading(false);
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
             <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-fidelity rounded-full flex items-center justify-center text-white">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800">Financial Assistant</h3>
                    <p className="text-xs text-gray-500">Powered by Gemini 2.5</p>
                </div>
             </div>
             <button 
                onClick={runQuickAnalysis}
                disabled={isLoading}
                className="text-xs bg-white border border-fidelity text-fidelity px-3 py-1.5 rounded-full hover:bg-fidelity hover:text-white transition-colors disabled:opacity-50"
             >
                Run Health Check
             </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'} items-start space-x-2`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-fidelity/10 text-fidelity'
                        }`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div 
                            className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                                msg.role === 'user' 
                                    ? 'bg-fidelity text-white rounded-tr-none' 
                                    : 'bg-gray-100 text-gray-800 rounded-tl-none'
                            } ${msg.isError ? 'bg-red-50 text-red-600 border border-red-200' : ''}`}
                        >
                            {msg.text}
                        </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                 <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                        <div className="w-8 h-8 rounded-full bg-fidelity/10 text-fidelity flex items-center justify-center">
                            <Bot size={16} />
                        </div>
                        <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none text-gray-500 flex items-center space-x-2">
                            <Loader2 size={16} className="animate-spin" />
                            <span className="text-xs font-medium">Thinking...</span>
                        </div>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about your retirement, asset allocation, or market trends..."
                    className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-fidelity focus:border-transparent transition-all"
                    disabled={isLoading}
                />
                <button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-2 p-1.5 bg-fidelity text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-fidelity-dark transition-colors"
                >
                    <Send size={18} />
                </button>
            </div>
            <p className="text-center text-[10px] text-gray-400 mt-2">
                AI can make mistakes. Please consult with a certified financial advisor before making investment decisions.
            </p>
        </div>
    </div>
  );
};

export default AdvisorView;
