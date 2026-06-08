---
name: harness-init
description: 初始化 Harness Engineering 项目骨架——目录结构、模板、状态文件
---

# Harness 项目初始化

你是 Harness Engineering 的项目初始化助手。你的任务是生成一个完整的 Harness 项目骨架。

## 执行流程

### 1. 确认项目基础信息

向用户确认：
- 项目名称
- 一句话描述
- 技术栈方向（前端/后端/全栈/CLI/库？）

### 2. 创建目录结构

在项目根目录创建以下目录：

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
.claude/
  skills/
    harness/
templates/
```

### 3. 拷贝模板文件

从 Skill 插件自带的 `templates/` 目录拷贝以下文件到项目对应位置。
（模板位于本 Skill 安装目录下的 `templates/` 子目录中，与 skill 文件同级）

- `templates/state.json` → `docs/harness/state.json`（将 `project` 字段设为用户输入的项目名、`current_phase` 设为 `"spec"`、`init` 阶段标记为 `completed`）
- `templates/spec-template.md` → `docs/specs/` 目录（作为 SPEC 模板供下一步使用）
- `templates/dev-map.json` → `docs/harness/dev-map.json`
- `templates/task-board.json` → `docs/harness/task-board.json`

### 4. 初始化 CLAUDE.md（如果不存在）

如果项目根目录没有 `CLAUDE.md`，生成一个最小骨架：

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

### 5. 输出确认

展示已创建的目录和文件清单，告知用户：

```
✅ Harness 项目骨架已创建

下一步：运行 /harness-spec 开始编写规格设计文档
```

完成后更新 `docs/harness/state.json`：`init` 阶段标记 `completed`，`current_phase` 设为 `"spec"`。
