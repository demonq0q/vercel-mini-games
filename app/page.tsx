import Link from 'next/link';
import { PageTopbar } from '@/components/common/page-topbar';
import { gameCatalog } from '@/lib/games/catalog';
import styles from './home.module.css';

export default function HomePage() {
  const playableCount = gameCatalog.filter((game) => game.status === '已可试玩').length;
  const heroStats = [
    { label: '可玩游戏', value: `${playableCount} / ${gameCatalog.length}`, description: '5 个模块都已完成首版可玩实现' },
    { label: '统一设置', value: '已接入', description: '主题、动效和移动端布局可统一切换' },
    { label: '部署方式', value: 'Vercel', description: '当前仓库可直接导入并完成首版上线' },
  ];
  const featureCards = [
    {
      title: '统一游戏外壳',
      description: '首页、详情页和操作说明保持统一节奏，后续新增游戏时不用重复搭页面骨架。',
    },
    {
      title: '规则引擎独立',
      description: '每个游戏都拆出了自己的纯逻辑引擎，便于后续补测试、重构和多人协作。',
    },
    {
      title: '移动端优先增强',
      description: '加入统一设置区后，可一键切换移动端优先布局，触控设备体验更顺手。',
    },
  ];

  return (
    <main className="page-shell">
      <PageTopbar subtitle="统一设置、多端操作优化、可直接部署到 Vercel" />

      <section className={`${styles.heroPanel} hero-panel`}>
        <div className={styles.heroMain}>
          <span className="hero-badge">5 款游戏已可试玩</span>
          <h1 className={`hero-title ${styles.heroTitle}`}>在线网页小游戏合集</h1>
          <p className={`hero-description ${styles.heroDescription}`}>
            当前项目已经完成 `2048`、`贪吃蛇`、`扫雷`、`俄罗斯方块` 和 `蜘蛛纸牌` 单花色 MVP，
            并补齐了统一设置区、移动端操作优化和 Vercel 部署说明。
          </p>

          <div className={styles.heroActions}>
            <Link className="primary-link" href="/games/2048">
              立即开始
            </Link>
            <a className="ghost-link" href="#game-list">
              查看全部游戏
            </a>
          </div>

          <div className={styles.heroStatGrid}>
            {heroStats.map((item) => (
              <article key={item.label} className={styles.statCard}>
                <span className={styles.statLabel}>{item.label}</span>
                <strong className={styles.statValue}>{item.value}</strong>
                <p className={styles.statDescription}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.heroPreview}>
          <div className={styles.previewPanel}>
            <span className={styles.previewEyebrow}>当前推荐路线</span>
            <h2 className={styles.previewTitle}>从首页进入，即可直接试玩全部模块</h2>
            <ul className={styles.previewList}>
              {gameCatalog.slice(0, 3).map((game) => (
                <li key={game.slug} className={styles.previewItem}>
                  <div className={styles.previewItemBody}>
                    <strong>{game.name}</strong>
                    <p className={styles.previewSummary}>{game.summary}</p>
                  </div>
                  <Link className={styles.inlineLink} href={game.path}>
                    立即打开
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.featureGrid} aria-label="项目亮点">
        {featureCards.map((feature) => (
          <article key={feature.title} className={styles.featureCard}>
            <h2>{feature.title}</h2>
            <p>{feature.description}</p>
          </article>
        ))}
      </section>

      <section className={styles.sectionShell} id="game-list" aria-label="游戏列表区块">
        <div className={styles.sectionHead}>
          <div>
            <span className={styles.sectionEyebrow}>游戏列表</span>
            <h2 className={styles.sectionTitle}>已完成的可玩模块</h2>
          </div>
          <p className={styles.sectionDescription}>所有页面都共享统一设置区，方便在桌面和移动端之间快速切换偏好。</p>
        </div>

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
            <div className={styles.gameCardFooter}>
              <span className={styles.routeText}>{game.routeLabel}</span>
              <Link className="primary-link" href={game.path}>
                进入页面
              </Link>
            </div>
          </article>
        ))}
        </section>
      </section>
    </main>
  );
}
