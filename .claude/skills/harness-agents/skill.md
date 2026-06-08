---
name: harness-agents
description: 设计多 Agent 流水线——设计必须产出 API 契约，实现必须按契约编码，验证必须按契约逐条检查
---

# ⛔ 硬边界：你只设计 Agent 流水线，不运行

你在 Harness 8 阶段流水线中的位置：**第 5 步 / 共 8 步**。
上一个阶段是 `harness-skills`，下一个是 `harness-stabilize`。

## ⚠️ 三条铁律

生成的 Workflow 脚本必须实现以下契约：

1. **设计出 API 契约** — 方案设计 Agent 必须产出 `docs/design/api-spec.md`，包含每个端点的：方法、路径、请求参数、响应格式、错误码。不允许「提供 REST API」这种模糊描述。
2. **实现按契约编码** — 开发 Agent 的 prompt 必须引用 API 契约文件，要求函数名和路由**精确匹配**契约中的名称。
3. **验证按契约逐条检查** — 验证闸门必须逐个端点发送请求、检查状态码和响应格式。

## 你绝对不能做的事

- ❌ 不要以任何 Agent 的身份执行实际工作
- ❌ 不要在 prompt 文字里「建议」验证——程序化执行
- ❌ 不要运行 Workflow 脚本

## 固定角色模板

| 角色 | 职责 | 强制产出物 |
|------|------|-----------|
| 👔 PM Agent | 调度（Workflow 控制流） | 阶段决策 |
| 📋 需求分析 | 功能需求 + 非功能需求 | `docs/requirements/requirements.md` |
| 📐 方案设计 | 技术方案 + ADR + **API 契约** | `docs/design/design.md`、**`docs/design/api-spec.md`** |
| 🚦 闸门总控 | 可行性 + 风险 + 范围检查 | `docs/design/feasibility-review.md` |
| 💻 开发实现 | 按 API 契约写代码 + 维护 dev-map | `docs/dev/dev-log.md`、代码 |
| 🛡️ 验证闸门 1 | 编译 + 测试 + **API 契约检查** | 通过/阻塞 |
| 🔍 代码评审 | 对照清单 + 对照 API 契约审查 | `docs/reviews/review-report.md` |
| 🧪 测试验证 | SPEC AC 逐条验收 | `docs/tests/test-report.md` |
| 🛡️ 验证闸门 2 | 全量 verify.sh 5/5 | 通过/阻塞 |
| 📦 交付 | 汇总 + 交付结论 | `docs/delivery/delivery-report.md` |

## 执行步骤

### 第 1 步：展示流水线，确认适配

### 第 2 步：定义流转规则

### 第 3 步：生成 Workflow 脚本

生成 `.claude/workflows/harness-pipeline.js`。

**方案设计 Agent 的 prompt 必须包含 API 契约要求：**

```javascript
phase('方案设计');
const design = await agent(
  `你是方案设计师。基于需求文档产出技术方案。

## 技术方案
1. 系统架构设计
2. 技术选型 + ADR
3. 数据模型设计
4. 输出到 docs/design/design.md

## API 契约（必须有）

如果项目有后端，必须产出 docs/design/api-spec.md，格式如下：

| 方法 | 路径 | 功能 | 请求参数 | 响应格式 | 错误码 |
|------|------|------|----------|----------|--------|
| GET | /api/agents | 获取 agent 列表 | ?project_id=int | {agents: [{id,name,phase}]} | 404 |
| POST | /api/agents | 创建 agent | {name,phase,project_id} | {id,created_at} | 400,409 |
| GET | /api/agents/:id | 获取单个 agent | — | {id,name,phase,artifacts} | 404 |
| PUT | /api/agents/:id/notes | 更新备注 | {note} | {updated_at} | 400,404 |
| GET | /api/agents/:id/notes | 获取备注历史 | — | {notes: [{content,created_at}]} | 404 |

不得使用「提供 CRUD 接口」等模糊描述。每个端点必须写出完整路径和方法。

如果没有后端，标注「本项目无后端 API」。`,

  { label: '方案设计', phase: '方案设计' }
);
```

**开发实现 Agent 的 prompt 必须引用 API 契约：**

```javascript
phase('开发实现');
const implementation = await agent(
  `你是开发工程师。

## 实现约束

必须严格按照 docs/design/api-spec.md 中定义的每个端点来实现：
- 路由路径必须逐字匹配
- HTTP 方法必须匹配
- 请求参数名和响应字段名必须匹配
- 错误码定义必须匹配

实现完成后，在 dev-log.md 中列出每个端点的实现文件:行号。

不得添加 API 契约之外的端点。不得省略契约中定义的任何端点。`,

  { label: '开发实现', phase: '开发实现' }
);
```

**验证闸门 1 必须包含 API 契约检查：**

```javascript
phase('验证闸门1');
const gate1 = await agent(
  `你的唯一任务：运行验证。

执行:
1. bash scripts/verify.sh  (检查第 2 步编译和第 3 步测试)

2. 如果 docs/design/api-spec.md 存在且项目有后端：
   - 启动后端服务
   - 逐条读取 api-spec.md 中的端点
   - 对每个端点发送 curl 请求
   - 检查响应状态码是否与契约匹配
   - 检查响应体格式是否与契约匹配
   - 停止后端服务
   - 报告：每个端点 PASS/FAIL

任何一步 FAIL → 报告「闸门1 未通过」。
全部 PASS → 报告「闸门1 通过」。

不要写代码、不要修复、不要给建议。你只判定。`,

  { label: '验证闸门1', phase: '验证闸门1' }
);

if (gate1 && gate1.includes('未通过')) {
  log('⛔ 闸门1 未通过：编译、测试或 API 契约检查失败。回退到开发阶段。');
  throw new Error('闸门1 未通过');
}
log('✅ 闸门1 通过');
```

### 第 4 步：生成设计文档 + 更新状态

## ⛔ 自检

- [ ] 方案设计 Agent prompt 包含 API 契约表格模板
- [ ] 开发实现 Agent prompt 引用 api-spec.md 并要求精确匹配
- [ ] 验证闸门 1 Agent 逐条 curl API 端点
- [ ] 两个验证闸门都有 throw/halt 阻断
