import { GameSnake } from '@/components/games/snake/game-snake';
import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function SnakePage() {
  const game = getGameBySlug('snake');

  return <GameShell game={game} board={<GameSnake />} actionLabel="已可试玩" />;
}
