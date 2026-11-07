// Finite service-deck adaptation of the component supplied by the user.
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

export type Slide = {
  id: string;
  title: string;
  caption: string;
  description: string;
  detail: string;
  icon: string;
  image: string;
  imagePosition: string;
  alt: string;
};
export type CardDeckCarouselProps = {
  slides: Slide[];
  scatter?: number;
  autoplay?: number;
  onChange?: (index: number) => void;
  onComplete?: () => void;
  nextSection?: string;
  ariaLabel?: string;
};
export const pad2 = (n: number) => String(n).padStart(2, '0');
export function tiltFor(i: number, max: number) {
  const u = (((i + 1) * 2654435761) >>> 0) / 4294967296;
  return (u * 2 - 1) * max;
}
export function isThrow(dx: number, vx: number, width: number) {
  return Math.abs(dx) > width * .28 || (Math.abs(vx) > .55 && Math.abs(dx) > 24);
}
export function deckPose(depth: number, tilt: number, reduce = false) {
  const d = Math.min(Math.max(depth, 0), 3);
  return {
    transform: depth < 0
      ? 'translate3d(-110%, -8px, 0) rotate(-5deg)'
      : `translate3d(0,${-d * 11}px,0) scale(${1 - d * .035}) rotate(${depth === 0 || reduce ? 0 : tilt}deg)`,
    opacity: depth < 0 || depth > 2 ? 0 : 1,
  };
}
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
type Source = 'pointer' | 'keyboard' | 'auto';
type Drag = { id: number; x: number; y: number; lx: number; lt: number; vx: number; horizontal: boolean; node: HTMLElement };

