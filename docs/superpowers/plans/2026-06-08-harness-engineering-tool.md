# Harness Engineering 项目创建工具 — 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 实现一组 Claude Code Skill（10 个 `/harness-*` 命令），引导用户走完 Harness Engineering 四层模型，产出 AI-Ready 项目仓库。

**Architecture:** 每个 Skill 是一个独立的 Markdown 文件（含 YAML 前置元数据），放在 `.claude/skills/harness/` 目录下。主入口 `/harness` 读取 `docs/harness/state.json` 做状态机路由。各子 Skill 完成阶段后更新状态文件。模板文件放在 `templates/` 目录，供 Skill 在初始化时拷贝到项目中。

**Tech Stack:** Claude Code Skill 格式（Markdown + YAML frontmatter），项目状态用 JSON，模板覆盖 Markdown/JSON/Shell。

---

## 文件结构总览

```
.claude/skills/harness/
  harness.md              # 主入口：状态机路由、全局总览
  harness-init.md         # 初始化：目录骨架、模板拷贝
  harness-spec.md         # 层①：SPEC 规格设计引导
  harness-rules.md        # 层①：AI 约束规则设计
  harness-skills.md       # 层①：Skill 识别与生成
  harness-agents.md       # 层①：多 Agent 流水线设计
  harness-stabilize.md    # 层①：补稳机制设计
  harness-verify.md       # 层②：验证体系与总验证脚本
  harness-map.md          # 层③：知识库建立与维护
  harness-evolve.md       # 层④：进化机制管理
  harness-status.md       # 全局：项目成熟度总览

templates/
  state.json              # 项目状态文件模板
  dev-map.json            # dev-map 开发导航模板
  task-board.json         # 任务看板模板
  spec-template.md        # SPEC 文档模板
  agent-design-template.md # Agent 编排设计模板
  verify-template.sh      # 总验证脚本模板

docs/harness/             # 用户项目中生成的文件（示例）
  state.json
  dev-map.json
  task-board.json
```

---

### Task 1: 项目骨架搭建 — 目录、模板、元数据

**Files:**
- Create: `templates/state.json`
- Create: `templates/dev-map.json`
- Create: `templates/task-board.json`
- Create: `templates/spec-template.md`
- Create: `templates/agent-design-template.md`
- Create: `templates/verify-template.sh`
- Create: `.claude/skills/harness/` （空目录）

- [ ] **Step 1: 创建 templates/state.json**

```json
{
  "version": "1.0",
  "project": "",
  "current_phase": "init",
  "phases": {
    "init":      { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "spec":      { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "rules":     { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "skills":    { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "agents":    { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "stabilize": { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "verify":    { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] },
    "map":       { "status": "pending", "started_at": null, "completed_at": null, "artifacts": [], "blocked_by": [] }
  },
  "knowledge_base_active": false,
  "evolution_log": []
}
```

- [ ] **Step 2: 创建 templates/dev-map.json**

```json
{
  "version": "1.0",
  "last_updated": "",
  "entry_points": [],
  "modules": [],
  "critical_paths": [],
  "document_index": {},
  "no_go_zones": [],
  "change_hotspots": []
}
```

`entry_points` 元素结构：`{ "path": "src/index.ts", "description": "", "role": "main" }`
`modules` 元素结构：`{ "name": "", "path": "", "description": "", "dependencies": [], "interfaces": [] }`
`critical_paths` 元素结构：`{ "path": "", "why_important": "" }`

- [ ] **Step 3: 创建 templates/task-board.json**

```json
{
  "version": "1.0",
  "last_updated": "",
  "columns": {
    "completed": [],
    "in_progress": [],
    "pending": []
  }
}
```

每列元素结构：`{ "id": "", "title": "", "phase": "", "owner": "", "artifacts": [], "blocked_by": [], "started_at": null, "completed_at": null }`

- [ ] **Step 4: 创建 templates/spec-template.md**

```markdown
# [项目名称] — 规格设计文档 (SPEC)

> 版本：v1.0 | 日期：YYYY-MM-DD | 状态：草稿

## 1. 项目目标 (What & Why)

[一句话描述项目要解决的核心问题]

## 2. 范围

### 2.1 要做的事

- [ ]

### 2.2 明确不做的事 (Non-goals)

- [ ]

## 3. 目标用户与使用场景

| 用户角色 | 使用场景 | 核心诉求 |
|----------|----------|----------|
|          |          |          |

## 4. 技术约束与边界条件

- 技术栈约束：
- 平台/环境约束：
- 性能/规模边界：

## 5. 外部依赖与接口约定

| 外部系统 | 接口类型 | 关键约定 |
|----------|----------|----------|
|          |          |          |

## 6. 成功标准 (验收条件)

- [ ] 
- [ ] 

## 7. 风险与假设

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
|      |      |          |
```

- [ ] **Step 5: 创建 templates/agent-design-template.md**

```markdown
# Agent 编排设计文档

## 流水线角色定义

| 角色 | 职责 | 输入 | 输出 | 文档路径 |
|------|------|------|------|----------|
| 👔 PM Agent | | | | |
| 📋 需求分析 | | | | |
| 📐 方案设计 | | | | |
| 🚦 闸门总控 | | | | |
| 💻 开发实现 | | | | |
| 🔍 代码评审 | | | | |
| 🧪 测试验证 | | | | |
| 📦 交付 | | | | |

## 流转规则

- 前进条件：
- 回退条件：

## Workflow 脚本设计

[Agent 编排的 Workflow 脚本配置]

## 并行策略

[哪些阶段可以并行、哪些必须串行]
```

