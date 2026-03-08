import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vercel 在线网页小游戏',
    short_name: '网页小游戏',
    description: '包含 2048、贪吃蛇、扫雷、俄罗斯方块和蜘蛛纸牌的在线网页小游戏合集。',
    start_url: '/',
    display: 'standalone',
    background_color: '#08111d',
    theme_color: '#08111d',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

