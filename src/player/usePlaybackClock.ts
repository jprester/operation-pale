import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

type Anchor = { position: number; since: number | null };

// Every seek or transport command replaces the anchor synchronously. A paint
// samples it; missed frames never accumulate or become a second time source.
export function usePlaybackClock(duration: number, available: boolean) {
  const anchor = useRef<Anchor>({ position: 0, since: null });
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const running = playing && available && !scrubbing;

  const read = useCallback(() => {
    const { position, since } = anchor.current;
    return Math.min(duration, position + (since === null ? 0 : (performance.now() - since) / 1000));
  }, [duration]);

  useLayoutEffect(() => {
    const position = read();
    anchor.current = { position, since: running ? performance.now() : null };
    setElapsed(position);
  }, [running, read]);

  useEffect(() => {
    if (!running) return;
    let frame: number;
    let lastPaint = -Infinity;
    function tick(now: number) {
      if (now - lastPaint >= 1000 / 30) {
        lastPaint = now;
        const position = read();
        setElapsed(position);
        if (position >= duration) {
          setPlaying(false);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [duration, running, read]);

  function seek(seconds: number) {
    const position = Math.max(0, Math.min(duration, seconds));
    anchor.current = { position, since: running ? performance.now() : null };
    setStarted(true);
    setElapsed(position);
    if (position === duration) setPlaying(false);
  }
  function restart() {
    seek(0);
    setPlaying(true);
  }
  function toggle() {
    if (read() >= duration) restart();
    else {
      setStarted(true);
      setPlaying(value => !value);
    }
  }
  return { elapsed, started, playing, running, read, seek, restart, toggle, setPlaying, setScrubbing };
}