- [ ] **Step 6: 创建 templates/verify-template.sh**

```bash
#!/bin/bash
# Harness 总验证脚本 — 5 步固定序列
# 用法：bash scripts/verify.sh
# 输出：每步 [PASS/FAIL/SKIP] + 详细原因

set -e
EXIT_CODE=0
REPORT=""

log_pass() { REPORT="${REPORT}[PASS] $1\n"; }
log_fail() { REPORT="${REPORT}[FAIL] $1 - $2\n"; EXIT_CODE=1; }
log_skip() { REPORT="${REPORT}[SKIP] $1 - $2\n"; }

echo "=== Harness 总验证 ==="
echo ""

# 1. 扫规范
echo "--- 1/5 规范检查 ---"
SPEC_FILE=$(ls docs/specs/*.md 2>/dev/null | head -1)
if [ -z "$SPEC_FILE" ]; then
  log_fail "规范检查" "未找到 SPEC 文件 (docs/specs/*.md)"
else
  # 检查 SPEC 必要字段
  for field in "项目目标" "明确不做的事" "成功标准" "技术约束"; do
    if grep -q "$field" "$SPEC_FILE"; then
      log_pass "SPEC 包含: $field"
    else
      log_fail "SPEC 缺少字段" "$field"
    fi
  done
fi

# 2. 编译检查
echo "--- 2/5 编译检查 ---"
# 项目特定：由 /harness-verify 根据技术栈生成具体命令
# 此处为占位，生成时会替换为实际编译命令
log_skip "编译检查" "请在 /harness-verify 中配置具体编译命令"

# 3. 测试检查
echo "--- 3/5 测试检查 ---"
log_skip "测试检查" "请在 /harness-verify 中配置具体测试命令"

# 4. 规则文件同步
echo "--- 4/5 规则同步 ---"
if [ -f "CLAUDE.md" ]; then
  log_pass "CLAUDE.md 存在"
else
  log_fail "规则同步" "CLAUDE.md 缺失"
fi
if [ -f ".claude/settings.json" ]; then
  log_pass ".claude/settings.json 存在"
else
  log_fail "规则同步" ".claude/settings.json 缺失"
fi

# 5. 工程文件完整性
echo "--- 5/5 工程完整性 ---"
REQUIRED_DOCS=(
  "docs/harness/state.json"
  "docs/harness/dev-map.json"
  "docs/harness/task-board.json"
)
for doc in "${REQUIRED_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    log_pass "文件存在: $doc"
  else
    log_fail "工程完整性" "缺少文件: $doc"
  fi
done

echo ""
echo "=== 验证结果 ==="
echo -e "$REPORT"
echo "退出码: $EXIT_CODE"
exit $EXIT_CODE
```

- [ ] **Step 7: 验证模板文件全部创建**

Run: `ls -la templates/`
Expected: 6 个模板文件全部存在，目录结构正确。

- [ ] **Step 8: Commit**

```bash
git add templates/ && git commit -m "feat: add harness templates (state, dev-map, task-board, spec, agent-design, verify)"
```

---

### Task 2: `/harness` 主入口 Skill

**Files:**
- Create: `.claude/skills/harness/harness.md`

- [ ] **Step 1: 创建主入口 Skill 文件**

```markdown
---
name: harness
description: Harness Engineering 主入口 — 项目工程化的导航与状态管理
---

# Harness Engineering 项目导航

你是 Harness Engineering 的项目导航助手。你的职责是读取项目状态、展示全局总览、引导用户到正确的下一步。

## 启动时必做

1. **读取状态文件**：读取 `docs/harness/state.json`。如果文件不存在，提示用户先运行 `/harness-init`。
2. **扫描仓库实际状态**：检查各阶段产出物是否实际存在，与 state.json 对比。
3. **报告漂移**：如果状态文件声称某阶段完成但产出物缺失，标记为漂移并告知用户。

## 输出格式

展示项目成熟度总览：

```
Harness Engineering 项目状态
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

项目：[project name]
当前阶段：[current phase]

阶段进度：
  ✅ init        完成于 2026-06-08
  ✅ spec        完成于 2026-06-09
  🔄 rules      进行中...
  ⏳ skills     待开始
  ⏳ agents     待开始
  ⏳ stabilize  待开始
  ⏳ verify     待开始
  ⏳ map        待开始

知识库：[未激活 | 已激活]

建议下一步：[具体动作]
```

## 路由规则

根据 `current_phase` 和用户意图路由到对应子 Skill：

- `current_phase = "init"` → 引导到 `/harness-init`
- `current_phase = "spec"` → 引导到 `/harness-spec`
- `current_phase = "rules"` → 引导到 `/harness-rules`
- `current_phase = "skills"` → 引导到 `/harness-skills`
- `current_phase = "agents"` → 引导到 `/harness-agents`
- `current_phase = "stabilize"` → 引导到 `/harness-stabilize`
- `current_phase = "verify"` → 引导到 `/harness-verify`
- `current_phase = "map"` → 引导到 `/harness-map`

如果用户在已完成阶段想修改 → 允许跳转，但提醒可能影响下游阶段。

## 持续陪伴模式

用户打开会话时：
1. 自动运行状态检查
2. 简要报告项目进度
3. 询问是否继续上次工作

不要把整个上下文倒给用户——只给当前阶段需要的。
```

