import React, { useEffect, useState, useRef } from 'react';

interface AnimatedStatProps {
  value: string;
  label: string;
}

export const AnimatedMetrics: React.FC<AnimatedStatProps> = ({ value, label }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  // Extract numeric value and non-numeric parts (e.g. "+", "%")
  const numericMatch = value.match(/\d+/);
  const targetNumber = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const prefix = value.substring(0, value.indexOf(numericMatch?.[0] || ''));
  const suffix = value.substring((value.indexOf(numericMatch?.[0] || '') + (numericMatch?.[0].length || 0)));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000; // 2 seconds
          const steps = 60;
          const increment = targetNumber / steps;
          const intervalTime = duration / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= targetNumber) {
              setDisplayValue(targetNumber);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.ceil(start));
            }
          }, intervalTime);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) observer.observe(elementRef.current);
    return () => observer.disconnect();
  }, [targetNumber, hasAnimated]);

  return (
    <div
      ref={elementRef}
      className="bg-[#1B1F24]/60 p-4 border border-[#242A31] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-[#E8590C]/50"
    >
      <span className="block text-3xl sm:text-4xl font-['Barlow_Condensed',sans-serif] font-black text-[#E8590C]">
        {prefix}{displayValue}{suffix}
      </span>
      <span className="text-[10px] sm:text-xs font-bold text-[#9CA3AC] uppercase tracking-wider mt-1 block">
        {label}
      </span>
    </div>
  );
};