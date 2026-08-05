function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0
  }
  return Math.abs(hash)
}

/** Par de colores HSL determinístico a partir de un id — usado para escudos de club, banderas y camisetas. */
export function hashColorPair(seed: string): { color1: string; color2: string } {
  const hash = hashString(seed)
  const hue1 = hash % 360
  const hue2 = (hue1 + 150 + (hash % 60)) % 360
  return { color1: `hsl(${hue1} 55% 42%)`, color2: `hsl(${hue2} 55% 42%)` }
}
