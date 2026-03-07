import type { ReactNode } from 'react';
import Link from 'next/link';
import { PageTopbar } from '@/components/common/page-topbar';
import type { GameDefinition } from '@/lib/games/catalog';

type GameShellProps = {
  game: GameDefinition;
  board?: ReactNode;
  actionLabel?: string;
};

export function GameShell({ game, board, actionLabel = '游戏逻辑待接入' }: GameShellProps) {
  return (
    <main className="page-shell">
      <PageTopbar subtitle="统一设置会在所有游戏页面之间保持同步" />

      <section className="game-shell">
        <header className="shell-header">
          <div>
            <div className="meta-row">
              <span className="meta-chip">{game.status}</span>
              <span className="meta-chip">{game.routeLabel}</span>
            </div>
            <h1 className="game-title">{game.name}</h1>
            <p className="game-description">{game.description}</p>
          </div>

          <div className="shell-actions">
            <Link className="ghost-link" href="/">
              返回首页
            </Link>
            <span className="primary-link" aria-disabled="true">
              {actionLabel}
            </span>
          </div>
        </header>

        <section className="shell-main">
          <div className={board ? 'board-placeholder board-placeholder-filled' : 'board-placeholder'}>
            {board ?? (
              <div className="placeholder-text">
                <strong>{game.placeholderTitle}</strong>
                <p className="section-description">{game.placeholderDescription}</p>
              </div>
            )}
          </div>

          <aside className="info-panel">
            <section className="section-block">
              <h2 className="section-title">操作方式</h2>
              <ul className="control-list">
                {game.controls.map((control) => (
                  <li key={control}>{control}</li>
                ))}
              </ul>
            </section>

            <section className="section-block">
              <h2 className="section-title">下一步</h2>
              <ul className="todo-list">
                {game.todo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </aside>
        </section>
      </section>
    </main>
  );
}
