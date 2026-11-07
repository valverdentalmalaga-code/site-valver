import { animate, motion, useInView, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useTransform, wrap, type AnimationPlaybackControls, type PanInfo } from 'motion/react';
import { createContext, memo, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

type GridVariant = 'default' | 'masonry' | 'polaroid';
const GridVariantContext = createContext({ variant: 'default' as GridVariant, reduced: false, entered: false });

/** Adapted from the supplied infinite-drag-scroll component.
 * Wrap the rendered transform, not the source value (avoids recursive updates).
 * Page scroll remains native; there is no global wheel listener or scroll pin.
 */
export function DraggableContainer({ children, className, variant = 'default' }: {
  children: ReactNode; className?: string; variant?: GridVariant;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion() === true;
  const entered = useInView(viewport, { once: true, amount: .15 });
  const [period, setPeriod] = useState({ width: 900, height: 620 });
  const [dragging, setDragging] = useState(false);
  const x = useMotionValue(-60);
  const y = useMotionValue(-24);
  const inertia = useRef<AnimationPlaybackControls[]>([]);
  const touchDrag = useRef(false);
  const stop = () => { inertia.current.forEach(control => control.stop()); inertia.current = []; };
  const { scrollYProgress } = useScroll({ target: viewport, offset: ['start end', 'end start'] });
  const wrappedX = useTransform(x, value => wrap(-period.width, 0, value));
  const wrappedY = useTransform(() => wrap(-period.height, 0, y.get() - (reduced ? 0 : scrollYProgress.get() * 54)));
  const transform = useMotionTemplate`translate3d(${wrappedX}px, ${wrappedY}px, 0)`;

  useEffect(() => {
    if (reduced) return;
    const tile = track.current?.querySelector<HTMLElement>('.ids-tile');
    if (!tile) return;
    const measure = () => {
      const width = tile.offsetWidth, height = tile.offsetHeight;
      if (width && height) setPeriod(previous => previous.width === width && previous.height === height ? previous : { width, height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(tile);
    measure();
    return () => observer.disconnect();
  }, [reduced]);

  useEffect(() => () => inertia.current.forEach(control => control.stop()), []);

  const pan = (event: PointerEvent, info: PanInfo) => {
    const touch = event.pointerType !== 'mouse';
    if (touch && Math.abs(info.offset.y) > Math.abs(info.offset.x)) return;
    touchDrag.current = touch;
    x.set(x.get() + info.delta.x);
    if (!touch) y.set(y.get() + info.delta.y);
  };
  const endPan = (_event: PointerEvent, info: PanInfo) => {
    setDragging(false);
    inertia.current = [animate(x, x.get(), { type: 'inertia', velocity: info.velocity.x, power: .28, timeConstant: 200, restDelta: .5 })];
    if (!touchDrag.current) inertia.current.push(animate(y, y.get(), { type: 'inertia', velocity: info.velocity.y, power: .28, timeConstant: 200, restDelta: .5 }));
  };
  const nudge = (distance: number, keyboard: boolean) => {
    stop();
    if (keyboard) x.set(x.get() + distance);
    else inertia.current = [animate(x, x.get() + distance, { duration: .25, ease: [.22, 1, .36, 1] })];
  };
  const keyPan = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault(); stop();
    if (event.key === 'ArrowLeft') x.set(x.get() + 180);
    if (event.key === 'ArrowRight') x.set(x.get() - 180);
    if (event.key === 'ArrowUp') y.set(y.get() + 140);
    if (event.key === 'ArrowDown') y.set(y.get() - 140);
  };

  return <GridVariantContext.Provider value={{ variant, reduced, entered }}>
    <div className={cn('ids-gallery', className)}>
      <div ref={viewport} className={cn('ids-viewport', reduced && 'ids-viewport--static')} role="region" aria-label="Fotografías de nuestras instalaciones" aria-describedby="facilities-gallery-hint" tabIndex={0} onKeyDown={reduced ? undefined : keyPan}>
        {reduced ? <div className="ids-static">{children}</div> : <motion.div
          ref={track}
          className="ids-track"
          data-dragging={dragging || undefined}
          style={{ transform }}
          onPanStart={event => { stop(); touchDrag.current = event.pointerType !== 'mouse'; setDragging(true); }}
          onPan={pan}
          onPanEnd={endPan}
          onPointerCancel={() => { setDragging(false); stop(); }}
        >{children}</motion.div>}
      </div>
      <div className="ids-footer">
        <p id="facilities-gallery-hint">{reduced ? 'Un recorrido por Valver.' : 'Desliza y descubre nuestros espacios.'}</p>
        {!reduced && <div className="ids-controls" aria-label="Recorrer las fotografías">
          <button type="button" aria-label="Ver fotografías anteriores" onClick={event => nudge(210, event.detail === 0)}><span aria-hidden="true">←</span></button>
          <button type="button" aria-label="Ver más fotografías" onClick={event => nudge(-210, event.detail === 0)}><span aria-hidden="true">→</span></button>
        </div>}
      </div>
    </div>
  </GridVariantContext.Provider>;
}

const itemStyles = cva('ids-card', { variants: { variant: { default: 'ids-card--default', masonry: 'ids-card--masonry', polaroid: 'ids-card--polaroid' } }, defaultVariants: { variant: 'default' } });

export function GridItem({ children, className, index = 0 }: { children: ReactNode; className?: string; index?: number }) {
  const { variant, reduced, entered } = useContext(GridVariantContext);
  return <motion.figure className={cn(itemStyles({ variant }), className)}
    initial={reduced ? false : { opacity: 0, transform: 'translateY(18px) scale(.97)' }}
    animate={reduced || entered ? { opacity: 1, transform: 'translateY(0px) scale(1)' } : undefined}
    transition={{ duration: .5, delay: reduced ? 0 : index * .055, ease: [.22, 1, .36, 1] }}
  >{children}</motion.figure>;
}

export const GridBody = memo(function GridBody({ children, className }: { children: ReactNode; className?: string }) {
  const { variant, reduced } = useContext(GridVariantContext);
  return <>{Array.from({ length: reduced ? 1 : 4 }, (_, index) => <div key={index} className={cn('ids-tile', `ids-tile--${variant}`, className)} aria-hidden={index > 0 ? true : undefined}>{children}</div>)}</>;
});
