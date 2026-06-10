# Harness Engineering

**7 个专业 AI Agent，把模糊想法变成可交付代码。**

不是代码生成工具——是一套工程化流水线。每个 Agent 有明确的专业身份、硬边界、铁律和自检清单。

## 项目概述

Harness Engineering 项目创建工具 — 一组 Claude Code Skill，引导用户通过 AI-Native 工程方法论创建 AI-Ready 项目仓库。覆盖四层架构：约束与流程、反馈、知识库、进化。


---

## 流水线

```
用户模糊想法
    │
 ① harness (PM)         项目经理 — 初始化、路由、进度、知识库
    │
 ② harness-spec         需求分析 — 深挖用户意图 → 带 ID 追溯体系的 PRD
    │
 ③ harness-design       方案设计 — SPEC → 完整技术方案（dev Agent 唯一施工依据）
    │
 ④ harness-gate         闸门总控 — 开发前最后把关（AI 审查 + 人签字）
    │
 ⑤ harness-dev          开发调度 — 按模块契约并行派发模块 Agent，集成检查
    │
 ⑥ harness-review       代码审查 — 实现质量 + 需求一致性 + 方案一致性 三维收口
    │
 ⑦ harness-test         测试验证 — 生成 verify.sh + 逐条 AC 验收 + 补稳
    │
 ✅ 交付
```

---

## 文档依赖链

```
SPEC（需求文档）
  ↓ 只被 harness-design 读取
设计方案（design.md + api-spec.md + modules/*.md）
  ↓ 被 gate、dev、review、test 读取
```

下游 Agent 不读 SPEC——只读设计方案。每个 Agent 有自己的信息边界。

---

## 安装

将 `.claude/skills/` 和 `templates/` 拷贝到目标项目：

```
your-project/
  .claude/skills/
    harness/SKILL.md
    harness-spec/SKILL.md
    harness-design/SKILL.md
    harness-gate/SKILL.md
    harness-dev/SKILL.md
    harness-review/SKILL.md
    harness-test/SKILL.md
  templates/
    state.json
    spec-template.md
    dev-map.json
    task-board.json
    agent-design-template.md
    module-spec-template.md
    verify-template.sh
```

---

## 使用

在项目目录下打开 Claude Code，依次调用：

```
harness            PM 初始化骨架 + 查看进度
harness-spec       需求分析，产出 SPEC（带 FR/AC/NFR ID 追溯）
harness-design     方案设计，产出 design.md + api-spec.md + modules/*.md
harness-gate       闸门审查（可跳过，直接确认通过）
harness-dev        并行派发模块 Agent 写代码
harness-review     三维审查（质量 + 需求一致性 + 方案一致性）
harness-test       生成 verify.sh → 运行 → 逐条 AC 验收
```

---

## 7 个 Agent

| Agent | 专业身份 | 核心产出 |
|-------|---------|---------|
| `harness` | 工程项目经理 | state.json、dev-map、task-board |
| `harness-spec` | 产品需求分析师 | SPEC（PRD，含术语表、ID 体系、假设记录） |
| `harness-design` | 技术架构师 | design.md + api-spec.md + modules/*.md |
| `harness-gate` | 闸门审查员 | feasibility-review.md（AI 审查 + 人审批） |
| `harness-dev` | 开发调度者 | 代码 + dev-report.md + dev-log + dev-map |
| `harness-review` | 代码审查员 | review-report.md（🔴🟡🔵 三级评审） |
| `harness-test` | 测试验证工程师 | verify.sh + test-report.md + 补稳规则 |

---

## 每个 Agent 的质量框架

所有 Agent 统一遵循 7 层质量框架：

| 层 | 内容 |
|----|------|
| ① 专业身份声明 | 我是谁、我的价值是什么 |
| ② 铁律 | 不可违反的硬规则 |
| ③ ID 追溯 | 每个结论可追溯到上游文档 |
| ④ 自检清单 | 输出前必查 |
| ⑤ 禁止行为 | 绝对不能做的事 |
| ⑥ 完成标准 | 逐条可验证 |
| ⑦ STOP 硬边界 | 做完就停，不越界 |

---

## 核心设计原则

### 文档单向流动

SPEC → Design → Dev/Review/Test。下游不越级读上游文档。

### Rule 做原则约束，Skill 做流程执行

Rule 一句话：「改完必须编译、测试、事后验证。三步全过才算完成。」
Skill 把每一步写清楚：怎么编、怎么测、怎么验。AI 不是理解——是调用一套现成方法。

### 总验证脚本是统一裁判

`scripts/verify.sh`——5 步固定序列。通过 = 可交付，不通过 = 不得进入下一阶段。不留占位符。

### dev-map 是开发导航图

不是文件列表。回答：功能落点、服务接入、配置位置、影响链路、标准写法、禁区。谁动代码谁改地图。

---

## 项目状态

Harness Engineering 自身是一个 Harness 项目，通过 `scripts/verify.sh` 验证：

```
[PASS] SPEC 包含: 项目目标
[PASS] SPEC 包含: 明确不做的事
[PASS] SPEC 包含: 成功标准
[PASS] SPEC 包含: 技术约束
[PASS] CLAUDE.md 存在
[PASS] .claude/settings.json 存在
[PASS] 文件存在: README.md
[PASS] 文件存在: docs/harness/state.json
[PASS] 文件存在: docs/harness/dev-map.json
[PASS] 文件存在: docs/harness/task-board.json
```

---

## 文件结构

```
.claude/skills/           # 7 个 Agent（SKILL.md）
templates/                # 模板（SPEC、state、dev-map、task-board、module-spec、verify）
docs/superpowers/
  specs/                  # 设计规格
  plans/                  # 实现计划
docs/harness/             # 项目状态（state.json、dev-map.json、task-board.json）
scripts/verify.sh         # 总验证脚本
CLAUDE.md                 # AI 行为规则
```

---

## License

MIT
