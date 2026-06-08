#!/bin/bash
# Harness 总验证脚本 — 5 步固定序列
# 由 harness-verify 根据项目技术栈自动填充
# 用法：bash scripts/verify.sh
# 输出：每步 [PASS/FAIL] + 详细原因
# 退出码：0 = 全部通过，非 0 = 存在失败项

set -e
EXIT_CODE=0
REPORT=""

log_pass() { echo "  [PASS] $1"; REPORT="${REPORT}[PASS] $1\n"; }
log_fail() { echo "  [FAIL] $1 — $2"; REPORT="${REPORT}[FAIL] $1 - $2\n"; EXIT_CODE=1; }

echo "=== Harness 总验证 ==="
echo ""

# ═══════════════════════════════════════════════════════════════
# 1. 规范检查 — 自动扫描 SPEC 必要字段
# ═══════════════════════════════════════════════════════════════
echo "--- 1/5 规范检查 ---"
SPEC_FILE=$(ls docs/specs/*.md 2>/dev/null | head -1)
if [ -z "$SPEC_FILE" ]; then
  log_fail "规范检查" "未找到 SPEC 文件 (docs/specs/*.md)"
else
  for field in "项目目标" "明确不做的事" "成功标准" "技术约束"; do
    if grep -q "$field" "$SPEC_FILE"; then
      log_pass "SPEC 包含: $field"
    else
      log_fail "SPEC 缺少字段" "$field"
    fi
  done
fi

# ═══════════════════════════════════════════════════════════════
# 2. 编译检查 — TO BE FILLED BY harness-verify
# ═══════════════════════════════════════════════════════════════
echo "--- 2/5 编译检查 ---"
# >>> HARNESS-VERIFY: 根据技术栈替换下方占位符 <<<
# 示例（Python 后端）：
#   pip install -r requirements.txt && mypy backend/ --strict && npm run build
# 示例（纯前端）：
#   npm ci && npm run build
# 示例（Go）：
#   go build ./...
# ⚠️  此占位符必须被替换为实际编译命令，否则验证脚本无效。
echo "  [FAIL] 编译检查 — 编译命令未配置。请运行 harness-verify 填充 scripts/verify.sh"
EXIT_CODE=1
REPORT="${REPORT}[FAIL] 编译检查 - 编译命令未配置\n"

# ═══════════════════════════════════════════════════════════════
# 3. 测试检查 — TO BE FILLED BY harness-verify
# ═══════════════════════════════════════════════════════════════
echo "--- 3/5 测试检查 ---"
# >>> HARNESS-VERIFY: 根据技术栈替换下方占位符 <<<
# 示例（Python 后端 + 前端）：
#   pytest backend/ -v --cov=backend --cov-report=term && npm test -- --coverage
# 示例（纯前端）：
#   npm test -- --coverage
# 示例（Go）：
#   go test ./... -v -cover
# ⚠️  此占位符必须被替换为实际测试命令，否则验证脚本无效。
echo "  [FAIL] 测试检查 — 测试命令未配置。请运行 harness-verify 填充 scripts/verify.sh"
EXIT_CODE=1
REPORT="${REPORT}[FAIL] 测试检查 - 测试命令未配置\n"

# ═══════════════════════════════════════════════════════════════
# 4. 规则文件同步 — 自动检查关键配置文件存在性和一致性
# ═══════════════════════════════════════════════════════════════
echo "--- 4/5 规则同步 ---"
if [ -f "CLAUDE.md" ]; then
  log_pass "CLAUDE.md 存在"
else
  log_fail "规则同步" "CLAUDE.md 缺失"
fi
if [ -f ".claude/settings.json" ]; then
  log_pass ".claude/settings.json 存在"
else
  log_fail "规则同步" ".claude/settings.json 缺失"
fi

# ═══════════════════════════════════════════════════════════════
# 5. 工程文件完整性 — 自动检查强制文档和产物
# ═══════════════════════════════════════════════════════════════
echo "--- 5/5 工程完整性 ---"
REQUIRED_DOCS=(
  "README.md"
  "docs/harness/state.json"
  "docs/harness/dev-map.json"
  "docs/harness/task-board.json"
)
for doc in "${REQUIRED_DOCS[@]}"; do
  if [ -f "$doc" ]; then
    log_pass "文件存在: $doc"
  else
    log_fail "工程完整性" "缺少文件: $doc"
  fi
done

echo ""
echo "=== 验证结果 ==="
echo -e "$REPORT"
echo "退出码: $EXIT_CODE"
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ 全部验证通过"
else
  echo "❌ 存在失败项，不得进入下一阶段"
fi
exit $EXIT_CODE
