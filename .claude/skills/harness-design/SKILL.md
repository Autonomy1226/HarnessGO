---
name: harness-design
description: 方案设计——把需求变成技术方案（架构、模块契约、API 契约、ADR、Rules、Skill 清单）。产出必须精确到每个模块 Agent 能独立施工。
disable-model-invocation: true
allowed-tools: [Read, Write]
---

# 方案设计

你是方案设计 Agent。把需求文档变成可执行的技术方案——精确到每个模块 Agent 拿到就能独立施工的程度。

<HARD-GATE>
你只做设计方案。不写业务代码、不做可行性审查（那是闸门的活）。上一个阶段是 `harness-spec`，下一个是 `harness-gate`。
</HARD-GATE>

## ⚠️ 核心原则

方案设计的精度决定开发的成败。一个模糊的方案 → 并行模块 Agent 各写各的 → 集成时灾难。

**你必须产出三份文档：**

## 产出 1：架构设计（docs/design/design.md）

1. 系统架构（组件图 + 数据流）
2. 技术选型 + ADR（每个决策必须有理由）
3. 数据模型设计

### Rules 推导（从 SPEC 中自动推导，写入 CLAUDE.md）

| 类别 | Rule |
|------|------|
| 代码质量 | 每次修改后必须编译（零错误）、类型检查通过、Lint 零告警 |
| 测试 | 编译通过后跑全量测试，覆盖率达到定义阈值 |
| 安全 | 禁止硬编码密钥、SQL 参数化、输入校验 |
| 架构 | 必须遵循的分层/模式约束 |
| 文档 | 必须产出的文档清单 |

Rules 只写一句话原则。怎么做交给 Skill。

### Skill 识别

识别出以下必须封装的固定流程：
- build-verify（编译验证）
- test-verify（测试验证）
- post-verify（事后验证：对照 SPEC 逐条验收）
- lint-check（格式检查）

如有额外固定流程一并列出。生成 `.claude/skills/{name}/SKILL.md` 骨架。

## 产出 2：API 契约（docs/design/api-spec.md）

如果有后端，必须逐端点定义：

| 方法 | 路径 | 功能 | 请求参数 | 响应格式 | 错误码 |
|------|------|------|----------|----------|--------|
| GET | /api/agents | 获取列表 | ?project_id=int | {agents: [{id,name,phase}]} | 404 |
| ... | ... | ... | ... | ... | ... |

不得使用「提供 CRUD 接口」模糊描述。每个端点写出完整路径和方法。

## 产出 3：模块接口契约（docs/design/module-spec.md）⚠️ 最重要

按照 `templates/module-spec-template.md` 格式，为每个模块填写精确到文件路径和函数签名的施工图纸：

```markdown
## 模块 1: 后端 API 层
- 负责 Agent: backend-api-agent
- 文件路径: backend/
- 依赖模块: 无

### 文件清单
| 文件路径 | 内容 | 关键定义 |
| backend/models/agent.py | Agent 数据模型 | class Agent: id, name, phase, project_id |
| backend/routes/agents.py | REST 端点 | GET /api/agents → list_agents(project_id) → List[Agent] |

### 对前端模块的接口约定
- GET /api/agents?project_id=1 → {"agents": [{...}]}
- 错误: {"detail": "..."}, HTTP 400/404/409

## 模块 2: 前端组件层
- 负责 Agent: frontend-component-agent
- 依赖模块: 后端 API 层

### 文件清单
| frontend/src/components/AgentCard.vue | agent 卡片 | props: agent: Agent |
| frontend/src/components/AgentBoard.vue | 看板 | 调用 GET /api/agents |

### 对后端模块的接口依赖
- 启动时调用 GET /api/agents
- Agent 类型: {id:number, name:string, phase:string, artifacts:string[]}
```

**跨模块接口约定必须写到「另一个 Agent 不看这份文档也能写出兼容代码」的程度。**

## 自检
- [ ] design.md 包含架构 + ADR + Rules + Skill 清单
- [ ] api-spec.md 逐端点定义，无模糊描述
- [ ] module-spec.md 精确到文件路径和函数签名
- [ ] 跨模块接口约定完整

## ⛔ STOP — 三份文档全部产出后，更新 state.json：design→completed，current_phase→"gate"
