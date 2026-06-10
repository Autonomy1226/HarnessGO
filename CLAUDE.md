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

- `harness` — 项目经理（PM）：路由、交接、回退、进度管理、知识库、进化
- `harness-spec` — 需求分析：模糊诉求 → 结构化 SPEC
- `harness-design` — 方案设计：需求 → 技术方案 + API 契约 + 模块契约 + Rules + Skills
- `harness-gate` — 闸门总控：开发前最后的可行性和风险把关
- `harness-dev` — 开发实现：按模块契约并行派发模块 Agent，集成检查
- `harness-review` — 代码审查：实现质量、需求一致性、方案一致性技术收口
- `harness-test` — 测试验证：功能正确性、稳定性、边界和回归风险结果收口

## Agent 编排

7 角色固定流水线：PM → 需求分析 → 方案设计 → 闸门总控 → 开发实现 → 代码审查 → 测试验证
