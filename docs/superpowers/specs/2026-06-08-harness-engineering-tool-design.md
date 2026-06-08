# Harness Engineering 项目创建工具 — 设计规格文档

> 版本：v1.0 | 日期：2026-06-08 | 状态：待审阅

---

## 一、项目定位

### 1.1 要解决什么问题

Harness Engineering 是一套 AI-Native 工程方法论，包含从 SPEC 撰写到持续进化的完整实践。目前这套方法论存在于少数实践者的经验中——新项目想用这套方法论，靠的是人工口述和模仿，缺乏一套工具来标准化、自动化这个流程。

本工具的目标：**让一个普通软件工程师，通过 Claude Code 对话，被引导走完 Harness Engineering 的完整流程，最终产出一个 AI-Ready 的项目仓库。**

### 1.2 核心设计决策

| 维度 | 决策 |
|------|------|
| 交付形态 | Claude Code Skill 插件（一组 `/harness-*` 命令） |
| 作用范围 | 持续陪伴型（非一次性脚手架） |
| 目标用户 | 普通软件工程师（需教育 + 引导） |
| 交互风格 | 对话引导式（像跟资深架构师聊天） |
| 最终产出 | 完整 AI-Ready 项目仓库（SPEC + Rules + Skills + Agent 编排 + 知识库） |

---

## 二、理论框架：Harness Engineering 四层模型

工具的设计以四层架构为骨架，四个层相互咬合、持续循环：

### 层① 约束与流程（Constraints & Workflow）
AI 该按什么顺序、什么边界做事。覆盖 Rule、Skill、多 Agent 设计、Workflow 编排、落地后补稳。

### 层② 反馈（Feedback）
「做完以后，系统能不能对结果有说法」。总验证脚本作为统一裁判，不是建议，是客观判决。

### 层③ 知识库（Knowledge Base）
项目级、写进仓库的导航系统。dev-map（开发导航）+ 任务看板（项目态势板），索引优先而非百科全书。

### 层④ 进化（Evolution）
人与 AI 合力驱动 Harness 自身改版。记忆 → 仓库晋升通道、Rule → Script 下沉通道、知识库自动纠偏。进化持续反哺前三层。

### 缺一块的典型症状

- **只有流程没有反馈**：完成幻觉——看起来很忙，不知道做对没有
- **只有反馈没有流程**：闸机有了，上游即兴，失败日志难收敛
- **没有知识库**：同一类功能反复重写、同一类坑反复踩
- **没有进化**：前三块冻在某一版，地图与结构脱节，改法堆在会话里落不回仓库

---

## 三、Skill 体系设计

### 3.1 主入口

**`/harness`** — 状态机路由。读取 `docs/harness/state.json`，展示项目成熟度总览，根据当前状态建议下一步动作。

### 3.2 层① Skill

| Skill | 职责 | 主要产出物 |
|-------|------|-----------|
| `/harness-init` | 初始化项目骨架：目录结构、dev-map 模板、看板模板、初始 state.json | `docs/harness/`、`.claude/` |
| `/harness-spec` | 引导用户定义项目目标、范围、Non-goals、成功标准、技术约束 | `docs/specs/{date}-{project}-spec.md` |
| `/harness-rules` | 基于 SPEC 推导 AI 约束——优先 Scripts（可自动判定），其次 Rule（行为约束） | `.claude/settings.json`、`CLAUDE.md` |
| `/harness-skills` | 识别步骤固定、每次必做、做错代价大的流程，封装为 Skill | `.claude/skills/{name}/skill.md` |
| `/harness-agents` | 设计结构化多 Agent 流水线：固定角色、固定流程、明确的前进/回退条件 | `docs/harness/agent-design.md`、Workflow 脚本 |
| `/harness-stabilize` | 定义 Agent 输出校验、Workflow 容错、可观测性策略 | 补稳配置文档 |

### 3.3 层② Skill

| Skill | 职责 | 主要产出物 |
|-------|------|-----------|
| `/harness-verify` | 建立两层验证体系：Tier 1 自动判定（编译/测试/类型/Lint/接口契约，做成 Skill）、Tier 2 人工判定（评审清单）；生成总验证脚本（5 步固定序列） | 总验证脚本、评审清单、门禁配置 |

