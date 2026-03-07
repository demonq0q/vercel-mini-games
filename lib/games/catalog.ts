export type GameSlug = '2048' | 'tetris' | 'snake' | 'spider' | 'minesweeper';

export type GameDefinition = {
  slug: GameSlug;
  name: string;
  path: string;
  routeLabel: string;
  status: string;
  summary: string;
  description: string;
  placeholderTitle: string;
  placeholderDescription: string;
  tags: string[];
  controls: string[];
  todo: string[];
};

export const gameCatalog: GameDefinition[] = [
  {
    slug: '2048',
    name: '2048',
    path: '/games/2048',
    routeLabel: '/games/2048',
    status: '已可试玩',
    summary: '经典数字合并玩法，现已支持键盘操作、随机出块、计分和最高分保存。',
    description: '当前已经可以直接游玩，后续可继续补动画、触屏手势和更完整的胜负提示。',
    placeholderTitle: '2048 游戏区占位',
    placeholderDescription: '当前页面已预留后续棋盘挂载区域，适合直接接入 2048 的状态机和键盘事件。',
    tags: ['键盘操作', '数字合并', '本地最高分'],
    controls: ['方向键或 WASD 移动', '支持重新开始按钮', '支持最高分本地保存'],
    todo: ['补平滑动画效果', '补触屏滑动手势', '补更明显的胜利提示'],
  },
  {
    slug: 'tetris',
    name: '俄罗斯方块',
    path: '/games/tetris',
    routeLabel: '/games/tetris',
    status: '骨架已完成',
    summary: '需要下落循环、碰撞检测和消行逻辑，适合放在 2048 之后实现。',
    description: '当前先保留页面和操作说明，后续再接入矩阵地图、方块旋转和消行计分。',
    placeholderTitle: '俄罗斯方块游戏区占位',
    placeholderDescription: '这里将承载方块地图、下一个方块预览和游戏状态栏。',
    tags: ['实时下落', '碰撞检测', '消行计分'],
    controls: ['方向键左右移动', '上键旋转', '下键加速下落'],
    todo: ['补地图与方块矩阵', '补 tick 循环', '补旋转、落地和消行逻辑'],
  },
  {
    slug: 'snake',
    name: '贪吃蛇',
    path: '/games/snake',
    routeLabel: '/games/snake',
    status: '已可试玩',
    summary: '当前已支持键盘控制、食物刷新、撞墙或撞自己失败，以及最高分本地保存。',
    description: '现在已经可以直接游玩，后续还可以继续补触屏方向、速度档位和暂停功能。',
    placeholderTitle: '贪吃蛇游戏区占位',
    placeholderDescription: '后续将接入网格地图、蛇身数组、食物随机生成和分数显示。',
    tags: ['方向控制', '固定时间步', '碰撞失败'],
    controls: ['方向键或 WASD 控制移动', '禁止反向转头', '支持重新开始和最高分保存'],
    todo: ['补暂停和继续按钮', '补速度切换', '补触屏滑动或虚拟摇杆'],
  },
  {
    slug: 'spider',
    name: '蜘蛛纸牌',
    path: '/games/spider',
    routeLabel: '/games/spider',
    status: '骨架已完成',
    summary: '5 个游戏里复杂度最高，建议先做单花色 MVP，再补拖拽与动画。',
    description: '当前只放骨架和规则拆分，后续从牌组结构、列移动规则和自动收牌开始实现。',
    placeholderTitle: '蜘蛛纸牌游戏区占位',
    placeholderDescription: '这里后续将放 10 列牌堆、发牌区和已完成牌组区域。',
    tags: ['牌组规则', '单花色优先', '复杂交互'],
    controls: ['首版建议点击选中再点击落点', '后续再补拖拽', '支持重新发牌与胜利判断'],
    todo: ['补牌对象和发牌逻辑', '补合法移动校验', '补完成顺子自动收牌'],
  },
  {
    slug: 'minesweeper',
    name: '扫雷',
    path: '/games/minesweeper',
    routeLabel: '/games/minesweeper',
    status: '骨架已完成',
    summary: '适合在前几项之后实现，重点是首击安全、插旗和连片展开。',
    description: '当前页面已预留棋盘区域和说明区，后续可直接接入难度选择、计时和翻格逻辑。',
    placeholderTitle: '扫雷游戏区占位',
    placeholderDescription: '这里后续将承载棋盘、剩余雷数、计时器和胜负提示。',
    tags: ['首击安全', '插旗', '自动展开'],
    controls: ['左键翻开格子', '右键插旗', '支持难度切换与重新开始'],
    todo: ['补雷区生成', '补周围雷数计算', '补 BFS 自动展开'],
  },
];

export function getGameBySlug(slug: GameSlug): GameDefinition {
  const game = gameCatalog.find((item) => item.slug === slug);

  if (!game) {
    throw new Error(`未找到游戏定义：${slug}`);
  }

  return game;
}
