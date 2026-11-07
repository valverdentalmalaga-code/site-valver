import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export interface CardItem {
  id: string | number;
  url: string;
  title: string;
  spritePosition?: string;
  logo?: boolean;
}
export interface DiagonalMarqueeCarouselProps {
  cards?: CardItem[];
  angle?: number;
  baseSpeed?: number;
  alternateDirections?: boolean;
  className?: string;
}
const PROCEDURE_TITLES = [
  'Revisión dental', 'Escaneado intraoral', 'Explicación del cuidado',
  'Limpieza profesional', 'Revisión de ortodoncia', 'Estudio del tono dental',
  'Radiografía intraoral', 'Adaptación de un alineador', 'Consulta sobre restauración',
  'Revisión de las encías', 'Orientación de higiene', 'Atención odontológica',
  'Exploración con espejo', 'Preparación de la consulta', 'Instrumental preparado',
  'Consulta de alineadores', 'Explicación del diagnóstico', 'Conversación después de la visita',
];
const DEFAULT_CARDS: CardItem[] = PROCEDURE_TITLES.map((title, index) => {
  const sheet = Math.floor(index / 6) + 1;
  const tile = index % 6;
  return {
    id: `dental-moment-${index + 1}`,
    url: `./assets/photos/essence-procedures-${String(sheet).padStart(2, '0')}.webp`,
    title,
    spritePosition: `${(tile % 3) * 50}% ${Math.floor(tile / 3) * 100}%`,
  };
});

/**
 * Restrained Valver adaptation of Great UI's diagonal marquee.
 * Reference supplied by the user; original component by Saurabh Sharma,
 * Great UI (https://great-ui.com / https://github.com/Saurabh-2607/GreatUI), MIT.
 * Decorative only: local illustrative dental imagery, no interactive cards or hidden copy.
 */
export default function DiagonalMarqueeCarousel({
  cards = DEFAULT_CARDS,
  angle = -14,
  baseSpeed = 205,
  alternateDirections = true,
  className,
}: DiagonalMarqueeCarouselProps) {
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries.some(entry => entry.isIntersecting)), { threshold: 0 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div className={cn('essence-diagonal-background', className)} ref={root} aria-hidden="true" data-running={visible ? 'true' : 'false'}>
    <div className="essence-diagonal-plane" style={{ transform: `rotate(${angle}deg)` }}>
      {[0, 1, 2].map(row => {
        const rowCards = cards.filter((_, index) => index % 3 === row);
        const items = row % 2 ? [...rowCards].reverse() : rowCards;
        return <div className="essence-diagonal-row" key={row}>
          <div className={cn('essence-diagonal-track', alternateDirections && row % 2 === 1 && 'is-reverse')} style={{ '--diagonal-speed': `${baseSpeed + row * 14}s` } as CSSProperties}>
            {[0, 1].map(copy => <div className="essence-diagonal-group" key={copy}>
              {items.map((card, index) => <div className={cn('essence-memory-card', card.logo && 'is-logo')} data-memory-id={card.id} key={`${card.id}-${index}`}>
                {card.spritePosition ? <div className="essence-memory-sprite" style={{ backgroundImage: `url("${card.url}")`, backgroundPosition: card.spritePosition }} /> : <img src={card.url} alt="" loading="lazy" draggable={false} />}
              </div>)}
            </div>)}
          </div>
        </div>;
      })}
    </div>
  </div>;
}
