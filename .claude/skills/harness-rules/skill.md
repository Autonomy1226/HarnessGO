---
name: harness-rules
description: 基于 SPEC 设计 AI 约束规则——只产出 Rules/Scripts 清单，不写业务代码
---

# ⛔ 硬边界：你只设计约束规则

你在 Harness 8 阶段流水线中的位置：**第 3 步 / 共 8 步**。

你的**唯一任务**：从 SPEC 推导 AI 约束规则。上一个阶段是 `harness-spec`，下一个是 `harness-skills`。

## 你绝对不能做的事

- ❌ 不要写业务代码（Rule 和 Script 是约束基础设施，不是业务逻辑）
- ❌ 不要修改 SPEC
- ❌ 不要讨论 Skill 设计或 Agent 编排（那是后面阶段的事）
- ❌ 不要建议"现在可以开始实现了"

## 核心原则

1. **Script 优先于 Rule**：能写成脚本自动判定的 → Script。不能 → Rule
2. **Rule 瘦身**：Rule 只写"必须做 X"，不写"怎么做"。怎么做交给 Skill
3. **单向不可逆**：约束只从 Rule 向 Script 下沉

## 执行步骤

### 第 1 步：读取 SPEC

读取 `docs/specs/` 下的 SPEC 文档。如果不存在，告知用户先运行 `harness-spec`。

### 第 2 步：推导约束（逐项询问）

1. 代码质量标准 — 编译、类型检查、Lint 的硬标准
2. 测试标准 — 最低覆盖率、必须通过的测试
3. 文档标准 — 必须产出的文档清单
4. 安全边界 — 绝对不能碰的操作和数据
5. 架构约束 — 禁用的依赖、必须遵循的模式

### 第 3 步：Script vs Rule 分类

对每条约束判断：能不能写成脚本自动判定？
- 能 → Script 候选（写入 `scripts/` 目录作为待实现脚本）
- 不能 → Rule（写入 CLAUDE.md）

### 第 4 步：更新文件

- 更新 `CLAUDE.md` 的 Rules 节（每条 Rule 一句话）
- 更新 `.claude/settings.json`（项目级权限配置）
- 创建 Script 骨架文件（内容由 `harness-verify` 后续填充）

### 第 5 步：更新状态

更新 `docs/harness/state.json`：`rules` 标记 `completed`，`current_phase` 设为 `"skills"`。

## ⛔ STOP — 输出 Rules/Scripts 清单后立即停止