- [ ] **Step 2: 验证 Skill 文件格式**

确认文件包含正确的 YAML frontmatter（`name`、`description`）且 Markdown 内容结构完整。

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/harness/harness.md && git commit -m "feat: add /harness main entry skill"
```

---

### Task 3: `/harness-init` 初始化 Skill

**Files:**
- Create: `.claude/skills/harness/harness-init.md`

- [ ] **Step 1: 创建初始化 Skill**

```markdown
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

从 `templates/` 目录拷贝以下文件到项目对应位置：

- `templates/state.json` → `docs/harness/state.json`（并将 `project` 字段设为用户输入的项目名、`current_phase` 设为 `"spec"`、`init` 阶段标记为 `completed`）
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
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-init.md && git commit -m "feat: add /harness-init skill"
```

---

### Task 4: `/harness-spec` SPEC 设计 Skill

**Files:**
- Create: `.claude/skills/harness/harness-spec.md`

- [ ] **Step 1: 创建 SPEC Skill**

```markdown
---
name: harness-spec
description: 引导用户撰写项目规格设计文档 (SPEC)——目标、范围、Non-goals、成功标准、技术约束
---

# SPEC 规格设计引导

你是 Harness Engineering 的 SPEC 引导助手。你的目标是帮助用户写出一份清晰、无歧义、可验收的规格设计文档。

## 核心原则

你不是给用户一张白纸让他写。而是通过结构化对话逐步收敛需求。每一步聚焦一个主题，不跳跃。

## 对话流程

### 阶段 1：项目目标与范围

引导用户用一句话描述核心问题，然后用以下问题逐层收敛：

1. "这个项目要解决什么核心问题？（一句话）"
2. "谁会用它？在什么场景下用？"
3. "明确不做的事情有哪些？"（Non-goals — 这对 AI Agent 很重要，避免越界实现）

### 阶段 2：技术约束与边界

1. "技术栈有偏好吗？有哪些硬约束？（公司要求、平台限制等）"
2. "性能或规模上有具体要求吗？（并发数、数据量、响应时间）"
3. "有哪些外部系统需要对接？接口约定是什么？"

### 阶段 3：成功标准

追问用户直到能写出可验证的标准：
1. "你怎么判断这个项目做完了？"（不接受"功能跑通"这类模糊标准）
2. "交付时需要哪些文档和产物？"
3. "验收测试的最小集合是什么？"

### 阶段 4：风险与假设

1. "哪些事你可能假设成立但实际不确定？"
2. "最大的技术风险是什么？"

### 阶段 5：生成 SPEC 文档

将对话内容整理为结构化的 SPEC 文档，写入 `docs/specs/YYYY-MM-DD-{project}-spec.md`。文档使用 `templates/spec-template.md` 的结构。

完成后更新 `docs/harness/state.json`：`spec` 阶段标记 `completed`，`current_phase` 设为 `"rules"`。

## 质量检查

生成 SPEC 后自检：
- [ ] 目标可以用一句话讲清楚
- [ ] Non-goals 明确，不会让 Agent 产生歧义
- [ ] 成功标准是可验证的（不只是"功能跑通"）
- [ ] 外部依赖和接口有明确约定
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-spec.md && git commit -m "feat: add /harness-spec skill"
```

---

### Task 5: `/harness-rules` 规则设计 Skill

**Files:**
- Create: `.claude/skills/harness/harness-rules.md`

- [ ] **Step 1: 创建 Rules Skill**

```markdown
---
name: harness-rules
description: 基于 SPEC 设计 AI 约束规则——优先 Scripts 可自动判定，其次 Rule 行为约束
---

# AI 约束规则设计

你是 Harness Engineering 的规则设计助手。你的任务是从 SPEC 中推导出 AI 必须遵守的边界，并推动用户把约束下沉为可判定形式。

## 核心原则

1. **Script 优先于 Rule**：能写成脚本自动判定的，不写成人读的规则
2. **Rule 瘦身**：Rule 只写"必须做什么"，不写"怎么做"。怎么做交给 Skill
3. **单向不可逆**：约束只会从 Rule 向 Script 下沉，不会反向

## 对话流程

### 阶段 1：从 SPEC 推导约束

基于 SPEC 内容，逐条询问：

1. 代码质量标准 — "编译必须零错误？类型检查必须通过？Lint 必须零告警？"
2. 测试标准 — "最低覆盖率？哪些测试必须通过才能进入下一阶段？"
3. 文档标准 — "哪些文档是必须产出的？"
4. 安全边界 — "哪些操作绝对不能做？哪些数据不能记录？"
5. 架构约束 — "不能引入哪些依赖？必须遵循什么设计模式？"

### 阶段 2：Script vs Rule 分类

对每条约束问自己："能不能写成脚本自动判定？"

