import { useEffect, useState, useCallback } from 'react';
import { storage, LOCAL_STORAGE_KEYS } from '@/lib/localStorage';

type SoundItem = { name: string; src: string };

const DEFAULTS = ['Mensagem de Texto 1.mp3', 'Mensagem de Texto 2.mp3', 'Mensagem de Texto 3.mp3'];

export function useSoundLibrary() {
  const [sounds, setSounds] = useState<SoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fileToUrl = useCallback((filename: string) => {
    return `/sounds/${encodeURIComponent(filename)}`;
  }, []);

  const addUnique = (items: SoundItem[]) => {
    setSounds(prev => {
      const map = new Map<string, SoundItem>();
      [...prev, ...items].forEach(i => map.set(i.name, i));
      return Array.from(map.values());
    });
  };

  const loadManifest = useCallback(async () => {
    const manifest = '/sounds/sounds.json';
    try {
      const res = await fetch(manifest, { cache: 'no-cache' });
      if (res.ok) {
        const list = await res.json();
        if (Array.isArray(list)) {
          const items = list
            .filter((n) => typeof n === 'string' && (n.toLowerCase().endsWith('.mp3') || n.toLowerCase().endsWith('.wav')))
            .map((n) => ({ name: n, src: fileToUrl(n) }));
          addUnique(items);
        }
      }
    } catch { /* ignore */ }
  }, [fileToUrl]);

  const loadDefaults = useCallback(() => {
    addUnique(DEFAULTS.map(n => ({ name: n, src: fileToUrl(n) })));
  }, [fileToUrl]);

  const loadCustomStorage = useCallback(() => {
    try {
      const list = storage.getData<string[]>(LOCAL_STORAGE_KEYS.CUSTOM_SOUND_LIB);
      if (list && Array.isArray(list)) {
        addUnique(list.map(n => ({ name: n, src: fileToUrl(n) })));
      }
    } catch { /* ignore */ }
  }, [fileToUrl]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      loadDefaults();
      loadCustomStorage();
      await loadManifest();
      setLoading(false);
    })();
  }, [loadDefaults, loadCustomStorage, loadManifest]);

  const addIfExists = useCallback(async (filename: string) => {
    const clean = filename.trim();
    if (!clean) return false;
    const url = fileToUrl(clean);
    try {
      const res = await fetch(url, { method: 'HEAD' });
      if (res.ok) {
        addUnique([{ name: clean, src: url }]);
        try {
          const existing = storage.getData<string[]>(LOCAL_STORAGE_KEYS.CUSTOM_SOUND_LIB) || [];
          const list: string[] = Array.isArray(existing) ? existing : [];
          if (!list.includes(clean)) {
            list.push(clean);
            storage.saveData(LOCAL_STORAGE_KEYS.CUSTOM_SOUND_LIB, list);
          }
        } catch { /* ignore */ }
        return true;
      }
    } catch { /* ignore */ }
    return false;
  }, [fileToUrl]);

  const reload = useCallback(async () => {
    setLoading(true);
    setSounds([]);
    loadDefaults();
    loadCustomStorage();
    await loadManifest();
    setLoading(false);
  }, [loadDefaults, loadCustomStorage, loadManifest]);

  return { sounds, loading, addIfExists, reload };
}
