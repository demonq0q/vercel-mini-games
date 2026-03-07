import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function SnakePage() {
  const game = getGameBySlug('snake');

  return <GameShell game={game} />;
}

