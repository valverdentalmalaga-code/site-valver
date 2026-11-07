import { useEffect, useRef, useState } from 'react';

export type PatientReview = {
  author: string;
  text: string;
  rating?: number;
  avatarUrl?: string;
  date?: string;
  sourceName?: string;
  sourceUrl?: string;
  authorized: true;
};
export function authorizedReviews(value: unknown): PatientReview[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is PatientReview => Boolean(item && typeof item === 'object'
    && item.authorized === true && typeof item.author === 'string' && item.author.trim()
    && typeof item.text === 'string' && item.text.trim()));
}
function sourceLink(value?: string) {
  try { const url = new URL(value || ''); return url.protocol === 'https:' ? url.href : ''; } catch { return ''; }
}
export default function PatientReviews({ reviews }: { reviews: PatientReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const measure = () => {
    const track = trackRef.current;
    if (!track) return;
    const start = track.scrollLeft <= 2, end = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    setEdges(old => old.start === start && old.end === end ? old : { start, end });
  };
  useEffect(() => {
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    measure();
    return () => observer.disconnect();
  }, [reviews.length]);
  const navigate = (direction: number, immediate: boolean) => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.firstElementChild?.getBoundingClientRect().width || track.clientWidth;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (width + gap), behavior: immediate || matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <div className="patient-reviews">
    <div className="review-track" ref={trackRef} tabIndex={0} role="region" aria-roledescription="carrusel" aria-label="Opiniones de pacientes" onScroll={measure}
      onKeyDown={event => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); navigate(event.key === 'ArrowRight' ? 1 : -1, true); }
      }}>
      {reviews.map((review, index) => {
        const url = sourceLink(review.sourceUrl);
        const rating = Number.isInteger(review.rating) && review.rating! >= 1 && review.rating! <= 5 ? review.rating : null;
        return <article className="patient-review" key={`${review.author}-${index}`}>
          <span className="reviews-quote" aria-hidden="true">“</span>
          {rating ? <span className="review-stars" aria-label={`Calificación: ${rating} de 5`}><span aria-hidden="true">{'★'.repeat(rating)}{'☆'.repeat(5 - rating)}</span></span> : null}
          <blockquote><p>{review.text}</p></blockquote>
          <footer><strong>{review.author}</strong>{review.date ? <span>{review.date}</span> : null}
            {review.sourceName ? url ? <a href={url} target="_blank" rel="noopener noreferrer">{review.sourceName} ↗</a> : <span>{review.sourceName}</span> : null}
          </footer>
        </article>;
      })}
    </div>
    {reviews.length > 1 ? <div className="review-controls"><span>Desliza para leer más.</span><div><button className="cd-btn" type="button" disabled={edges.start} aria-label="Opiniones anteriores" onClick={event => navigate(-1, event.detail === 0)}>←</button><button className="cd-btn" type="button" disabled={edges.end} aria-label="Opiniones siguientes" onClick={event => navigate(1, event.detail === 0)}>→</button></div></div> : null}
  </div>;
}
