import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { SiteSettingsProvider } from '@/components/settings/site-settings-provider';
import './globals.css';

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Vercel 在线网页小游戏',
    template: '%s | Vercel 在线网页小游戏',
  },
  description: '包含 2048、俄罗斯方块、贪吃蛇、蜘蛛纸牌和扫雷的在线网页小游戏合集。',
  applicationName: 'Vercel 在线网页小游戏',
  keywords: ['Vercel', 'Next.js', '2048', '贪吃蛇', '扫雷', '俄罗斯方块', '蜘蛛纸牌', '网页小游戏'],
  authors: [{ name: 'demonq0q' }],
  creator: 'demonq0q',
  publisher: 'demonq0q',
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    title: 'Vercel 在线网页小游戏',
    description: '一个包含 2048、贪吃蛇、扫雷、俄罗斯方块和蜘蛛纸牌的在线网页小游戏合集。',
    siteName: 'Vercel 在线网页小游戏',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vercel 在线网页小游戏',
    description: '5 款小游戏已可试玩，支持统一设置区、移动端操作优化和 Vercel 部署。',
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>
        <SiteSettingsProvider>{children}</SiteSettingsProvider>
      </body>
    </html>
  );
}
