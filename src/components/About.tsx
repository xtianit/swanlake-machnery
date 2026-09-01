import React from 'react';

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-slate-900 text-slate-100 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">
            Engineering Excellence
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-white">
            About Swanlake Machinery Ltd
          </h2>
          <div className="w-20 h-1 bg-amber-500 mx-auto mt-4 rounded"></div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Text Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white leading-snug">
              Powering Infrastructure & Industrial Operations Across the Region
            </h3>
            <p className="text-slate-300 leading-relaxed">
              Swanlake Machinery Ltd is a premier provider of heavy construction machinery, industrial equipment sales, and comprehensive fleet support. We specialize in supplying high-performance excavators, earth-moving machinery, and specialized plant equipment engineered for demanding project sites.
            </p>
            <p className="text-slate-400 leading-relaxed">
              From full equipment procurement to on-site maintenance and technical consultation, we deliver robust solutions designed to minimize downtime, maximize efficiency, and keep major engineering works on schedule.
            </p>

            {/* Feature Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Certified Equipment</h4>
                  <p className="text-xs text-slate-400">Rigorous safety & quality standards</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">24/7 Field Support</h4>
                  <p className="text-xs text-slate-400">On-site technical support crew</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Stats & Highlights Column */}
          <div className="grid grid-cols-2 gap-6 bg-slate-800/60 p-8 rounded-2xl border border-slate-700/60 shadow-xl">
            <div className="space-y-2">
              <span className="text-4xl font-extrabold text-amber-500">15+</span>
              <h4 className="text-sm font-medium text-slate-300">Years Industry Experience</h4>
              <p className="text-xs text-slate-500">Delivering heavy machinery solutions</p>
            </div>

            <div className="space-y-2">
              <span className="text-4xl font-extrabold text-amber-500">250+</span>
              <h4 className="text-sm font-medium text-slate-300">Projects Supplied</h4>
              <p className="text-xs text-slate-500">Civil & industrial sites</p>
            </div>

            <div className="space-y-2">
              <span className="text-4xl font-extrabold text-amber-500">99%</span>
              <h4 className="text-sm font-medium text-slate-300">Fleet Uptime</h4>
              <p className="text-xs text-slate-500">Proactive equipment servicing</p>
            </div>

            <div className="space-y-2">
              <span className="text-4xl font-extrabold text-amber-500">100%</span>
              <h4 className="text-sm font-medium text-slate-300">Safety Compliant</h4>
              <p className="text-xs text-slate-500">Tested to international standards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};