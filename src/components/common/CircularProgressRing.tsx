import React from 'react';

interface CircularProgressRingProps {
  progressPct: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  subtext?: string;
}

export const CircularProgressRing: React.FC<CircularProgressRingProps> = ({
  progressPct,
  size = 80,
  strokeWidth = 7,
  color = '#2563EB',
  label,
  subtext
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-800"
          fill="transparent"
        />
        {/* Animated indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-500 ease-out"
        />
      </svg>

      <div className="absolute flex flex-col items-center justify-center text-center">
        {label && <span className="text-sm font-bold text-gray-900 dark:text-white leading-none">{label}</span>}
        {subtext && <span className="text-[10px] font-medium text-gray-400 mt-0.5">{subtext}</span>}
      </div>
    </div>
  );
};
