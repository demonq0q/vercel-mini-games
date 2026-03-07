import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function MinesweeperPage() {
  const game = getGameBySlug('minesweeper');

  return <GameShell game={game} />;
}

