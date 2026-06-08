---
name: harness-map
description: 建立项目知识库——两把钥匙：dev-map 管代码导航，任务看板管需求历史
---

# ⛔ 硬边界：你只建立索引和看板

你在 Harness 8 阶段流水线中的位置：**第 8 步 / 共 8 步**。
上一个阶段是 `harness-verify`，完成后项目进入持续迭代。

你的**唯一任务**：建立 dev-map（开发导航图）和任务看板（项目态势板）——让后续任何一个 AI 或人进入项目时，能立刻找到「整个项目从哪读起」的钥匙。

## 你绝对不能做的事

- ❌ 不要写业务文档（这是导航系统，不是百科全书）
- ❌ 不要修改已完成的阶段产物
- ❌ 不要运行验证

---

## 钥匙一：dev-map（开发导航图）

### 它不是什么
不是文件列表。不是目录树 dump。

### 它是什么
这座工程的**开发导航图**。AI 动代码之前，第一件事就是查它。

### 必须回答的 6 个问题

对 `docs/harness/dev-map.json` 中的每个条目，必须能回答：

#### 1. 功能落点 —「某类功能一般落在哪些文件」

在 `modules` 数组中，每个模块描述：

```json
{
  "name": "agent 数据管理",
  "path": "backend/services/agent_service.py",
  "description": "agent 的增删改查、状态流转、备注管理",
  "patterns": ["CRUD 模式", "参数化 SQL", "Service→Repository 分层"],
  "key_functions": ["list_agents()", "create_agent()", "update_notes()"]
}
```

不只是路径——**得让 AI 看完就知道去哪找类似代码、在哪加新功能。**

#### 2. 服务接入 —「某类服务怎么接入」

如果项目有外部依赖、中间件、第三方服务，记录接入方式和入口文件。

```json
{
  "name": "数据库连接",
  "path": "backend/database.py",
  "description": "SQLite 连接池，通过 get_db() 依赖注入到 Repository",
  "pattern": "FastAPI Depends + context manager"
}
```

#### 3. 配置定义 —「某类配置通常在哪定义」

```json
{
  "name": "应用配置",
  "path": "backend/config.py",
  "description": "环境变量 + .env 加载，包含 DB_PATH、LOG_LEVEL、CORS_ORIGINS",
  "pattern": "Pydantic BaseSettings"
}
```

#### 4. 影响范围 —「改一个模块可能会牵动哪些链路」

在 `modules[].dependencies` 中标明依赖：

```json
{
  "name": "agent API 路由",
  "path": "backend/routes/agents.py",
  "dependencies": [
    "backend/services/agent_service.py（业务逻辑）",
    "backend/database.py（DB 连接）",
    "backend/schemas/agent.py（请求/响应模型）"
  ]
}
```

**改路由之前，AI 应该先对一遍这里——知道牵一发动全身。**

#### 5. 标准写法 —「项目里已有的标准写法长什么样」

在 `critical_paths` 中标明参考文件：

```json
{
  "path": "backend/services/agent_service.py",
  "why_important": "标准 CRUD 实现范本，后续新增实体 Service 参照此文件结构",
  "pattern_demo": "Controller→Service→Repository 三层，异常处理用 AppException"
}
```

#### 6. 禁区 —「哪些地方不能乱动」

在 `no_go_zones` 中记录：

```json
["frontend/dist/（构建产物，自动生成）", "backend/migrations/（数据库迁移，只追加不修改）"]
```

---

## 钥匙二：任务看板（项目态势板）

### 它不是普通待办
不是 TODO list。是**项目级的任务历史与当前态势总览**。

### 它必须记录

`docs/harness/task-board.json`，每个任务包含：

```json
{
  "id": "TASK-001",
  "title": "Agent 可视化看板 MVP",
  "phase": "开发实现",
  "owner": "开发 Agent",
  "artifacts": [
    "docs/requirements/requirements.md",
    "docs/design/design.md",
    "docs/design/api-spec.md"
  ],
  "blocked_by": [],
  "started_at": "2026-06-08",
  "completed_at": null,
  "delivery_conclusion": null
}
```

### 新 Agent 进入时的标准操作

任何新的需求分析 Agent 开始工作前，**必须先读任务看板**。它能回答：

| 问题 | 看板里的答案 |
|------|-------------|
| 是新需求还是旧需求延续？ | 往期任务标题和交付结论 |
| 有没有类似任务做过？ | 已完成列的相似任务 |
| 相关文档在哪？ | artifacts 字段 |
| 上一轮设计怎么定的？ | 设计文档路径 → 点进去看 ADR |
| 当前哪些在跑？有没有冲突？ | in_progress 列 |

**新需求把旧设计冲掉的概率会小很多。**

---

## 维护分工

| 谁维护 | 维护什么 | 什么时候 |
|--------|----------|----------|
| 开发 Agent | dev-map | 每次代码变更后。新增模块→加 entry。接口变了→改 dependencies。删了关键文件→更新 critical_paths。**谁改地貌，谁改地图。** |
| PM Agent | 任务看板 | 每阶段完成/回退后。新任务启动时建条目。任务完成时填交付结论。 |

不是「写一份永远没人更新的漂亮文档」——是**流程副产物**，AI 自己改、自己闭环。

---

## 执行步骤

### 第 1 步：初始化 dev-map

浏览当前项目结构，逐条填充 6 个维度的信息。即使项目还是空的，也要建好骨架——后续开发 Agent 在工作中往里面填肉。

### 第 2 步：初始化任务看板

基于 `state.json` 各阶段状态，建初始条目。已完成阶段写入 completed 列，当前阶段写入 in_progress。

### 第 3 步：生成索引视图

四种入口：
- 按文件类型（SPEC 在哪、ADR 在哪、测试文档在哪）
- 按流水线阶段（需求阶段的文档、设计阶段的文档）
- 按关注点标签（安全、性能、API 契约）
- 按时间线（最近两周变更、本次交付新增）

### 第 4 步：更新状态

更新 `docs/harness/state.json`：`map` 标记 `completed`，`knowledge_base_active` 设为 `true`，`current_phase` 设为 `"iterating"`。

---

## ⛔ 最终目标 — 不只是两个工具的名字

是一层能力：**AI 把当前任务做完以后，还能在仓库里找到「整个项目从哪读起」的那几把钥匙。**

- dev-map = 代码与模块结构的入口
- 任务看板 = 需求与任务历史的入口

两个入口都写在仓库里，AI 在流程里各改各的，知识库才真正转得起来。

## ⛔ STOP — 8 步全部完成，项目进入持续迭代
