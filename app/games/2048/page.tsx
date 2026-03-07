import { Game2048 } from '@/components/games/2048/game-2048';
import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function Game2048Page() {
  const game = getGameBySlug('2048');

  return <GameShell game={game} board={<Game2048 />} actionLabel="已可试玩" />;
}
