'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  HelpCircle, 
  Handshake, 
  Bug, 
  Send, 
  CheckCircle, 
  Headphones,
  Clock
} from 'lucide-react';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Support',
    message: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const contactChannels = [
    {
      title: 'General Support',
      desc: 'Assistance with account access, navigation, and general questions.',
      email: 'support@realyonogame.com',
      icon: Headphones,
    },
    {
      title: 'Game Queries',
      desc: 'Rules questions, tournament schedules, and game performance.',
      email: 'games@realyonogame.com',
      icon: HelpCircle,
    },
    {
      title: 'Partnerships',
      desc: 'Affiliate opportunities, marketing collaborations, and media.',
      email: 'partners@realyonogame.com',
      icon: Handshake,
    },
    {
      title: 'Report an Issue',
      desc: 'Technical bugs, APK installation errors, or broken links.',
      email: 'tech@realyonogame.com',
      icon: Bug,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus('error');
      setErrorMessage('Please complete all required fields.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    try {
      setStatus('loading');
      setErrorMessage('');

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setFormData({
          name: '',
          email: '',
          category: 'General Support',
          message: '',
        });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network connection error. Please check your connection and try again.');
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EEF8F2] border border-[#087F5B]/20 text-[#087F5B] text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-3.5 h-3.5" />
            24/7 Player Help Desk
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#172331] tracking-tight">
            Need Help?
          </h1>
          <p className="text-base text-[#5D6B78]">
            We are here to support your gaming experience. Choose a channel below or submit an inquiry directly.
          </p>
        </div>

        {/* 4 Dedicated Support Channels */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.title}
                className="bg-[#F7FBF8] p-6 rounded-3xl border border-[#E4ECE7] shadow-luxury hover:shadow-luxury-hover hover:border-[#087F5B]/30 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-[#E4ECE7] group-hover:bg-[#087F5B] group-hover:text-white transition-colors flex items-center justify-center text-[#087F5B] mb-4 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#172331] group-hover:text-[#087F5B] transition-colors">
                    {channel.title}
                  </h3>
                  <p className="text-xs text-[#5D6B78] mt-2 leading-relaxed">
                    {channel.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4ECE7] text-xs font-semibold text-[#087F5B]">
                  {channel.email}
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-3xl mx-auto bg-white rounded-3xl border border-[#E4ECE7] p-8 sm:p-12 shadow-luxury">
          <div className="space-y-2 mb-8 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-[#172331]">
              Send Us a Message
            </h2>
            <p className="text-xs sm:text-sm text-[#5D6B78]">
              Our support specialists typically respond within 2 to 4 hours.
            </p>
          </div>

          {status === 'success' ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#EEF8F2] text-[#087F5B] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#172331]">Message Delivered!</h3>
              <p className="text-sm text-[#5D6B78] max-w-md mx-auto">
                Thank you for getting in touch. A support ticket has been created and our representative will reply to your email shortly.
              </p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#087F5B] text-white text-xs font-bold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                  {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172331]">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-sm text-[#172331] outline-none focus:border-[#087F5B] focus:bg-white transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#172331]">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-sm text-[#172331] outline-none focus:border-[#087F5B] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172331]">
                  Inquiry Department
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-sm text-[#172331] outline-none focus:border-[#087F5B] focus:bg-white transition-all cursor-pointer"
                >
                  <option value="General Support">General Support</option>
                  <option value="Game Queries">Game Queries</option>
                  <option value="Partnerships">Partnerships & Marketing</option>
                  <option value="Report an Issue">Report a Technical Bug</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#172331]">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your query or feedback in detail..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#F7FBF8] border border-[#E4ECE7] text-sm text-[#172331] outline-none focus:border-[#087F5B] focus:bg-white transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[#087F5B] hover:bg-[#07553F] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {status === 'loading' ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#E4ECE7] flex items-center justify-center gap-2 text-xs text-[#5D6B78]">
            <Clock className="w-3.5 h-3.5 text-[#087F5B]" />
            <span>Average response turnaround: 2-4 business hours</span>
          </div>
        </div>

      </div>
    </div>
  );
}
