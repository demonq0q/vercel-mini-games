import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { SiteSettingsProvider } from '@/components/settings/site-settings-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Vercel 在线网页小游戏',
  description: '包含 2048、俄罗斯方块、贪吃蛇、蜘蛛纸牌和扫雷的在线网页小游戏合集。',
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
