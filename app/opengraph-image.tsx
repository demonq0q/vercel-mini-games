import { ImageResponse } from 'next/og';

export const alt = 'Vercel 在线网页小游戏';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          padding: 48,
          background: 'linear-gradient(135deg, #08111d 0%, #15112a 48%, #04131f 100%)',
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
            background: 'rgba(15, 23, 42, 0.62)',
            padding: 44,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 190,
                height: 46,
                borderRadius: 999,
                background: 'rgba(56, 189, 248, 0.16)',
                color: '#7dd3fc',
                fontSize: 24,
                fontWeight: 700,
              }}
            >
              5 款游戏已可试玩
            </div>
            <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.04 }}>Vercel 在线网页小游戏</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 28, lineHeight: 1.6, color: '#cbd5e1' }}>
              <div>2048、贪吃蛇、扫雷、俄罗斯方块、蜘蛛纸牌</div>
              <div>支持统一设置区、移动端优化与 Vercel 部署</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 18 }}>
            {['2048', 'Snake', 'Minesweeper', 'Blocks', 'Spider'].map((item) => (
              <div
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '14px 22px',
                  borderRadius: 20,
                  background: 'rgba(15, 23, 42, 0.72)',
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
