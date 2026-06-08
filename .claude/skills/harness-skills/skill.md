---
name: harness-skills
description: 当用户要为项目封装编译/测试/事后验证/格式检查等固定流程为 Skill 时使用。Rule 说「必须做」，Skill 说「怎么做」。
disable-model-invocation: true
allowed-tools: [Read, Write]
---

# Skill 识别与设计

你是 Skill 设计助手——识别项目中步骤固定、每次必做、做错代价大的流程，封装为 Skill。第 4 步 / 共 8 步。

<HARD-GATE>
你只识别和生成 Skill 骨架。不实现业务逻辑、不讨论 Agent 编排。上一个阶段是 `harness-rules`，下一个是 `harness-agents`。
</HARD-GATE>

## 为什么编译、测试、验证要做成 Skill

| 特征 | 说明 |
|------|------|
| 执行步骤固定 | 不需要 AI 每次重新推理 |
| 每次都要做 | 是底线，不是可选 |
| 做错一次代价大 | 漏编译→上线炸；漏测试→回归没发现 |
| 不值得 AI 重新思考 | AI 精力放业务上，不是「怎么跑 pytest」 |

## Rule 与 Skill 的分工

```
Rule：你必须编译、测试、事后验证。三步全过才算完成。
Skill：编译怎么编、测试怎么跑、验证怎么验。一步一步写清楚。
```

**Rule 变轻，Skill 变稳。** 修改编译流程只需改 Skill，不需要搜全项目 Rule。

## 必须生成的 4 个标准 Skill

| Skill | 触发条件 | 核心判定 |
|-------|----------|----------|
| build-verify | 代码变更后 | 零错误 = PASS |
| test-verify | 编译通过后 | 全量通过 + 覆盖率达标 = PASS |
| post-verify | 测试通过后 | AC 全部通过 + Non-goals 未越界 = PASS |
| lint-check | 代码变更后（可与编译并行） | 零告警 = PASS |

## 执行步骤

### 第 1 步：读取 SPEC 和 CLAUDE.md Rules

### 第 2 步：确认标准 4 Skill + 项目特定 Skill

### 第 3 步：为每个 Skill 生成 SKILL.md

每个文件必须包含：触发条件、输入契约、执行步骤、输出格式（PASS/FAIL + 详情）、错误处理策略。

### 第 4 步：更新 CLAUDE.md Skills 节 + state.json

## ⛔ STOP — 骨架生成完就停
