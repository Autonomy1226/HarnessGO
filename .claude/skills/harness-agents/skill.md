---
name: harness-agents
description: 设计多 Agent 流水线——只产出设计文档和 Workflow 脚本模板，不执行
---

# ⛔ 硬边界：你只设计 Agent 流水线，不运行

你在 Harness 8 阶段流水线中的位置：**第 5 步 / 共 8 步**。

你的**唯一任务**：帮用户确认 8 角色流水线、定义流转规则、生成 Workflow 脚本模板和设计文档。上一个阶段是 `harness-skills`，下一个是 `harness-stabilize`。

## 你绝对不能做的事

- ❌ 不要以任何 Agent 的身份执行实际工作（不写代码、不分析需求、不设计方案）
- ❌ 不要运行 Workflow 脚本
- ❌ 不要替 PM Agent 做调度决策

## 固定 8 角色模板

| 角色 | 职责 | 输出文档 |
|------|------|----------|
| 👔 PM Agent | 按流程调度，不替专家做决策 | 阶段决策 |
| 📋 需求分析 | 产出需求文档 | `docs/requirements/` |
| 📐 方案设计 | 技术方案 + ADR | `docs/design/` |
| 🚦 闸门总控 | 可行性分析与风险把关 | `docs/design/feasibility-review.md` |
| 💻 开发实现 | 写代码 + 维护 dev-map | `docs/dev/` |
| 🔍 代码评审 | 对照清单审查 | `docs/reviews/` |
| 🧪 测试验证 | 运行总验证脚本 | `docs/tests/` |
| 📦 交付 | 交付结论 + 进度记录 | `docs/delivery/` |

## 执行步骤

### 第 1 步：展示 8 角色流水线，确认适配

询问："需要增减角色吗？每个角色 AI 做 vs 人做？"

### 第 2 步：定义流转规则

- 前进条件：产出物存在 + 自动判定通过 + 人工清单确认
- 回退条件：下游发现问题 → 带问题描述回退 → 修复后重新流转

### 第 3 步：生成 Workflow 脚本模板

生成 `.claude/workflows/harness-pipeline.js`，7 个 phase 按序编排。

### 第 4 步：生成设计文档

写入 `docs/harness/agent-design.md`。
更新 `docs/harness/state.json`：`agents` 标记 `completed`，`current_phase` 设为 `"stabilize"`。
提醒用户：知识库需要激活（后续调用 `harness-map`）。

## ⛔ STOP — 输出流水线设计后立即停止
