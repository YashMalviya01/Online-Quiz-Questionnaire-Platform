import * as React from 'react';
import { cn } from '../../utils/helpers';

const Progress = React.forwardRef(({ className, value = 0, max = 100, showLabel = false, variant = 'default', ...props }, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    default: 'bg-primary',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600'
  };

  return (
    <div className="w-full">
      <div
        ref={ref}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
          className
        )}
        {...props}
      >
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {percentage.toFixed(0)}%
        </p>
      )}
    </div>
  );
});
Progress.displayName = 'Progress';

const CircularProgress = ({ value = 0, max = 100, size = 80, strokeWidth = 8, className }) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-primary transition-all duration-500"
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-sm font-semibold">
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
};

export { Progress, CircularProgress };
