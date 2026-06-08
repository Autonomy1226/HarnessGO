# CLAUDE.md — Harness Engineering Tool

## 项目概述

Harness Engineering 项目创建工具 — 一组 Claude Code Skill，引导用户通过 AI-Native 工程方法论创建 AI-Ready 项目仓库。覆盖四层架构：约束与流程、反馈、知识库、进化。

## 规则

你必须执行以下验证（通过总验证脚本 `scripts/verify.sh`）：
- [ ] SPEC 规范检查通过
- [ ] 规则文件同步检查通过
- [ ] 工程文件完整性检查通过

你必须遵守以下行为约束：
- [ ] 不修改 `docs/harness/state.json` 中的已完成阶段记录
- [ ] Skill 文件变更后更新 `docs/harness/dev-map.json`

## 技能

- `harness` — 主入口，状态机路由
- `harness-init` — 项目初始化
- `harness-spec` — SPEC 规格设计引导
- `harness-rules` — AI 约束规则设计
- `harness-skills` — Skill 识别与生成
- `harness-agents` — 多 Agent 流水线设计
- `harness-stabilize` — 补稳机制设计
- `harness-verify` — 验证体系与总验证脚本
- `harness-map` — 知识库建立与维护
- `harness-evolve` — 进化机制管理
- `harness-status` — 项目成熟度总览

## Agent 编排

8 角色固定流水线：PM → 需求分析 → 方案设计 → 闸门总控 → 开发实现 → 代码评审 → 测试验证 → 交付
