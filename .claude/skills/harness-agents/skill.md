---
name: harness-agents
description: 设计多 Agent 流水线——Workflow 脚本必须在阶段间插入程序化验证闸门，不能只靠 prompt 文字
---

# ⛔ 硬边界：你只设计 Agent 流水线，不运行

你在 Harness 8 阶段流水线中的位置：**第 5 步 / 共 8 步**。

你的**唯一任务**：生成一份 **带程序化验证闸门** 的 Workflow 脚本。上一个阶段是 `harness-skills`，下一个是 `harness-stabilize`。

## ⚠️ 最重要的规则：验证闸门必须是 Bash 命令，不能是 prompt 文字

生成的 Workflow 脚本中，**开发→评审** 和 **测试→交付** 两个节点之间必须插入**程序化验证闸门**：
- ❌ 错误做法：在开发 Agent 的 prompt 里写「请运行 verify.sh」
- ✅ 正确做法：开发 Agent 完成后，Workflow 脚本派一个独立的验证 Agent，**它的唯一任务就是跑 verify.sh 并报告退出码**。退出码非 0 → `log()` 报错 → 不进入下一阶段

## 你绝对不能做的事

- ❌ 不要以任何 Agent 的身份执行实际工作
- ❌ 不要在 prompt 文字里「建议」验证——程序化执行
- ❌ 不要运行 Workflow 脚本

## 固定 8 角色模板

| 角色 | 职责 | 输出文档 |
|------|------|----------|
| 👔 PM Agent | 按流程调度（Workflow 控制流），不替专家做决策 | 阶段决策 |
| 📋 需求分析 | 产出需求文档 | `docs/requirements/` |
| 📐 方案设计 | 技术方案 + ADR | `docs/design/` |
| 🚦 闸门总控 | 可行性分析与风险把关 | `docs/design/feasibility-review.md` |
| 💻 开发实现 | 写代码 + 维护 dev-map | `docs/dev/` |
| 🛡️ 验证闸门 1 | **程序化执行** verify.sh 步骤 2+3 | 通过/阻塞信号 |
| 🔍 代码评审 | 对照清单审查 | `docs/reviews/` |
| 🧪 测试验证 | 运行总验证脚本 + SPEC AC 验收 | `docs/tests/` |
| 🛡️ 验证闸门 2 | **程序化执行** 全量 verify.sh 5/5 | 通过/阻塞信号 |
| 📦 交付 | 交付结论 + 进度记录 | `docs/delivery/` |

## 执行步骤

### 第 1 步：展示流水线，确认适配

包含两个验证闸门角色。询问用户确认。

### 第 2 步：定义流转规则

- 前进条件：产出物存在 + 验证闸门 PASS
- 回退条件：验证闸门 FAIL → 带失败日志回退到开发阶段

### 第 3 步：生成 Workflow 脚本 — 插入验证闸门

生成 `.claude/workflows/harness-pipeline.js`。

**关键：两个验证闸门必须是独立 Agent，不是 prompt 里的文字。**

```javascript
// ── Phase 4: 开发实现 ──────────────────────────────────────
phase('开发实现');
const implementation = await agent(
  `你负责写代码...`,
  { label: '开发实现', phase: '开发实现' }
);

// ── 验证闸门 1: 编译 + 测试（开发→评审之间）───────────────
phase('验证闸门1');
const gate1 = await agent(
  `你的唯一任务：运行 verify.sh 步骤 2（编译）和步骤 3（测试）。
   执行: bash scripts/verify.sh
   检查输出中第 2 步和第 3 步是否都为 PASS。
   如果任何一步 FAIL → 报告「闸门1 未通过」，列出具体失败项。
   如果全部 PASS → 报告「闸门1 通过」。

   不要写代码、不要修复问题、不要给建议。你只判定。`,

  { label: '验证闸门1-编译测试', phase: '验证闸门1' }
);

// 闸门判定——不是建议，是硬阻断
if (gate1 && gate1.includes('未通过')) {
  log(`⛔ 闸门1 未通过：编译或测试失败。回退到开发阶段修复。`);
  log(`失败详情: ${gate1}`);
  // 不回退就停止——PM 在此阻断
  throw new Error('闸门1 未通过');
}
log('✅ 闸门1 通过：编译和测试验证通过');

// ── Phase 5: 代码评审 ──────────────────────────────────────
phase('代码评审');
const review = await agent(
  `对照 docs/harness/review-checklist.md 逐项审查...`,
  { label: '代码评审', phase: '代码评审' }
);

// ── Phase 6: 测试验证 ──────────────────────────────────────
phase('测试验证');
const testing = await agent(
  `运行全量验证 + SPEC 验收标准...`,
  { label: '测试验证', phase: '测试验证' }
);

// ── 验证闸门 2: 全量 verify.sh 5/5（测试→交付之间）────────
phase('验证闸门2');
const gate2 = await agent(
  `你的唯一任务：运行全量 verify.sh (5/5)。
   执行: bash scripts/verify.sh
   退出码必须为 0，且 5 步全部 PASS。
   如果任何一步 FAIL → 报告「闸门2 未通过」。
   如果全部 PASS → 报告「闸门2 通过」。

   不要写代码、不要修复问题。你只判定。`,

  { label: '验证闸门2-全量验证', phase: '验证闸门2' }
);

if (gate2 && gate2.includes('未通过')) {
  log(`⛔ 闸门2 未通过：全量验证失败。回退到开发阶段修复。`);
  throw new Error('闸门2 未通过');
}
log('✅ 闸门2 通过：全量验证 5/5');
```

### 第 4 步：生成设计文档 + 更新状态

写入 `docs/harness/agent-design.md`，更新 state.json，提醒激活知识库。

## ⛔ 生成后自检 — 全部满足才 STOP

- [ ] Workflow 脚本包含两个独立的验证闸门 Agent（不是 prompt 文字建议）
- [ ] 验证闸门包含 `throw new Error` 或等价阻断逻辑
- [ ] 验证闸门 Agent 的 prompt 明确写「你只判定，不修复」
