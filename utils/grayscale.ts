export function toGrayscale(hex: string): string {
  const cleanHex = hex.replace("#", "");

  if (cleanHex.length !== 6) return hex;

  const r = parseInt(cleanHex.slice(0, 2), 16);
  const g = parseInt(cleanHex.slice(2, 4), 16);
  const b = parseInt(cleanHex.slice(4, 6), 16);

  const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

  const grayHex = gray.toString(16).padStart(2, "0");

  return `#${grayHex}${grayHex}${grayHex}`;
}

export function mapColorsToGrayscale<T extends Record<string, any>>(colors: T): T {
  const result: Record<string, any> = {};

  for (const key in colors) {
    const value = colors[key];
    result[key] =
      typeof value === "string" && value.startsWith("#")
        ? toGrayscale(value)
        : value;
  }

  return result as T;
}