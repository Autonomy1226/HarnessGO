---
name: harness-verify
description: 建立验证体系——编译、测试、API 端点验证全部必须有实际命令，不能留占位符
---

# ⛔ 硬边界：不留占位符。有后端就必须验证 API 端点。

你在 Harness 8 阶段流水线中的位置：**第 7 步 / 共 8 步**。
上一个阶段是 `harness-stabilize`，下一个是 `harness-map`。

## ⚠️ 最重要的规则

verify.sh 必须是一份**可立即执行的脚本**，所有步骤都有实际命令。如果有后端 API，必须包含逐个端点的 curl 验证。

## 你绝对不能做的事

- ❌ 不要在 verify.sh 中保留任何占位符、SKIP、TBD
- ❌ 不要运行验证脚本
- ❌ 不要修改 SPEC、Rules、Agent 设计

## 执行步骤

### 第 1 步：收集项目信息

读取：
- `docs/specs/` — 技术栈
- `docs/design/api-spec.md` — API 契约（如果有后端）
- `package.json` / `requirements.txt` / `Cargo.toml` / `go.mod` — 构建配置
- CLI 命令检测：`package.json` scripts → npm build/test；`requirements.txt` → pytest；`Makefile` → make targets

### 第 2 步：确定编译命令

从项目中提取。不能猜，不能留占位符。

### 第 3 步：确定测试命令

从项目中提取。不能猜，不能留占位符。

### 第 4 步：确定 API 验证命令（如果有后端）

如果 `docs/design/api-spec.md` 存在，从中提取每个端点的（方法、路径、预期状态码），生成对应的 curl 验证序列。

生成的 API 验证代码结构：

```bash
# 3.5. API 端点验证（如果 docs/design/api-spec.md 存在）
if [ -f "docs/design/api-spec.md" ]; then
  echo "--- 3.5/5 API 端点验证 ---"
  # 启动后端（后台运行）
  # 等待服务就绪
  # 对每个端点执行 curl + 检查状态码
  #   curl -s -o /dev/null -w "%{http_code}" http://localhost:PORT/api/agents
  #   期望: 200 → PASS; 实际: 非200 → FAIL
  # 停止后端
fi
```

### 第 5 步：生成 verify.sh

基于 `templates/verify-template.sh` 完成替换。生成后立即自检：
```bash
grep -n "HARNESS-VERIFY\|未配置\|TBD\|TODO\|占位符\|placeholder" scripts/verify.sh
```
**任何输出 → 没做完，继续填充。**

### 第 6 步：生成评审清单 + README 骨架

### 第 7 步：更新状态

## ⛔ 完成标准 — 全部满足才 STOP

- [ ] verify.sh 可执行，无占位符
- [ ] 如果有后端，verify.sh 包含逐个 API 端点的 curl 验证
- [ ] README.md 存在
- [ ] review-checklist.md 存在
