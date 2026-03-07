import { GameTetris } from '@/components/games/tetris/game-tetris';
import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function TetrisPage() {
  const game = getGameBySlug('tetris');

  return <GameShell game={game} board={<GameTetris />} actionLabel="已可试玩" />;
}
