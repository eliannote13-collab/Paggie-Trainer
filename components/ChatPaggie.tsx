
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, TrainerProfile } from '../types';
import { sendChatMessage } from '../services/groqService';

interface Props {
  trainer: TrainerProfile;
  onBack: () => void;
}

export const ChatPaggie: React.FC<Props> = ({ trainer, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'welcome',
        role: 'model',
        text: `Olá, ${trainer.name}! Sou o ChatPAGGIE 🤖.\nEstou aqui para ajudar a montar treinos, periodizações ou adaptar exercícios para alunos com lesões.\n\nComo posso ajudar hoje?`,
        timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        text: inputText,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    const historyForApi = messages.filter(m => m.id !== 'welcome'); 

    const responseText = await sendChatMessage(historyForApi, userMsg.text);

    const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
    }
  };

  // Simple formatting for markdown-like bold/breaks
  const formatMessage = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n/g, '<br />'); // Line breaks
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col z-50 animate-fade-in">
        {/* HEADER */}
        <div className="bg-slate-900 border-b border-slate-800 p-3 sm:p-4 flex items-center justify-between shadow-lg z-10">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
                    🤖
                </div>
                <div>
                    <h2 className="text-white font-bold text-lg leading-none">ChatPAGGIE</h2>
                    <p className="text-indigo-400 text-xs font-medium uppercase tracking-wider">Assistente Inteligente</p>
                </div>
            </div>
            <button 
                onClick={onBack}
                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors"
            >
                Fechar
            </button>
        </div>

        {/* MESSAGES AREA */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950 custom-scrollbar pb-32">
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                        className={`max-w-[85%] sm:max-w-[70%] rounded-2xl p-3 sm:p-4 shadow-md text-sm sm:text-base leading-relaxed ${
                            msg.role === 'user' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                        }`}
                    >
                        <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }} />
                        <div className={`text-[10px] mt-2 opacity-50 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>
                </div>
            ))}
            
            {isLoading && (
                <div className="flex justify-start">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* INPUT AREA - Fixed to bottom with safe area support */}
        <div className="bg-slate-900 border-t border-slate-800 p-2 sm:p-4 fixed bottom-0 left-0 right-0 z-20 safe-area-bottom">
            <div className="max-w-4xl mx-auto relative flex items-end gap-2">
                <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Descreva o caso do aluno..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none min-h-[50px] max-h-[120px]"
                    rows={1}
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !inputText.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all shadow-lg active:scale-95 flex-shrink-0"
                >
                    <svg className="w-6 h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
            </div>
        </div>
    </div>
  );
};
