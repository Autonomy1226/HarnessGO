---
name: harness-init
description: 初始化 Harness Engineering 项目骨架——仅创建目录和模板文件，不讨论需求、不写代码
---

# ⛔ 硬边界：你只做初始化，到此为止

你在 Harness 8 阶段流水线中的位置：**第 1 步 / 共 8 步**。

你的**唯一任务**：创建项目目录骨架 + 拷贝模板文件 + 生成初始 state.json。
下一个阶段是 `harness-spec`（由用户手动调用），不是你。

## 你绝对不能做的事

- ❌ 不要讨论需求、功能、用户故事
- ❌ 不要设计架构或技术方案
- ❌ 不要写任何业务代码
- ❌ 不要跳到 SPEC 编写（那是 harness-spec 的活）
- ❌ 不要问"你想实现什么功能"——只问项目名、一句话描述、技术栈方向

## 执行步骤

### 第 1 步：确认项目基础信息（只问 3 个问题）

1. 项目名称是什么？
2. 一句话描述是什么？
3. 技术栈方向（前端/后端/全栈/CLI/库）？

**问完就停，不要追问细节。**

### 第 2 步：创建目录结构

在项目根目录创建：

```
docs/
  specs/
  requirements/
  design/
  dev/
  reviews/
  tests/
  delivery/
  harness/
scripts/
.claude/skills/harness/
```

### 第 3 步：拷贝模板文件

从 `templates/` 目录拷贝以下文件：
- `templates/state.json` → `docs/harness/state.json`
- `templates/spec-template.md` → `docs/specs/` 目录
- `templates/dev-map.json` → `docs/harness/dev-map.json`
- `templates/task-board.json` → `docs/harness/task-board.json`

修改 `state.json`：
- `project` 设为用户输入的项目名
- `current_phase` 设为 `"spec"`
- `init` 阶段标记为 `"completed"`

### 第 4 步：生成最小 CLAUDE.md（如果不存在）

```markdown
# CLAUDE.md

## 项目概述
[由 /harness-spec 填充]

## 规则
- 所有代码变更前必须先运行类型检查
- 提交前必须通过总验证脚本

## 技能
[由 /harness-skills 填充]

## Agent 编排
[由 /harness-agents 填充]
```

### 第 5 步：输出确认并停止

输出：

```
✅ Harness 项目骨架已创建

创建的目录：docs/specs/ requirements/ design/ dev/ reviews/ tests/ delivery/ harness/ scripts/
创建的文件：docs/harness/state.json、CLAUDE.md、模板文件

📌 流水线位置：1/8 完成
📌 下一步：用户手动运行 harness-spec 开始撰写 SPEC
```

## ⛔ 最终 STOP 规则

输出确认清单后**立即停止**。不要问"还需要我做什么"。不要建议下一步。你只做初始化。