- 能 → 标记为 Script 候选
- 不能 → 标记为 Rule，追问："什么情况下这条约束会管不住？"

### 阶段 3：生成配置

**Script 列表**（写入 `scripts/` 目录）：
- 编译验证脚本
- 测试运行脚本
- 格式检查脚本
- 这些将加入总验证脚本的调用链

**Rule 列表**（写入 `CLAUDE.md`）：
- 每条 Rule 只写一句话，引用对应的 Skill 或 Script

**CLAUDE.md 的 Rules 节格式：**
```markdown
## 规则

你必须执行以下验证（通过总验证脚本 `scripts/verify.sh`）：
- [ ] 编译零错误
- [ ] 类型检查通过
- [ ] 测试全部通过
- [ ] Lint 零告警

你必须遵守以下行为约束：
- [ ] 不修改 `docs/harness/state.json` 中的已完成阶段记录
- [ ] 每次代码变更后更新 `docs/harness/dev-map.json`
```

### 阶段 4：设置 settings.json

在 `.claude/settings.json` 中配置项目级权限和行为：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test:*)",
      "Bash(npm run lint:*)",
      "Bash(npm run build:*)"
    ]
  }
}
```

完成后更新 `docs/harness/state.json`：`rules` 阶段标记 `completed`，`current_phase` 设为 `"skills"`。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-rules.md && git commit -m "feat: add /harness-rules skill"
```

---

### Task 6: `/harness-skills` Skill 设计 Skill

**Files:**
- Create: `.claude/skills/harness/harness-skills.md`

- [ ] **Step 1: 创建 Skills 设计 Skill**

```markdown
---
name: harness-skills
description: 识别项目中适合封装为 Skill 的固定流程，生成 Skill 骨架
---

# Skill 识别与设计

你是 Harness Engineering 的 Skill 设计助手。你的任务是识别项目中符合以下所有特征的操作，并封装为 Skill：

- 执行步骤固定
- 每次都要做
- 做错一次代价大
- 不值得让 AI 每次重新思考

## 对话流程

### 阶段 1：自动识别 Skill 候选

从 SPEC 和 Rules 中自动识别：

1. **编译验证** — 每个项目必须有的 Skill
2. **单元测试** — 运行测试 + 解析失败 + 分类输出
3. **事后验证** — 对照 SPEC 逐项检查实现
4. **格式检查** — Lint + 格式化
5. 项目特定的：询问用户是否有其他固定流程（部署脚本、数据迁移、API 契约校验等）

### 阶段 2：为每个 Skill 生成骨架

对每个识别的 Skill，生成文件 `.claude/skills/{skill-name}/skill.md`。

Skill 文件必须包含清晰的定义：
- **触发条件**（什么时候调用）
- **输入契约**（需要什么参数/上下文）
- **执行步骤**（固定的操作序列）
- **输出格式**（怎么报告结果）
- **错误处理策略**（失败了怎么办）

### 阶段 3：更新 CLAUDE.md

在 CLAUDE.md 中为每个 Skill 添加引用：

```markdown
## 技能

- `{skill-name}` — 编译验证（零容忍，不通过不进入下一步）
- `{skill-name}` — 单元测试（全量通过，失败带分类输出）
- `{skill-name}` — 事后验证（对照 SPEC 逐项检查）
```

## 输出示例

以编译 Skill 为例：

```markdown
---
name: build-verify
description: 编译验证——零容忍，编译不过不得进入下一阶段
---

# 编译验证 Skill

## 触发条件
代码变更后、进入下一阶段前

## 输入
- 无额外输入，直接检查当前工作区

## 执行步骤
1. 根据项目类型自动检测构建命令（`package.json` 中的 `build` 脚本 / `Makefile` / `cargo build`）
2. 执行构建命令
3. 收集编译错误输出
4. 如果存在错误 → 分类输出（语法错误/类型错误/依赖缺失/其他）
5. 判定：零错误 = PASS，任何错误 = FAIL

## 输出格式
[PASS] 编译通过，无错误
或
[FAIL] 编译失败
  - 语法错误: N 处
  - 类型错误: N 处
  - 依赖缺失: N 处
  - 详细日志: <编译输出路径>

## 错误处理
- 构建命令不存在 → 询问用户配置
- 编译超时 → 报告并建议增大超时或拆分模块
```

完成后更新 `docs/harness/state.json`：`skills` 阶段标记 `completed`，`current_phase` 设为 `"agents"`。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-skills.md && git commit -m "feat: add /harness-skills skill"
```

---

### Task 7: `/harness-agents` 多 Agent 流水线设计 Skill

**Files:**
- Create: `.claude/skills/harness/harness-agents.md`

- [ ] **Step 1: 创建 Agents 设计 Skill**

