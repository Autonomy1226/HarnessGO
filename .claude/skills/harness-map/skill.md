---
name: harness-map
description: 建立与维护项目知识库——dev-map 开发导航、任务看板、多种索引
---

# 知识库建立与维护

你是 Harness Engineering 的知识库管理助手。你的任务是建立 dev-map（开发导航）和任务看板（项目态势板）。

## 核心原则

1. **索引优先**：是导航系统，不是百科全书。告诉 AI 和人"从哪进门"。
2. **AI 自维护**：谁动代码谁改地图，谁管需求谁改看板——流程副产物。
3. **时机**：项目初期不需要，进入 Agent 阶段后才激活。
4. **写进仓库**：知识库是 Git 仓库中的文件，不是 Memory。

## dev-map 维护

### 初始化

浏览项目结构，填充 `docs/harness/dev-map.json`：

- **entry_points**：主入口文件、核心模块索引。元素结构：`{ "path": "src/index.ts", "description": "", "role": "main" }`
- **modules**：逻辑分组、依赖关系。元素结构：`{ "name": "", "path": "", "description": "", "dependencies": [], "interfaces": [] }`
- **critical_paths**：最重要的 5-10 个文件及理由。元素结构：`{ "path": "", "why_important": "" }`
- **document_index**：SPEC、ADR、测试文档等路径
- **no_go_zones**：自动生成文件、禁止修改的目录
- **change_hotspots**：最近频繁修改的区域

### 持续维护

每次代码变更后，开发 Agent 应更新 dev-map：
- 新增模块 → 加入 modules
- 接口变更 → 更新 interfaces
- 删除了关键文件 → 从 critical_paths 移除

## 任务看板维护

### 初始化

基于 state.json 的各阶段状态，填充 `docs/harness/task-board.json`：

- **completed**：已完成阶段 + 产出物链接
- **in_progress**：当前阶段 + 负责人 + 预计产出
- **pending**：待开始阶段 + 依赖关系

每列元素结构：`{ "id": "", "title": "", "phase": "", "owner": "", "artifacts": [], "blocked_by": [], "started_at": null, "completed_at": null }`

### 持续维护

PM Agent 在每阶段完成/回退后更新看板。

## 多种索引生成

为用户生成以下索引视图：

1. **按文件类型**：所有 SPEC、所有 ADR、所有测试文档
2. **按流水线阶段**：需求阶段的文档、开发阶段的文档
3. **按关注点标签**：安全相关、性能相关、API 契约
4. **按时间线**：最近两周变更、本次交付新增

## 漂移检测

定期（每次 `/harness-status` 调用时）检查：
- dev-map 中的路径是否实际存在
- 任务看板状态是否与 state.json 一致
- 新增文件是否已纳入索引

发现漂移 → 报告并建议修复。

完成后更新 `docs/harness/state.json`：`map` 阶段标记 `completed`，`knowledge_base_active` 设为 `true`，`current_phase` 设为 `"iterating"`。
