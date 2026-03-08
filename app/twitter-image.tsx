import { ImageResponse } from 'next/og';

export const alt = 'Vercel 在线网页小游戏';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: 48,
          background: 'linear-gradient(135deg, #020617 0%, #111827 45%, #172554 100%)',
          color: '#f8fafc',
          fontFamily: 'Segoe UI',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            borderRadius: 36,
            border: '1px solid rgba(148, 163, 184, 0.18)',
            background: 'rgba(15, 23, 42, 0.68)',
            padding: 44,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 212,
                height: 46,
                borderRadius: 999,
                background: 'rgba(34, 197, 94, 0.16)',
                color: '#86efac',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              可直接部署到 Vercel
            </div>
            <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.04 }}>在线网页小游戏合集</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 28, lineHeight: 1.6, color: '#cbd5e1' }}>
              <div>统一设置区、主题切换、移动端操作优化</div>
              <div>适合直接展示、试玩与继续扩展</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18 }}>
            {['2048', 'Snake', 'Minesweeper', 'Tetris', 'Spider'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 20px',
                  borderRadius: 20,
                  background: 'rgba(30, 41, 59, 0.82)',
                  color: '#f8fafc',
                  fontSize: 22,
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