```markdown
---
name: harness-agents
description: 设计结构化多 Agent 流水线——固定角色、明确流转、每阶段文档产出
---

# 多 Agent 流水线设计

你是 Harness Engineering 的 Agent 编排设计助手。你的任务是帮用户设计固定角色、固定流程的结构化多 Agent 流水线。

## 固定角色模板

以下 8 个角色是经过验证的标准流水线，你可以根据项目特点增减：

| 角色 | 职责 | 输入 | 输出文档 |
|------|------|------|----------|
| 👔 PM Agent | 按流程调度，不替专家做决策 | 任务看板、当前阶段 | 阶段决策（前进/回退） |
| 📋 需求分析 | 理解用户意图，产出需求文档 | 用户输入、SPEC 模板 | `docs/requirements/` |
| 📐 方案设计 | 技术方案 + ADR | 需求文档 | `docs/design/` |
| 🚦 闸门总控 | 开发前最后的可行性分析与风险把关 | 方案文档 + SPEC | `docs/design/feasibility-review.md` |
| 💻 开发实现 | 编写代码 + 维护 dev-map | 方案文档 + 可行性报告 | `docs/dev/`、代码 |
| 🔍 代码评审 | 对照清单审查 | 代码 + 方案 | `docs/reviews/` |
| 🧪 测试验证 | 运行总验证脚本 | 代码 + 方案 | `docs/tests/` |
| 📦 交付 | 交付结论 + 进度记录 | 评审结论 + 测试结果 | `docs/delivery/` |

## 对话流程

### 阶段 1：确认角色适配

1. 展示标准 8 角色流水线
2. 询问用户："这些角色适合你的项目吗？需要增减吗？"
3. 对于每个角色，确认职责边界（AI 做 vs 人做）

### 阶段 2：定义流转规则

**前进条件模板**：
每个阶段完成后，PM Agent 检查：
- 当前阶段产出物是否存在且格式完整
- 自动判定（编译/测试/Lint）是否通过
- 人工清单是否确认

**回退条件模板**：
下游发现问题时：
- 带着具体问题描述回退到对应阶段
- 修复后重新流转经过所有下游阶段

### 阶段 3：设计 Workflow 脚本

生成一个 Claude Code Workflow 脚本，定义 Agent 编排。脚本示例：

```javascript
export const meta = {
  name: 'harness-pipeline',
  description: 'Harness Engineering 8-stage pipeline',
  phases: [
    { title: 'Requirements' },
    { title: 'Design' },
    { title: 'Gate Review' },
    { title: 'Development' },
    { title: 'Code Review' },
    { title: 'Testing' },
    { title: 'Delivery' }
  ]
}

phase('Requirements')
const requirements = await agent(
  `分析用户需求并产出需求文档。SPEC: ${SPEC_CONTENT}`,
  { label: 'requirements-analysis', schema: REQUIREMENT_SCHEMA }
)

phase('Design')
const design = await agent(
  `基于需求文档产出技术方案和 ADR。需求: ${requirements}`,
  { label: 'solution-design', schema: DESIGN_SCHEMA }
)

phase('Gate Review')
const feasibility = await agent(
  `闸门总控：对方案做最后的可行性分析和风险把关。方案: ${design}, SPEC: ${SPEC_CONTENT}`,
  { label: 'gate-review', schema: FEASIBILITY_SCHEMA }
)

if (!feasibility.approved) {
  log(`闸门未通过: ${feasibility.reason}，回退到方案设计阶段`)
  // 触发回退
}

// ...后续阶段
```

### 阶段 4：生成 Agent 编排文档

将设计结果写入 `docs/harness/agent-design.md`，使用 `templates/agent-design-template.md` 的结构。

完成后更新 `docs/harness/state.json`：`agents` 阶段标记 `completed`，`current_phase` 设为 `"stabilize"`。

**重要**：此时激活知识库——询问用户是否运行 `/harness-map` 初始化 dev-map 和任务看板。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-agents.md && git commit -m "feat: add /harness-agents skill"
```

---

### Task 8: `/harness-stabilize` 补稳设计 Skill

**Files:**
- Create: `.claude/skills/harness/harness-stabilize.md`

- [ ] **Step 1: 创建补稳 Skill**

```markdown
---
name: harness-stabilize
description: 设计多 Agent 系统的补稳机制——输出校验、容错、可观测性
---

# 多 Agent 系统补稳

你是 Harness Engineering 的稳定性设计助手。多 Agent 系统上线后最大的风险不是单点故障，而是链式传播的静默错误。

## 对话流程

### 阶段 1：Agent 输出校验

对流水线中每个 Agent，定义输出校验规则：

1. **Schema 校验**：每个 Agent 的输出是否符合约定的 JSON Schema？
2. **完整性校验**：必填字段是否存在？引用文件是否实际存在？
3. **一致性校验**：输出内容是否与输入 SPEC 矛盾？

询问用户："哪些 Agent 的输出可以用结构化 Schema 校验？哪些只能人工检查？"

### 阶段 2：Workflow 容错设计

1. **Agent 失败策略**：单个 Agent 失败时——
   - 阻塞全流程（适用于关键路径）
   - 降级继续（适用于非关键路径）
   - 重试 N 次后降级
2. **幂等性**：Agent 重复执行是否安全？如何保证？
3. **断点续跑**：流程中断后从哪里恢复？哪些步骤需要重新执行？

### 阶段 3：可观测性

1. **产物追踪**：每个阶段的产出物路径是否明确？
2. **状态可见**：PM Agent 是否能随时报告当前进度？
3. **失败溯源**：出现问题后能否快速定位是哪个 Agent 的哪个输出出了问题？

### 阶段 4：生成补稳配置

产出 `docs/harness/stabilization.md`：

```markdown
# 补稳配置

## Agent 输出校验规则

