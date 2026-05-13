import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Terminal, ShieldCheck, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { geminiService } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Product, Order } from '../types';

export const AdminChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      Promise.all([
        api.getProducts().then(setProducts),
        api.getAllOrders().then(setOrders)
      ]).catch(console.error);
    }
  }, [isOpen]);

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

    // Create a special admin context for Gemini
    const adminContext = `
      System Info:
      - Current Admin: ${user?.name}
      - Total Products: ${products.length}
      - Total Orders: ${orders.length}
      - Low Stock Items: ${products.filter(p => p.stock < 10).length}
      - Out of Stock: ${products.filter(p => p.stock <= 0).length}
    `;

    const response = await geminiService.getChatResponse(
      `[ADMIN MODE] ${userMessage}\n\nContext:\n${adminContext}`, 
      history, 
      products, 
      user
    );
    
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-white w-[400px] h-[600px] rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden mb-6"
          >
            {/* Admin AI Header */}
            <div className="bg-gray-900 p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center border border-white/10">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-widest italic">Sabiha Admin AI</h3>
                  <p className="text-[8px] opacity-60 uppercase tracking-[0.2em] font-bold">System Interface Active</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm text-[11px] font-bold text-gray-600 leading-relaxed italic">
                    "Welcome, Admin. I am connected to the Korean Skin Food database. How can I assist you with inventory, orders, or analytics today?"
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                     <button onClick={() => setInput('Show low stock items')} className="p-3 bg-white border border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all text-left flex items-center gap-2">
                        <Terminal className="w-3 h-3" /> Stock Audit
                     </button>
                     <button onClick={() => setInput('Summarize today\'s sales')} className="p-3 bg-white border border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all text-left flex items-center gap-2">
                        <Database className="w-3 h-3" /> Sales Report
                     </button>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[12px] font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-gray-900 text-white rounded-tr-none' 
                      : 'bg-white border border-gray-100 text-gray-900 rounded-tl-none shadow-sm'
                  }`}>
                    {m.text.startsWith('[ADMIN MODE]') ? m.text.split('\n\n')[0].replace('[ADMIN MODE] ', '') : m.text}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm text-xs text-gray-400 flex gap-2 items-center">
                    <Sparkles className="w-3 h-3 animate-spin" />
                    Processing query...
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask Admin AI..."
                className="flex-1 px-5 py-4 bg-gray-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button 
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gray-900 text-white p-4 rounded-2xl disabled:opacity-50 hover:bg-black transition-all shadow-lg"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-[70px] h-[70px] bg-gray-900 text-white rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"></div>
        {isOpen ? <X className="w-8 h-8" /> : <Bot className="w-10 h-10" />}
      </button>
    </div>
  );
};
