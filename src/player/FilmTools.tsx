import { useEffect, useRef, useState } from 'react';

export function usePlayerChrome(playing: boolean) {
  const [idle, setIdle] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  function wake() {
    clearTimeout(timer.current);
    setIdle(false);
    if (playing) timer.current = setTimeout(() => setIdle(true), 3000);
  }
  useEffect(() => {
    wake();
    return () => clearTimeout(timer.current);
  }, [playing]);
  return { hidden: playing && idle, wake };
}

export function useFilmFullscreen(element: React.RefObject<HTMLDivElement>) {
  const [native, setNative] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    const change = () => setNative(document.fullscreenElement === element.current);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, [element]);
  useEffect(() => {
    if (!expanded) return;
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setExpanded(false); };
    document.body.classList.add('film-expanded');
    document.addEventListener('keydown', escape);
    return () => {
      document.body.classList.remove('film-expanded');
      document.removeEventListener('keydown', escape);
    };
  }, [expanded]);
  async function toggleFullscreen() {
    if (expanded) setExpanded(false);
    else if (document.fullscreenElement) await document.exitFullscreen();
    else if (element.current?.requestFullscreen && document.fullscreenEnabled) {
      try { await element.current.requestFullscreen(); } catch { setExpanded(true); }
    } else setExpanded(true);
  }
  return { fullscreen: native || expanded, expanded, toggleFullscreen };
}
