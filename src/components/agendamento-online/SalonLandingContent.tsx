import { useCallback, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Image } from 'lucide-react';
import type { ConfigAgendamentoOnline } from '@/hooks/useConfigAgendamentoOnline';

export function SalonLandingContent({ config }: { config: ConfigAgendamentoOnline }) {
  const gallery = Array.isArray(config.galeria_urls)
    ? config.galeria_urls.filter((url): url is string => typeof url === 'string' && url.length > 0)
    : [];
  const galleryRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const primaryColor = config.cor_primaria || '#8B5CF6';

  const goToSlide = useCallback((index: number) => {
    const container = galleryRef.current;
    const slide = slideRefs.current[index];
    if (!container || !slide) return;
    const left = slide.offsetLeft - container.offsetLeft - (container.clientWidth - slide.clientWidth) / 2;
    container.scrollTo({ left, behavior: 'smooth' });
    setActiveSlide(index);
  }, []);

  const handleGalleryScroll = useCallback(() => {
    const container = galleryRef.current;
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const distance = Math.abs(center - slideCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });
    setActiveSlide(closestIndex);
  }, []);

  if (gallery.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl space-y-16 px-4 py-12 sm:px-8 sm:py-16 lg:space-y-24">
      <div>
          <div className="mb-7 flex flex-col gap-5 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Image className="h-4 w-4" />
                Nosso trabalho
              </span>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Um espaço para se sentir bem</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Deslize para conhecer nosso espaço, detalhes e resultados.
              </p>
            </div>
            {gallery.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Ver foto anterior"
                  onClick={() => goToSlide(Math.max(0, activeSlide - 1))}
                  disabled={activeSlide === 0}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 shadow-sm transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  aria-label="Ver próxima foto"
                  onClick={() => goToSlide(Math.min(gallery.length - 1, activeSlide + 1))}
                  disabled={activeSlide === gallery.length - 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/80 shadow-sm transition hover:border-primary/40 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={galleryRef}
            onScroll={handleGalleryScroll}
            className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden motion-reduce:scroll-auto sm:gap-6"
            aria-label="Galeria de fotos"
          >
            {gallery.map((url, index) => (
              <figure
                key={`${url}-${index}`}
                ref={element => { slideRefs.current[index] = element; }}
                className={`group relative aspect-[4/3] w-[86%] shrink-0 snap-center overflow-hidden rounded-[1.5rem] bg-muted shadow-[0_20px_50px_-25px_rgba(15,23,42,0.5)] transition-transform duration-500 sm:w-[62%] sm:rounded-[2rem] lg:w-[48%] ${
                  config.efeito_visual === 'float' ? 'hover:-translate-y-1' : ''
                }`}
              >
                <img
                  src={url}
                  alt={`Foto ${index + 1} de ${config.nome_salao}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04] motion-reduce:transform-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent opacity-70 transition-opacity group-hover:opacity-100" />
                <figcaption className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/25 px-4 py-2 text-xs font-semibold text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 sm:bottom-6 sm:left-6">
                  {config.nome_salao}
                </figcaption>
              </figure>
            ))}
          </div>

          {gallery.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-2" aria-label={`Foto ${activeSlide + 1} de ${gallery.length}`}>
              {gallery.map((url, index) => (
                <button
                  key={`dot-${url}-${index}`}
                  type="button"
                  aria-label={`Ir para foto ${index + 1}`}
                  aria-current={activeSlide === index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${activeSlide === index ? 'w-7' : 'w-2 bg-foreground/20 hover:bg-foreground/40'}`}
                  style={activeSlide === index ? { backgroundColor: primaryColor } : undefined}
                />
              ))}
            </div>
          )}
      </div>
    </section>
  );
}
