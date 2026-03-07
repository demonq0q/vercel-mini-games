import Link from 'next/link';
import { gameCatalog } from '@/lib/games/catalog';

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-panel">
        <span className="hero-badge">Vercel 可部署</span>
        <h1 className="hero-title">在线网页小游戏合集</h1>
        <p className="hero-description">
          当前已搭好项目骨架、首页和 5 个游戏路由，下一步可以逐个补齐游戏逻辑。
        </p>
      </section>

      <section className="game-grid" aria-label="游戏列表">
        {gameCatalog.map((game) => (
          <article key={game.slug} className="game-card">
            <div className="game-card-head">
              <h2>{game.name}</h2>
              <span className="status-chip">{game.status}</span>
            </div>
            <p className="game-summary">{game.summary}</p>
            <ul className="tag-list">
              {game.tags.map((tag) => (
                <li key={tag} className="tag-item">
                  {tag}
                </li>
              ))}
            </ul>
            <Link className="primary-link" href={game.path}>
              进入页面
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}

