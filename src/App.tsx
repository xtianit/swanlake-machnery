import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import { SITE_CONTENT, type ServiceItem } from './data/content';
import { InterestModal } from './components/InterestModal';
//new content

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

  // Shared tokens (kept inline to match the rest of the file's style)
  const focusRing = "focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E8590C]";

  return (
    <>
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-2 sm:gap-4">

            {/* Logo */}
            <a href="#top" className={`flex items-center gap-2 sm:gap-3 shrink min-w-0 rounded-sm ${focusRing}`}>
              <div
                className="w-4 h-4 bg-[#E8590C] shrink-0 transition-colors duration-300 group-hover:bg-[#FF7A29]"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)' }}
              />
              <span className={`font-['Barlow_Condensed',sans-serif] font-black text-base sm:text-xl uppercase tracking-wider truncate ${
                theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
              }`}>
                {SITE_CONTENT.company.name}
              </span>
            </a>

            {/* Desktop Navigation Links */}
            <nav className={`hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-widest ${
              theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
            }`}>
              {SITE_CONTENT.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className={`hover:text-[#E8590C] transition-colors relative py-2 rounded-sm after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#E8590C] hover:after:w-full after:transition-all after:duration-300 ${focusRing}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">

              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle light or dark theme"
                className={`px-2.5 sm:px-3 py-2 rounded-sm border text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-colors duration-300 ${focusRing} ${
                  theme === 'dark'
                    ? 'bg-[#1B1F24] border-[#333B44] text-[#FFC42B] hover:bg-[#242A31] hover:border-[#E8590C]'
                    : 'bg-[#E8E6DF] border-[#C9C6BC] text-[#14171B] hover:bg-[#DDDACF] hover:border-[#9C9890]'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <svg className="w-4 h-4 fill-[#FFC42B] shrink-0" viewBox="0 0 20 20">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                    </svg>
                    <span className="hidden sm:inline">Light</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 fill-[#14171B] shrink-0" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                    <span className="hidden sm:inline">Dark</span>
                  </>
                )}
              </button>

              {/* Primary CTA Button */}
              <a
                href="#contact"
                className={`hidden sm:inline-flex items-center py-2.5 px-5 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider hover:bg-[#FF7A29] transition-colors duration-300 ${focusRing}`}
                style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
              >
                Start a Project
              </a>

              {/* Mobile Menu Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2 rounded-md shrink-0 transition-colors ${focusRing} ${
                  theme === 'dark' ? 'text-[#B7BCC3] hover:text-[#E8590C]' : 'text-[#4B5158] hover:text-[#E8590C]'
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
              theme === 'dark' ? 'bg-[#14171B]/95 border-[#242A31]' : 'bg-white/95 border-[#C9C6BC]'
            }`}>
              {SITE_CONTENT.nav.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-xs font-bold uppercase tracking-widest hover:text-[#E8590C] py-2.5 border-b transition-colors rounded-sm ${focusRing} ${
                    theme === 'dark' ? 'text-[#B7BCC3] border-[#1B1F24]' : 'text-[#4B5158] border-[#E8E6DF]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block text-center py-3.5 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider mt-4 ${focusRing}`}
              >
                Start a Project
              </a>
            </div>
          )}
        </header>

        <main id="top" className="pt-20">

          {/* Hero Section */}
          <section className="relative w-full min-h-[90vh] flex flex-col justify-between py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-[#14171B] via-[#1B1F24] to-[#14171B] text-[#ECEDEF]">
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
                className="w-full h-full object-cover opacity-20 scale-105 motion-reduce:hidden"
              >
                <source src={SITE_CONTENT.hero.videoSrc} type="video/mp4" />
                Your browser does not support video playback.
              </video>

              <div className="absolute inset-0 bg-gradient-to-t from-[#14171B] via-[#14171B]/60 to-[#14171B]/90" />
              <div className="absolute inset-0 bg-[radial-gradient(#333B44_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-between h-full flex-1">
              <div className="mt-8 max-w-4xl">
                <div
                  className="inline-flex items-center gap-2.5 pl-3 pr-4 py-1.5 bg-[#1B1F24] border-t-2 border-[#E8590C] text-[#ECEDEF]/90 text-xs font-semibold mb-5"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 0 100%)' }}
                >
                  <span className="w-1.5 h-1.5 bg-[#E8590C] shrink-0" />
                  {SITE_CONTENT.hero.eyebrow}
                </div>

                <h1 className="font-['Barlow_Condensed',sans-serif] text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-[1.05] text-[#ECEDEF]">
                  {SITE_CONTENT.hero.headlinePrefix}{" "}
                  <span className="inline-block overflow-hidden align-top h-[1.35em] py-1">
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

                <p className="text-[#B7BCC3] text-sm sm:text-base mt-6 max-w-2xl leading-relaxed font-normal">
                  {SITE_CONTENT.hero.subhead}
                </p>

                <div className="flex flex-wrap gap-4 mt-8">
                  <a
                    href={SITE_CONTENT.hero.ctaPrimary.href}
                    className={`py-4 px-9 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider hover:bg-[#FF7A29] transition-colors duration-300 ${focusRing}`}
                    style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
                  >
                    {SITE_CONTENT.hero.ctaPrimary.label}
                  </a>
                  <a
                    href={SITE_CONTENT.hero.ctaSecondary.href}
                    className={`py-4 px-9 border border-[#333B44] bg-[#1B1F24]/50 backdrop-blur-sm text-[#ECEDEF] font-bold uppercase text-xs tracking-wider hover:border-[#E8590C] hover:text-[#E8590C] transition-colors duration-300 ${focusRing}`}
                  >
                    {SITE_CONTENT.hero.ctaSecondary.label}
                  </a>
                </div>
              </div>

              {/* Hero Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#242A31] pt-8 mt-16 max-w-4xl">
                {SITE_CONTENT.hero.stats.map((stat, i) => (
                  <div key={i} className="bg-[#1B1F24]/60 p-4 border border-[#242A31] backdrop-blur-sm">
                    <span className="block text-3xl sm:text-4xl font-['Barlow_Condensed',sans-serif] font-black text-[#E8590C]">{stat.value}</span>
                    <span className="text-[10px] sm:text-xs font-bold text-[#9CA3AC] uppercase tracking-wider mt-1 block">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <span className="text-[#E8590C] font-semibold text-sm border-l-2 border-[#E8590C] pl-3 block">
                    {SITE_CONTENT.about.eyebrow}
                  </span>
                  <h2 className={`font-['Barlow_Condensed',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3 ${
                    theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                  }`}>
                    {SITE_CONTENT.about.heading}
                  </h2>
                  <div className={`space-y-4 text-sm leading-relaxed mt-6 font-normal ${
                    theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
                  }`}>
                    {SITE_CONTENT.about.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <div className={`relative border shadow-2xl overflow-hidden h-72 sm:h-96 w-full ${
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

                  <div className={`p-6 border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center ${
                    theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC] shadow-sm'
                  }`}>
                    {SITE_CONTENT.about.stats.map((s, i) => (
                      <div key={i} className="p-2">
                        <span className="block text-2xl sm:text-3xl font-['Barlow_Condensed',sans-serif] font-black text-[#E8590C]">{s.value}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider mt-1 block ${
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

          {/* Services Section */}
          <section id="services" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#E8590C] font-semibold text-sm">{SITE_CONTENT.services.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.services.heading}</h2>
                <p className={`text-sm mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.services.subhead}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      <div className="relative overflow-hidden h-60">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out motion-reduce:transform-none"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#14171B] via-[#14171B]/40 to-transparent" />
                        <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 bg-[#FFC42B] text-[#14171B]">
                          Available
                        </span>
                      </div>
                      <div className="p-6">
                        <h3 className={`font-['Barlow_Condensed',sans-serif] text-xl font-bold uppercase group-hover:text-[#E8590C] transition-colors duration-300 ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>
                          {item.name}
                        </h3>
                        <p className={`text-xs mt-3 leading-relaxed ${
                          theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                        }`}>
                          {item.summary}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setSelectedService(item)}
                        className={`w-full py-3.5 border text-[#E8590C] font-bold uppercase text-xs tracking-wider hover:bg-[#E8590C] hover:text-[#14171B] hover:border-[#E8590C] transition-colors duration-300 text-center ${focusRing} ${
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

          {/* Portfolio Section */}
          <section id="portfolio" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-[#E8590C] font-semibold text-sm">{SITE_CONTENT.portfolio.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.portfolio.heading}</h2>
                <p className={`text-sm mt-4 leading-relaxed ${
                  theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                }`}>{SITE_CONTENT.portfolio.subhead}</p>
              </div>

              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {SITE_CONTENT.portfolio.filters.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider border transition-colors ${focusRing} ${
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <div key={project.id} className={`border overflow-hidden group transition-colors ${
                    theme === 'dark' ? 'bg-[#14171B] border-[#242A31] hover:border-[#333B44]' : 'bg-white border-[#C9C6BC] hover:border-[#9C9890] shadow-sm'
                  }`}>
                    <div className="h-52 overflow-hidden relative">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:brightness-110 transition-[filter] duration-500 motion-reduce:transition-none"
                      />
                      <div className="absolute top-4 left-4 bg-[#E8590C] text-[#14171B] text-[10px] font-black uppercase tracking-widest px-3 py-1">
                        {project.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-['Barlow_Condensed',sans-serif] text-lg font-bold uppercase ${
                          theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                        }`}>{project.title}</h4>
                        <span className="text-[10px] font-bold text-[#5C7A99] uppercase bg-[#5C7A99]/10 border border-[#5C7A99]/30 px-2 py-0.5">
                          {project.year}
                        </span>
                      </div>
                      <p className={`text-xs mt-3 leading-relaxed ${
                        theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                      }`}>{project.summary}</p>
                      <div className={`mt-5 pt-3 border-t text-xs font-bold uppercase flex justify-between ${
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

          {/* Process Section */}
          <section id="process" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-[#E8590C] font-semibold text-sm">{SITE_CONTENT.process.eyebrow}</span>
                <h2 className={`font-['Barlow_Condensed',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight mt-2 ${
                  theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                }`}>{SITE_CONTENT.process.heading}</h2>
              </div>

              <div className="relative max-w-6xl mx-auto">
                <div className={`hidden sm:block absolute top-6 left-[6%] right-[6%] h-px ${
                  theme === 'dark' ? 'bg-[#242A31]' : 'bg-[#C9C6BC]'
                }`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
                  {SITE_CONTENT.process.steps.map((step, idx) => (
                    <div key={idx} className="relative flex flex-col items-start">
                      <div
                        className={`relative z-10 w-12 h-12 flex items-center justify-center font-['Barlow_Condensed',sans-serif] font-bold text-lg border-2 border-[#E8590C] text-[#E8590C] ${
                          theme === 'dark' ? 'bg-[#14171B]' : 'bg-white'
                        }`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)' }}
                      >
                        {idx + 1}
                      </div>
                      <h4 className={`font-['Barlow_Condensed',sans-serif] font-bold text-xl uppercase mt-5 ${
                        theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                      }`}>{step.title}</h4>
                      <p className={`text-xs mt-3 leading-relaxed ${
                        theme === 'dark' ? 'text-[#9CA3AC]' : 'text-[#4B5158]'
                      }`}>{step.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className={`py-24 border-t ${
            theme === 'dark' ? 'bg-[#1B1F24] border-[#242A31]' : 'bg-[#E8E6DF] border-[#C9C6BC]'
          }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5">
                  <span className="text-[#E8590C] font-semibold text-sm border-l-2 border-[#E8590C] pl-3 block">{SITE_CONTENT.contact.eyebrow}</span>
                  <h2 className={`font-['Barlow_Condensed',sans-serif] text-3xl sm:text-5xl font-black uppercase tracking-tight mt-3 ${
                    theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'
                  }`}>{SITE_CONTENT.contact.heading}</h2>
                  <p className={`text-sm leading-relaxed mt-4 ${
                    theme === 'dark' ? 'text-[#B7BCC3]' : 'text-[#4B5158]'
                  }`}>
                    {SITE_CONTENT.contact.subhead}
                  </p>

                  <div className="mt-10 space-y-6 text-xs">
                    <div className={`p-4 border ${
                      theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
                    }`}>
                      <span className="text-[#6B7178] uppercase font-bold block text-[10px] tracking-wider mb-1">Yard Address</span>
                      <span className={`font-bold ${theme === 'dark' ? 'text-[#ECEDEF]' : 'text-[#14171B]'}`}>{SITE_CONTENT.company.address}</span>
                    </div>
                    <div className={`p-4 border ${
                      theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
                    }`}>
                      <span className="text-[#6B7178] uppercase font-bold block text-[10px] tracking-wider mb-1">Email Inquiry</span>
                      <a href={`mailto:${SITE_CONTENT.company.email}`} className={`text-[#E8590C] font-bold text-sm hover:underline rounded-sm ${focusRing}`}>
                        {SITE_CONTENT.company.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className={`lg:col-span-7 p-8 sm:p-10 border shadow-2xl ${
                  theme === 'dark' ? 'bg-[#14171B] border-[#242A31]' : 'bg-white border-[#C9C6BC]'
                }`}>
                  {contactSubmitted ? (
                    <div className="p-8 bg-[#3D9A5C]/10 border border-[#3D9A5C]/30 text-[#3D9A5C] text-sm font-bold text-center space-y-4">
                      <p>Thank you! Your inquiry has been submitted. We will contact you by email shortly.</p>
                      <button
                        onClick={() => setContactSubmitted(false)}
                        className={`text-xs text-[#E8590C] uppercase underline cursor-pointer rounded-sm ${focusRing}`}
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-6">
                      {contactError && (
                        <div className="p-4 bg-[#C4432B]/10 border border-[#C4432B]/30 text-[#C4432B] text-xs font-bold">
                          {contactError}
                        </div>
                      )}
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#6B7178] mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className={`w-full border p-4 text-sm focus:border-[#E8590C] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#1B1F24] border-[#242A31] text-[#ECEDEF]'
                              : 'bg-[#F9F8F5] border-[#C9C6BC] text-[#14171B]'
                          }`}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs uppercase font-bold text-[#6B7178] mb-2">Email</label>
                          <input
                            type="email"
                            name="email"
                            required
                            className={`w-full border p-4 text-sm focus:border-[#E8590C] focus:outline-none transition-colors ${
                              theme === 'dark'
                                ? 'bg-[#1B1F24] border-[#242A31] text-[#ECEDEF]'
                                : 'bg-[#F9F8F5] border-[#C9C6BC] text-[#14171B]'
                            }`}
                          />
                        </div>
                        <div>
                          <label className="block text-xs uppercase font-bold text-[#6B7178] mb-2">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            className={`w-full border p-4 text-sm focus:border-[#E8590C] focus:outline-none transition-colors ${
                              theme === 'dark'
                                ? 'bg-[#1B1F24] border-[#242A31] text-[#ECEDEF]'
                                : 'bg-[#F9F8F5] border-[#C9C6BC] text-[#14171B]'
                            }`}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#6B7178] mb-2">Equipment Category</label>
                        <select
                          name="category"
                          className={`w-full border p-4 text-sm focus:border-[#E8590C] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#1B1F24] border-[#242A31] text-[#ECEDEF]'
                              : 'bg-[#F9F8F5] border-[#C9C6BC] text-[#14171B]'
                          }`}
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Earthmoving Equipment">Earthmoving Equipment</option>
                          <option value="Lifting & Cranes">Lifting & Cranes</option>
                          <option value="Haulage & Transport">Haulage & Transport</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs uppercase font-bold text-[#6B7178] mb-2">Message</label>
                        <textarea
                          name="message"
                          rows={4}
                          required
                          className={`w-full border p-4 text-sm focus:border-[#E8590C] focus:outline-none transition-colors ${
                            theme === 'dark'
                              ? 'bg-[#1B1F24] border-[#242A31] text-[#ECEDEF]'
                              : 'bg-[#F9F8F5] border-[#C9C6BC] text-[#14171B]'
                          }`}
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        disabled={contactSubmitting}
                        className={`w-full py-4 bg-[#E8590C] text-[#14171B] font-black uppercase text-xs tracking-wider hover:bg-[#FF7A29] transition-colors duration-300 disabled:opacity-50 cursor-pointer ${focusRing}`}
                        style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%)' }}
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

        {/* Footer */}
        <footer className="border-t bg-[#14171B] border-[#242A31] text-[#9CA3AC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

              <div className="lg:col-span-2 space-y-4">
                <a href="#top" className={`flex items-center gap-3 rounded-sm ${focusRing}`}>
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
                <div className="text-xs text-[#6B7178] pt-2">
                  <span>Yard Location: </span>
                  <span className="text-[#B7BCC3] font-bold">{SITE_CONTENT.company.address}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-4">Navigation</h4>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
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
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-4">Fleet Categories</h4>
                <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Earthmoving</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Lifting & Cranes</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Compaction</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Power Generation</a></li>
                  <li><a href="#services" className={`hover:text-[#E8590C] transition-colors rounded-sm ${focusRing}`}>Haulage & Transport</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ECEDEF] mb-4">Direct Contact</h4>
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

            <div className="mt-16 pt-8 border-t border-[#242A31] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7178]">
              <p>© {new Date().getFullYear()} {SITE_CONTENT.company.fullName}. All rights reserved.</p>
              <a href="#top" className={`text-[#E8590C] hover:text-[#FF7A29] font-bold uppercase tracking-widest text-[10px] transition-colors rounded-sm ${focusRing}`}>
                Back to top
              </a>
            </div>
          </div>
        </footer>

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