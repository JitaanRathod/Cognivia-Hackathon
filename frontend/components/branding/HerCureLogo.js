import React, { useEffect, useState } from 'react';

export default function HerCureLogo({ size = 56 }) {
  const [showCure, setShowCure] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowCure(true), 500); // Cure appears 0.5s after Her
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        {/* Heart next to H */}
        <svg width={size} height={size} viewBox="0 0 120 120" className={`logo-heart ${showCure ? 'pulse' : ''}`}>
          <defs>
            <linearGradient id="heroHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4CD4B0" />
              <stop offset="100%" stopColor="#5B8DEF" />
            </linearGradient>
          </defs>
          <path d="M60 100 Q30 70 30 45 Q30 25 45 25 Q52 25 57 30 Q60 28 63 30 Q71 25 75 25 Q90 25 90 45 Q90 70 60 100 Z" fill="url(#heroHeart)" stroke="#1E2A3A" strokeWidth="2" />
        </svg>

        <span className="text-4xl logo-text text-navy">Her</span>
      </div>

      <span className={`text-4xl logo-text logo-part-cure ${showCure ? 'visible delay-500' : ''} text-primary`}>
        Cure
      </span>
    </div>
  );
}
