import { useState, useEffect } from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import SplashScreen from './components/SplashScreen';
import { SITE_CONTENT, type ServiceItem } from './data/content';
import { InterestModal } from './components/InterestModal';
import { AnimatedMetrics } from './components/AnimatedMetrics';

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

    const interval = setInterval(() => {
      setCurrentAboutImage((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
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
          access_key: "710745a1-96b8-4988-800f-776ca3e7849c",
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

  // Shared tokens
  const focusRing = "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8590C]";

  return (
    <HelmetProvider>
      <Helmet>
        <title>Swanlake Machinery | Heavy Equipment Leasing & Rental</title>
        <meta
          name="description"
          content="High-performance heavy equipment rental, machinery leasing, and fleet solutions for construction projects across Nigeria."
        />
        <meta
          name="keywords"
          content="Swanlake Machinery, heavy equipment rental, machinery leasing, fleet management, construction machinery"
        />
        <link rel="canonical" href="https://swanlakemachinery.com" />
      </Helmet>

      {loading && <SplashScreen />}

      <div className={`min-h-screen font-sans transition-colors duration-300 selection:bg-[#E8590C] selection:text-[#14171B] ${
        theme === 'dark' ? 'bg-[#14171B] text-[#ECEDEF]' : 'bg-[#F3F2EE] text-[#14171B]'
      }`}>

        {/* Header Navigation */}
        <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-[#14171B]/85 border-[#242A31] text-[#ECEDEF]'
            : 'bg-white/85 border-[#C9C6BC] text-[#14171B]'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">

            {/* Logo */}
            <a href="#top" className={`flex items-center gap-2 shrink min-w-0 rounded-sm ${focusRing}`}>
              <div
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#E8590C] shrink-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)' }}
              />
              <span className={`font-['Barlow_Condensed',sans-serif] font-black text-sm sm:text-xl uppercase tracking-wider truncate ${
                theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
              }`}>
                {SITE_CONTENT.company.name}
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className={`hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest ${
              theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
            }`}>
              {SITE_CONTENT.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`hover:text-[#E8590C] transition-colors relative py-2 rounded-sm ${focusRing}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={`p-2 sm:px-3 sm:py-2 rounded-sm border text-xs font-black uppercase flex items-center gap-2 cursor-pointer transition-colors ${focusRing} ${
                  theme === 'dark'
                    ? 'bg-[#1B1F24] border-[#333B44] text-[#FFC42B]'
                    : 'bg-[#E8E6DF] border-[#C9C6BC] text-[#14171B]'
                }`}
              >
                {theme === 'dark' ? (
                  <svg className="w-4 h-4 fill-[#FFC42B] shrink-0" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 fill-[#14171B] shrink-0" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
                <span className="hidden md:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
              </button>

              <a
                href="#contact"
                className={`hidden sm:inline-flex items-center py-2 px-4 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider hover:bg-[#FF7A29] transition-colors ${focusRing}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
              >
                Start Project
              </a>

              {/* Mobile Navigation Toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md transition-colors ${focusRing} ${
                  theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
                }`}
                aria-label="Toggle menu"
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

          {/* Expanded Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className={`lg:hidden border-b px-4 py-6 space-y-4 ${
              theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
            }`}>
              <nav className="flex flex-col gap-4 text-sm font-bold uppercase tracking-wider">
                {SITE_CONTENT.nav.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="hover:text-[#E8590C] transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </header>

        <main id="top" className="pt-16 sm:pt-20">

          {/* Hero Section */}
          <section className="relative w-full h-auto pt-8 sm:pt-20 pb-12 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#14171B] via-[#1B1F24] to-[#14171B] text-[#ECEDEF]">
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                ref={(videoRef) => {
                  if (videoRef) {
                    videoRef.muted = true;
                    videoRef.play().catch((err) => {
                      console.warn("Autoplay deferred by browser policy:", err);
                    });
                  }
                }}
                className="w-full h-full object-cover scale-105 motion-reduce:hidden"
              >
                <source src={SITE_CONTENT.hero.videoSrc} type="video/mp4" />
                Your browser does not support video playback.
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-[#14171B] via-[#14171B]/70 to-[#14171B]/90" />
              <div className="absolute inset-0 bg-[radial-gradient(#333B44_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-start">
              <div className="mt-4 sm:mt-8 max-w-4xl">
                <div
                  className="inline-flex items-center gap-2 pl-3 pr-3.5 py-1 bg-[#1B1F24] border-t-2 border-[#E8590C] text-[#ECEDEF]/90 text-[11px] sm:text-xs font-semibold mb-4"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#E8590C] shrink-0" />
                  {SITE_CONTENT.hero.eyebrow}
                </div>

                <h1 className="font-['Barlow_Condensed',sans-serif] text-3xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.1] text-[#ECEDEF]">
                  {SITE_CONTENT.hero.headlinePrefix}{" "}
                  <span className="inline-block overflow-hidden align-top h-[1.25em]">
                    <span
                      className={`block text-[#E8590C] transition-all duration-700 ease-in-out transform motion-reduce:transition-none motion-reduce:transform-none ${
                        isAnimating
                          ? '-translate-y-full opacity-0'
                          : 'translate-y-0 opacity-100'
                      }`}
                    >
                      {SITE_CONTENT.hero.rotatingWords[wordIndex]}
                    </span>
                  </span>
                </h1>

                <p className="text-[#B7BCC3] text-xs sm:text-base mt-4 sm:mt-6 max-w-2xl leading-relaxed font-normal">
                  {SITE_CONTENT.hero.subhead}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                  <a
                    href={SITE_CONTENT.hero.ctaPrimary.href}
                    className={`w-full sm:w-auto text-center py-3.5 sm:py-4 px-7 sm:px-9 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider hover:bg-[#FF7A29] transition-colors duration-300 ${focusRing}`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                  >
                    {SITE_CONTENT.hero.ctaPrimary.label}
                  </a>
                  <a
                    href={SITE_CONTENT.hero.ctaSecondary.href}
                    className={`w-full sm:w-auto text-center py-3.5 sm:py-4 px-7 sm:px-9 border border-[#333B44] bg-[#1B1F24]/50 backdrop-blur-sm text-[#ECEDEF] font-bold uppercase text-xs tracking-wider hover:border-[#E8590C] hover:text-[#E8590C] transition-colors duration-300 ${focusRing}`}
                  >
                    {SITE_CONTENT.hero.ctaSecondary.label}
                  </a>
                </div>
              </div>

              {/* Responsive Metrics Block */}
              <div className="grid grid-cols-3 gap-2 sm:gap-6 border-t border-[#242A31] pt-6 mt-8 sm:mt-12 max-w-4xl">
                {SITE_CONTENT.hero.stats.map((stat, i) => (
                  <AnimatedMetrics key={i} value={stat.value} label={stat.label} />
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <div>
                  <span className="text-[#E8590C] font-semibold text-xs sm:text-sm border-l-2 border-[#E8590C] pl-3 block">
                    {SITE_CONTENT.about.eyebrow}
                  </span>
                  <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-2 sm:mt-3 ${
                    theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                  }`}>
                    {SITE_CONTENT.about.heading}
                  </h2>
                  <div className={`space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed mt-4 sm:mt-6 font-normal ${
                    theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
                  }`}>
                    {SITE_CONTENT.about.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={`relative border shadow-2xl overflow-hidden h-60 sm:h-96 w-full ${
                    theme === 'dark' ? 'border-[#242A31] bg-[#14171B]' : 'border-[#C9C6BC] bg-[#F3F2EE]'
                  }`}>
                    {SITE_CONTENT.about.images.map((imgUrl, index) => (
                      <img
                        key={imgUrl}
                        src={imgUrl}
                        alt={`${SITE_CONTENT.company.fullName} machine ${index + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80";
                        }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
                          index === currentAboutImage ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                      />
                    ))}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-[#14171B]/70 p-2 backdrop-blur-md border border-[#242A31]">
                      {SITE_CONTENT.about.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentAboutImage(index)}
                          className={`h-2 transition-all rounded-sm ${focusRing} ${
                            index === currentAboutImage ? 'w-8 bg-[#E8590C]' : 'w-2 bg-white/40'
                          }`}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className={`p-4 sm:p-6 border grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-center ${
                    theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC] shadow-sm'
                  }`}>
                    {SITE_CONTENT.about.stats.map((s, i) => (
                      <div key={i} className="p-1 sm:p-2">
                        <span className="block text-xl sm:text-3xl font-['Barlow_Condensed',sans-serif] font-black text-[#E8590C]">{s.value}</span>
                        <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 block ${
                          theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#6B7178]'
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

          {/* Services Section — Single column on mobile */}
          {/* <section id="services" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span className="text-[#E8590C] font-semibold text-xs sm:text-sm">{SITE_CONTENT.services.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-1 sm:mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.services.heading}</h2>
                <p className={`text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.services.subhead}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {SITE_CONTENT.services.items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden flex flex-col justify-between border transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-[#1B1F24] border-[#242A31] hover:border-[#E8590C]/70'
                        : 'bg-[#F9F8F5] border-[#C9C6BC] hover:border-[#E8590C]/70 shadow-sm'
                    }`}
                  >
                    <span className="absolute top-0 left-0 h-[3px] w-0 bg-[#E8590C] transition-all duration-300 group-hover:w-full z-20" />
                    <div>
                      <div className="relative overflow-hidden h-48 sm:h-60">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out motion-reduce:transform-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14171B] via-[#14171B]/40 to-transparent" />
                        <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#FFC42B] text-[#14171B]">
                          Available
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className={`font-['Barlow_Condensed',sans-serif] text-lg sm:text-xl font-bold uppercase group-hover:text-[#E8590C] transition-colors duration-300 ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className={`text-xs mt-2.5 leading-relaxed ${
                          theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                        }`}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 pt-0">
                      <button
                        onClick={() => setSelectedService(item)}
                        className={`w-full py-3 border text-[#E8590C] font-bold uppercase text-xs tracking-wider hover:bg-[#E8590C] hover:text-[#14171B] hover:border-[#E8590C] transition-colors duration-300 text-center ${focusRing} ${
                          theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
                        }`}
                      >
                        Express Interest
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
          <section id="services" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span className="text-[#E8590C] font-semibold text-xs sm:text-sm">{SITE_CONTENT.services.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-1 sm:mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.services.heading}</h2>
                <p className={`text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.services.subhead}</p>
              </div>

              {/* Strictly 1 column on mobile, switching to 2 cols at md and 3 cols at lg */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {SITE_CONTENT.services.items.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative overflow-hidden flex flex-col justify-between border transition-colors duration-300 ${
                      theme === 'dark'
                        ? 'bg-[#1B1F24] border-[#242A31] hover:border-[#E8590C]/70'
                        : 'bg-[#F9F8F5] border-[#C9C6BC] hover:border-[#E8590C]/70 shadow-sm'
                    }`}
                  >
                    <span className="absolute top-0 left-0 h-[3px] w-0 bg-[#E8590C] transition-all duration-300 group-hover:w-full z-20" />
                    <div>
                      <div className="relative overflow-hidden h-48 sm:h-60">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out motion-reduce:transform-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14171B] via-[#14171B]/40 to-transparent" />
                        <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-[#FFC42B] text-[#14171B]">
                          Available
                        </span>
                      </div>
                      <div className="p-5 sm:p-6">
                        <h3 className={`font-['Barlow_Condensed',sans-serif] text-lg sm:text-xl font-bold uppercase group-hover:text-[#E8590C] transition-colors duration-300 ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className={`text-xs mt-2.5 leading-relaxed ${
                          theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                        }`}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6 pt-0">
                      <button
                        onClick={() => setSelectedService(item)}
                        className={`w-full py-3 border text-[#E8590C] font-bold uppercase text-xs tracking-wider hover:bg-[#E8590C] hover:text-[#14171B] hover:border-[#E8590C] transition-colors duration-300 text-center ${focusRing} ${
                          theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
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

          {/* Portfolio Section — Single column on mobile */}
          {/* <section id="portfolio" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                <span className="text-[#E8590C] font-semibold text-xs sm:text-sm">{SITE_CONTENT.portfolio.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-1 sm:mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.portfolio.heading}</h2>
                <p className={`text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.portfolio.subhead}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
                {SITE_CONTENT.portfolio.filters.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-colors ${focusRing} ${
                      activeFilter === category
                        ? 'bg-[#E8590C] text-[#14171B] border-[#E8590C]'
                        : theme === 'dark'
                        ? 'bg-[#14171B] text-[#9CA3AC] border-[#242A31] hover:border-[#333B44]'
                        : 'bg-white text-[#4B5158] border-[#C9C6BC] hover:border-[#9C9890]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`border overflow-hidden group transition-colors ${
                    theme === 'dark' ? 'bg-[#14171B] border-[#242A31] hover:border-[#333B44]' : 'bg-white border-[#C9C6BC] hover:border-[#9C9890] shadow-sm'
                  }`}>
                    <div className="h-44 sm:h-52 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-[filter] duration-500 motion-reduce:transition-none"
                      />
                      <div className="absolute top-3 left-3 bg-[#E8590C] text-[#14171B] text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-['Barlow_Condensed',sans-serif] text-base sm:text-lg font-bold uppercase ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>{project.title}</h4>
                        <span className="text-[10px] font-bold text-[#5C7A99] uppercase bg-[#5C7A99]/10 border border-[#5C7A99]/30 px-2 py-0.5">
                          {project.year}
                        </span>
                      </div>
                      <p className={`text-xs mt-2.5 leading-relaxed ${
                        theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                      }`}>{project.summary}</p>
                      <div className={`mt-4 pt-3 border-t text-xs font-bold uppercase flex justify-between ${
                        theme === 'dark' ? 'border-[#1B1F24] text-[#6B7178]' : 'border-[#E8E6DF] text-[#9C9890]'
                      }`}>
                        <span>Location:</span>
                        <span className={theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'}>{project.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section> */}
          {/* Portfolio Section */}
          <section id="portfolio" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
                <span className="text-[#E8590C] font-semibold text-xs sm:text-sm">{SITE_CONTENT.portfolio.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-1 sm:mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.portfolio.heading}</h2>
                <p className={`text-xs sm:text-sm mt-3 sm:mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.portfolio.subhead}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-8 sm:mb-12">
                {SITE_CONTENT.portfolio.filters.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-4 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider border transition-colors ${focusRing} ${
                      activeFilter === category
                        ? 'bg-[#E8590C] text-[#14171B] border-[#E8590C]'
                        : theme === 'dark'
                        ? 'bg-[#14171B] text-[#9CA3AC] border-[#242A31] hover:border-[#333B44]'
                        : 'bg-white text-[#4B5158] border-[#C9C6BC] hover:border-[#9C9890]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Strictly 1 column on mobile, switching at md/lg */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`border overflow-hidden group transition-colors ${
                    theme === 'dark' ? 'bg-[#14171B] border-[#242A31] hover:border-[#333B44]' : 'bg-white border-[#C9C6BC] hover:border-[#9C9890] shadow-sm'
                  }`}>
                    <div className="h-44 sm:h-52 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-[filter] duration-500 motion-reduce:transition-none"
                      />
                      <div className="absolute top-3 left-3 bg-[#E8590C] text-[#14171B] text-[10px] font-black uppercase tracking-widest px-2.5 py-1">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-['Barlow_Condensed',sans-serif] text-base sm:text-lg font-bold uppercase ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>{project.title}</h4>
                        <span className="text-[10px] font-bold text-[#5C7A99] uppercase bg-[#5C7A99]/10 border border-[#5C7A99]/30 px-2 py-0.5">
                          {project.year}
                        </span>
                      </div>
                      <p className={`text-xs mt-2.5 leading-relaxed ${
                        theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                      }`}>{project.summary}</p>
                      <div className={`mt-4 pt-3 border-t text-xs font-bold uppercase flex justify-between ${
                        theme === 'dark' ? 'border-[#1B1F24] text-[#6B7178]' : 'border-[#E8E6DF] text-[#9C9890]'
                      }`}>
                        <span>Location:</span>
                        <span className={theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'}>{project.location}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Process Section — Single column on mobile */}
          {/* Process Section */}
          <section id="process" className={`py-12 sm:py-24 border-t ${
            theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                <span className="text-[#E8590C] font-semibold text-xs sm:text-sm">{SITE_CONTENT.process.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-2xl sm:text-5xl font-black uppercase tracking-tight mt-1 sm:mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.process.heading}</h2>
              </div>

              <div className="relative max-w-6xl mx-auto">
                <div className={`hidden lg:block absolute top-6 left-[6%] right-[6%] h-px ${
                  theme === 'dark' ? 'bg-[#242A31]' : 'bg-[#C9C6BC]'
                }`} />
                {/* 1 column on mobile, 2 columns on tablet, 4 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 sm:gap-y-10 gap-x-6">
                  {SITE_CONTENT.process.steps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-start">
                      <div
                        className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center font-['Barlow_Condensed',sans-serif] font-bold text-base sm:text-lg border-2 border-[#E8590C] text-[#E8590C] ${
                          theme === 'dark' ? 'bg-[#14171B]' : 'bg-white'
                        }`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                      >
                        {idx + 1}
                      </div>
                      <h4 className={`font-['Barlow_Condensed',sans-serif] font-bold text-lg sm:text-xl uppercase mt-3 sm:mt-5 ${
                        theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                      }`}>{step.title}</h4>
                      <p className={`text-xs mt-2 sm:mt-3 leading-relaxed ${
                        theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                      }`}>{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer — Single column on mobile */}
        {/* <footer className="border-t bg-[#14171B] border-[#242A31] text-[#9CA3AC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">

              <div className="grid-cols-1 sm:col-span-2 space-y-3 sm:space-y-4">
                <a href="#top" className={`flex items-center gap-2.5 rounded-sm ${focusRing}`}>
                  <div
                    className="w-4 h-4 bg-[#E8590C]"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)' }}
                  />
                  <span className="font-['Barlow_Condensed',sans-serif] font-black text-lg uppercase tracking-wider text-[#ECEDEF]">
                    {SITE_CONTENT.company.name}
                  </span>
                </a>
                <p className="text-xs leading-relaxed text-[#9CA3AC] max-w-sm">
                  {SITE_CONTENT.company.fullName} provides heavy equipment leasing, operator staffing, and site fleet logistics across Nigeria.
                </p>
                <div className="text-xs text-[#6B7178] pt-1 sm:pt-2">
                  <span>Yard Location: </span>
                  <span className="text-[#B7BCC3] font-bold">{SITE_CONTENT.company.address}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Navigation</h4>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
                  {SITE_CONTENT.nav.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Fleet Categories</h4>
                <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Earthmoving</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Lifting & Cranes</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Compaction</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Power Generation</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Haulage & Transport</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Direct Contact</h4>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="block text-[10px] text-[#6B7178] uppercase font-bold">Dispatch Email</span>
                    <a href={`mailto:${SITE_CONTENT.company.email}`} className={`text-[#E8590C] font-bold hover:underline rounded-sm ${focusRing}`}>
                      {SITE_CONTENT.company.email}
                    </a>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#6B7178] uppercase font-bold">24/7 Support</span>
                    <span className="text-[#B7BCC3] font-bold">+234 (0) 800-MACHINERY</span>
                  </div>
                </div>
              </div>

            </div>

            <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-[#242A31] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7178]">
              <p>© {new Date().getFullYear()} {SITE_CONTENT.company.fullName}. All rights reserved.</p>
              <a href="#top" className={`text-[#E8590C] hover:text-[#FF7A29] font-bold uppercase tracking-widest text-[10px] transition-colors rounded-sm ${focusRing}`}>
                Back to top
              </a>
            </div>
          </div>
        </footer> */}
        <footer className="border-t bg-[#14171B] border-[#242A31] text-[#9CA3AC]">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
    {/* 1 column on mobile, 2 columns at md, 5 columns at lg */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">

      <div className="md:col-span-2 space-y-3 sm:space-y-4">
        <a href="#top" className={`flex items-center gap-2.5 rounded-sm ${focusRing}`}>
          <div
            className="w-4 h-4 bg-[#E8590C]"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)' }}
          />
          <span className="font-['Barlow_Condensed',sans-serif] font-black text-lg uppercase tracking-wider text-[#ECEDEF]">
            {SITE_CONTENT.company.name}
          </span>
        </a>
        <p className="text-xs leading-relaxed text-[#9CA3AC] max-w-sm">
          {SITE_CONTENT.company.fullName} provides heavy equipment leasing, operator staffing, and site fleet logistics across Nigeria.
        </p>
        <div className="text-xs text-[#6B7178] pt-1 sm:pt-2">
          <span>Yard Location: </span>
          <span className="text-[#B7BCC3] font-bold">{SITE_CONTENT.company.address}</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Navigation</h4>
        <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
          {SITE_CONTENT.nav.map((item) => (
            <li key={item.label}>
              <a href={item.href} className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Fleet Categories</h4>
        <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
          <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Earthmoving</a></li>
          <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Lifting & Cranes</a></li>
          <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Compaction</a></li>
          <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Power Generation</a></li>
          <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Haulage & Transport</a></li>
        </ul>
      </div>

      <div>
        <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-3 sm:mb-4">Direct Contact</h4>
        <div className="space-y-3 text-xs">
          <div>
            <span className="block text-[10px] text-[#6B7178] uppercase font-bold">Dispatch Email</span>
            <a href={`mailto:${SITE_CONTENT.company.email}`} className={`text-[#E8590C] font-bold hover:underline rounded-sm ${focusRing}`}>
              {SITE_CONTENT.company.email}
            </a>
          </div>
          <div>
            <span className="block text-[10px] text-[#6B7178] uppercase font-bold">24/7 Support</span>
            <span className="text-[#B7BCC3] font-bold">+234 (0) 800-MACHINERY</span>
          </div>
        </div>
      </div>

    </div>

    <div className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-[#242A31] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7178]">
      <p>© {new Date().getFullYear()} {SITE_CONTENT.company.fullName}. All rights reserved.</p>
      <a href="#top" className={`text-[#E8590C] hover:text-[#FF7A29] font-bold uppercase tracking-widest text-[10px] transition-colors rounded-sm ${focusRing}`}>
        Back to top
      </a>
    </div>
  </div>
</footer>

        {selectedService && (
          <InterestModal
            theme={theme}
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
      </div>
    </HelmetProvider>
  );
}