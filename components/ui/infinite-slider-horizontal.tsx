'use client';

// Adapted from the InfiniteSlider component supplied for this project.
// Motion is shared with the existing islands through motion/react.
import { animate, motion, useInView, useTransform, useMotionValue, useReducedMotion, type AnimationPlaybackControls } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import useMeasure from 'react-use-measure';
import { cn } from '@/lib/utils';

type InfiniteSliderProps = {
  children: ReactNode;
  gap?: number;
  duration?: number;
  durationOnHover?: number;
  direction?: 'horizontal' | 'vertical';
  reverse?: boolean;
  className?: string;
  label?: string;
  entranceDelay?: number;
  decorative?: boolean;
  step?: boolean;
  stepInterval?: number;
};

export function InfiniteSlider({ children, gap = 22, duration = 42, durationOnHover, direction = 'horizontal', reverse = false, className, label = 'Fotografías de Valver Dental', entranceDelay = 0, decorative = false, step = false, stepInterval = 4.5 }: InfiniteSliderProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  // Measure one copy only: the loop period includes its trailing gap exactly.
  const [measureRef, { width, height }] = useMeasure();
  const visible = useInView(viewportRef, { margin: '80px 0px', amount: .01 });
  const reduced = useReducedMotion() === true;
  const translation = useMotionValue(0);
  const previousPeriod = useRef(0);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const activeDuration = hovered && durationOnHover ? durationOnHover : duration;
  const horizontal = direction === 'horizontal';
  const transform = useTransform(translation, value => horizontal ? `translate3d(${value}px, 0px, 0px)` : `translate3d(0px, ${value}px, 0px)`);

  useEffect(() => {
    const changed = () => setPageVisible(!document.hidden);
    changed();
    document.addEventListener('visibilitychange', changed);
    return () => document.removeEventListener('visibilitychange', changed);
  }, []);

  useEffect(() => {
    const period = (horizontal ? width : height) + gap;
    if (reduced) { translation.set(0); return; }
    if (!visible || !pageVisible || period <= gap) return;
    const oldPeriod = previousPeriod.current || period;
    const oldProgress = reverse ? (translation.get() + oldPeriod) / oldPeriod : -translation.get() / oldPeriod;
    const progress = ((oldProgress % 1) + 1) % 1;
    const from = reverse ? -period : 0;
    const to = reverse ? 0 : -period;
    const current = from + (to - from) * progress;
    previousPeriod.current = period;
    translation.set(current);
    if (step && horizontal) {
      const count = viewportRef.current?.querySelector('.ifs-group')?.children.length || 1;
      const stride = period / count;
      let index = progress * count;
      let stopped = false;
      let timer: ReturnType<typeof setTimeout>;
      let animation: AnimationPlaybackControls | undefined;
      const advance = () => {
        if (stopped) return;
        const next = Math.floor(index + .001) + 1;
        animation = animate(translation, -next * stride, {
          duration: .85,
          ease: [.22, 1, .36, 1],
          onComplete: () => {
            if (stopped) return;
            index = next % count;
            translation.set(-index * stride);
            timer = setTimeout(advance, stepInterval * 1000);
          },
        });
      };
      // Hold complete photographs between transitions; keep the same loop phase.
      timer = setTimeout(advance, Math.abs(index - Math.round(index)) < .001 ? stepInterval * 1000 : 0);
      return () => { stopped = true; clearTimeout(timer); animation?.stop(); };
    }
    let disposed = false;
    let controls: AnimationPlaybackControls;
    const loop = () => {
      if (disposed) return;
      controls = animate(translation, [from, to], { ease: 'linear', duration: activeDuration, repeat: Infinity, repeatType: 'loop' });
    };
    // Resume at the existing phase after visibility, hover or resize changes.
    controls = animate(translation, to, { ease: 'linear', duration: Math.max(.01, activeDuration * (1 - progress)), onComplete: loop });
    return () => { disposed = true; controls.stop(); };
  }, [width, height, gap, horizontal, activeDuration, reverse, reduced, visible, pageVisible, translation, step, stepInterval]);

  return <motion.div
    ref={viewportRef}
    className={cn('ifs-viewport', reduced && 'ifs-viewport--static', className)}
    role="region"
    aria-label={label}
    tabIndex={reduced && !decorative ? 0 : undefined}
    initial={reduced ? false : { opacity: 0, transform: 'translateY(18px)' }}
    whileInView={{ opacity: 1, transform: 'translateY(0px)' }}
    viewport={{ once: true, amount: .08 }}
    transition={{ duration: .6, delay: entranceDelay, ease: [.22, 1, .36, 1] }}
    onHoverStart={durationOnHover ? () => setHovered(true) : undefined}
    onHoverEnd={durationOnHover ? () => setHovered(false) : undefined}
  >
    <motion.div className="ifs-track" style={{ transform: reduced ? 'none' : transform, gap, flexDirection: horizontal ? 'row' : 'column' }}>
      <div ref={measureRef} className="ifs-group" style={{ gap, flexDirection: horizontal ? 'row' : 'column' }}>{children}</div>
      {!reduced && <div className="ifs-group" style={{ gap, flexDirection: horizontal ? 'row' : 'column' }} aria-hidden="true">{children}</div>}
    </motion.div>
  </motion.div>;
}