| Agent | Schema 校验 | 完整性校验 | 一致性校验 |
|-------|------------|-----------|-----------|
| 需求分析 | 需求文档结构 | 字段完整性 | 与 SPEC 对齐 |
| 方案设计 | ADR 格式   | ADR 必要章节 | 技术选型一致性 |
| ...     | ...        | ...       | ...       |

## 容错策略

- 关键路径 Agent 失败：阻塞 + 重试 2 次 → 人工介入
- 非关键路径 Agent 失败：记录 → 降级继续
- 幂等性保证：通过状态文件防重

## 可观测性指标

- 每阶段完成时间
- Agent 调用次数与成功率
- 总验证脚本通过/失败历史
```

完成后更新 `docs/harness/state.json`：`stabilize` 阶段标记 `completed`，`current_phase` 设为 `"verify"`。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-stabilize.md && git commit -m "feat: add /harness-stabilize skill"
```

---

### Task 9: `/harness-verify` 验证体系 Skill（层②核心）

**Files:**
- Create: `.claude/skills/harness/harness-verify.md`

- [ ] **Step 1: 创建验证体系 Skill**

```markdown
---
name: harness-verify
description: 建立两层验证体系——自动判定（Script/Skill）和人工判定（评审清单），生成总验证脚本
---

# 验证体系建立

你是 Harness Engineering 的验证体系设计助手。你的核心产出是**总验证脚本**——它不是一个建议，是客观判决。

## 核心原则

1. 总验证脚本是统一裁判——通过 = 开发完成，不通过 = 不得进入下一阶段
2. 验证分两层：Tier 1 自动判定（做成 Skill），Tier 2 人工判定（做成清单）
3. Rule 管不住的时候，约束下沉为 Script 加入验证序列

## 对话流程

### 阶段 1：确认 Tier 1 自动判定项

基于 Rules 阶段定义的 Script 列表，确认总验证脚本要包含的自动检查：

1. 编译验证（零容忍）
2. 测试验证（全量通过）
3. 类型检查
4. Lint/格式
5. 接口契约校验
6. 规则文件同步检查
7. 工程文件完整性检查

### 阶段 2：在统一入口中组装

将所有 Tier 1 检查组装为 `scripts/verify.sh`，使用固定 5 步序列：

1. 先扫规范 — SPEC 需求追溯检查
2. 再看编译 — 构建零错误
3. 再看测试 — 测试全量通过
4. 再看规则文件同步 — 配置一致性
5. 再看工程文件完整性 — 强制文档齐全

### 阶段 3：定义 Tier 2 人工评审清单

生成 `docs/harness/review-checklist.md`：

```markdown
# 人工评审清单

## 需求对齐
- [ ] 实现覆盖 SPEC 中每一条需求
- [ ] 未实现 Non-goals 中声明不做的事

## 架构一致性
- [ ] 未偏离 ADR 中的技术决策
- [ ] 新增依赖在允许范围内

## 安全审查
- [ ] 敏感数据路径受保护
- [ ] 权限边界未被突破

## 文档完整性
- [ ] 无未记录的重大变更
- [ ] API 变更已反映在文档中
```

### 阶段 4：将总验证脚本注册为 Skill

确保 `scripts/verify.sh` 能被 Claude Code 通过 Skill 调用。生成 Skill 包装：

```markdown
---
name: verify-all
description: 总验证脚本——5 步固定序列，通过 = 开发完成，不通过 = 不得交付
---

# 总验证 Skill

执行 `bash scripts/verify.sh`，将输出结构化呈现给用户。

此 Skill 由 /harness-verify 生成，由 PM Agent 在每阶段结束时调用。
```

完成后更新 `docs/harness/state.json`：`verify` 阶段标记 `completed`，`current_phase` 设为 `"map"`。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-verify.md && git commit -m "feat: add /harness-verify skill"
```

---

### Task 10: `/harness-map` 知识库 Skill（层③核心）

**Files:**
- Create: `.claude/skills/harness/harness-map.md`

- [ ] **Step 1: 创建知识库 Skill**

```markdown
---
name: harness-map
description: 建立与维护项目知识库——dev-map 开发导航、任务看板、多种索引
---

# 知识库建立与维护

你是 Harness Engineering 的知识库管理助手。你的任务是建立 dev-map（开发导航）和任务看板（项目态势板）。

## 核心原则

1. **索引优先**：是导航系统，不是百科全书。告诉 AI 和人"从哪进门"。
2. **AI 自维护**：谁动代码谁改地图，谁管需求谁改看板——流程副产物。
3. **时机**：项目初期不需要，进入 Agent 阶段后才激活。

## dev-map 维护

### 初始化

浏览项目结构，填充 `docs/harness/dev-map.json`：

- **entry_points**：主入口文件、核心模块索引
- **modules**：逻辑分组、依赖关系
- **critical_paths**：最重要的 5-10 个文件及理由
- **document_index**：SPEC、ADR、测试文档等路径
- **no_go_zones**：自动生成文件、禁止修改的目录

### 持续维护

每次代码变更后，开发 Agent 应更新 dev-map：
- 新增模块 → 加入 modules
- 接口变更 → 更新 interfaces
- 删除了关键文件 → 从 critical_paths 移除

## 任务看板维护

### 初始化

基于 state.json 的各阶段状态，填充 `docs/harness/task-board.json`：

- **completed**：已完成阶段 + 产出物链接
- **in_progress**：当前阶段 + 负责人 + 预计产出
- **pending**：待开始阶段 + 依赖关系

### 持续维护

PM Agent 在每阶段完成/回退后更新看板。

## 多种索引生成

为用户生成以下索引视图：

1. **按文件类型**：所有 SPEC、所有 ADR、所有测试文档
2. **按流水线阶段**：需求阶段的文档、开发阶段的文档
3. **按关注点标签**：安全相关、性能相关、API 契约
4. **按时间线**：最近两周变更、本次交付新增

## 漂移检测

定期（每次 `/harness-status` 调用时）检查：
- dev-map 中的路径是否实际存在
- 任务看板状态是否与 state.json 一致
- 新增文件是否已纳入索引

发现漂移 → 报告并建议修复。

完成后更新 `docs/harness/state.json`：`map` 阶段标记 `completed`，`knowledge_base_active` 设为 `true`，`current_phase` 设为 `"iterating"`。
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-map.md && git commit -m "feat: add /harness-map skill"
```