**总验证脚本固定序列：**

1. **先扫规范** — 产出物是否覆盖 SPEC 中每条需求
2. **再看编译** — 零容忍，编译不过 = 开发未完成
3. **再看测试** — 单元测试 + E2E 管线全量通过
4. **再看规则文件同步** — CLAUDE.md、Skill 定义、Agent 配置一致性
5. **再看工程文件完整性** — 强制文档是否全部产出、dev-map 是否更新

### 3.4 层③ Skill

| Skill | 职责 | 主要产出物 |
|-------|------|-----------|
| `/harness-map` | 建立和维护 dev-map（开发导航）和任务看板；多种索引思路（按文件类型、流水线阶段、关注点、时间线） | `docs/harness/dev-map.json`、`docs/harness/task-board.json` |

**维护分工：**
- **dev-map** → 由开发 Agent 维护（谁动代码谁改地图）
- **任务看板** → 由 PM Agent 维护（谁管需求谁改看板）

**时机：** 项目初期 SPEC + Rules 足够，持续迭代阶段这一层才变得划算。

### 3.5 层④ Skill

| Skill | 职责 | 主要产出物 |
|-------|------|-----------|
| `/harness-evolve` | 管理三个进化机制：Memory→仓库晋升、Rule→Script 下沉、知识库自动纠偏 | 晋升记录、下沉的 Script、纠偏日志 |
| `/harness-status` | 全局项目成熟度总览：当前在哪个阶段、哪些完成、哪些有缺口、下一步建议 | 终端结构化报告 |

---

## 四、结构化多 Agent 流水线

### 4.1 固定角色

| 角色 | 职责 | 输入 | 输出文档 |
|------|------|------|----------|
| 👔 PM Agent | 按流程调度，不替专家做决策 | 任务看板、当前阶段 | 阶段决策（前进/回退） |
| 📋 需求分析 Agent | 理解用户意图，产出需求文档 | 用户输入、SPEC 模板 | `docs/requirements/` |
| 📐 方案设计 Agent | 技术方案 + ADR | 需求文档 | `docs/design/` |
| 🚦 闸门总控 Agent | 开发前最后的可行性分析与风险把关：技术风险、资源可行性、方案与 SPEC 对齐复查 | 方案文档 + SPEC | `docs/design/feasibility-review.md` |
| 💻 开发实现 Agent | 编写代码 + 维护 dev-map | 方案文档 + 可行性报告 | `docs/dev/`、代码 |
| 🔍 代码评审 Agent | 对照清单审查 | 代码 + 方案 | `docs/reviews/` |
| 🧪 测试验证 Agent | 运行总验证脚本 | 代码 + 方案 | `docs/tests/` |
| 📦 交付 Agent | 交付结论 + 进度记录 | 评审结论 + 测试结果 | `docs/delivery/` |

### 4.2 流转规则

- **前进条件**：当前阶段产出物通过对应门禁（自动判定 + 人工清单），PM Agent 读取验证结果决定
- **回退条件**：下游发现上游问题 → 带着具体问题描述回退到对应阶段 → 修复后重新流转

---

## 五、Rule 与 Skill 的分工原则

### 5.1 什么做成 Skill

满足以下全部特征：
- 执行步骤固定
- 每次都要做
- 做错一次代价大
- 不值得让 AI 每次重新思考

**典型例子**：编译验证、单元测试、事后验证——这些做成 Skill。

### 5.2 Rule 的瘦身

Rule 不再写细碎命令和注意事项。Rule 只保留一句话：「你必须做这件事。」

具体怎么做——由 Skill 承载。

### 5.3 Script 优先于 Rule

当实践反复证明某条 Rule 管不住（AI 解释性执行、找例外理由），该约束必须下沉为 Script。这是单向不可逆的过程——Script 不会退化为 Rule。

---

## 六、项目知识的三层分类

所有写进仓库的项目知识按三层分类：

