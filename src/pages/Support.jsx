import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Phone,
  Mail,
  ChevronDown,
  AlertCircle,
  FileCheck,
  Send,
  Sparkles,
  Bot
} from 'lucide-react';
import { SupportChatModal } from '../components/modals/SupportChatModal';
import { useToast } from '../context/ToastContext';

export const Support = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [selectedIssueCategory, setSelectedIssueCategory] = useState('Order issue');
  const [complaintText, setComplaintText] = useState('');
  const [ticketGenerated, setTicketGenerated] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { addToast } = useToast();

  const issueCategories = [
    { title: 'Order issue', icon: '❓', desc: 'Item missing, delayed order, wrong dish delivered' },
    { title: 'Payment issue', icon: '💳', desc: 'Debited twice, payment failed, UPI error' },
    { title: 'Delivery issue', icon: '🚴', desc: 'Rider unreachable, delivery location mismatch' },
    { title: 'Food quality issue', icon: '🍔', desc: 'Spilled packing, cold food, bad taste' },
    { title: 'Refund issue', icon: '💰', desc: 'Status of refund, cancellation charge query' },
    { title: 'Account issue', icon: '👤', desc: 'Phone change, OTP login issue, address edit' }
  ];

  const faqs = [
    {
      q: 'How long does FoodieGo delivery take?',
      a: 'Average delivery takes 25 to 30 minutes from partner kitchens in your vicinity. Priority express orders arrive in 15–20 minutes.'
    },
    {
      q: 'How do I use promo coupons like SAVE50 or FOODIE100?',
      a: 'Add your favorite dishes to the cart. In the cart drawer, navigate to the "Apply Coupons" section and enter your code or click the one-touch Apply button.'
    },
    {
      q: 'What is the refund timeline for cancelled orders?',
      a: 'Instant UPI refunds are credited back to your account within 15–30 minutes. Card and Net Banking refunds take 2–3 business banking days.'
    },
    {
      q: 'Are all partner restaurants FSSAI verified?',
      a: 'Yes, 100% of restaurants featured on FoodieGo are verified with valid FSSAI food safety licenses and maintain rigorous hygiene protocols.'
    }
  ];

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;

    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketGenerated(ticketId);
    setComplaintText('');
    addToast(`Complaint registered! Ticket ID: ${ticketId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="w-14 h-14 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 text-2xl shadow-inner">
          <HelpCircle className="w-7 h-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
          How can we help you?
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Find instant answers to common questions or reach out to our dedicated 24x7 delight team.
        </p>

        {/* Live Chat Banner Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-95 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/25 flex items-center gap-2 text-sm transition-all"
          >
            <Bot className="w-4 h-4" />
            <span>Launch Live FoodieGo AI Chat Assistant</span>
          </button>
        </div>
      </div>

      {/* 1. Issue Categories Grid */}
      <div className="mb-12">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Select Your Issue Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {issueCategories.map((c) => {
            const isSelected = selectedIssueCategory === c.title;
            return (
              <div
                key={c.title}
                onClick={() => setSelectedIssueCategory(c.title)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-1.5">{c.icon}</div>
                <h3 className="text-sm font-bold text-slate-900">{c.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Raise Complaint Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm mb-12">
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Raise a Ticket for: <span className="text-orange-600">{selectedIssueCategory}</span>
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Describe the situation and our support manager will resolve it promptly.
        </p>

        {ticketGenerated ? (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider">
                  Ticket Created Successfully!
                </div>
                <div className="text-sm font-black mt-0.5">Reference ID: {ticketGenerated}</div>
                <div className="text-xs text-emerald-700">
                  We are reviewing your complaint and will update you via SMS / Email in 30 mins.
                </div>
              </div>
            </div>
            <button
              onClick={() => setTicketGenerated(null)}
              className="text-xs font-bold text-emerald-700 hover:underline"
            >
              Raise Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleComplaintSubmit} className="space-y-4">
            <textarea
              rows={3}
              required
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              placeholder="Provide details about your order ID, missing items, or delivery difficulty..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-slate-900 hover:bg-orange-500 active:scale-95 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Complaint</span>
            </button>
          </form>
        )}
      </div>

      {/* 3. Frequently Asked Questions Accordion */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4 mb-12">
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          Frequently Asked Questions
        </h3>

        <div className="divide-y divide-slate-100">
          {faqs.map((f, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div key={idx} className="py-3.5">
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-orange-600 transition-colors"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-orange-500' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed pl-1">
                    {f.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Contact channels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Direct Helpline</div>
            <div className="text-xs text-orange-700 font-semibold">+91 98765 43210 (24x7)</div>
          </div>
        </div>

        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">Email Assistance</div>
            <div className="text-xs text-amber-800 font-semibold">support@foodiego.com</div>
          </div>
        </div>
      </div>

      {/* Support Chat Modal */}
      <SupportChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
};
