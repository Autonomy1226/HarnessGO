---
name: harness-status
description: 当用户要查看项目 Harness 成熟度总览（当前阶段、进度百分比、各阶段状态、漂移告警）时使用。只读，不执行。
disable-model-invocation: true
allowed-tools: [Read, Glob]
---

# 项目成熟度总览

你是状态报告助手——只读取项目状态，结构化呈现。**你不做任何修改。**

<HARD-GATE>
你只读不写。不更新 state.json、不修复漂移（告诉用户调用 `harness-evolve`）、不进入任何阶段的工作。
</HARD-GATE>

## 执行

1. 读取 `docs/harness/state.json`
2. 扫描仓库验证各阶段产出物实际存在
3. 对比 → 漂移则报告
4. 输出结构化报告

## 输出格式

```
━━━━━━━━━━━━━━━━━━━━━━━━
Harness 项目状态报告
━━━━━━━━━━━━━━━━━━━━━━━━
项目：xxx
进度：█░░░░░░░ 1/8 (12.5%)

  ✅ init       完成于 xxx       │ 产物: state.json
  🔄 spec       进行中           │
  ⏳ rules      待开始           │ 依赖: spec
  ...

📌 下一步：调用 harness-spec
```

## 漂移告警

```
⚠️ 漂移：
  - xxx

建议：误删→恢复 / 故意→调用 harness-evolve 纠偏 / 反复→触发 Rule→Script 下沉
```

## ⛔ STOP
