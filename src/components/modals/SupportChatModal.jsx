import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react';

export const SupportChatModal = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste! Welcome to FoodieGo Instant Support. How can I assist you with your feast today?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const quickPrompts = [
    'Where is my order?',
    'How to apply SAVE50 coupon?',
    'Refund status for cancelled items',
    'Talk to human support agent'
  ];

  const handleSend = (textToSend) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    // Generate intelligent AI support reply
    setTimeout(() => {
      let botResponse = 'Thank you for reaching out. Our support supervisor has noted your inquiry.';
      const lower = query.toLowerCase();

      if (lower.includes('where') || lower.includes('order')) {
        botResponse = 'You can track your live rider in real-time from the "Orders" page or "Track Order" link in your confirmation. Our riders average 25–30 minute delivery times!';
      } else if (lower.includes('coupon') || lower.includes('save50')) {
        botResponse = 'You can enter coupon codes like SAVE50, FOODIE100 or TASTY20 directly in the Cart drawer. Ensure your cart meets the minimum value (e.g. ₹199 for SAVE50)!';
      } else if (lower.includes('refund')) {
        botResponse = 'Instant UPI refunds are credited within 15–30 minutes directly to your source account. Card refunds take 2–3 business days.';
      } else if (lower.includes('agent') || lower.includes('human')) {
        botResponse = 'Connecting you to senior customer delight specialist Tanya Sharma... Expected wait time is 45 seconds.';
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: botResponse }
      ]);
    }, 600);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end sm:justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full h-[80vh] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold flex items-center gap-1.5">
                  <span>FoodieGo AI Assistant</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h3>
                <p className="text-[11px] text-orange-100">Live 24x7 Order & Delivery Support</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick prompt suggestions */}
          <div className="p-3 bg-slate-50 border-b border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={`quick-prompt-${idx}`}
                onClick={() => handleSend(p)}
                className="shrink-0 px-2.5 py-1 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-200 text-slate-700 hover:text-orange-600 rounded-full text-[11px] font-medium transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="p-4 flex-1 overflow-y-auto space-y-3">
            {messages.map((m, idx) => (
              <div
                key={`chat-msg-${m.id || idx}-${idx}`}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-xs font-bold mt-1">
                    FG
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-none shadow-md shadow-orange-500/20'
                      : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about your food order..."
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 disabled:opacity-40 text-white rounded-xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
