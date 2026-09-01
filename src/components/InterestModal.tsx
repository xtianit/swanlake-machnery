import { useState } from 'react';
import { SITE_CONTENT, type ServiceItem } from '../data/content';


interface InterestModalProps {
  service: ServiceItem | null;
  onClose: () => void;
}

export default function InterestModal({ service, onClose }: InterestModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      service: service.name,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch(SITE_CONTENT.interestModal.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch {
      setError('Failed to submit request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
          {SITE_CONTENT.interestModal.heading}
        </span>
        <h3 className="text-2xl font-black text-white uppercase mt-1">
          {service.name}
        </h3>
        <p className="text-slate-400 text-xs mt-1">
          {SITE_CONTENT.interestModal.subhead}
        </p>

        {submitted ? (
          <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold text-center">
            Inquiry submitted successfully! We will follow up via email at {SITE_CONTENT.company.email}.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input type="hidden" name="service" value={service.name} />
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Anything specific we should know?</label>
              <textarea
                name="message"
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 p-3 text-sm text-white focus:border-amber-500 focus:outline-none"
              ></textarea>
            </div>

            {error && <p className="text-rose-500 text-xs font-bold">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-amber-500 text-slate-950 font-bold uppercase text-xs tracking-wider hover:bg-amber-400 transition-all disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Interest'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}