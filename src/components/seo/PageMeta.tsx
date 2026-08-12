import { useEffect } from 'react';

const SITE_URL = 'https://www.zalu.app.shop';

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

interface PageMetaProps {
  title: string;
  description: string;
  path?: string;
  keywords?: string;
  jsonLd?: object;
  noindex?: boolean;
}

export function PageMeta({ title, description, path = '/', keywords, jsonLd, noindex = false }: PageMetaProps) {
  useEffect(() => {
    const fullTitle = title.includes('ZALU') ? title : `${title} | ZALU — Gestão de Salões de Beleza`;
    const url = `${SITE_URL}${path}`;

    document.title = fullTitle;
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertMeta('name', 'description', description);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:site_name', 'ZALU');
    upsertMeta('property', 'og:image', `${SITE_URL}/icons/icon-512x512.png`);
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', description);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:image', `${SITE_URL}/icons/icon-512x512.png`);
    upsertMeta('name', 'keywords', keywords ?? '');

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    const id = 'page-jsonld';
    document.getElementById(id)?.remove();
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = id;
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, keywords, jsonLd, noindex]);

  return null;
}