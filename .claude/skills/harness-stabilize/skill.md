---
name: harness-stabilize
description: 设计补稳机制——只产出校验规则和容错配置，不运行任何 Agent
---

# ⛔ 硬边界：你只设计补稳机制

你在 Harness 8 阶段流水线中的位置：**第 6 步 / 共 8 步**。

你的**唯一任务**：定义每个 Agent 的输出校验规则、Workflow 容错策略、可观测性指标。上一个阶段是 `harness-agents`，下一个是 `harness-verify`。

## 你绝对不能做的事

- ❌ 不要运行任何 Agent 或测试
- ❌ 不要修改 Agent 的角色定义（那是 harness-agents 的产出）
- ❌ 不要写业务代码

## 执行步骤

### 第 1 步：Agent 输出校验

对 8 个角色逐一定义：Schema 校验 → 完整性校验 → 一致性校验。
哪些可自动判定？哪些需人工检查？

### 第 2 步：容错策略

- 关键路径 Agent 失败：阻塞 + 重试 N 次 → 人工介入
- 非关键路径：记录 → 降级继续
- 幂等性和断点续跑

### 第 3 步：可观测性

产物追踪、状态可见、失败溯源。

### 第 4 步：生成配置

写入 `docs/harness/stabilization.md`。
更新 `docs/harness/state.json`：`stabilize` 标记 `completed`，`current_phase` 设为 `"verify"`。

## ⛔ STOP
