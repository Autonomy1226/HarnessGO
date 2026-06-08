---
name: harness-verify
description: 建立验证体系——必须将所有占位符替换为项目实际命令后才算完成
---

# ⛔ 硬边界：你只建立验证体系，不运行。但不能留下占位符。

你在 Harness 8 阶段流水线中的位置：**第 7 步 / 共 8 步**。

你的**唯一任务**：生成一份**可立即执行**的 `scripts/verify.sh`，所有 5 步都有实际命令，没有占位符。

## ⚠️ 最重要的规则

**verify.sh 中的第 2 步（编译）和第 3 步（测试）必须被替换为项目实际的编译和测试命令。**
模板中的占位符会直接 FAIL——如果你留了占位符就走，等于没做。

## 你绝对不能做的事

- ❌ 不要在 verify.sh 中保留 `log_skip` 或注释占位符
- ❌ 不要运行验证脚本
- ❌ 不要修改 SPEC、Rules、Agent 设计

## 执行步骤

### 第 1 步：收集项目信息

读取以下文件，提取编译和测试命令：
- `CLAUDE.md`（Rules 节中是否有指定的编译/测试命令？）
- `docs/specs/` 下的 SPEC（技术栈是什么？）
- `package.json` / `requirements.txt` / `Cargo.toml` / `go.mod` 等（实际的构建配置）
- `.claude/skills/` 下的编译/测试 Skill 定义

### 第 2 步：确定编译和测试命令

**根据项目实际技术栈**，填入准确命令。不能猜，必须从项目文件中提取：

| 项目类型 | 编译命令示例 | 测试命令示例 |
|----------|-------------|-------------|
| Python 后端 + Vue 前端 | `pip install -r requirements.txt && mypy backend/ --strict` | `pytest backend/ -v --cov && npm test -- --coverage` |
| 纯前端 | `npm ci && npm run build` | `npm test -- --coverage` |
| Go | `go build ./...` | `go test ./... -v -cover` |
| Rust | `cargo build --release` | `cargo test` |

### 第 3 步：生成 verify.sh

基于 `templates/verify-template.sh`，**必须**完成以下替换：
- 第 2 步的占位符 → 实际编译命令
- 第 3 步的占位符 → 实际测试命令

### 第 4 步：自检 — verify.sh 中不能有占位符

生成后**立即检查**生成的脚本：
```bash
grep -n "HARNESS-VERIFY\|未配置\|TBD\|TODO\|占位符\|placeholder" scripts/verify.sh
```
**如果有任何输出 → 你的工作没做完，必须继续填充直到零输出。**

### 第 5 步：生成评审清单

写入 `docs/harness/review-checklist.md`。

### 第 6 步：生成 README 骨架（如果不存在）

检查项目根目录是否有 `README.md`。如果没有，基于 SPEC 生成一个最小 README：
- 项目名称和一句话描述
- 技术栈
- 快速开始（安装 + 运行）
- 目录结构说明

### 第 7 步：更新状态

更新 `docs/harness/state.json`：`verify` 标记 `completed`，`current_phase` 设为 `"map"`。

## ⛔ 完成标准 — 全部满足才 STOP

- [ ] verify.sh 存在且可执行
- [ ] verify.sh 中第 2 步、第 3 步没有占位符，已替换为项目实际命令
- [ ] README.md 存在
- [ ] review-checklist.md 存在
