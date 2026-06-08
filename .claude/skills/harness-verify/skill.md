---
name: harness-verify
description: 当用户要生成总验证脚本 verify.sh（编译+测试+API 端点+规则同步+工程完整性 5 步序列）时使用。不留占位符，有后端必须验证 API。
disable-model-invocation: true
allowed-tools: [Read, Write, Bash, Edit]
---

# 验证体系建立

你是验证体系设计助手——生成可立即执行的 `scripts/verify.sh` 和评审清单。第 7 步 / 共 8 步。

<HARD-GATE>
你只建立验证体系，不运行它。verify.sh 中不能有任何占位符——有后端就必须包含 API 端点 curl 验证。上一个阶段是 `harness-stabilize`，下一个是 `harness-map`。
</HARD-GATE>

## 核心原则

总验证脚本是**统一裁判**——通过 = 开发完成，不通过 = 不得交付。不是建议。

## 你绝对不能做的事

- ❌ 不留 SKIP、TODO、占位符
- ❌ 不运行验证脚本
- ❌ 不修改 SPEC、Rules、Agent 设计

## 执行步骤

### 第 1 步：收集项目信息
读取 SPEC、CLAUDE.md、`docs/design/api-spec.md`（如果有后端）、`package.json`/`requirements.txt` 等构建配置。

### 第 2 步：确定编译命令
从项目中提取实际命令。不能猜。

### 第 3 步：确定测试命令
从项目中提取实际命令。不能猜。

### 第 4 步：确定 API 验证命令（如果有后端）
如果 `docs/design/api-spec.md` 存在，从中提取每个端点，生成 curl 验证序列：
启动后端 → 等就绪 → 逐端点 curl + 检查状态码 → 停止后端。

### 第 5 步：生成 verify.sh + 自检
```bash
grep -n "HARNESS-VERIFY\|未配置\|TBD\|TODO\|占位符\|placeholder" scripts/verify.sh
```
任何输出 → 没做完，继续填充。

### 第 6 步：生成评审清单 + README 骨架 + 更新 state.json

## ⛔ 完成标准 — 全部满足才 STOP
- [ ] verify.sh 可执行，无占位符
- [ ] 如果有后端，包含逐端点 curl 验证
- [ ] README.md 存在
- [ ] review-checklist.md 存在
