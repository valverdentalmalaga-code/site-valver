// Client-only React island, compiled for the existing static website.

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import Lenis from 'lenis';

export interface ParallaxComponentProps {
  /** Existing semantic hero: content remains usable before React loads. */
  target?: string;
  /** Multiplier for the supplied 70/55/40/10 layer speed relationship. */
  strength?: number;
  smoothWheel?: boolean;
}

/**
 * Valver adaptation of the supplied Osmo four-layer parallax.
 * React owns the ornaments; GSAP enhances the existing HTML layers.
 * No pinning, artificial scroll distance or replacement of readable content.
 */
export function ParallaxComponent({
  target = '#inicio',
  strength = 0.18,
  smoothWheel = true,
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ornaments = parallaxRef.current;
    const triggerElement = document.querySelector<HTMLElement>(target);
    if (!triggerElement || !ornaments) return;

    // Keep the upper stem at a constant distance from the window ellipse.
    const frame = triggerElement.querySelector<HTMLElement>('.portrait-frame');
    const branch = triggerElement.querySelector<HTMLElement>('.portrait-olive--upper');
    const fitBranch = () => {
      if (!frame || !branch) return;
      const width = frame.clientWidth, height = frame.clientHeight;
      if (!width || !height) return;
      const radius = getComputedStyle(frame).borderTopRightRadius.split(' ');
      const pixels = (value: string, size: number) => value.includes('%') ? parseFloat(value) * size / 100 : parseFloat(value);
      const rx = pixels(radius[0], width), ry = pixels(radius[1] || radius[0], height);
      const cx = width - rx, cy = ry;
      const point = (angle: number) => {
        const nx = Math.cos(angle) / rx, ny = Math.sin(angle) / ry, length = Math.hypot(nx, ny);
        return [cx + rx * Math.cos(angle) + 5 * nx / length, cy + ry * Math.sin(angle) + 5 * ny / length];
      };
      const start = -58 * Math.PI / 180, end = -10 * Math.PI / 180;
      const stem = Array.from({ length: 25 }, (_, i) => {
        const [x, y] = point(start + (end - start) * i / 24);
        return `${i ? 'L' : 'M'}${x.toFixed(2)} ${y.toFixed(2)}`;
      }).join('');
      const scale = Math.min(24, Math.max(14, width * .042)) / 52;
      const leaves = Array.from({ length: 7 }, (_, i) => {
        const angle = start + (end - start) * (.1 + i * .125);
        const [x, y] = point(angle);
        const rotation = -Math.atan2(-rx * Math.sin(angle), ry * Math.cos(angle)) * 180 / Math.PI;
        const side = i % 2 ? 1 : -1;
        return `<g transform="translate(${x} ${y}) rotate(${rotation}) scale(${side * scale} ${scale})"><path d="M0 0C-2-24 17-45 39-52C35-27 20-7 0 0Z" fill="currentColor"/><path d="M0 0Q22-27 39-52" fill="none" stroke="var(--v-olive)" stroke-width=".65" opacity=".22"/></g>`;
      }).join('');
      Object.assign(branch.style, { left: `${frame.offsetLeft}px`, top: `${frame.offsetTop}px`, right: 'auto', width: `${width}px`, height: `${height}px` });
      branch.innerHTML = `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true"><path d="${stem}" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>${leaves}</svg>`;
    };
    const branchObserver = new ResizeObserver(fitBranch);
    if (frame) branchObserver.observe(frame);
    fitBranch();

    gsap.registerPlugin(ScrollTrigger, CustomEase);
    const curve = getComputedStyle(document.documentElement)
      .getPropertyValue('--v-ease').match(/cubic-bezier\(([^)]+)\)/)?.[1];
    const entranceEase = CustomEase.create('valver-parallax-out', curve || '0.22,1,0.36,1');
    const media = gsap.matchMedia();
    triggerElement.classList.add('has-parallax');

    media.add({
      all: '(min-width: 0px)',
      reduced: '(prefers-reduced-motion: reduce)',
      desktop: '(min-width: 761px)',
      fine: '(hover: hover) and (pointer: fine)',
    }, context => {
      const { reduced, desktop, fine } = context.conditions!;
      const fullMotion = desktop && fine;
      triggerElement.dataset.parallaxMode = reduced ? 'reduced' : fullMotion ? 'desktop' : 'mobile';
      if (reduced) return;

      const amount = Math.min(Math.max(strength, 0), 0.3) * (fullMotion ? 1 : 0.38);
      const headerHeight = () => document.querySelector('header')?.getBoundingClientRect().height || 0;
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: 'valver-hero-parallax',
          trigger: triggerElement,
          start: () => `top top+=${headerHeight()}`,
          end: () => `bottom top+=${headerHeight()}`,
          scrub: desktop && fine ? 0.35 : true,
          invalidateOnRefresh: true,
        },
      });
      const layers = [
        { layer: '1', yPercent: 70 },
        { layer: '2', yPercent: 55 },
        { layer: '3', yPercent: 40 },
        { layer: '4', yPercent: 10 },
      ];
      layers.forEach(({ layer, yPercent }) => {
        const elements = triggerElement.querySelectorAll<HTMLElement>(`[data-parallax-layer="${layer}"]`);
        if (elements.length) {
          timeline.to(elements, {
            yPercent: (!fullMotion && layer === '3') ? 0 : yPercent * amount,
            ease: 'none',
          }, 0);
        }
      });

      // Separate inner transform: pointer feedback never competes with scroll.
      const portrait = triggerElement.querySelector<HTMLElement>('.portrait-motion');
      let pointerMove: ((event: PointerEvent) => void) | undefined;
      let pointerLeave: (() => void) | undefined;
      if (portrait && fine && desktop) {
        const xTo = gsap.quickTo(portrait, 'x', { duration: 0.5, ease: entranceEase });
        const yTo = gsap.quickTo(portrait, 'y', { duration: 0.5, ease: entranceEase });
        pointerMove = event => {
          if (event.pointerType !== 'mouse') return;
          const rect = triggerElement.getBoundingClientRect();
          xTo(((event.clientX - rect.left) / rect.width - 0.5) * 8);
          yTo(((event.clientY - rect.top) / rect.height - 0.5) * 6);
        };
        pointerLeave = () => { xTo(0); yTo(0); };
        triggerElement.addEventListener('pointermove', pointerMove, { passive: true });
        triggerElement.addEventListener('pointerleave', pointerLeave);
      }

      let lenis: Lenis | undefined;
      let tick: ((time: number) => void) | undefined;
      if (smoothWheel && fine && desktop) {
        // Current Lenis package; touch keeps native momentum and scroll physics.
        lenis = new Lenis({
          autoRaf: false,
          lerp: 0.12,
          smoothWheel: true,
          syncTouch: false,
          anchors: false,
          prevent: node => document.body.matches('.menu-open, .dialog-open')
            || Boolean(node.closest('dialog, [data-lenis-prevent]')),
        });
        lenis.on('scroll', ScrollTrigger.update);
        tick = time => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
      }

      // Refresh after fonts settle, while guarding an already disposed effect.
      let alive = true;
      void document.fonts.ready.then(() => { if (alive) ScrollTrigger.refresh(); });
      const onPageShow = () => ScrollTrigger.refresh();
      window.addEventListener('pageshow', onPageShow);

      return () => {
        alive = false;
        if (pointerMove) triggerElement.removeEventListener('pointermove', pointerMove);
        if (pointerLeave) triggerElement.removeEventListener('pointerleave', pointerLeave);
        window.removeEventListener('pageshow', onPageShow);
        if (tick) gsap.ticker.remove(tick);
        lenis?.off('scroll', ScrollTrigger.update);
        lenis?.destroy();
        // matchMedia reverts only the GSAP objects created in this context.
      };
    });

    return () => {
      branchObserver.disconnect();
      media.revert();
      triggerElement.classList.remove('has-parallax');
      delete triggerElement.dataset.parallaxMode;
    };
  }, [target, strength, smoothWheel]);

  return <div className="parallax__ornaments" ref={parallaxRef} aria-hidden="true" />;
}