| 层 | 中文 | 比喻 | 内容示例 | 存放 |
|----|------|------|----------|------|
| 档案 Archive | 事实 | 像档案 | SPEC、ADR、设计说明、dev-map | Git 仓库 `docs/` |
| 故事 Stories | 例子 | 像故事 | 测试用例、门禁输出约定、评审清单 | Git 仓库 `docs/` |
| 手册 Handbook | 规矩 | 像手册 | Scripts、Rules、错题晋升的约束 | Git 仓库 `.claude/`、`scripts/` |

**Memory 的定位**：临时草稿区，非权威来源。重要内容不被删除，而是晋升到上面三层。晋升路径：草稿 → 验证 → 认定分类 → 写入仓库对应层级。

---

## 七、项目成熟度状态机

### 7.1 状态文件

`docs/harness/state.json` — 写入仓库，Git 跟踪，所有人可见。

```json
{
  "version": "1.0",
  "project": "项目名",
  "current_phase": "spec",
  "phases": {
    "init":     { "status": "completed",  "completed_at": "...", "artifacts": [...] },
    "spec":     { "status": "in_progress", "started_at": "...",  "artifacts": [...] },
    "rules":    { "status": "pending",    "blocked_by": [] },
    "skills":   { "status": "pending",    "blocked_by": [] },
    "agents":   { "status": "pending",    "blocked_by": [] },
    "stabilize":{ "status": "pending",    "blocked_by": [] },
    "verify":   { "status": "pending",    "blocked_by": [] },
    "map":      { "status": "pending",    "blocked_by": [] }
  }
}
```

### 7.2 跨会话恢复

- 会话打开时 `/harness` 自动读取 `state.json`
- 检查状态文件与仓库实际状态是否一致
- 发现漂移 → 报告并建议修复
- 不依赖 Claude Code Memory 目录

### 7.3 边界情况

- **会话中断**：每个阶段有「进行中」状态 + 中间产物路径，恢复时从最近检查点继续
- **多分支冲突**：state.json 随分支走，合并时总验证脚本检测一致性
- **用户手工修改**：总验证脚本的「规则同步」步骤发现漂移，`/harness-status` 报告
- **空项目初始化**：`/harness-init` 生成完整骨架，所有阶段标记为「待开始」

---

## 八、持续迭代阶段的知识库激活

项目初期（SPEC + Rules 阶段），代码量少、结构扁平，AI 能直接扫描理解。知识库（dev-map + 任务看板）不是第一天就需要。

**激活时机**：进入 `/harness-agents` 阶段后，PM 和开发 Agent 面临「全局视野缺失」风险——新方案冲掉旧方案、AI 重复造轮子。

**激活方式**：`/harness-map` 初始化 dev-map 和任务看板，后续由 Agent 自维护。不是写一份永远没人更新的文档，而是流程的副产物。

---

## 九、成功标准

一个 Harness Engineering 项目的交付标准：

1. **SPEC 完整**：目标、范围、Non-goals、成功标准、技术约束齐全
2. **Rules 就绪**：CLAUDE.md + settings.json 覆盖核心行为约束
3. **Skills 就绪**：编译/测试/验证等固定流程已封装为 Skill
4. **Agent 编排明确**：固定角色、流转规则、文档产出目录定义清楚
5. **总验证脚本可运行**：5 步序列全部通过才算开发完成
6. **知识库可导航**：dev-map 指向关键文件，任务看板反映真实状态
7. **进化通道畅通**：Memory → 仓库晋升、Rule → Script 下沉机制已建立

---

## 十、范围外（Non-goals）

- **不实现**独立的 CI/CD 系统（对接现有的即可）
- **不替代** Git 工作流（分支策略、PR 流程由团队自行管理）
- **不管理**人员权限和协作规则（那是团队章程的事）
- **不生成**业务代码本身（工具生成的是工程化基础设施，不是业务逻辑）
- **不做**实时协作编辑（那是 IDE 或文档平台的事）

---

> 下一步：此规格文档审阅通过后，进入 writing-plans 阶段，产出实现计划。
