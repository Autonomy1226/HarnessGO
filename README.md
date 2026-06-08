# Harness Engineering

**让每个软件工程师都能用 AI-Native 方法论，从零到一创建 AI-Ready 的项目仓库。**

Harness Engineering 不生成业务代码——它帮你建立项目的**工程化基础设施**：SPEC、Rules、Skills、Agent 编排、总验证脚本、知识库。建完之后，你和 AI 在轨道上高效协作，而不是每次从零开始。

---

## 四层架构

```
┌─────────────────────────────────────────┐
│  ④ 进化 ← 持续反哺前三层                  │
│  ┌───────────────────────────────────┐  │
│  │ ③ 知识库：dev-map + 任务看板        │  │
│  │ ┌─────────────────────────────┐   │  │
│  │ │ ② 反馈：总验证脚本（统一裁判）  │   │  │
│  │ │ ┌───────────────────────┐   │   │  │
│  │ │ │ ① 约束与流程           │   │   │  │
│  │ │ │ Rule → Skill → Agent  │   │   │  │
│  │ │ │ → Workflow → 补稳     │   │   │  │
│  │ │ └───────────────────────┘   │   │  │
│  │ └─────────────────────────────┘   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

| 层 | 解决的问题 | 核心 Skill |
|----|-----------|-----------|
| ① 约束与流程 | AI 按什么顺序、什么边界做事 | `spec` `rules` `skills` `agents` `stabilize` |
| ② 反馈 | 裁判说了算，不是模型觉得做完了 | `verify` |
| ③ 知识库 | AI 知道从哪进门，不用扫描全仓 | `map` |
| ④ 进化 | 规矩跟项目一起变厚——人定边界，AI 在规矩内落地 | `evolve` |

---

## 快速开始

### 安装

将 `templates/` 和 `.claude/skills/harness/` 拷贝到你的项目中：

```
your-project/
├── .claude/
│   └── skills/
│       └── harness/       # 10 个 Skill 文件
├── templates/             # 6 个模板文件
└── scripts/
    └── verify.sh          # 总验证脚本（初始化时生成）
```

### 走一遍完整流程

```bash
/harness              # 查看项目状态（首次提示初始化）
/harness-init         # ① 初始化项目骨架
/harness-spec         # ② 写 SPEC：目标、范围、Non-goals、成功标准
/harness-rules        # ③ 定 Rules：AI 能做什么、不能做什么
/harness-skills       # ④ 封装 Skills：编译、测试、验证等固定流程
/harness-agents       # ⑤ 设计 Agent 流水线：8 角色 + 流转规则
/harness-stabilize    # ⑥ 补稳：输出校验、容错、可观测性
/harness-verify       # ⑦ 建验证体系：总验证脚本（5 步固定序列）
/harness-map          # ⑧ 建知识库：dev-map + 任务看板
/harness-evolve       # ⑨ 进化：Memory→仓库晋升、Rule→Script 下沉
/harness-status       # 随时查看项目成熟度
```

---

## 10 个 Skill 一览

| Skill | 层 | 产出物 |
|-------|----|--------|
| `/harness` | — | 状态机路由，全局导航 |
| `/harness-init` | ① | `docs/harness/state.json`、目录骨架 |
| `/harness-spec` | ① | `docs/specs/{date}-{project}-spec.md` |
| `/harness-rules` | ① | `CLAUDE.md`、`.claude/settings.json`、Script 列表 |
| `/harness-skills` | ① | `.claude/skills/{name}/skill.md` |
| `/harness-agents` | ① | `docs/harness/agent-design.md`、Workflow 脚本 |
| `/harness-stabilize` | ① | `docs/harness/stabilization.md` |
| `/harness-verify` | ② | `scripts/verify.sh`、评审清单、门禁配置 |
| `/harness-map` | ③ | `docs/harness/dev-map.json`、`docs/harness/task-board.json` |
| `/harness-evolve` | ④ | 晋升记录、下沉 Script、纠偏日志 |
| `/harness-status` | — | 项目成熟度总览 |

---

## 结构化 Agent 流水线

```
PM Agent（调度，不决策）
  → 📋 需求分析 → 📐 方案设计 → 🚦 闸门总控（可行性把关）
  → 💻 开发实现 → 🔍 代码评审 → 🧪 测试验证 → 📦 交付
```

- 每个阶段有明确的**前进条件**（门禁通过）和**回退条件**（带着问题回退）
- PM Agent 凭**总验证脚本的输出**决定前进/回退——不是凭感觉
- 每阶段强制产出文档，存放在 `docs/` 对应目录

---

## 核心设计原则

### Script 优先于 Rule

Rule 是自然语言——AI 会解释性执行。Script 是二进制判决。当 Rule 反复管不住，约束**必须**下沉为 Script。这是单向不可逆的过程。

### 总验证脚本是统一裁判

不是「建议你验证一下」。是「这次开发到底算不算完成」的客观判决。5 步固定序列：

1. 扫规范 → 2. 编译 → 3. 测试 → 4. 规则同步 → 5. 工程完整性

**通过 = 前进，不通过 = 不得进入下一阶段、不得交付。**

### Memory 不在主干上

Memory 是草稿区，不是权威来源。定了的结论、边界、文档索引必须写进仓库。重要内容会**晋升**——从 Memory 到仓库的三层文档体系（档案/故事/手册）。

### 知识库索引优先

不是整仓说明书塞进上下文。是一套够准的索引——告诉 AI 从哪几条线、哪几份文档进门，再让它自己去翻。

---

## 项目状态

Harness Engineering 工具自身就是一个 Harness 项目——它通过了 `scripts/verify.sh` 的全量验证。

```
=== Harness 总验证 ===
[PASS] SPEC 包含: 项目目标
[PASS] SPEC 包含: 明确不做的事
[PASS] SPEC 包含: 成功标准
[PASS] SPEC 包含: 技术约束
[PASS] CLAUDE.md 存在
[PASS] .claude/settings.json 存在
[PASS] 文件存在: docs/harness/state.json
[PASS] 文件存在: docs/harness/dev-map.json
[PASS] 文件存在: docs/harness/task-board.json
退出码: 0
```

---

## 文件结构

```
.claude/skills/harness/   # 10 个 Skill（Markdown）
templates/                # 6 个模板（JSON/Markdown/Shell）
docs/superpowers/
  specs/                  # 设计规格文档
  plans/                  # 实现计划
docs/harness/             # 项目状态文件（自举产物）
scripts/verify.sh         # 总验证脚本
CLAUDE.md                 # AI 规则（自举产物）
```

---

## License

MIT