---

### Task 11: `/harness-evolve` 进化 Skill（层④核心）

**Files:**
- Create: `.claude/skills/harness/harness-evolve.md`

- [ ] **Step 1: 创建进化 Skill**

```markdown
---
name: harness-evolve
description: 管理 Harness 自身的进化——Memory 晋升、Rule 下沉、知识库纠偏
---

# Harness 进化管理

你是 Harness Engineering 的进化管理助手。你的职责是确保 Harness 系统不冻结，随着项目持续变厚。

## 三个进化机制

### 机制 1：Memory → 仓库晋升

用户或 Agent 在 Memory 中记录了重要观察后，引导晋升：

1. **识别候选**：哪些 Memory 条目不再是临时草稿？
2. **验证**：这个观察是否反复出现？是否可以复现？
3. **分类**：
   - 认定为事实 → 晋升为**档案**（更新 SPEC、ADR、设计文档）
   - 可复现的范本 → 晋升为**故事**（加入测试用例、评审清单、示例）
   - 必须执行的约束 → 晋升为**手册**（加入 Scripts 或 Rules）
4. **执行**：将内容写入仓库对应位置
5. **记录**：在 `state.json` 的 `evolution_log` 中记录晋升事件

### 机制 2：Rule → Script 下沉

触发信号：
- 总验证脚本反复在同一位置失败
- 评审清单中同一项反复被打回
- 同一类 bug 在交付后复现

发现触发信号时：
1. 定位失守的 Rule
2. 将约束改写为可自动判定的 Script
3. 加入总验证脚本序列
4. 从 Rule 清单中移除（或保留为"必须执行脚本 X"的一句话引用）
5. 记录：`evolution_log` 中记录下沉事件

### 机制 3：知识库自动纠偏

每次运行时检查：
- dev-map 路径是否仍有效
- 新增文件是否遗漏索引
- 任务看板是否与 state.json 一致

发现问题 → 自动修复或建议修复 → 记录纠偏事件。

## 人的位置

进化机制中人的职责：
- 决定"改成什么样算过关"
- 认可或拒绝 AI 提出的晋升/下沉建议
- 做出 AI 做不了的架构判断

AI 的职责：
- 发现晋升/下沉候选
- 在已定流程内执行变更
- 记录所有进化事件
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-evolve.md && git commit -m "feat: add /harness-evolve skill"
```

---

### Task 12: `/harness-status` 状态总览 Skill

**Files:**
- Create: `.claude/skills/harness/harness-status.md`

- [ ] **Step 1: 创建状态总览 Skill**

```markdown
---
name: harness-status
description: 显示 Harness 项目成熟度总览——当前阶段、进度、缺口、下一步建议
---

# 项目成熟度总览

你是 Harness Engineering 的状态报告助手。你的唯一任务是读取项目状态并清晰呈现。

## 执行流程

1. 读取 `docs/harness/state.json`
2. 扫描仓库验证各阶段产出物实际存在
3. 对比检测漂移
4. 输出结构化状态报告

## 输出格式

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Harness Engineering 项目状态报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
项目：xxx
总体验收进度：█░░░░░░ 12.5% (1/8)

阶段状态：
  ✅ init         完成于 2026-06-08 │ 产物: docs/harness/state.json
  ✅ spec         完成于 2026-06-09 │ 产物: docs/specs/2026-06-09-xxx-spec.md
  🔄 rules        进行中...         │ 开始于 2026-06-10
  ⏳ skills       待开始           │ 依赖: rules
  ⏳ agents       待开始           │ 依赖: skills
  ⏳ stabilize    待开始           │ 依赖: agents
  ⏳ verify       待开始           │ 依赖: stabilize
  ⏳ map          待开始           │ 依赖: agents [知识库在 agents 阶段激活]

知识库：⏳ 未激活（将在 agents 阶段激活）

📌 建议下一步：继续 /harness-rules — 完成 AI 约束规则设计
```

## 漂移告警格式

如果发现漂移：

