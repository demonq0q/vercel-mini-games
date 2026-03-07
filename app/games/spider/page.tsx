import { GameSpider } from '@/components/games/spider/game-spider';
import { GameShell } from '@/components/game-shell/game-shell';
import { getGameBySlug } from '@/lib/games/catalog';

export default function SpiderPage() {
  const game = getGameBySlug('spider');

  return <GameShell game={game} board={<GameSpider />} actionLabel="已可试玩" />;
}
