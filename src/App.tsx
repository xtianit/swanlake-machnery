import { useState, useEffect } from 'react';
import { SITE_CONTENT, type ServiceItem } from './data/content';
import InterestModal from './components/InterestModal';

export default function App() {
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactSubmitting, setContactSubmitting] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Active word index for vertical rolling effect
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    const words = SITE_CONTENT.hero.rotatingWords;
    if (!words || words.length <= 1) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setWordIndex((prev) => (prev + 1) % words.length);
        setIsAnimating(false);
      }, 700);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  const [currentAboutImage, setCurrentAboutImage] = useState<number>(0);

  useEffect(() => {
    const images = SITE_CONTENT.about.images;
    if (!images || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentAboutImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const filteredProjects = activeFilter === 'All'
    ? SITE_CONTENT.portfolio.projects
    : SITE_CONTENT.portfolio.projects.filter(p => p.category === activeFilter);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setContactSubmitting(true);
    setContactError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      projectType: formData.get('projectType'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch(SITE_CONTENT.contact.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setContactSubmitted(true);
      } else {
        setContactError('Failed to send message. Please try again later.');
      }
    } catch {
      setContactError('An error occurred. Please check your network connection.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-950 text-white min-h-screen font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3 group">
            <div className="relative w-4 h-4 bg-amber-500 group-hover:rotate-45 transition-transform duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]">
              <div className="absolute inset-0 bg-amber-400 animate-ping opacity-75"></div>
            </div>
            <span className="font-black text-xl uppercase tracking-wider text-white group-hover:text-amber-500 transition-colors">
              {SITE_CONTENT.company.name}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-slate-300">
            {SITE_CONTENT.nav.map((item) => (
              <a 
                key={item.label} 
                href={item.href} 
                className="hover:text-amber-500 transition-colors relative py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-amber-500 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a 
              href="#contact" 
              className="hidden sm:inline-flex items-center gap-2 py-3 px-6 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Start a Project</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-amber-500 focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path fillRule="evenodd" clipRule="evenodd" d="M18.278 16.864a1 1 0 01-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 01-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 011.414-1.414l4.829 4.828 4.828-4.828a1 1 0 111.414 1.414l-4.828 4.829 4.828 4.828z" />
                ) : (
                  <path fillRule="evenodd" d="M4 5h16a1 1 0 010 2H4a1 1 0 110-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2zm0 6h16a1 1 0 010 2H4a1 1 0 010-2z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Animated Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-2xl border-b border-slate-800/80 px-6 pt-4 pb-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
            {SITE_CONTENT.nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-amber-500 py-2.5 border-b border-slate-900 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center py-3.5 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider shadow-lg shadow-amber-500/20 mt-4"
            >
              Start a Project
            </a>
          </div>
        )}
      </header>

      <main id="top" className="pt-20">
        
        {/* Hero Section */}
        <section className="relative w-full min-h-[90vh] flex flex-col justify-between py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover opacity-25 scale-105"
            >
              <source src={SITE_CONTENT.hero.videoSrc} type="video/mp4" />
              Your browser does not support video playback.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/90"></div>
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between h-full flex-1">
            <div className="mt-8 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                {SITE_CONTENT.hero.eyebrow}
              </div>

              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mt-2 leading-[1.05]">
                {SITE_CONTENT.hero.headlinePrefix}{" "}
                <span className="inline-block overflow-hidden align-top h-[1.35em] py-1">
                  <span
                    className={`block text-amber-500 transition-all duration-700 ease-in-out transform ${
                      isAnimating
                        ? '-translate-y-full opacity-0'
                        : 'translate-y-0 opacity-100'
                    }`}
                  >
                    {SITE_CONTENT.hero.rotatingWords[wordIndex]}
                  </span>
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base mt-6 max-w-2xl leading-relaxed font-normal">
                {SITE_CONTENT.hero.subhead}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <a href={SITE_CONTENT.hero.ctaPrimary.href} className="py-4 px-9 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider hover:bg-amber-400 hover:shadow-xl hover:shadow-amber-500/20 transition-all">
                  {SITE_CONTENT.hero.ctaPrimary.label}
                </a>
                <a href={SITE_CONTENT.hero.ctaSecondary.href} className="py-4 px-9 border border-slate-700 bg-slate-900/50 backdrop-blur-sm text-white font-bold uppercase text-xs tracking-wider hover:border-amber-500 hover:text-amber-500 transition-all">
                  {SITE_CONTENT.hero.ctaSecondary.label}
                </a>
              </div>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-800/80 pt-8 mt-16 max-w-4xl">
              {SITE_CONTENT.hero.stats.map((stat, i) => (
                <div key={i} className="bg-slate-900/40 p-4 border border-slate-800/50 backdrop-blur-sm">
                  <span className="block text-3xl sm:text-4xl font-black text-amber-500">{stat.value}</span>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-slate-900 border-t border-slate-800 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs border-l-2 border-amber-500 pl-3 block">
                  {SITE_CONTENT.about.eyebrow}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3 text-white">
                  {SITE_CONTENT.about.heading}
                </h2>
                <div className="space-y-4 text-slate-300 text-sm leading-relaxed mt-6 font-normal">
                  {SITE_CONTENT.about.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="relative border border-slate-800 shadow-2xl overflow-hidden h-72 sm:h-96 w-full bg-slate-950 group">
                  {SITE_CONTENT.about.images.map((imgUrl, index) => (
                    <img
                      key={imgUrl}
                      src={imgUrl}
                      alt={`${SITE_CONTENT.company.fullName} machine ${index + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80";
                      }}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                        index === currentAboutImage ? 'opacity-100 scale-105 z-10' : 'opacity-0 scale-100 z-0'
                      }`}
                    />
                  ))}

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-slate-950/60 p-2 backdrop-blur-md border border-slate-800">
                    {SITE_CONTENT.about.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentAboutImage(index)}
                        className={`h-2 transition-all ${
                          index === currentAboutImage ? 'w-8 bg-amber-500' : 'w-2 bg-white/40'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-6 border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  {SITE_CONTENT.about.stats.map((s, i) => (
                    <div key={i} className="p-2">
                      <span className="block text-2xl sm:text-3xl font-black text-amber-500">{s.value}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1 block">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-24 bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.services.eyebrow}</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2">{SITE_CONTENT.services.heading}</h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">{SITE_CONTENT.services.subhead}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {SITE_CONTENT.services.items.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-slate-900/40 border border-slate-800/80 rounded-sm overflow-hidden flex flex-col justify-between hover:border-amber-500/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 backdrop-blur-sm"
                >
                  <div>
                    <div className="relative overflow-hidden h-60">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                      <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-slate-950/80 text-amber-500 border border-amber-500/30 backdrop-blur-md">
                        Available
                      </span>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-black uppercase text-white group-hover:text-amber-500 transition-colors duration-300">
                        {item.name}
                      </h3>
                      <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedService(item)}
                      className="w-full py-3.5 bg-slate-950 border border-slate-800 text-amber-500 font-bold uppercase text-xs tracking-wider hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-300 text-center shadow-md"
                    >
                      Express Interest
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" className="py-24 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.portfolio.eyebrow}</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2">{SITE_CONTENT.portfolio.heading}</h2>
              <p className="text-slate-400 text-sm mt-4 leading-relaxed">{SITE_CONTENT.portfolio.subhead}</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {SITE_CONTENT.portfolio.filters.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                    activeFilter === category
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-slate-950 border border-slate-800 overflow-hidden group hover:border-slate-700 transition-all">
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 shadow-md">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-black uppercase text-white">{project.title}</h4>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                        {project.year}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">{project.summary}</p>
                    <div className="mt-5 pt-3 border-t border-slate-900 text-xs text-slate-500 font-bold uppercase flex justify-between">
                      <span>Location:</span>
                      <span className="text-slate-300">{project.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-24 bg-slate-950 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.process.eyebrow}</span>
              <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2">{SITE_CONTENT.process.heading}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {SITE_CONTENT.process.steps.map((step, idx) => (
                <div key={idx} className="bg-slate-900/50 border border-slate-800 p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all group">
                  <div>
                    <span className="text-4xl font-black text-amber-500/40 group-hover:text-amber-500 transition-colors block mb-6">0{idx + 1}</span>
                    <h4 className="font-bold text-white text-lg uppercase">{step.title}</h4>
                    <p className="text-slate-400 text-xs mt-3 leading-relaxed">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 bg-slate-900 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs border-l-2 border-amber-500 pl-3 block">{SITE_CONTENT.contact.eyebrow}</span>
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3">{SITE_CONTENT.contact.heading}</h2>
                <p className="text-slate-300 text-sm leading-relaxed mt-4">
                  {SITE_CONTENT.contact.subhead}
                </p>

                <div className="mt-10 space-y-6 text-xs">
                  <div className="bg-slate-950 p-4 border border-slate-800">
                    <span className="text-slate-500 uppercase font-bold block text-[10px] tracking-wider mb-1">Yard Address</span>
                    <span className="text-white font-bold">{SITE_CONTENT.company.address}</span>
                  </div>
                  <div className="bg-slate-950 p-4 border border-slate-800">
                    <span className="text-slate-500 uppercase font-bold block text-[10px] tracking-wider mb-1">Email Inquiry</span>
                    <a href={`mailto:${SITE_CONTENT.company.email}`} className="text-amber-500 font-bold text-sm hover:underline">
                      {SITE_CONTENT.company.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-slate-950 p-8 sm:p-10 border border-slate-800 shadow-2xl">
                {contactSubmitted ? (
                  <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center space-y-4">
                    <p>Thank you! Your inquiry has been submitted. We will contact you by email shortly.</p>
                    <button 
                      onClick={() => setContactSubmitted(false)} 
                      className="text-xs text-amber-500 uppercase underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    {contactError && (
                      <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                        {contactError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full bg-slate-900 border border-slate-800 p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full bg-slate-900 border border-slate-800 p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Phone (Optional)</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full bg-slate-900 border border-slate-800 p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Equipment Needed</label>
                      <select name="projectType" required className="w-full bg-slate-900 border border-slate-800 p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors">
                        <option value="">Select Equipment Category</option>
                        {SITE_CONTENT.contact.projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Tell us about the job</label>
                      <textarea
                        name="message"
                        rows={4}
                        required
                        className="w-full bg-slate-900 border border-slate-800 p-4 text-sm text-white focus:border-amber-500 focus:outline-none transition-colors"
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full py-4 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider hover:bg-amber-400 transition-all disabled:opacity-50 shadow-lg shadow-amber-500/20"
                    >
                      {contactSubmitting ? 'Sending Message...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modern Multi-Column Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 bg-amber-500"></div>
                <span className="font-black text-xl uppercase tracking-wider text-white">
                  {SITE_CONTENT.company.name}
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                {SITE_CONTENT.footer.tagline}
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest block mb-1">
                  Yard Location
                </span>
                <p className="text-xs text-slate-300 font-semibold">
                  {SITE_CONTENT.company.address}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {SITE_CONTENT.nav.map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="hover:text-amber-500 transition-colors">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
                Equipment Fleet
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-400">
                {SITE_CONTENT.services.items.slice(0, 5).map((item) => (
                  <li key={item.id}>
                    <a href="#services" className="hover:text-amber-500 transition-colors">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-2">
                Operations & Hours
              </h4>
              <div className="space-y-3 text-xs text-slate-400">
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Yard Hours</span>
                  <span className="text-slate-300 font-semibold">Mon – Sat: 7:00 AM – 6:00 PM</span>
                </div>
                <div>
                  <span className="text-slate-500 block uppercase text-[10px] font-bold">Direct Email</span>
                  <a href={`mailto:${SITE_CONTENT.company.email}`} className="text-amber-500 font-bold hover:underline">
                    {SITE_CONTENT.company.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} {SITE_CONTENT.footer.copyrightName}. All Rights Reserved.</p>
            <a href="#top" className="hover:text-amber-500 transition-colors">Back to top ↑</a>
          </div>
        </div>
      </footer>

      {/* Express Interest Modal */}
      <InterestModal service={selectedService} onClose={() => setSelectedService(null)} />
    </div>
  );
}