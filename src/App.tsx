import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import { SITE_CONTENT, type ServiceItem } from './data/content';


// To this:
import { InterestModal } from './components/InterestModal';

export default function App() {
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize theme state with localStorage
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState<boolean>(false);
  const [contactSubmitting, setContactSubmitting] = useState<boolean>(false);
  const [contactError, setContactError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Active word index for vertical rolling effect
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Handle splash screen timer
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(splashTimer);
  }, []);

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
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const phone = (formData.get('phone') as string) || 'N/A';
  const category = (formData.get('category') as string) || 'General Inquiry';
  const userMessage = (formData.get('message') as string) || 'No message provided.';

  const messageBody = `
NEW INQUIRY — SWANLAKE MACHINERY
----------------------------------------
Customer Name : ${name}
Email Address : ${email}
Phone Number  : ${phone}
Category      : ${category}
----------------------------------------
Message:
${userMessage}
----------------------------------------
Sent from: Swanlake Machinery Website
  `.trim();

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "710745a1-96b8-4988-800f-776ca3e7849c", // Add your actual API key
        from_name: `${name} (Swanlake Inquiry)`,
        subject: `New Equipment Request: ${category} - ${name}`,
        replyto: email,
        message: messageBody,
      })
    });

    const result = await response.json();

    if (result.success) {
      setContactSubmitted(true);
      setContactError(null);
    } else {
      setContactError(result.message || 'Submission failed. Please check your Access Key.');
    }
  } catch (err) {
    console.error("Form error:", err);
    setContactError('An error occurred. Please try again.');
  } finally {
    setContactSubmitting(false);
  }
};
 
  return (
    <>
      {loading && <SplashScreen />}
      
      <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-amber-500 selection:text-slate-950 ${
        theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        
        {/* Header Navigation */}
        <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
  theme === 'dark' 
    ? 'bg-slate-950/80 border-slate-800/80 text-white' 
    : 'bg-white/80 border-slate-200 text-slate-900'
}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">
    
    {/* Logo - Added max-w and shrink logic to prevent pushing controls on small screens */}
    <a href="#top" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
      <div className="relative w-4 h-4 bg-amber-500 group-hover:rotate-45 transition-transform duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0">
        <div className="absolute inset-0 bg-amber-400 animate-ping opacity-75"></div>
      </div>
      <span className={`font-black text-base sm:text-xl uppercase tracking-wider group-hover:text-amber-500 transition-colors truncate ${
        theme === 'dark' ? 'text-white' : 'text-slate-900'
      }`}>
        {SITE_CONTENT.company.name}
      </span>
    </a>

    {/* Desktop Navigation Links */}
    <nav className={`hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest ${
      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
    }`}>
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

    {/* Right Action Controls */}
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      
      {/* Theme Toggle Button - Hides text label on small mobile screens to save space */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle light or dark theme"
        className={`px-2.5 sm:px-3 py-2 rounded-sm border text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800 hover:border-amber-500'
            : 'bg-slate-200 border-slate-300 text-slate-900 hover:bg-slate-300 hover:border-slate-400'
        }`}
      >
        {theme === 'dark' ? (
          <>
            <svg className="w-4 h-4 fill-amber-400 shrink-0" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
            </svg>
            <span className="hidden xs:inline">Light</span>
          </>
        ) : (
          <>
            <svg className="w-4 h-4 fill-slate-800 shrink-0" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
            <span className="hidden xs:inline">Dark</span>
          </>
        )}
      </button>

      {/* Primary CTA Button */}
      <a 
        href="#contact" 
        className="hidden sm:inline-flex items-center gap-2 py-2.5 px-5 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all duration-300"
      >
        <span>Start a Project</span>
        <span>→</span>
      </a>

      {/* Mobile Menu Button - Added shrink-0 and explicit size wrappers */}
      <button
        type="button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className={`lg:hidden p-2 rounded-md focus:outline-none shrink-0 transition-colors ${
          theme === 'dark' ? 'text-slate-300 hover:text-amber-500' : 'text-slate-700 hover:text-amber-500'
        }`}
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

  {/* Mobile Menu Dropdown */}
  {isMobileMenuOpen && (
    <div className={`lg:hidden backdrop-blur-2xl border-b px-6 pt-4 pb-8 space-y-4 ${
      theme === 'dark' ? 'bg-slate-950/95 border-slate-800' : 'bg-white/95 border-slate-200'
    }`}>
      {SITE_CONTENT.nav.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={() => setIsMobileMenuOpen(false)}
          className={`block text-xs font-bold uppercase tracking-widest hover:text-amber-500 py-2.5 border-b transition-colors ${
            theme === 'dark' ? 'text-slate-300 border-slate-900' : 'text-slate-700 border-slate-100'
          }`}
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
          <section className={`relative w-full min-h-[90vh] flex flex-col justify-between py-24 px-4 sm:px-6 lg:px-8 overflow-hidden ${
            theme === 'dark' 
              ? 'bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950' 
              : 'bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white'
          }`}>
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

                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight mt-2 leading-[1.05] text-white">
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
          <section id="about" className={`py-24 border-t relative ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-amber-500 font-bold tracking-widest uppercase text-xs border-l-2 border-amber-500 pl-3 block">
                    {SITE_CONTENT.about.eyebrow}
                  </span>
                  <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>
                    {SITE_CONTENT.about.heading}
                  </h2>
                  <div className={`space-y-4 text-sm leading-relaxed mt-6 font-normal ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {SITE_CONTENT.about.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={`relative border shadow-2xl overflow-hidden h-72 sm:h-96 w-full group ${
                    theme === 'dark' ? 'border-slate-800 bg-slate-950' : 'border-slate-300 bg-slate-200'
                  }`}>
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

                  <div className={`p-6 border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    {SITE_CONTENT.about.stats.map((s, i) => (
                      <div key={i} className="p-2">
                        <span className="block text-2xl sm:text-3xl font-black text-amber-500">{s.value}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 block ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                        }`}>
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
          <section id="services" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.services.eyebrow}</span>
                <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{SITE_CONTENT.services.heading}</h2>
                <p className={`text-sm mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{SITE_CONTENT.services.subhead}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {SITE_CONTENT.services.items.map((item) => (
                  <div 
                    key={item.id} 
                    className={`group relative rounded-sm overflow-hidden flex flex-col justify-between border hover:border-amber-500/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 ${
                      theme === 'dark' 
                        ? 'bg-slate-900/40 border-slate-800/80 backdrop-blur-sm' 
                        : 'bg-slate-50 border-slate-200 shadow-sm'
                    }`}
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
                        <h3 className={`text-xl font-black uppercase group-hover:text-amber-500 transition-colors duration-300 ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>
                          {item.name}
                        </h3>
                        <p className={`text-xs mt-3 leading-relaxed ${
                          theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setSelectedService(item)}
                        className={`w-full py-3.5 border text-amber-500 font-bold uppercase text-xs tracking-wider hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all duration-300 text-center shadow-md ${
                          theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-300'
                        }`}
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
          <section id="portfolio" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.portfolio.eyebrow}</span>
                <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{SITE_CONTENT.portfolio.heading}</h2>
                <p className={`text-sm mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{SITE_CONTENT.portfolio.subhead}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {SITE_CONTENT.portfolio.filters.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider border transition-all ${
                      activeFilter === category
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20'
                        : theme === 'dark'
                        ? 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                        : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`border overflow-hidden group hover:border-slate-500 transition-all ${
                    theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
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
                        <h4 className={`text-lg font-black uppercase ${
                          theme === 'dark' ? 'text-white' : 'text-slate-900'
                        }`}>{project.title}</h4>
                        <span className="text-[10px] font-bold text-emerald-400 uppercase bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5">
                          {project.year}
                        </span>
                      </div>
                      <p className={`text-xs mt-3 leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>{project.summary}</p>
                      <div className={`mt-5 pt-3 border-t text-xs font-bold uppercase flex justify-between ${
                        theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-100 text-slate-400'
                      }`}>
                        <span>Location:</span>
                        <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}>{project.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section */}
          <section id="process" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-amber-500 font-bold tracking-widest uppercase text-xs">{SITE_CONTENT.process.eyebrow}</span>
                <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>{SITE_CONTENT.process.heading}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {SITE_CONTENT.process.steps.map((step, idx) => (
                  <div key={idx} className={`border p-8 flex flex-col justify-between hover:border-amber-500/50 transition-all group ${
                    theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <span className="text-4xl font-black text-amber-500/40 group-hover:text-amber-500 transition-colors block mb-6">0{idx + 1}</span>
                      <h4 className={`font-bold text-lg uppercase ${
                        theme === 'dark' ? 'text-white' : 'text-slate-900'
                      }`}>{step.title}</h4>
                      <p className={`text-xs mt-3 leading-relaxed ${
                        theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                      }`}>{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                  <span className="text-amber-500 font-bold tracking-widest uppercase text-xs border-l-2 border-amber-500 pl-3 block">{SITE_CONTENT.contact.eyebrow}</span>
                  <h2 className={`text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3 ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}>{SITE_CONTENT.contact.heading}</h2>
                  <p className={`text-sm leading-relaxed mt-4 ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {SITE_CONTENT.contact.subhead}
                  </p>

                  <div className="mt-10 space-y-6 text-xs">
                    <div className={`p-4 border ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-slate-500 uppercase font-bold block text-[10px] tracking-wider mb-1">Yard Address</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{SITE_CONTENT.company.address}</span>
                    </div>
                    <div className={`p-4 border ${
                      theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                    }`}>
                      <span className="text-slate-500 uppercase font-bold block text-[10px] tracking-wider mb-1">Email Inquiry</span>
                      <a href={`mailto:${SITE_CONTENT.company.email}`} className="text-amber-500 font-bold text-sm hover:underline">
                        {SITE_CONTENT.company.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-7 p-8 sm:p-10 border shadow-2xl ${
                  theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  {contactSubmitted ? (
                    <div className="p-8 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-bold text-center space-y-4">
                      <p>Thank you! Your inquiry has been submitted. We will contact you by email shortly.</p>
                      <button 
                        onClick={() => setContactSubmitted(false)} 
                        className="text-xs text-amber-500 uppercase underline cursor-pointer"
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
                          className={`w-full border p-4 text-sm focus:border-amber-500 focus:outline-none transition-colors ${
                            theme === 'dark' 
                              ? 'bg-slate-900 border-slate-800 text-white' 
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            required
                            className={`w-full border p-4 text-sm focus:border-amber-500 focus:outline-none transition-colors ${
                              theme === 'dark' 
                                ? 'bg-slate-900 border-slate-800 text-white' 
                                : 'bg-slate-50 border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            className={`w-full border p-4 text-sm focus:border-amber-500 focus:outline-none transition-colors ${
                              theme === 'dark' 
                                ? 'bg-slate-900 border-slate-800 text-white' 
                                : 'bg-slate-50 border-slate-300 text-slate-900'
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Equipment Category</label>
                        <select
                          name="projectType"
                          className={`w-full border p-4 text-sm focus:border-amber-500 focus:outline-none transition-colors ${
                            theme === 'dark' 
                              ? 'bg-slate-900 border-slate-800 text-white' 
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        >
                          <option value="general">General Inquiry</option>
                          <option value="earthmoving">Earthmoving Equipment</option>
                          <option value="lifting">Lifting & Cranes</option>
                          <option value="haulage">Haulage & Transport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-slate-400 mb-2">Message</label>
                        <textarea
                          name="message"
                          rows={4}
                          required
                          className={`w-full border p-4 text-sm focus:border-amber-500 focus:outline-none transition-colors ${
                            theme === 'dark' 
                              ? 'bg-slate-900 border-slate-800 text-white' 
                              : 'bg-slate-50 border-slate-300 text-slate-900'
                          }`}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className="w-full py-4 bg-amber-500 text-slate-950 font-black uppercase text-xs tracking-wider hover:bg-amber-400 transition-all duration-300 disabled:opacity-50 cursor-pointer"
                      >
                        {contactSubmitting ? 'Sending...' : 'Send Message'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>


        {/* Footer Component */}
<footer className={`border-t transition-colors duration-300 ${
  theme === 'dark' 
    ? 'bg-slate-950 border-slate-800 text-slate-400' 
    : 'bg-slate-900 border-slate-800 text-slate-400'
}`}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
      
      {/* Brand Info */}
      <div className="lg:col-span-2 space-y-4">
        <a href="#top" className="flex items-center gap-3 group inline-flex">
          <div className="relative w-4 h-4 bg-amber-500 group-hover:rotate-45 transition-transform duration-500 ease-out shadow-[0_0_12px_rgba(245,158,11,0.5)]">
            <div className="absolute inset-0 bg-amber-400 animate-ping opacity-75"></div>
          </div>
          <span className="font-black text-lg uppercase tracking-wider text-white group-hover:text-amber-500 transition-colors">
            {SITE_CONTENT.company.name}
          </span>
        </a>
        <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
          {SITE_CONTENT.company.fullName} provides heavy equipment leasing, operator staffing, and site fleet logistics across Nigeria.
        </p>
        <div className="text-xs text-slate-500 pt-2">
          <span>Yard Location: </span>
          <span className="text-slate-300 font-bold">{SITE_CONTENT.company.address}</span>
        </div>
      </div>

      {/* Navigation Links */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Navigation</h4>
        <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
          {SITE_CONTENT.nav.map((item) => (
            <li key={item.label}>
              <a href={item.href} className="hover:text-amber-500 transition-colors">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Equipment Categories */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Fleet Categories</h4>
        <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
          <li><a href="#services" className="hover:text-amber-500 transition-colors">Earthmoving</a></li>
          <li><a href="#services" className="hover:text-amber-500 transition-colors">Lifting & Cranes</a></li>
          <li><a href="#services" className="hover:text-amber-500 transition-colors">Compaction</a></li>
          <li><a href="#services" className="hover:text-amber-500 transition-colors">Power Generation</a></li>
          <li><a href="#services" className="hover:text-amber-500 transition-colors">Haulage & Transport</a></li>
        </ul>
      </div>

      {/* Direct Contact */}
      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Direct Contact</h4>
        <div className="space-y-3 text-xs">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold">Dispatch Email</span>
            <a href={`mailto:${SITE_CONTENT.company.email}`} className="text-amber-500 font-bold hover:underline">
              {SITE_CONTENT.company.email}
            </a>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold">24/7 Support</span>
            <span className="text-slate-300 font-bold">+234 (0) 800-MACHINERY</span>
          </div>
        </div>
      </div>

    </div>

    {/* Bottom Bar */}
    <div className="mt-16 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
      <p>© {new Date().getFullYear()} {SITE_CONTENT.company.fullName}. All rights reserved.</p>
      <a href="#top" className="text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest text-[10px] transition-colors">
        Back to top ↑
      </a>
    </div>
  </div>
</footer>

        {/* Modal for Service Interest */}
        {selectedService && (
          <InterestModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>
    </>
  );
}