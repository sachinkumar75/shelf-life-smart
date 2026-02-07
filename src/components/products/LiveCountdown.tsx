import { useState, useEffect } from 'react';
import { getCountdown, getExpiryUrgency, getExpiryColor } from '@/lib/expiry-utils';
import { cn } from '@/lib/utils';

interface LiveCountdownProps {
  expiryDate: string;
}

export function LiveCountdown({ expiryDate }: LiveCountdownProps) {
  const [countdown, setCountdown] = useState(getCountdown(expiryDate));
  const urgency = getExpiryUrgency(expiryDate);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(expiryDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [expiryDate]);

  if (countdown.isExpired) {
    return (
      <div className="text-center p-6 rounded-xl bg-destructive/10 border border-destructive/20">
        <span className="text-4xl mb-2 block">⚠️</span>
        <h3 className="text-2xl font-bold text-destructive">EXPIRED</h3>
        <p className="text-sm text-muted-foreground mt-1">This product has expired</p>
      </div>
    );
  }

  const timeBlocks = [
    { value: countdown.days, label: 'Days' },
    { value: countdown.hours, label: 'Hours' },
    { value: countdown.minutes, label: 'Mins' },
    { value: countdown.seconds, label: 'Secs' },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-2">
        {timeBlocks.map(({ value, label }) => (
          <div
            key={label}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl",
              getExpiryColor(urgency)
            )}
          >
            <span className="text-2xl md:text-3xl font-bold tabular-nums">
              {String(value).padStart(2, '0')}
            </span>
            <span className="text-xs uppercase tracking-wide opacity-90">
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground">
        Time remaining until expiration
      </p>
    </div>
  );
}
