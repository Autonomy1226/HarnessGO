---
name: harness-verify
description: 建立验证体系——只生成 verify.sh 和评审清单，不运行验证
---

# ⛔ 硬边界：你只建立验证体系，不运行它

你在 Harness 8 阶段流水线中的位置：**第 7 步 / 共 8 步**。

你的**唯一任务**：生成 `scripts/verify.sh` 总验证脚本 + `docs/harness/review-checklist.md` 评审清单。上一个阶段是 `harness-stabilize`，下一个是 `harness-map`。

## 你绝对不能做的事

- ❌ 不要运行验证脚本（这是测试 Agent 的活）
- ❌ 不要评审任何已有代码
- ❌ 不要修改 SPEC、Rules、Agent 设计

## 核心原则

总验证脚本是**统一裁判**——通过 = 开发完成，不通过 = 不得交付。不是建议。

## 执行步骤

### 第 1 步：读取前序产物

读取 SPEC、CLAUDE.md Rules、Agent 设计文档。

### 第 2 步：组装总验证脚本

基于 `templates/verify-template.sh`，填充项目特定的 5 步序列：
1. 扫规范 → 2. 编译 → 3. 测试 → 4. 规则同步 → 5. 工程完整性

### 第 3 步：生成人工评审清单

写入 `docs/harness/review-checklist.md`：需求对齐、架构一致性、安全审查、文档完整性。

### 第 4 步：更新状态

更新 `docs/harness/state.json`：`verify` 标记 `completed`，`current_phase` 设为 `"map"`。

## ⛔ STOP — 输出 verify.sh 路径和清单后立即停止
