/**
 * Dashboard journey cover imagery.
 * Uses Lorem Picsum with a fixed seed per journey — a stable, verified CDN that
 * returns a consistent real photo for each seed (no expiring/broken assets).
 */
const cover = (seed) => `https://picsum.photos/seed/${seed}/400/400`;

export const JOURNEY_COVER_IMAGES = {
  'body-transformation': cover('aether-body'),
  'dual-brand': cover('aether-brand'),
  'software-engineering': cover('aether-code'),
  reading: cover('aether-reading'),
  writers: cover('aether-writing'),
};
