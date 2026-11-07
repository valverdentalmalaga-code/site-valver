import { Card, CardContent } from '@/components/ui/card';
import { Marquee } from '@/components/ui/marquee-01-utils/marquee';

export type MarqueeReview = {
  author: string;
  text: string;
  avatarTile?: number;
  avatarUrl?: string;
  demo?: boolean;
  rating?: number;
  sourceName?: string;
  sourceUrl?: string;
};
function safeImage(value?: string) {
  try {
    const url = new URL(value || '', document.baseURI);
    return value && (url.protocol === 'https:' || (url.origin === location.origin && ['http:', 'file:'].includes(url.protocol))) ? url.href : '';
  } catch { return ''; }
}
function httpsLink(value?: string) {
  try { const url = new URL(value || ''); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
function ReviewCard({ review }: { review: MarqueeReview }) {
  const avatar = safeImage(review.avatarUrl);
  const source = httpsLink(review.sourceUrl);
  const rating = Number.isInteger(review.rating) && review.rating! >= 1 && review.rating! <= 5 ? review.rating : null;
  return <Card className="natural-review-card" role="listitem"><CardContent>
    <div className="natural-review-person"><span className="natural-review-avatar" aria-hidden="true">
      {review.demo && Number.isInteger(review.avatarTile)
        ? <span className="demo-review-portrait" style={{ backgroundImage: 'url("./assets/photos/review-avatars-demo.webp")', backgroundPosition: `${(review.avatarTile! % 3) * 50}% ${Math.floor(review.avatarTile! / 3) * 100}%` }} />
        : <><span>{review.author.trim().split(/\s+/).slice(0, 2).map(word => word[0]).join('')}</span>{avatar ? <img src={avatar} width="44" height="44" alt="" loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }} /> : null}</>}
    </span><div><h3>{review.author}</h3>{rating ? <div className="natural-review-rating" role="img" aria-label={`Valoración: ${rating} de 5`}><span className="natural-review-stars" aria-hidden="true">{Array.from({ length: 5 }, (_, i) => <svg key={i} className={i < rating ? 'is-filled' : 'is-empty'} viewBox="0 0 24 24"><path d="M12 3 14.8 8.7 21.1 9.6 16.5 14.1 17.6 20.4 12 17.4 6.4 20.4 7.5 14.1 2.9 9.6 9.2 8.7Z" /></svg>)}</span></div> : null}{!review.demo ? <span>Experiencia compartida</span> : null}</div></div>
    <blockquote><p>{review.text}</p></blockquote>
    {!review.demo && review.sourceName ? <div className="natural-review-footer">{source ? <a href={source} target="_blank" rel="noopener noreferrer">{review.sourceName} ↗</a> : <span>{review.sourceName}</span>}</div> : null}
  </CardContent></Card>;
}
export default function TestimonialMarquee({ reviews, demo = false }: { reviews: MarqueeReview[]; demo?: boolean }) {
  const split = Math.ceil(reviews.length / 2);
  const rows = reviews.length >= 6 ? [reviews.slice(0, split), reviews.slice(split)] : [reviews];
  return <div className="testimonial-marquee" data-demo={demo ? 'true' : 'false'}>
    <div className="marquee-toolbar">{demo ? <p className="demo-reviews-notice">Contenido de demostración: nombres, retratos, mensajes y valoraciones creados para este diseño.</p> : <p>Historias compartidas con su propia voz.</p>}
    </div>
    {rows.map((row, index) => <Marquee key={index} reverse={index === 1} duration={index === 1 ? 52 : 44} stationary={row.length < 3} label={demo ? `Contenido de demostración, fila ${index + 1}` : `Opiniones, fila ${index + 1}`}>
      {row.map((review, i) => <ReviewCard review={review} key={`${review.author}-${i}`} />)}
    </Marquee>)}
    <p className="marquee-reduced-hint">Desliza para leer más.</p>
  </div>;
}
