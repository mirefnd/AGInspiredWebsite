/**
 * Get thumbnail URL for grid display.
 * Returns the original Supabase public URL — Next.js Image handles
 * resizing via its built-in optimisation pipeline.
 */
export function getThumbnailUrl(url: string): string {
  return url;
}

/**
 * Get viewer URL for full photo display.
 * Returns the original Supabase public URL.
 */
export function getViewerUrl(url: string): string {
  return url;
}
