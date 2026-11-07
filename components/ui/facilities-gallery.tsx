import { InfiniteSlider } from '@/components/ui/infinite-slider-horizontal';

const photos = [
  { id: 'sala-espera', label: 'Un momento de calma', alt: 'Sala de espera con sillas blancas, plantas y mesa de madera junto a la entrada' },
  { id: 'gabinete', label: 'Nuestro gabinete', alt: 'Gabinete odontológico con sillón azul, lámpara dental y equipo de trabajo' },
  { id: 'atencion', label: 'Cerca en cada paso', alt: 'Profesional de odontología atendiendo a un paciente en el gabinete de Valver' },
  { id: 'despacho', label: 'Espacio para escucharte', alt: 'Despacho con mesa de madera, dos sillas y estantería para conversar sobre el cuidado dental' },
  { id: 'pasillo', label: 'Cada detalle cuenta', alt: 'Pasillo luminoso de Valver con acceso al despacho y a las demás estancias' },
];

function PhotoCard({ photo }: { photo: typeof photos[number] }) {
  return <figure className="facilities-slide">
    <img src={`./assets/photos/instalaciones/${photo.id}-small.webp`} srcSet={`./assets/photos/instalaciones/${photo.id}-small.webp 480w, ./assets/photos/instalaciones/${photo.id}.webp 900w`} sizes="(max-width:760px) calc(100vw - 40px), (max-width:1440px) 30vw, 425px" width="900" height="1200" alt={photo.alt} loading="eager" decoding="async" draggable={false} />
    <figcaption>{photo.label}</figcaption>
  </figure>;
}

export default function FacilitiesGallery() {
  return <div className="facilities-slider">
    <InfiniteSlider step stepInterval={4.5} label="Nuestras instalaciones: sala de espera y espacios interiores de la clínica">
      {photos.map(photo => <PhotoCard key={photo.id} photo={photo} />)}
    </InfiniteSlider>

  </div>;
}
