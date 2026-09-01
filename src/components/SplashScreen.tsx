import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  theme?: 'dark' | 'light';
}

export default function SplashScreen({ onFinish, theme = 'dark' }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade-out animation after 1.5 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Completely remove splash screen from DOM after fade animation completes
    const removeTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onFinish]);

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-900 text-white'}`}
    >
      <div className="relative flex flex-col items-center gap-6">
        {/* Outer Pulsing Glow */}
        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl animate-pulse"></div>

        {/* Spinner Graphic */}
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
          <div className="absolute w-8 h-8 border-4 border-slate-700 border-b-amber-400 rounded-full animate-spin [animation-direction:reverse]"></div>
        </div>

        {/* Text / Brand Indicator */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black uppercase tracking-widest text-white">
            Loading App
          </h2>
          <div className="flex items-center justify-center gap-1.5 text-xs text-amber-500 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            Initializing system...
          </div>
        </div>
      </div>
    </div>
  );
}