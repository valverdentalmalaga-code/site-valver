import { createRoot } from 'react-dom/client';
import ParallaxDemo from '@/demos/default';
import CardDeckCarousel, { type Slide } from '@/components/ui/card-deck-carousel';
import DiagonalMarqueeCarousel from '@/components/ui/great-ui-diagonal-marquee-carousel';
import FacilitiesGallery from '@/components/ui/facilities-gallery';
import './hero.css';

const mount = document.getElementById('hero-parallax-root');
if (mount) {
  const root = createRoot(mount);
  root.render(<ParallaxDemo />);
  // A host can cleanly unmount the island before replacing this page.
  const unmount = () => root.unmount();
  mount.addEventListener('valver:unmount', unmount, { once: true });
  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      mount.removeEventListener('valver:unmount', unmount);
      root.unmount();
    });
  }
}

// Read the existing, fully usable HTML service cards as the source of truth.
const servicesMount = document.getElementById('services-deck-root');
if (servicesMount) {
  const slides: Slide[] = [...document.querySelectorAll<HTMLElement>('.treatment-card')].map(card => {
    const art = card.querySelector<HTMLElement>('.service-art');
    const photo = card.querySelector<HTMLElement>('.service-photo');
    return {
      id: card.id,
      title: card.querySelector('h3')?.textContent?.trim() || '',
      caption: card.querySelector('.service-tagline')?.textContent?.trim() || '',
      description: card.querySelector('.service-copy > p:not(.service-tagline)')?.textContent?.trim() || '',
      detail: card.querySelector('.service-more p')?.textContent?.trim() || '',
      icon: card.querySelector('.service-icon use')?.getAttribute('href') || '#v-tooth',
      image: './assets/photos/treatments.webp',
      imagePosition: `${photo?.style.getPropertyValue('--photo-x') || '0%'} ${photo?.style.getPropertyValue('--photo-y') || '0%'}`,
      alt: art?.getAttribute('aria-label') || '',
    };
  });
  if (slides.length) {
    const root = createRoot(servicesMount);
    root.render(<CardDeckCarousel slides={slides} />);
    const unmount = () => root.unmount();
    servicesMount.addEventListener('valver:unmount', unmount, { once: true });
    if (import.meta.hot) {
      import.meta.hot.dispose(() => {
        servicesMount.removeEventListener('valver:unmount', unmount);
        root.unmount();
      });
    }
  }
}

const essenceMount = document.getElementById('essence-background-root');
if (essenceMount) {
  const root = createRoot(essenceMount);
  root.render(<DiagonalMarqueeCarousel />);
  const unmount = () => root.unmount();
  essenceMount.addEventListener('valver:unmount', unmount, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(() => {
    essenceMount.removeEventListener('valver:unmount', unmount);
    root.unmount();
  });
}

// Installations gallery enhances the static interior photographs.
const facilitiesMount = document.getElementById('facilities-gallery-root');
if (facilitiesMount) {
  const section = document.getElementById('instalaciones');
  const fallback = facilitiesMount.innerHTML;
  const root = createRoot(facilitiesMount);
  section?.classList.add('has-gallery');
  root.render(<FacilitiesGallery />);
  const unmount = () => { root.unmount(); facilitiesMount.innerHTML = fallback; section?.classList.remove('has-gallery'); };
  facilitiesMount.addEventListener('valver:unmount', unmount, { once: true });
  if (import.meta.hot) import.meta.hot.dispose(() => {
    facilitiesMount.removeEventListener('valver:unmount', unmount);
    unmount();
  });
}
