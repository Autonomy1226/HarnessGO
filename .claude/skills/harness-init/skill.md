---
name: harness-init
description: 当用户要初始化新项目的 Harness Engineering 骨架时使用。只创建目录和模板，不讨论需求、不写代码。
disable-model-invocation: true
allowed-tools: [Bash, Read, Write]
---

# Harness 项目初始化

你是项目初始化助手——创建目录骨架、拷贝模板文件、生成初始状态文件。第 1 步 / 共 8 步。

<HARD-GATE>
你只做初始化。不讨论需求、不设计架构、不写业务代码。下一个阶段是 `harness-spec`，不是你。
</HARD-GATE>

## 你绝对不能做的事

- ❌ 不讨论需求、功能、用户故事
- ❌ 不设计架构或技术方案
- ❌ 不写任何业务代码
- ❌ 不跳到 SPEC 编写

## 执行步骤

### 第 1 步：确认项目基础信息（只问 3 个问题）

1. 项目名称是什么？
2. 一句话描述是什么？
3. 技术栈方向（前端/后端/全栈/CLI/库）？

问完就停，不追问细节。

### 第 2 步：创建目录结构

```
docs/specs/ requirements/ design/ dev/ reviews/ tests/ delivery/ harness/
scripts/
.claude/skills/harness/
```

### 第 3 步：拷贝模板文件

从 `templates/` 拷贝：
- `templates/state.json` → `docs/harness/state.json`
- `templates/spec-template.md` → `docs/specs/`
- `templates/dev-map.json` → `docs/harness/dev-map.json`
- `templates/task-board.json` → `docs/harness/task-board.json`

修改 `state.json`：`project` 设为项目名，`current_phase` 设为 `"spec"`，`init` 标记 `completed`。

### 第 4 步：生成最小 CLAUDE.md（如果不存在）

### 第 5 步：输出确认并停止

```
✅ Harness 项目骨架已创建
📌 流水线位置：1/8 完成
📌 下一步：调用 harness-spec 撰写 SPEC
```

## ⛔ STOP — 输出确认后立即停止
