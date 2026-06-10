# Harness Engineering

[English](README.md) | [中文](README.zh.md)

---

**一套结构化的 Claude Code 工程流水线。7 个 Skill 引导你从模糊想法走到可验证交付——每一步都可追溯。**

不是代码生成器。每个 Skill 锁定一个工程阶段：需求被追问到无歧义，设计精确到函数签名，代码按契约实现，验证全部脚本化——不靠主观判断。

---

## 流水线

```
模糊想法
    │
 ① harness             项目经理 — 初始化、路由、进度、知识库
    │
 ② harness-spec         需求分析 — 深挖意图 → 可追溯的 PRD
    │
 ③ harness-design       方案设计 — PRD → 技术蓝图（4 份按读者拆分的文档）
    │
 ④ harness-gate         闸门审查 — 可行性 & 风险评估（AI 审查 + 人签字）
    │
 ⑤ harness-dev          开发调度 — 按蓝图派发模块 Agent，集成检查
    │
 ⑥ harness-review       代码审查 — 实现质量 × 需求一致性 × 方案一致性 三维收口
    │
 ⑦ harness-test         测试验证 — 分层测试脚本 + 逐条 AC 验收
    │
 ✅ 交付
```

---

## 文档依赖链

```
PRD（需求分析产出）
  ↓  只被 harness-design 读取
设计蓝图（design.md + dev/ + gate/ + test/）
  ↓  被 harness-gate、harness-dev、harness-review、harness-test 读取
```

每个阶段只读自己指定的输入。下游不越级读上游——避免信息泄漏和歧义扩散。

---

## 安装

将 `.claude/skills/` 和 `templates/` 拷贝到你的项目：

```
your-project/
  .claude/skills/         # 7 个 Skill 文件（SKILL.md）
  templates/              # 生成项目用的模板
```

---

## 使用

在项目目录下打开 Claude Code，按顺序调用：

```
harness            初始化骨架 + 查看进度
harness-spec       撰写 PRD（带 FR/AC/NFR ID 追溯体系）
harness-design     产出 design.md + dev/ + gate/ + test/
harness-gate       闸门审查（AI 审查 + 人工签字确认）
harness-dev        按设计蓝图派发模块 Agent 写代码
harness-review     三维审查（实现质量 × 需求 × 方案）
harness-test       生成分层测试脚本 → 运行 → 逐条 AC 验收
```

---

## 7 个 Skill

| Skill | 专业角色 | 核心产出 |
|-------|---------|---------|
| `harness` | 工程项目经理 | `state.json`、`dev-map.json`、`task-board.json` |
| `harness-spec` | 产品需求分析师 | PRD（术语表、ID 体系、假设记录） |
| `harness-design` | 技术架构师 | `design.md` + `dev/` + `gate/` + `test/` |
| `harness-gate` | 闸门审查员 | `feasibility-review.md`（AI 审查 + 人签字） |
| `harness-dev` | 开发调度者 | 代码 + `dev-report.md` + `dev-log.md` + `dev-map.json` |
| `harness-review` | 代码审查员 | `review-report.md`（🔴 阻塞 / 🟡 严重 / 🔵 建议） |
| `harness-test` | 测试验证工程师 | `scripts/test/*.sh` + `verify.sh` + `test-report.md` |

---

## 质量框架

每个 Skill 构建在相同的 7 层结构上。当 Skill 说「完成了」，它能证明：

| 层 | 名称 | 含义 |
|----|------|------|
| ① | 专业身份 | 知道自己该做什么，不越界做别人的事 |
| ② | 铁律 | 不可违反的硬约束——违反即阻断 |
| ③ | ID 追溯 | 每个结论引用具体的上游需求 ID |
| ④ | 自检清单 | 声明完成前的强制验证 |
| ⑤ | 禁止行为 | 明确列出绝对不能做的事 |
| ⑥ | 完成标准 | 可验证的条件——不是「看起来可以」 |
| ⑦ | STOP 硬边界 | 到站就停，交接给下一阶段 |

---

## 设计原则

**文档单向流动。** PRD → Design → Dev/Review/Test。下游不越级读上游。避免「我读了原始需求，理解不一样」——解读只发生一次，在设计阶段。

**Rule 说做什么，Skill 说怎么做。** Rule：「每次改完必须编译、测试、事后验证。三步全过才算完成。」Skill 定义精确的命令、输出格式和失败处理。AI 不是理解规则——是调用已验证的方法。

**验证脚本化，不靠主观。** `scripts/verify.sh` 串联分层测试脚本（单元、集成、API、E2E、安全、性能）。每条验收标准对应到具体测试步骤。通过 = 可交付。失败 = 阻断。没有「看着没问题」。

**dev-map 是代码库的导航地图。** 不是文件列表。回答：功能 X 在哪？服务 Y 怎么接入？配置 Z 在哪定义？改这个模块会牵动什么？标准写法是什么？禁区在哪？

---

## 自举验证

本项目自身就是 Harness 项目，通过 `bash scripts/verify.sh` 验证：

```
[PASS] PRD 完整性检查
[PASS] 规则文件同步（CLAUDE.md + settings.json）
[PASS] 工程文件完整（README、state.json、dev-map、task-board）
```

---

## License

MIT
