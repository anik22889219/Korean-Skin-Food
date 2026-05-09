import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product } from '../types';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    api.getProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await geminiService.getChatResponse(userMessage, history, products, user);
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-[#efeae2] w-[90vw] sm:w-[400px] h-[550px] rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden mb-4 relative"
          >
            {/* WhatsApp Header */}
            <div className="bg-[#008069] p-4 flex justify-between items-center text-white z-10 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop" 
                    alt="Sabiha" 
                    className="w-10 h-10 rounded-full object-cover border border-white/20"
                  />
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#25D366] border border-[#008069] rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-bold text-[15px]">সাবিহা</h3>
                  <p className="text-[11px] opacity-90">Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 z-10" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: 'contain', opacity: 0.95 }}>
              {messages.length === 0 && (
                <div className="text-center py-6 space-y-3">
                  <div className="inline-block bg-[#FFEECD] text-[#54432A] text-[11px] px-3 py-1.5 rounded-lg shadow-sm font-semibold mb-4">
                    Today
                  </div>
                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-gray-800 text-left max-w-[85%] relative">
                    <span className="absolute top-0 -left-[8px] border-[8px] border-transparent border-t-white"></span>
                    আসসালামু আলাইকুম! আমি সাবিহা, আপনার কোরিয়ান স্কিনকেয়ার কনসালট্যান্ট। একদম গ্লাস স্কিন পেতে আমি আপনাকে সাহায্য করতে পারি।
                    <div className="text-[10px] text-gray-400 text-right mt-1">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`relative max-w-[85%] p-2.5 rounded-xl shadow-sm text-[14.5px] leading-snug ${
                    m.role === 'user' 
                      ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none' 
                      : 'bg-white text-gray-900 rounded-tl-none'
                  }`}>
                    {m.role === 'user' && <span className="absolute top-0 -right-[8px] border-[8px] border-transparent border-t-[#d9fdd3]"></span>}
                    {m.role === 'model' && <span className="absolute top-0 -left-[8px] border-[8px] border-transparent border-t-white"></span>}
                    
                    <span dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
                    
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">
                        {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                      {m.role === 'user' && (
                        <svg viewBox="0 0 16 15" width="16" height="15">
                          <path fill="#53bdeb" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm text-sm text-gray-500 relative flex gap-1 items-center">
                    <span className="absolute top-0 -left-[8px] border-[8px] border-transparent border-t-white"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-[#f0f2f5] z-10 flex gap-2 items-center">
              <input 
                type="text" 
                placeholder="Message"
                className="flex-1 px-4 py-3 bg-white border-none rounded-full text-sm outline-none shadow-sm focus:ring-1 focus:ring-[#008069]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-[#008069] text-white p-3 rounded-full disabled:opacity-50 transition-opacity shadow-sm flex-shrink-0"
              >
                <Send className="w-5 h-5 -ml-1" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[60px] h-[60px] bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(37,211,102,0.4)] hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};
