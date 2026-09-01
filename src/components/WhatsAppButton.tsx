import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = '1234567890'; // Replace with your actual WhatsApp contact number
  const defaultMessage = encodeURIComponent('Hello! I would like to request a quote for heavy equipment leasing.');

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl transition-all hover:scale-105 group"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6 fill-current" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold text-xs uppercase tracking-wider">
        Instant Quote Chat
      </span>
    </a>
  );
}