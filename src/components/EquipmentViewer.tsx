import React, { useState } from 'react';

interface Equipment {
  id: string;
  name: string;
  category: string;
  tagline: string;
  image: string;
  specs: {
    enginePower: string;
    operatingWeight: string;
    maxReach: string;
    bucketCapacity: string;
  };
  hotspots: {
    id: number;
    title: string;
    desc: string;
    top: string;
    left: string;
  }[];
}

const equipmentData: Equipment[] = [
  {
    id: 'excavator-cat349',
    name: 'CAT 349 Heavy Excavator',
    category: 'Earthmoving',
    tagline: 'High-production heavy excavating power for mass earthmoving.',
    image: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80',
    specs: {
      enginePower: '424 HP',
      operatingWeight: '53,000 kg',
      maxReach: '12.1 m',
      bucketCapacity: '3.2 m³',
    },
    hotspots: [
      { id: 1, title: 'Hydraulic System', desc: 'Advanced electro-hydraulic system for precision flow control.', top: '40%', left: '35%' },
      { id: 2, title: 'Reinforced Boom', desc: 'Heavy-duty steel boom designed for severe rock loading.', top: '30%', left: '60%' },
      { id: 3, title: 'ROPS Safety Cab', desc: 'Sound-suppressed, pressurized cab with climate control.', top: '25%', left: '42%' },
    ],
  },
  {
    id: 'crane-liebherr',
    name: 'Liebherr LTM 1120 All-Terrain Crane',
    category: 'Lifting & Rigging',
    tagline: 'Maximum mobility and heavy lifting performance on any terrain.',
    image: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80',
    specs: {
      enginePower: '544 HP',
      operatingWeight: '60,000 kg',
      maxReach: '66.0 m',
      bucketCapacity: '120 Ton Capacity',
    },
    hotspots: [
      { id: 1, title: 'Telescopic Boom', desc: '7-section 66m boom with automatic extension system.', top: '20%', left: '55%' },
      { id: 2, title: 'VarioBase System', desc: 'Flexible outrigger positioning for safe operation in tight spaces.', top: '75%', left: '30%' },
      { id: 3, title: 'Drive Architecture', desc: '12x6 multi-axle steering for tight turning radius.', top: '70%', left: '70%' },
    ],
  },
];
export default function EquipmentViewer() {
  const [selectedId, setSelectedId] = useState<string>(equipmentData[0].id);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);

  const selectedMachine = equipmentData.find((item) => item.id === selectedId) || equipmentData[0];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">Interactive Showcase</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
            Explore Machinery Specs
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>

        {/* Switcher */}
        <div className="flex justify-center gap-4 mb-10 overflow-x-auto pb-2">
          {equipmentData.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedId(item.id);
                setActiveHotspot(null);
              }}
              className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border ${
                selectedId === item.id
                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Viewer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 relative bg-slate-950 border border-slate-800 h-[400px] sm:h-[480px] overflow-hidden group">
            <img
              key={selectedMachine.id}
              src={selectedMachine.image}
              alt={selectedMachine.name}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80";
              }}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

            {/* Hotspots */}
            {selectedMachine.hotspots.map((spot) => (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
              >
                <button
                  onClick={() => setActiveHotspot(activeHotspot === spot.id ? null : spot.id)}
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-transform ${
                    activeHotspot === spot.id ? 'bg-amber-400 text-slate-950 scale-125' : 'bg-amber-500/90 text-slate-950 hover:scale-110'
                  }`}
                >
                  <span className="absolute inset-0 rounded-full bg-amber-500 animate-ping opacity-50"></span>
                  {spot.id}
                </button>

                {activeHotspot === spot.id && (
                  <div className="absolute left-1/2 bottom-full mb-3 -translate-x-1/2 w-56 bg-slate-900 border border-amber-500/40 p-4 shadow-2xl z-30">
                    <h5 className="font-bold text-white text-xs uppercase tracking-wider">{spot.title}</h5>
                    <p className="text-slate-300 text-xs mt-1 leading-relaxed">{spot.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Specs Panel */}
          <div className="bg-slate-950 p-8 border border-slate-800 space-y-6">
            <div>
              <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">{selectedMachine.category}</span>
              <h3 className="text-2xl font-black text-white mt-1 uppercase">{selectedMachine.name}</h3>
              <p className="text-slate-400 text-xs mt-2 leading-relaxed">{selectedMachine.tagline}</p>
            </div>

            <div className="space-y-4 border-t border-b border-slate-900 py-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Engine Output</span>
                <span className="font-bold text-white">{selectedMachine.specs.enginePower}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Operating Weight</span>
                <span className="font-bold text-white">{selectedMachine.specs.operatingWeight}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Maximum Reach</span>
                <span className="font-bold text-white">{selectedMachine.specs.maxReach}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">Capacity</span>
                <span className="font-bold text-amber-500">{selectedMachine.specs.bucketCapacity}</span>
              </div>
            </div>

            <a
              href="#contact"
              className="block text-center w-full py-3.5 bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-xs hover:bg-amber-400 transition-all"
            >
              Request Lease Quote
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}