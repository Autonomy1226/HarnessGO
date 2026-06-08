---
name: harness-map
description: 建立知识库——dev-map 和任务看板，索引优先，不写业务文档
---

# ⛔ 硬边界：你只建立索引和看板

你在 Harness 8 阶段流水线中的位置：**第 8 步 / 共 8 步**。

你的**唯一任务**：初始化 dev-map 和任务看板，生成多种索引视图。上一个阶段是 `harness-verify`，完成后项目进入持续迭代。

## 你绝对不能做的事

- ❌ 不要写业务文档（知识库是导航系统，不是百科全书）
- ❌ 不要修改任何已完成的阶段产物
- ❌ 不要运行验证

## 核心原则

- **索引优先**：告诉 AI 和人"从哪进门"，不是导出全仓说明书
- **AI 自维护**：谁动代码谁改地图，谁管需求谁改看板
- **写进仓库**：Git 跟踪，不是 Memory

## 执行步骤

### 第 1 步：初始化 dev-map

浏览项目结构，填充 `docs/harness/dev-map.json`：
entry_points、modules、critical_paths、document_index、no_go_zones、change_hotspots

### 第 2 步：初始化任务看板

基于 state.json，填充 `docs/harness/task-board.json`：
completed / in_progress / pending 三列

### 第 3 步：生成索引视图

- 按文件类型、按流水线阶段、按关注点标签、按时间线

### 第 4 步：更新状态

更新 `docs/harness/state.json`：`map` 标记 `completed`，`knowledge_base_active` 设为 `true`，`current_phase` 设为 `"iterating"`。

## ⛔ STOP — 8 步全部完成，项目进入持续迭代
