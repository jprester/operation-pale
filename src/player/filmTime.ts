export const pad = (n: number) => String(n).padStart(2, '0');
export const clock = (seconds: number) => [Math.floor(seconds / 60), Math.floor(seconds % 60)].map(pad).join(':');
