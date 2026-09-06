import { useEffect, useState } from 'react';

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
        /* 1. Swan Flight & Entry Path */
        @keyframes swanGlidePath {
          0% {
            transform: translate(-45px, -150px) scale(0.6) rotate(-16deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          65% {
            transform: translate(0px, 12px) scale(1.02) rotate(5deg);
            opacity: 1;
          }
          85%, 100% {
            transform: translate(0px, 28px) scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        /* 2. Primary Front Wing Flap Motion */
        @keyframes wingFlapFront {
          0% {
            transform: rotate(0deg) scaleY(1);
          }
          25% {
            transform: rotate(-30deg) scaleY(0.68) translateY(-14px);
          }
          50% {
            transform: rotate(0deg) scaleY(1);
          }
          75% {
            transform: rotate(24deg) scaleY(0.82) translateY(10px);
          }
          100% {
            transform: rotate(0deg) scaleY(1);
          }
        }

        /* 3. Secondary Back Wing Flap Motion */
        @keyframes wingFlapBack {
          0% {
            transform: rotate(0deg) scaleY(1);
          }
          25% {
            transform: rotate(-24deg) scaleY(0.72) translateY(-10px);
          }
          50% {
            transform: rotate(0deg) scaleY(1);
          }
          75% {
            transform: rotate(20deg) scaleY(0.85) translateY(8px);
          }
          100% {
            transform: rotate(0deg) scaleY(1);
          }
        }

        /* 4. Hydraulic Leg & Claw Motion */
        @keyframes clawPaddle {
          0%, 100% {
            transform: rotate(0deg) translateY(0px);
          }
          50% {
            transform: rotate(-14deg) translateY(-4px);
          }
        }

        /* 5. Expanding Impact Rings */
        @keyframes hydroRipple {
          0% {
            r: 0px;
            stroke-width: 4px;
            opacity: 0;
          }
          30% {
            opacity: 0.9;
          }
          100% {
            r: 150px;
            stroke-width: 0.5px;
            opacity: 0;
          }
        }

        /* 6. Splash Particle Spray */
        @keyframes particleBurst {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          35% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--dx), var(--dy)) scale(1.3);
            opacity: 0;
          }
        }

        /* Animation Classes */
        .animate-swan-flight {
          animation: swanGlidePath 1.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          transform-origin: center center;
        }

        .animate-wing-front {
          animation: wingFlapFront 0.46s ease-in-out infinite;
          transform-origin: 175px 165px;
        }

        .animate-wing-back {
          animation: wingFlapBack 0.46s ease-in-out infinite;
          transform-origin: 145px 160px;
        }

        .animate-claws {
          animation: clawPaddle 0.46s ease-in-out infinite;
          transform-origin: 135px 200px;
        }

        .animate-ripple-1 {
          animation: hydroRipple 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) 0.82s infinite;
        }

        .animate-ripple-2 {
          animation: hydroRipple 1.5s cubic-bezier(0.1, 0.8, 0.3, 1) 1.12s infinite;
        }

        .animate-drop-1 { --dx: -55px; --dy: -65px; animation: particleBurst 0.8s ease-out 0.82s forwards; }
        .animate-drop-2 { --dx: 55px; --dy: -65px; animation: particleBurst 0.8s ease-out 0.82s forwards; }
        .animate-drop-3 { --dx: -90px; --dy: -32px; animation: particleBurst 0.8s ease-out 0.88s forwards; }
        .animate-drop-4 { --dx: 90px; --dy: -32px; animation: particleBurst 0.8s ease-out 0.88s forwards; }
        .animate-drop-5 { --dx: -25px; --dy: -80px; animation: particleBurst 0.8s ease-out 0.85s forwards; }
        .animate-drop-6 { --dx: 25px; --dy: -80px; animation: particleBurst 0.8s ease-out 0.85s forwards; }

        @media (prefers-reduced-motion: reduce) {
          .animate-swan-flight,
          .animate-wing-front,
          .animate-wing-back,
          .animate-claws,
          .animate-ripple-1,
          .animate-ripple-2,
          .animate-drop-1,
          .animate-drop-2,
          .animate-drop-3,
          .animate-drop-4,
          .animate-drop-5,
          .animate-drop-6 {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      {/* Industrial Visual Reticle Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-15 pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full border border-dashed border-[#E8590C]" />
        <div className="absolute w-[350px] h-[350px] rounded-full border border-[#3A3F4D]" />
      </div>

      <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center">
        <svg
          viewBox="0 0 400 400"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Surface Ambient Glow */}
          <ellipse cx="200" cy="280" rx="150" ry="22" fill="url(#lakeGlow)" className="opacity-70" />

          {/* Water Grid Line */}
          <line
            x1="30"
            y1="280"
            x2="370"
            y2="280"
            stroke="#1E232B"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Impact Waves */}
          <ellipse cx="200" cy="280" rx="0" ry="0" stroke="#E8590C" fill="none" className="animate-ripple-1" />
          <ellipse cx="200" cy="280" rx="0" ry="0" stroke="#FF7A29" fill="none" className="animate-ripple-2" />

          {/* Water Splash Spray */}
          <g transform="translate(200, 275)">
            <circle cx="0" cy="0" r="3.5" fill="#E8590C" className="animate-drop-1" />
            <circle cx="0" cy="0" r="3.5" fill="#FF7A29" className="animate-drop-2" />
            <circle cx="0" cy="0" r="2.5" fill="#ECEDEF" className="animate-drop-3" />
            <circle cx="0" cy="0" r="2.5" fill="#E8590C" className="animate-drop-4" />
            <circle cx="0" cy="0" r="3.0" fill="#FFFFFF" className="animate-drop-5" />
            <circle cx="0" cy="0" r="3.0" fill="#FF7A29" className="animate-drop-6" />
          </g>

          {/* Swan Asset */}
          <g className="animate-swan-flight">
            {/* Back Wing Layer */}
            <g className="animate-wing-back">
              <path
                d="M 145 165 C 105 95, 55 95, 35 130 C 70 148, 115 158, 140 175 Z"
                fill="#343A43"
              />
              <path
                d="M 135 160 C 100 105, 65 105, 48 135 C 75 145, 110 154, 130 168 Z"
                fill="#525B68"
              />
            </g>

            {/* Rear Leg with Red Claws */}
            <g className="animate-claws">
              {/* Thigh & Joint */}
              <path d="M 132 195 L 122 218 L 114 228" stroke="#B02A1E" strokeWidth="4" strokeLinecap="round" />
              <circle cx="122" cy="218" r="2.5" fill="#FF3B30" />
              {/* Red Claws */}
              <path d="M 114 228 L 102 236 M 114 228 L 110 240 M 114 228 L 122 237" stroke="#FF3B30" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Tail Plumage */}
            <path d="M 115 185 L 75 178 L 98 198 L 125 195 Z" fill="#C5CBD3" />

            {/* Body Core */}
            <path
              d="M 115 185 C 135 218, 180 220, 210 195 C 220 180, 198 150, 168 150 C 140 150, 125 170, 115 185 Z"
              fill="url(#bodyGradient)"
            />

            {/* Front Leg with Bright Crimson Claws */}
            <g className="animate-claws">
              {/* Thigh & Joint */}
              <path d="M 142 198 L 134 224 L 126 235" stroke="#D32F2F" strokeWidth="4.5" strokeLinecap="round" />
              <circle cx="134" cy="224" r="3" fill="#FF5252" />
              {/* Splayed Claws */}
              <path d="M 126 235 L 112 244 M 126 235 L 121 247 M 126 235 L 135 244" stroke="#FF5252" strokeWidth="3.2" strokeLinecap="round" />
            </g>

            {/* Front Wing Layer (Flapping) */}
            <g className="animate-wing-front">
              <path
                d="M 175 165 C 120 55, 45 60, 20 115 C 68 138, 135 155, 165 175 Z"
                fill="url(#primaryWingGradient)"
                filter="drop-shadow(0px 8px 12px rgba(0,0,0,0.5))"
              />
              <path
                d="M 160 160 C 115 75, 58 80, 38 125 C 75 140, 128 150, 152 168 Z"
                fill="#FFFFFF"
                opacity="0.5"
              />
            </g>

            {/* Sculpted Neck */}
            <path
              d="M 192 182 C 238 165, 258 198, 242 235 C 234 252, 215 258, 204 274"
              stroke="#ECEDEF"
              strokeWidth="15"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Crown / Mask */}
            <path d="M 205 267 C 211 265, 215 267, 210 274 C 205 277, 201 272, 205 267 Z" fill="#0B0D10" />

            {/* Safety Orange Beak */}
            <path d="M 204 274 L 208 289 L 196 282 Z" fill="#E8590C" />

            {/* Eye Dot */}
            <circle cx="205" cy="264" r="1.6" fill="#0B0D10" />
          </g>

          {/* SVG Definitions */}
          <defs>
            <radialGradient id="lakeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E8590C" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0B0D10" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#CBD1D9" />
            </linearGradient>
            <linearGradient id="primaryWingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#D8DCE2" />
              <stop offset="100%" stopColor="#737C88" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Brand Title */}
      <div className="mt-2 flex items-center gap-3">
        <div
          className="w-5 h-5 bg-[#E8590C]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 60% 100%, 0 100%)' }}
        />
        <span className="font-['Barlow_Condensed',sans-serif] font-black text-2xl uppercase tracking-widest text-[#ECEDEF]">
          Swanlake Machinery
        </span>
      </div>
    </div>
  );
}