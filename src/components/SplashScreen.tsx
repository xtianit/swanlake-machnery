import { useEffect, useState } from 'react';
import swanLogo from '../assets/swanLogo.png'; // Adjust path if using public/ (e.g., '/swanlake-logo.jpeg')

export default function SplashScreen() {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1900);

    return () => clearTimeout(fadeTimer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0B0D10] transition-opacity duration-600 ease-out ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        /* Expanding Impact Rings */
        @keyframes hydroRipple {
          0% {
            transform: scale(0.3);
            stroke-width: 4px;
            opacity: 0;
          }
          30% {
            opacity: 0.9;
          }
          100% {
            transform: scale(1.8);
            stroke-width: 0.5px;
            opacity: 0;
          }
        }

        /* Laser scan line movement */
        @keyframes laserScan {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-ripple-1 {
          animation: hydroRipple 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }

        .animate-ripple-2 {
          animation: hydroRipple 1.8s cubic-bezier(0.1, 0.8, 0.3, 1) 0.4s infinite;
        }

        .animate-laser {
          animation: laserScan 1.5s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-ripple-1,
          .animate-ripple-2,
          .animate-laser {
            animation: none !important;
          }
        }
      `}</style>

      {/* Background Reticle */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-dashed border-[#E8590C]" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#3A3F4D]" />
      </div>

      {/* Main Logo Container */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Animated Ripple Circles */}
        <div className="absolute inset-0 rounded-full border-2 border-[#E8590C] animate-ripple-1 pointer-events-none" />
        <div className="absolute inset-0 rounded-full border-2 border-[#FF7A29] animate-ripple-2 pointer-events-none" />

        {/* Ambient Backlight Glow */}
        <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-[#E8590C]/20 blur-2xl" />

        {/* Logo Image */}
        <img
          src={swanLogo}
          alt="Swanlake Machinery Logo"
          className="relative z-10 w-44 h-44 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-[#E8590C] shadow-[0_0_35px_rgba(232,89,12,0.45)] transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Brand Title & Subtitle Container */}
      <div className="mt-6 flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-3">
          <img
            src={swanLogo}
            alt="Swanlake Mini Logo"
            className="w-6 h-6 rounded-full object-cover border border-[#E8590C]"
          />
          <span className="font-['Barlow_Condensed',sans-serif] font-black text-2xl sm:text-3xl uppercase tracking-widest text-[#ECEDEF]">
            Swanlake Machinery
          </span>
        </div>

        {/* Industrial Scanning Progress Bar */}
        <div className="mt-2 w-48 h-1 bg-[#1E232B] overflow-hidden rounded-full">
          <div className="w-full h-full bg-[#E8590C] animate-laser" />
        </div>
      </div>
    </div>
  );
}