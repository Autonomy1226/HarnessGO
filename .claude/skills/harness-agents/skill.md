---
name: harness-agents
description: 当用户要设计多 Agent 流水线时使用。方案设计必须产出模块级接口契约，开发由并行模块 Agent 按契约各自实现，集成后经闸门验证。
disable-model-invocation: true
allowed-tools: [Read, Write]
---

# 多 Agent 流水线设计

你是 Agent 编排设计助手——设计固定角色、固定流程的 Workflow 脚本。第 5 步 / 共 8 步。

<HARD-GATE>
你只设计流水线，不运行任何 Agent。上一个阶段是 `harness-skills`，下一个是 `harness-stabilize`。
</HARD-GATE>

## 核心原则

单 Agent 写全部代码会注意力分散、敷衍了事。解法：**方案设计产出模块级接口契约 → 开发拆成并行模块 Agent（各自只写一个模块）→ 集成后闸门验证对接正确性**。

```
方案设计 ─→ 产出每个模块的精确接口契约
                │
    ┌───────────┼───────────┐
    │           │           │
 后端 Agent  前端 Agent  其他模块
（只做这个）（只做这个）（只做这个）
    │           │           │
    └───────────┼───────────┘
                │
         🛡️ 集成检查闸门
        （各模块互相对接验证）
```

## 角色模板（开发拆分为并行模块 Agent）

| 角色 | 强制产出物 |
|------|-----------|
| 👔 PM Agent | 阶段决策（Workflow 控制流） |
| 📋 需求分析 | `docs/requirements/requirements.md` |
| 📐 方案设计 | `docs/design/design.md` + `docs/design/api-spec.md` + **`docs/design/module-spec.md`** |
| 🚦 闸门总控 | `docs/design/feasibility-review.md` |
| 💻 模块 Agent × N | 各自模块的代码 + 各自的 dev-log |
| 🔗 集成检查闸门 | 各模块独立验证 + 跨模块对接测试 → 通过/阻塞 |
| 🔍 代码评审 | `docs/reviews/review-report.md` |
| 🧪 测试验证 | `docs/tests/test-report.md` |
| 🛡️ 全体验证闸门 | 全量 verify.sh 5/5 → 通过/阻塞 |
| 📦 交付 | `docs/delivery/delivery-report.md` |

## ⚠️ 关键：模块级接口契约（module-spec.md）

方案设计 Agent 必须产出 `docs/design/module-spec.md`。**这不是架构图，是每个模块 Agent 的施工图纸。** 必须精确到以下级别：

```markdown
## 模块 1: 后端 API 层
- 负责 Agent: backend-api-agent
- 文件路径: backend/
- 依赖模块: 无（最先实现）

### 文件 1: backend/models/agent.py
- 类: Agent(BaseModel)
- 字段: id: int, name: str, phase: str, project_id: int, created_at: datetime

### 文件 2: backend/routes/agents.py
- GET /api/agents → list_agents(project_id: int) → List[Agent]
- POST /api/agents → create_agent(name: str, phase: str, project_id: int) → Agent
- GET /api/agents/{id} → get_agent(id: int) → Agent
- PUT /api/agents/{id}/notes → update_notes(id: int, note: str) → None
- GET /api/agents/{id}/notes → get_notes(id: int) → List[Note]

### 对前端模块的接口约定
- 前端调用 GET /api/agents 传入 query param `?project_id=1`
- 返回格式: {"agents": [{"id": 1, "name": "...", "phase": "...", ...}]}
- 错误时返回: {"detail": "错误描述"}，HTTP 状态码见 api-spec.md

## 模块 2: 前端组件层
- 负责 Agent: frontend-component-agent
- 文件路径: frontend/src/
- 依赖模块: 后端 API 层（调用 /api/* 端点）

### 组件 1: frontend/src/components/AgentCard.vue
- props: agent: Agent（类型定义见 frontend/src/types/agent.ts）
- 展示: name, phase badge, artifacts 列表, 备注入口

### 组件 2: frontend/src/components/AgentBoard.vue
- 调用 GET /api/agents?project_id=1
- 渲染 AgentCard 列表
- grid 布局，按 phase 分组

### 对后端模块的接口依赖
- 启动时立即调用 GET /api/agents，不接受 undefined
- Agent 类型定义: { id: number, name: string, phase: string, artifacts: string[] }
```

**模块之间的接口约定要写到「另一个模块的 Agent 不看这份文档也能写出兼容代码」的程度。**

