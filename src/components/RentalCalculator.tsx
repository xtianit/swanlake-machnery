import React, { useState } from 'react';

export default function RentalCalculator() {
  const [days, setDays] = useState<number>(7);
  const [machineType, setMachineType] = useState<string>('excavator');
  const [includeOperator, setIncludeOperator] = useState<boolean>(true);

  const rates: Record<string, { daily: number; fuelPerHour: number; name: string }> = {
    excavator: { daily: 450, fuelPerHour: 35, name: 'CAT 349 Excavator' },
    crane: { daily: 850, fuelPerHour: 50, name: 'Liebherr 120T Crane' },
    loader: { daily: 380, fuelPerHour: 28, name: 'CAT 966 Wheel Loader' },
  };

  const selected = rates[machineType];
  const operatorCostPerDay = 150;
  const estimatedHoursPerDay = 8;
  const fuelCostPerLiter = 1.25;

  const baseRentalCost = selected.daily * days;
  const totalOperatorCost = includeOperator ? operatorCostPerDay * days : 0;
  const estimatedFuelCost = Math.round(selected.fuelPerHour * estimatedHoursPerDay * fuelCostPerLiter * days);

  const grandTotal = baseRentalCost + totalOperatorCost + estimatedFuelCost;

  return (
    <section className="py-24 bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">Estimate & Plan</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mt-2">
            Rental & Fuel Estimator
          </h2>
          <div className="w-16 h-1 bg-amber-500 mx-auto mt-4"></div>
        </div>

        {/* Estimator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-slate-900 border border-slate-800 p-8 sm:p-10">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-400 mb-3">Select Equipment Type</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.keys(rates).map((key) => (
                  <button
                    key={key}
                    onClick={() => setMachineType(key)}
                    className={`py-3 px-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                      machineType === key
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-xs font-bold uppercase text-slate-400">Duration (Days)</label>
                <span className="text-amber-500 font-black text-lg">{days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="60"
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
              />
            </div>

            {/* Operator Checkbox */}
            <div className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800">
              <div>
                <h5 className="text-white text-sm font-bold">Include Certified Operator</h5>
                <p className="text-slate-400 text-xs mt-0.5">Experienced site engineer provided ($150/day)</p>
              </div>
              <input
                type="checkbox"
                checked={includeOperator}
                onChange={(e) => setIncludeOperator(e.target.checked)}
                className="w-5 h-5 accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Live Investment Summary */}
          <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-8 border border-slate-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold uppercase text-amber-500 tracking-wider mb-6">Estimated Breakdown</h4>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-slate-300">
                  <span>Base Equipment Leasing</span>
                  <span className="font-bold text-white">${baseRentalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Operator Service</span>
                  <span className="font-bold text-white">${totalOperatorCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Est. Diesel Fuel Usage</span>
                  <span className="font-bold text-white">${estimatedFuelCost.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 mt-6">
              <span className="text-xs uppercase text-slate-400 block mb-1">Total Estimated Investment</span>
              <span className="text-3xl font-black text-amber-500">${grandTotal.toLocaleString()}</span>
              <a
                href="#contact"
                className="block text-center w-full mt-6 py-3.5 bg-amber-500 text-slate-950 font-bold uppercase tracking-wider text-xs hover:bg-amber-400 transition-all"
              >
                Lock In Estimate
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}