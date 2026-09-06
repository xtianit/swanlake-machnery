// import React from 'react';

const partners = [
  'CAT INDUSTRIAL',
  'LIEBHERR HEAVY',
  'KOMATSU MINING',
  'VOLVO CE',
  'TEREX RIGGING',
  'HITACHI CONSTRUCTION',
];

export default function PartnerMarquee() {
  return (
    <div className="bg-amber-500 py-6 overflow-hidden border-y border-amber-600">
      <div className="flex w-max animate-marquee space-x-12">
        {[...partners, ...partners].map((name, index) => (
          <div key={index} className="flex items-center gap-12">
            <span className="text-slate-950 font-black text-sm uppercase tracking-widest whitespace-nowrap">
              {name}
            </span>
            <span className="text-slate-950/40 text-xs">◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}