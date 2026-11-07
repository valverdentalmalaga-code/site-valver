import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Marquee({ children, reverse = false, className, duration = 44, stationary = false, label }: {
  children: ReactNode;
  reverse?: boolean;
  className?: string;
  duration?: number;
  label: string;
  stationary?: boolean;
}) {
  return <div className={cn('review-marquee-row', reverse && 'is-reversed', stationary && 'is-static', className)} style={{ '--marquee-duration': `${duration}s` } as CSSProperties} role="region" aria-label={label}>
    <div className="review-marquee-track">
      <div className="review-marquee-group" role="list">{children}</div>
      <div className="review-marquee-group is-clone" role="presentation" aria-hidden="true" inert>{children}</div>
    </div>
  </div>;
}
