# Vercel 在线网页小游戏合集

一个基于 `Next.js + TypeScript + App Router` 的在线网页小游戏项目，当前已经完成 5 个小游戏的首版可玩实现，可直接部署到 `Vercel`。

## 1. 当前已完成内容

- `2048`：支持键盘操作、随机出块、计分和最高分保存
- `贪吃蛇`：支持键盘控制、自动前进、食物生成、碰撞失败和最高分保存
- `扫雷`：支持难度切换、首击安全、右键插旗、连片展开、计时和最佳时间保存
- `俄罗斯方块`：支持自动下落、旋转移动、软降、硬降、消行计分、下一块预览和最高分保存
- `蜘蛛纸牌`：支持单花色模式、点击选牌、点击目标列移动、补牌和完整顺子自动收走

## 2. 技术栈

- `Next.js 15`
- `React 19`
- `TypeScript`
- `App Router`
- 原生 `CSS Modules`

## 3. 本地启动

```bash
npm install
npm run dev
```

默认开发地址：`http://localhost:3000`

## 4. 生产构建

```bash
npm run build
npm run start
```

## 5. 页面路由

- 首页：`/`
- `2048`：`/games/2048`
- `俄罗斯方块`：`/games/tetris`
- `贪吃蛇`：`/games/snake`
- `蜘蛛纸牌`：`/games/spider`
- `扫雷`：`/games/minesweeper`

## 6. 项目结构

```text
app/
components/
  game-shell/
  games/
lib/
  games/
docs/
```

说明：

- `app/`：页面路由和全局布局
- `components/game-shell/`：统一游戏页面壳子
- `components/games/`：每个游戏自己的交互组件和样式
- `lib/games/`：每个游戏的纯规则引擎
- `docs/`：部署与维护说明

## 7. 部署到 Vercel

详细步骤见：`docs/Vercel部署说明.md`

简版流程：

1. 将仓库推送到 GitHub
2. 在 Vercel 导入该仓库
3. 保持默认识别为 `Next.js`
4. 无需额外环境变量即可完成首版部署
5. 点击 `Deploy` 等待构建完成

## 8. 当前边界

- `蜘蛛纸牌` 当前是 `单花色 MVP`，还没有拖拽、撤销、双花色和四色模式
- `俄罗斯方块` 当前还没有暂停、持有方块和完整墙踢规则
- 所有游戏当前都以桌面端体验为主，移动端只做基础可用

## 9. 后续建议

- 增加 `README` 截图或 GIF 演示
- 增加 `暂停 / 设置 / 音效` 之类的统一控制区
- 为各游戏引擎补单元测试
- 为首页补项目介绍和玩法说明的视觉强化

