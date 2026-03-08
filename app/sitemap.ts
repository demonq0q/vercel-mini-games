import type { MetadataRoute } from 'next';

const routes = ['/', '/games/2048', '/games/tetris', '/games/snake', '/games/spider', '/games/minesweeper'];

export default function sitemap(): MetadataRoute.Sitemap {
  const updatedAt = new Date();

  return routes.map((route) => ({
    url: route,
    lastModified: updatedAt,
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}

