import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import FadeIn from './FadeIn';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How does equipment mobilization and site delivery work?',
    answer: 'We provide end-to-end heavy haul transportation directly to your project site. Mobilization timelines and freight costs are included transparently in your final lease agreement.',
  },
  {
    question: 'Are operators included with machine rentals?',
    answer: 'Yes, we offer both wet leases (equipment provided with certified, experienced heavy equipment operators) and dry leases (machinery only), depending on your project requirements.',
  },
  {
    question: 'What happens in the event of mechanical breakdown or maintenance?',
    answer: 'Our 24/7 field service engineering team is on standby. In the event of downtime, site mechanics are dispatched immediately, or replacement machinery is deployed to ensure project continuity.',
  },
  {
    question: 'What insurance and compliance coverage is required?',
    answer: 'All our equipment is fully insured and certified for site compliance. Clients are required to maintain Contractors Equipment Floater or general liability insurance during the rental period.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn direction="down">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">Knowledge Base</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
          </div>
        </FadeIn>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="bg-slate-950 border border-slate-800 transition-colors">
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full text-left p-6 flex justify-between items-center gap-4 focus:outline-none"
                >
                  <span className="font-bold text-white text-sm uppercase tracking-wide">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-amber-500 transition-transform duration-300 ${
                      openIndex === idx ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openIndex === idx && (
                  <div className="px-6 pb-6 text-slate-400 text-xs leading-relaxed border-t border-slate-900/50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}