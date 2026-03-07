import { GameMinesweeper } from '@/components/games/minesweeper/game-minesweeper';
import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function MinesweeperPage() {
  const game = getGameBySlug('minesweeper');

  return <GameShell game={game} board={<GameMinesweeper />} actionLabel="已可试玩" />;
}