export default function CardDeckCarousel({
  slides,
  scatter = 2.4,
  autoplay = 7000,
  nextSection = '#instalaciones',
  onChange,
  onComplete,
  ariaLabel = 'Explora nuestros tratamientos',
}: CardDeckCarouselProps) {
  const n = slides.length;
  const [top, setTop] = useState(0);
  const [source, setSource] = useState<Source>('pointer');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [departing, setDeparting] = useState<number | null>(null);
  const [detail, setDetail] = useState<Slide | null>(null);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [blocked, setBlocked] = useState(false);
  const [interaction, setInteraction] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const detailTrigger = useRef<HTMLElement | null>(null);
  const topRef = useRef(0);
  const dragRef = useRef<Drag | null>(null);
  const departureTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialHashHandled = useRef(false);
  const active = slides[top];

  const show = useCallback((index: number, input: Source) => {
    const next = clamp(index, 0, n - 1);
    if (next === topRef.current) return;
    if (departureTimer.current) clearTimeout(departureTimer.current);
    setDeparting(next > topRef.current && !reduced && input !== 'keyboard' ? topRef.current : null);
    topRef.current = next;
    setSource(input);
    setTop(next);
    departureTimer.current = setTimeout(() => setDeparting(null), input === 'auto' ? 620 : 280);
  }, [n, reduced]);

  const complete = (input: Source) => {
    const next = document.querySelector<HTMLElement>(nextSection);
    if (!next) return;
    onComplete?.();
    next.scrollIntoView({ block: 'start', behavior: reduced || input === 'keyboard' ? 'instant' : 'smooth' });
    // Keyboard navigation transfers focus with the visitor into the next section.
    if (input === 'keyboard') {
      next.setAttribute('tabindex', '-1');
      next.focus({ preventScroll: true });
    }
  };
  const goTo = (index: number, input: Source) => {
    setInteraction(value => value + 1);
    if (index >= n) { complete(input); return; }
    if (index < 0) return;
    show(index, input);
  };

  useEffect(() => { onChange?.(top); }, [top, onChange]);
  useEffect(() => {
    const query = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduced(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  // Autoplay only after enough time to read; never scroll the page or loop.
  useEffect(() => {
    const info = rootRef.current?.querySelector('.cd-info');
    const observer = new IntersectionObserver(entries => {
      setVisible(entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .7));
    }, { threshold: [0, .7] });
    if (info) observer.observe(info);
    const visibility = () => setPageVisible(!document.hidden);
    const overlay = () => setBlocked(document.body.matches('.menu-open, .dialog-open'));
    const mutation = new MutationObserver(overlay);
    mutation.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', visibility);
    overlay();
    return () => { observer.disconnect(); mutation.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  const readingWords = active ? `${active.title} ${active.caption} ${active.description}`.trim().split(/\s+/).length : 0;
  const readingDelay = Math.max(autoplay, Math.min(10500, 1500 + readingWords * 220));
  useEffect(() => {
    if (!autoplay || focused || dragging || !visible || !pageVisible || blocked || reduced || top >= n - 1) return;
    const expected = top;
    const timer = window.setTimeout(() => {
      if (topRef.current === expected && !document.hidden && !document.body.matches('.menu-open, .dialog-open')) show(expected + 1, 'auto');
    }, readingDelay);
    return () => window.clearTimeout(timer);
  }, [autoplay, focused, dragging, visible, pageVisible, blocked, reduced, top, n, readingDelay, interaction, show]);

  // The deck occupies only its content height; page scroll never selects a card.
  useLayoutEffect(() => {
    const section = rootRef.current?.closest<HTMLElement>('#servicios');
    if (!section) return;
    section.classList.add('services-enhanced');
    section.setAttribute('aria-labelledby', 'services-deck-title');
    return () => {
      section.classList.remove('services-enhanced');
      section.setAttribute('aria-labelledby', 'services-title');
    };
  }, [n]);

  // Keep existing footer links and direct service URLs meaningful.
  useEffect(() => {
    const seek = (hash: string, input: Source) => {
      const index = slides.findIndex(slide => `#${slide.id}` === hash);
      if (index < 0) return false;
      show(index, input);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        rootRef.current?.scrollIntoView({ block: 'start', behavior: reduced || input === 'keyboard' ? 'instant' : 'smooth' });
      }));
      return true;
    };
    const click = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#tratamiento-"]');
      if (!anchor || !seek(anchor.hash, event.detail === 0 ? 'keyboard' : 'pointer')) return;
      event.preventDefault();
      if (location.hash !== anchor.hash) history.pushState(null, '', anchor.hash);
    };
    const hashChange = () => seek(location.hash, 'keyboard');
    document.addEventListener('click', click);
    window.addEventListener('hashchange', hashChange);
    if (!initialHashHandled.current) {
      initialHashHandled.current = true;
      if (location.hash.startsWith('#tratamiento-')) hashChange();
    }
    return () => {
      document.removeEventListener('click', click);
      window.removeEventListener('hashchange', hashChange);
    };
  }, [slides, show]);

  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (departureTimer.current) clearTimeout(departureTimer.current);
      if (dialog?.open) document.body.classList.remove('dialog-open');
    };
  }, []);
  useEffect(() => {
    if (detail) {
      dialogRef.current?.showModal();
      document.body.classList.add('dialog-open');
    }
  }, [detail]);

  const resetDrag = () => {
    const drag = dragRef.current;
    if (!drag) return;
    setDragging(false);
    drag.node.dataset.drag = '0';
    drag.node.style.transform = deckPose(0, 0, reduced).transform;
    dragRef.current = null;
    if (drag.node.hasPointerCapture(drag.id)) drag.node.releasePointerCapture(drag.id);
  };
  const onDown = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY, lx: event.clientX, lt: event.timeStamp, vx: 0, horizontal: false, node: event.currentTarget };
  };
  const onMove = (event: ReactPointerEvent<HTMLElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (!d.horizontal) {
      if (Math.abs(dy) > 9 && Math.abs(dy) > Math.abs(dx)) { resetDrag(); return; }
      if (Math.abs(dx) < 9 || Math.abs(dx) < Math.abs(dy) * 1.15) return;
      d.horizontal = true;
      d.node.dataset.drag = '1';
    }
    const dt = Math.max(1, event.timeStamp - d.lt);
    d.vx = .8 * ((event.clientX - d.lx) / dt) + .2 * d.vx;
    d.lx = event.clientX; d.lt = event.timeStamp;
    const x = clamp(dx, -innerWidth, innerWidth);
    d.node.style.transform = `translate3d(${x}px,${clamp(dy * .12, -18, 18)}px,0) rotate(${reduced ? 0 : clamp(dx * .025, -6, 6)}deg)`;
  };
  const onUp = (event: ReactPointerEvent<HTMLElement>) => {
    const d = dragRef.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x;
    const velocity = event.timeStamp - d.lt > 120 ? 0 : d.vx;
    const advance = d.horizontal && isThrow(dx, velocity, deckRef.current?.offsetWidth || 400);
    resetDrag();
    if (advance) goTo(topRef.current + (dx < 0 ? 1 : -1), 'pointer');
  };
  const closeDetail = () => dialogRef.current?.close();
  const inputOf = (event: { detail: number }): Source => event.detail === 0 ? 'keyboard' : 'pointer';

  if (!active) return null;
  return (
    <div className="cd-root" ref={rootRef} data-input={source} data-reduced={reduced ? 'true' : 'false'}
      onFocusCapture={event => {
        if ((event.target as HTMLElement).matches(':focus-visible')) setFocused(true);
      }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false); }}>
      <div className="cd-track">
        <div className="cd-sticky">
          <div className="cd-layout container">
            <header className="cd-heading"><span className="eyebrow">Nuestros tratamientos</span><h2 id="services-deck-title">Un cuidado para <br /><em>cada sonrisa.</em></h2></header>
            <div className="cd-info" aria-live="off">
              <span className="cd-service-label">{pad2(top + 1)} / Cuidado Valver</span>
              <h3>{active.title}</h3><p className="cd-tagline">{active.caption}</p><p className="cd-description">{active.description}</p>
              <button className="text-link cd-detail-trigger" type="button" onClick={event => { detailTrigger.current = event.currentTarget; setSource(inputOf(event)); setDetail(active); }}>Quiero saber más <span aria-hidden="true">↗</span></button>
            </div>
            <div className="cd-visual" role="region" aria-roledescription="carrusel" aria-label={ariaLabel} tabIndex={0}
              onKeyDown={event => {
                if (event.target !== event.currentTarget) return;
                if (event.key === 'ArrowRight') { event.preventDefault(); goTo(topRef.current + 1, 'keyboard'); }
                if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(topRef.current - 1, 'keyboard'); }
                if (event.key === 'Home') { event.preventDefault(); goTo(0, 'keyboard'); }
                if (event.key === 'End') { event.preventDefault(); goTo(n - 1, 'keyboard'); }
              }}>
              <div className="cd-deck" ref={deckRef}>
                {slides.map((slide, i) => {
                  const depth = i - top;
                  const pose = deckPose(depth, tiltFor(i, scatter), reduced);
                  const outgoing = departing === i;
                  return <article className="cd-card" key={slide.id} data-top={depth === 0 ? '1' : '0'} data-fly={outgoing ? '1' : '0'}
                    aria-hidden={depth === 0 ? undefined : true} aria-label={depth === 0 ? `${pad2(i + 1)} de ${pad2(n)}: ${slide.title}` : undefined}
                    style={{ transform: pose.transform, opacity: outgoing ? 0 : pose.opacity, zIndex: outgoing ? n + 1 : n - Math.max(depth, 0), pointerEvents: depth === 0 ? 'auto' : 'none' }}
                    onPointerDown={depth === 0 ? onDown : undefined} onPointerMove={depth === 0 ? onMove : undefined} onPointerUp={depth === 0 ? onUp : undefined} onPointerCancel={event => { if (dragRef.current?.id === event.pointerId) resetDrag(); }} onLostPointerCapture={event => { if (dragRef.current?.id === event.pointerId) resetDrag(); }}>
                    <div className="cd-photo" role="img" aria-label={slide.alt}><div style={{ backgroundImage: `url("${slide.image}")`, backgroundPosition: slide.imagePosition }} /></div>
                    <div className="cd-print"><svg className="v-icon" aria-hidden="true"><use href={slide.icon} /></svg><span>{pad2(i + 1)}</span></div>
                  </article>;
                })}
              </div>
            </div>
            <nav className="cd-controls" aria-label="Navegación de tratamientos">
              <button className="cd-btn" type="button" disabled={top === 0} aria-label="Tratamiento anterior" onClick={event => goTo(topRef.current - 1, inputOf(event))}><span aria-hidden="true">←</span></button>
              <div className="cd-progress"><span className="cd-count"><b>{pad2(top + 1)}</b><span> / {pad2(n)}</span></span><div className="cd-dots">{slides.map((slide, i) => <button type="button" key={slide.id} className="cd-dot" aria-label={`Ver ${slide.title}`} aria-current={i === top ? 'step' : undefined} onClick={event => goTo(i, inputOf(event))}><span /></button>)}</div></div>
              <button className={`cd-btn cd-next ${top === n - 1 ? 'cd-continue' : ''}`} type="button" aria-label={top === n - 1 ? 'Continuar a las historias compartidas' : 'Siguiente tratamiento'} onClick={event => goTo(topRef.current + 1, inputOf(event))}>{top === n - 1 ? <><span>Continuar</span><span aria-hidden="true">↓</span></> : <span aria-hidden="true">→</span>}</button>
            </nav>
            <div className="cd-playback"><p className="cd-hint">{top === n - 1 ? 'Puedes seguir bajando para descubrir más sobre Valver.' : 'Explora a tu ritmo. Puedes deslizar o usar las flechas.'}</p>
            </div>
            <div className="cd-sr" aria-live={source === 'auto' ? 'off' : 'polite'} aria-atomic="true">{`Tratamiento ${top + 1} de ${n}: ${active.title}${top === n - 1 ? '. Puedes continuar a las historias compartidas.' : ''}`}</div>
          </div>
        </div>
      </div>
      <dialog className="contact-dialog cd-dialog" ref={dialogRef} aria-labelledby="service-dialog-title" data-lenis-prevent
        onClose={() => { setDetail(null); if (!document.querySelector('dialog[open]')) document.body.classList.remove('dialog-open'); detailTrigger.current?.focus({ preventScroll: true }); }}
        onClick={event => { if (event.target === event.currentTarget) { const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDetail(); } }}>
        <button className="dialog-close" type="button" aria-label="Cerrar información" onClick={closeDetail}>×</button>
        <span className="eyebrow">Cuidado Valver</span><h2 id="service-dialog-title">{detail?.title}</h2><p className="cd-dialog-tagline">{detail?.caption}</p><p>{detail?.detail}</p>
        <a className="v-button" href="#contacto" data-interest={detail?.title} onClick={closeDetail}>Conversemos <span aria-hidden="true">↗</span></a>
      </dialog>
    </div>
  );
}
