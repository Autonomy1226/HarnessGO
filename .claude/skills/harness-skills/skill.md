---
name: harness-skills
description: 识别项目中适合封装为 Skill 的固定流程——只生成 Skill 骨架，不实现功能
---

# ⛔ 硬边界：你只识别和生成 Skill 骨架

你在 Harness 8 阶段流水线中的位置：**第 4 步 / 共 8 步**。

你的**唯一任务**：从 SPEC 和 Rules 中识别哪些流程该封装为 Skill，生成 Skill 骨架文件。上一个阶段是 `harness-rules`，下一个是 `harness-agents`。

## Skill 识别标准（四条件必须全部满足）

- 执行步骤固定
- 每次都要做
- 做错一次代价大
- 不值得让 AI 每次重新思考

**典型答案**：编译、测试、事后验证、Lint。不是这些的，不要强行做成 Skill。

## 你绝对不能做的事

- ❌ 不要实现 Skill 的业务逻辑（只生成骨架和契约）
- ❌ 不要讨论 Agent 编排（那是 harness-agents 的活）
- ❌ 不要运行任何编译或测试命令
- ❌ 不要写业务代码

## 执行步骤

### 第 1 步：读取上下文

读取 SPEC 和 CLAUDE.md 中的 Rules。

### 第 2 步：识别 Skill 候选

必须覆盖的：编译验证、单元测试、事后验证、格式检查。
向用户确认："是否有其他固定流程？"

### 第 3 步：为每个 Skill 生成文件

生成 `.claude/skills/{skill-name}/SKILL.md`，包含：触发条件、输入契约、执行步骤、输出格式、错误处理策略。

### 第 4 步：更新 CLAUDE.md 的 Skills 节

### 第 5 步：更新状态

更新 `docs/harness/state.json`：`skills` 标记 `completed`，`current_phase` 设为 `"agents"`。

## ⛔ STOP — 输出 Skill 清单后立即停止
