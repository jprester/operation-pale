const paths={
  play:'M7 4.5 19 12 7 19.5Z', pause:'M8 5v14m8-14v14',restart:'M4 10a8 8 0 1 1 .9 6M4 4v6h6',
  fullscreen:'M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5',
  exit:'M9 4v5H4m16 0h-5V4m0 16v-5h5M4 15h5v5',
  audio:'M3 9h4l5-4v14l-5-4H3z M16 8q4 4 0 8m3-11q7 7 0 14',
  mute:'M3 9h4l5-4v14l-5-4H3z M16 9l6 6m0-6-6 6',
  film:'M3 5h18v14H3z M7 5v14m10-14v14M3 9h4m10 0h4M3 15h4m10 0h4',
  atlas:'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z M9 3v15m6-12v15',
  index:'M4 6h2m3 0h11M4 12h2m3 0h11M4 18h2m3 0h11'
};
export function FilmIcon({name}:{name:keyof typeof paths}) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill={name==='play'?'currentColor':'none'} stroke="currentColor"
    strokeWidth={name==='pause'?3:1.55} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true"><path d={paths[name]}/></svg>;
}
