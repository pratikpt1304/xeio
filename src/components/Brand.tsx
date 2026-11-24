import React from 'react';

interface BrandProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'hero';
  showTagline?: boolean;
  className?: string;
}

export const ElzeoLogo: React.FC<BrandProps> = ({
  variant = 'light',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#0B1E36';
  const planetBlue = '#2563EB';
  const ringCyan = isDark ? '#38BDF8' : '#0284C7';

  const dimensions = {
    sm: { width: 90, height: 26, fontSize: 16, tagSize: 5 },
    md: { width: 130, height: 38, fontSize: 24, tagSize: 7 },
    lg: { width: 180, height: 52, fontSize: 34, tagSize: 9.5 },
    hero: { width: 260, height: 78, fontSize: 50, tagSize: 13.5 },
  }[size];

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-center gap-1.5 leading-none">
        <span
          style={{ color: textColor, fontSize: `${dimensions.fontSize}px`, fontWeight: 800, letterSpacing: '-0.04em' }}
          className="font-sans"
        >
          elze
        </span>
        {/* Planet 'o' with orbital ring */}
        <div className="relative inline-flex items-center justify-center" style={{ width: `${dimensions.fontSize * 1.1}px`, height: `${dimensions.fontSize * 1.1}px` }}>
          <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id={`planetGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={planetBlue} />
                <stop offset="100%" stopColor={ringCyan} />
              </linearGradient>
            </defs>
            {/* Back half of ring */}
            <ellipse
              cx="50"
              cy="50"
              rx="46"
              ry="16"
              fill="none"
              stroke={ringCyan}
              strokeWidth="5"
              transform="rotate(-28 50 50)"
              strokeDasharray="90 180"
              strokeDashoffset="35"
              opacity="0.7"
            />
            {/* Planet Body */}
            <circle cx="50" cy="50" r="32" fill={`url(#planetGrad-${variant})`} />
            {/* Subtle surface glow */}
            <circle cx="43" cy="42" r="14" fill="#FFFFFF" opacity="0.25" />
            {/* Front half of ring */}
            <ellipse
              cx="50"
              cy="50"
              rx="46"
              ry="16"
              fill="none"
              stroke={isDark ? '#E0F2FE' : '#38BDF8'}
              strokeWidth="5.5"
              transform="rotate(-28 50 50)"
              strokeDasharray="95 180"
              strokeDashoffset="125"
            />
          </svg>
        </div>
      </div>
      {showTagline && (
        <div
          className="tracking-[0.28em] font-medium mt-1 uppercase"
          style={{
            color: isDark ? '#93C5FD' : '#2563EB',
            fontSize: `${dimensions.tagSize}px`,
          }}
        >
          INNOVATE <span className="opacity-60">|</span> TRANSFORM
        </div>
      )}
    </div>
  );
};

export const XeIOLogo: React.FC<{
  variant?: 'dark' | 'light';
  suffix?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ variant = 'dark', suffix = '', size = 'md', className = '' }) => {
  const isDark = variant === 'dark';
  const textColor = isDark ? '#FFFFFF' : '#141413';
  const blueColor = isDark ? '#3FA9F5' : '#1F5FE0';

  const sizeClass = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`inline-flex items-center gap-1.5 font-sans font-semibold tracking-tight ${sizeClass} select-none ${className}`}>
      <span>
        <span style={{ color: textColor }}>Xe</span>
        <span style={{ color: blueColor }}>IO</span>
      </span>
      {suffix && (
        <span className="font-normal text-muted text-xs tracking-normal ml-0.5">
          {suffix}
        </span>
      )}
    </div>
  );
};

export const FooterBranding: React.FC<{ className?: string }> = ({ className = '' }) => (
  <footer className={`py-4 px-6 text-center text-xs text-muted border-t border-border bg-paper ${className}`}>
    <div className="flex flex-wrap items-center justify-center gap-2">
      <XeIOLogo variant="light" size="sm" />
      <span>·</span>
      <span>Designed and maintained by <strong>Elzeo Future Technologies Pvt Ltd, India</strong></span>
    </div>
  </footer>
);