```
⚠️ 漂移告警：
  - docs/specs/xxx-spec.md：状态显示已完成但文件缺失
  - docs/harness/dev-map.json：引用了不存在的路径 src/old/index.ts

建议修复：
  1. 如果是误删 → 恢复文件
  2. 如果是故意移除 → 运行 /harness-evolve 同步状态
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/skills/harness/harness-status.md && git commit -m "feat: add /harness-status skill"
```

---

### Task 13: 集成测试 — 从 Init 到 Status 的完整穿透

**Files:**
- Create: `tests/harness-walkthrough.md`

- [ ] **Step 1: 编写穿透测试脚本**

```markdown
# Harness 工具穿透测试清单

## 测试环境
- 新建临时目录作为模拟项目根目录
- 拷贝 templates/ 到模拟项目中

## 测试流程

### T1: /harness-init
- [ ] 在空目录中运行 /harness-init
- [ ] 确认生成了 docs/、.claude/、scripts/ 目录
- [ ] 确认 state.json 内容正确（init=completed, current_phase=spec）
- [ ] 确认 CLAUDE.md 存在且包含基础骨架

### T2: /harness-spec
- [ ] 运行 /harness-spec
- [ ] 模拟用户输入项目目标、范围、Non-goals
- [ ] 确认生成了 docs/specs/YYYY-MM-DD-xxx-spec.md
- [ ] 确认 state.json 中 spec 阶段更新为 completed

### T3: /harness-rules
- [ ] 运行 /harness-rules
- [ ] 确认 Script 候选列表被正确识别
- [ ] 确认 CLAUDE.md 被更新（Rules 节）
- [ ] 确认 .claude/settings.json 被创建或更新

### T4: /harness-skills
- [ ] 运行 /harness-skills
- [ ] 确认至少识别出编译、测试、事后验证三个 Skill
- [ ] 确认生成了对应的 .claude/skills/{name}/skill.md

### T5: /harness-agents
- [ ] 运行 /harness-agents
- [ ] 确认生成了 8 角色流水线配置
- [ ] 确认 docs/harness/agent-design.md 存在

### T6: /harness-stabilize
- [ ] 运行 /harness-stabilize
- [ ] 确认 docs/harness/stabilization.md 包含校验规则、容错策略、可观测性指标

### T7: /harness-verify
- [ ] 运行 /harness-verify
- [ ] 确认 scripts/verify.sh 存在且可执行
- [ ] 确认 docs/harness/review-checklist.md 存在
- [ ] 运行 verify.sh 确认至少 5 个步骤都输出结果

### T8: /harness-map
- [ ] 运行 /harness-map
- [ ] 确认 docs/harness/dev-map.json 包含 entry_points/modules/critical_paths
- [ ] 确认 docs/harness/task-board.json 反映实际阶段状态

### T9: /harness-status
- [ ] 运行 /harness-status
- [ ] 确认输出所有 8 个阶段的状态
- [ ] 确认进度百分比正确
- [ ] 确认建议下一步合理

### T10: /harness-evolve
- [ ] 模拟一条 Memory 观察
- [ ] 运行 /harness-evolve
- [ ] 确认晋升流程被触发
- [ ] 确认 evolution_log 记录正确

### T11: 跨会话恢复
- [ ] 模拟"关闭会话后重新打开"场景
- [ ] 确认 /harness 能正确读取上次状态
- [ ] 确认漂移检测生效

### T12: 回退场景
- [ ] 在 agents 阶段发现 spec 问题
- [ ] 确认 PM Agent 能正确回退到 spec 阶段
- [ ] 确认回退后 state.json 反映正确状态
```

- [ ] **Step 2: 逐条执行穿透测试，记录结果**

对每个测试项：实际执行 `/harness-*` 命令（或模拟其逻辑），验证产出物是否符合预期。

- [ ] **Step 3: 修复测试中发现的问题**

根据测试失败项，修复对应 Skill 文件中的流程或输出逻辑。

- [ ] **Step 4: Commit**

```bash
git add tests/ && git commit -m "test: add harness walkthrough test checklist"
```

---

### Task 14: 项目自举 — 让 Harness 工具本身通过 Harness 验证

- [ ] **Step 1: 以本项目为对象运行 /harness-init**

在当前仓库（d:/Prj/Ai）中运行 `/harness-init`，生成本项目的 Harness 骨架。

- [ ] **Step 2: 运行 /harness-spec 补全本项目的 SPEC**

使用已写好的 SPEC 文档，确认 `/harness-spec` 能正确识别其完整度。

- [ ] **Step 3: 运行 /harness-rules 为本项目生成规则**

确认 Rules 能从 SPEC 中正确推导。

- [ ] **Step 4: 运行 /harness-status 检查项目状态**

确认状态报告准确反映本项目的实际进度。

- [ ] **Step 5: 记录自举过程中的改进点**

如果发现 Skill 在某些场景下表现不佳，记录改进项。

---

## 验证方式

完成所有 Task 后，运行以下验证：

1. **文件完整性**：确认 10 个 Skill 文件 + 6 个模板 + 1 个测试清单全部存在
2. **穿透测试**：按 Task 13 的清单逐项执行
3. **自举验证**：按 Task 14 的流程让工具分析自身项目
4. **SPEC 对齐**：逐条对照 SPEC 第九章「成功标准」的 7 条，确认每条有对应的 Skill 覆盖