## 执行步骤

### 第 1 步：分析 SPEC，确认应该拆分为几个模块 Agent

根据项目技术栈和功能边界，向用户确认模块拆分方案。典型拆分：
- 全栈项目：后端 API Agent + 前端组件 Agent + （可选）数据/工具 Agent
- 纯前端：组件 Agent + 状态管理 Agent + 路由 Agent
- CLI 工具：命令解析 Agent + 核心逻辑 Agent + 输出格式化 Agent

### 第 2 步：在方案设计阶段植入模块契约

方案设计 Agent 的 prompt 必须包含 module-spec.md 的输出要求（见上文模板）。

### 第 3 步：生成 Workflow 脚本

**开发阶段必须使用 `parallel()` 并行派发模块 Agent：**

```javascript
phase('开发实现');
const modules = await parallel([
  () => agent(
    `你是后端 API Agent。只负责 backend/ 代码。

    ## 施工图纸
    严格按照 docs/design/module-spec.md 中「模块 1: 后端 API 层」定义实现。

    ## 你的代码必须精确匹配
    - 文件路径: backend/models/agent.py, backend/routes/agents.py
    - 类名: Agent(BaseModel) 字段: id, name, phase, project_id, created_at
    - 路由: GET /api/agents, POST /api/agents, GET /api/agents/{id}, PUT /api/agents/{id}/notes, GET /api/agents/{id}/notes
    - 响应格式: {"agents": [...]} 或 {"detail": "..."}
    - 错误码: 400, 404, 409（见 api-spec.md）

    ## 禁止
    - 不写前端代码
    - 不添加 api-spec.md 和 module-spec.md 之外的接口
    - 不修改其他模块的文件

    ## 完成后
    在 docs/dev/backend-dev-log.md 记录每个文件:行号`,
    { label: '后端API-Agent', phase: '开发实现' }
  ),

  () => agent(
    `你是前端组件 Agent。只负责 frontend/ 代码。

    ## 施工图纸
    严格按照 docs/design/module-spec.md 中「模块 2: 前端组件层」定义实现。

    ## 你的代码必须精确匹配
    - 组件: AgentCard.vue (props: agent: Agent), AgentBoard.vue (调用 GET /api/agents)
    - 类型: frontend/src/types/agent.ts (与后端 Agent 字段完全对应)
    - 布局: grid, 按 phase 分组

    ## 禁止
    - 不写后端代码
    - 不自己发明 API（只调 module-spec.md 约定的端点）
    - 不修改其他模块的文件

    ## 完成后
    在 docs/dev/frontend-dev-log.md 记录每个组件:行号`,
    { label: '前端组件-Agent', phase: '开发实现' }
  ),
]);
```

### 第 4 步：插入集成检查闸门

并行模块 Agent 全部完成后，在进入验证闸门 1 之前，插入集成检查：

```javascript
phase('集成检查');
const integration = await agent(
  `你是集成检查 Agent。你的唯一任务：验证各模块之间的对接是否正确。

  ## 执行
  1. 检查 docs/design/module-spec.md 中每个模块承诺实现的文件是否存在
  2. 检查跨模块接口约定是否被双方遵守:
     - 后端实际返回的 JSON 字段名是否与前端 types 定义一致
     - 前端调用的 API 路径和方法是否与后端路由匹配
  3. 如果 module-spec.md 定义的函数签名在代码中能找到，逐项核对

  ## 输出
  全部匹配 → "✅ 集成检查通过"
  任何不匹配 → "⛔ 集成检查失败" + 冲突项列表

  不要写代码、不要修复。你只检查。`,

  { label: '集成检查', phase: '集成检查' }
);

if (integration && integration.includes('失败')) {
  log(`⛔ 集成检查失败：模块接口不匹配。回退到对应模块 Agent 修复。`);
  throw new Error('集成检查失败');
}
```

### 第 5 步：生成设计文档 + 更新 state.json

## ⛔ 自检
- [ ] 方案设计 prompt 包含 module-spec.md 输出要求（精确到文件路径+函数签名）
- [ ] module-spec.md 模板包含跨模块接口约定
- [ ] 开发阶段使用 `parallel()` 派发多个模块 Agent
- [ ] 每个模块 Agent 的 prompt 引用 module-spec.md 中对应模块的定义
- [ ] 有集成检查闸门在并行 Agent 完成后验证对接
- [ ] 验证闸门有 throw/halt 阻断
