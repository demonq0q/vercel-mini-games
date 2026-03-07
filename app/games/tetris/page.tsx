import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function TetrisPage() {
  const game = getGameBySlug('tetris');

  return <GameShell game={game} />;
}

