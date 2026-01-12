import React from 'react';

export default function HerCureLogo({ size = 48 }) {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <svg width={size} height={size} viewBox="0 0 120 120" className="animate-bounce">
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B9D" />
            <stop offset="25%" stopColor="#C44569" />
            <stop offset="50%" stopColor="#F093FB" />
            <stop offset="75%" stopColor="#FDCB6E" />
            <stop offset="100%" stopColor="#6C5CE7" />
          </linearGradient>
        </defs>
        {/* Incomplete heart shape */}
        <path
          d="M60 100 Q30 70 30 45 Q30 25 45 25 Q52 25 57 30"
          fill="url(#heartGradient)"
          stroke="#FF6B9D"
          strokeWidth="3"
        />
        {/* 'H' completing the heart */}
        <text x="75" y="55" fontSize="40" fontWeight="bold" fill="#FF6B9D" fontFamily="Arial, sans-serif">H</text>
      </svg>
      <span className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
        erCure
      </span>
    </div>
  );
}
