import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User, ShoppingBag, Layers, AlertCircle } from 'lucide-react';
import { aiService, AIChatResponse } from '../../services/aiService';
import { Product } from '../../types';
import { Link } from 'react-router-dom';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  products?: Product[];
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: 'Hello! I am your TechNova AI Shopping Assistant. Ask me anything about our laptops, smartphones, 4K monitors, audio gear, or accessories!',
    },
  ]);

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: prompt.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt('');
    setLoading(true);

    try {
      const res = await aiService.chat(currentPrompt);
      const aiData = res.data;

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiData.response,
        products: aiData.products,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'AI assistance is temporarily unavailable. You can continue browsing TechNova normally using the catalog and filters.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleClick = (sampleText: string) => {
    setPrompt(sampleText);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="w-screen max-w-md bg-white shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-techDark-900 to-brand-900 text-white flex items-center justify-between border-b border-brand-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-amber-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-1.5">
                  TechNova AI Assistant
                </h3>
                <p className="text-[11px] text-brand-200">Grounded on live PostgreSQL store data</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="bg-brand-50/60 p-3 border-b border-brand-100/80 flex items-center gap-2 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[10px] font-bold text-brand-800 uppercase flex-shrink-0">Try:</span>
            <button
              onClick={() => handleSampleClick('I need a laptop for programming under ₹80,000')}
              className="whitespace-nowrap bg-white hover:bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200 text-xs transition-colors"
            >
              Laptop under ₹80k
            </button>
            <button
              onClick={() => handleSampleClick('Show me noise canceling headphones')}
              className="whitespace-nowrap bg-white hover:bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200 text-xs transition-colors"
            >
              ANC Headphones
            </button>
            <button
              onClick={() => handleSampleClick('Compare Apple iPhone 16 Pro Max and Samsung S24 Ultra')}
              className="whitespace-nowrap bg-white hover:bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full border border-brand-200 text-xs transition-colors"
            >
              Flagship Compare
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className={`max-w-[85%] space-y-3`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : 'bg-white border border-gray-200 text-gray-800 shadow-sm rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Grounded Products Carousel / Grid */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Recommended Products:</p>
                      <div className="space-y-2">
                        {msg.products.map((prod) => (
                          <Link
                            key={prod.id}
                            to={`/products/${prod.id}`}
                            onClick={onClose}
                            className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-200 hover:border-brand-500 shadow-sm transition-all group"
                          >
                            <img
                              src={prod.images?.[0] || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=200'}
                              alt={prod.name}
                              className="w-12 h-12 object-contain bg-gray-50 rounded-lg p-1"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-xs text-gray-900 truncate group-hover:text-brand-600">
                                {prod.name}
                              </h5>
                              <p className="text-xs font-bold text-brand-600">
                                ₹{prod.price?.toLocaleString('en-IN')}
                              </p>
                            </div>
                            <ShoppingBag className="w-4 h-4 text-gray-400 group-hover:text-brand-600 flex-shrink-0 mr-1" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-techDark-900 text-white flex items-center justify-center flex-shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-xs text-gray-500 bg-white p-3 rounded-2xl border border-gray-200 w-fit">
                <Bot className="w-4 h-4 text-brand-600 animate-spin" />
                <span>TechNova AI is querying live database data...</span>
              </div>
            )}
          </div>

          {/* Prompt Input Form */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Ask TechNova AI..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || loading}
              className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white p-2.5 rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
