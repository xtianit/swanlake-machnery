import React, { useState } from 'react';
import { SITE_CONTENT } from '../data/content';

export interface ServiceItem {
  id?: string;
  title?: string;
  name?: string;
  category?: string;
  image?: string;
  imageUrl?: string;
  imgUrl?: string;
  description?: string;
  [key: string]: any;
}

interface InterestModalProps {
  service?: ServiceItem | null;
  isOpen?: boolean;
  onClose: () => void;
  theme: "dark" | "light";
  defaultCategory?: string;
}

export const InterestModal: React.FC<InterestModalProps> = ({
  service,
  isOpen = true,
  onClose,
  defaultCategory = 'General Inquiry',
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const initialCategory = service?.title || service?.name || service?.category || defaultCategory;
  const imageSrc = service?.image || service?.imageUrl || service?.imgUrl;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = (formData.get('phone') as string) || 'N/A';
    const category = (formData.get('category') as string) || initialCategory;
    const userMessage = (formData.get('message') as string) || 'No message provided.';

    const messageBody = `
        NEW INQUIRY — SWANLAKE MACHINERY
        ----------------------------------------
        Customer Name : ${name}
        Email Address : ${email}
        Phone Number  : ${phone}
        Requested Item: ${category}
        ----------------------------------------
        Message:
        ${userMessage}
        ----------------------------------------
        Sent from: Swanlake Machinery Website
    `.trim();

    const data = {
      access_key: "710745a1-96b8-4988-800f-776ca3e7849c", 
      from_name: `${name} (Swanlake Inquiry)`,
      subject: `New Equipment Request: ${category} - ${name}`,
      replyto: email,
      message: messageBody,
    };

    const targetEndpoint = SITE_CONTENT?.contact?.formEndpoint || "https://api.web3forms.com/submit";

    try {
      const response = await fetch(targetEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        setError('');
      } else {
        setError(result.message || 'Failed to submit form. Please check your access key.');
      }
    } catch {
      setError('An error occurred. Please check your network connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendAnother = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSubmitted(false);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8 text-white shadow-2xl my-8">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-slate-400 hover:text-white text-xl font-bold cursor-pointer"
        >
          ✕
        </button>

        {/* Selected Service Card Preview (Image & Info) */}
        {service && (
          <div className="mb-6 overflow-hidden rounded-lg border border-slate-800 bg-slate-950/50 p-3 flex items-center gap-4">
            {imageSrc && (
              <img
                src={imageSrc}
                alt={initialCategory}
                className="w-20 h-20 object-cover rounded-md border border-slate-800 flex-shrink-0"
              />
            )}
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-500 tracking-wider block">
                Selected Item
              </span>
              <h4 className="text-base font-bold text-white leading-tight">
                {initialCategory}
              </h4>
              {service.description && (
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                  {service.description}
                </p>
              )}
            </div>
          </div>
        )}

        <h3 className="text-2xl font-extrabold uppercase mb-2 text-amber-500">
          Request Equipment
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Submit your project details and we will reply via email with rates and availability.
        </p>

        {submitted ? (
          <div className="p-6 text-center border border-emerald-500/30 bg-emerald-950/20 rounded-lg">
            <p className="text-emerald-400 font-medium mb-4">
              Thank you! Your inquiry has been submitted. We will contact you by email shortly.
            </p>
            <button
              type="button"
              onClick={handleSendAnother}
              className="text-amber-500 hover:text-amber-400 font-semibold text-xs tracking-wider uppercase underline underline-offset-4 cursor-pointer"
            >
              SEND ANOTHER MESSAGE
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 border border-rose-500/30 bg-rose-950/20 text-rose-400 text-xs rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Equipment Category / Item</label>
              <input
                type="text"
                name="category"
                defaultValue={initialCategory}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Message</label>
              <textarea
                name="message"
                rows={3}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded uppercase text-xs tracking-wider disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? 'Sending...' : 'Submit Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default InterestModal;