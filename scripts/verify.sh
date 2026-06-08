#!/bin/bash
# Harness 总验证脚本 — 5 步固定序列
# 用法：bash scripts/verify.sh
# 输出：每步 [PASS/FAIL/SKIP] + 详细原因

set -e
EXIT_CODE=0
REPORT=""

log_pass() { REPORT="${REPORT}[PASS] $1\n"; }
log_fail() { REPORT="${REPORT}[FAIL] $1 - $2\n"; EXIT_CODE=1; }
log_skip() { REPORT="${REPORT}[SKIP] $1 - $2\n"; }

echo "=== Harness 总验证 ==="
echo ""

# 1. 扫规范
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

# 2. 编译检查
echo "--- 2/5 编译检查 ---"
log_skip "编译检查" "请在 /harness-verify 中配置具体编译命令"

# 3. 测试检查
echo "--- 3/5 测试检查 ---"
log_skip "测试检查" "请在 /harness-verify 中配置具体测试命令"

# 4. 规则文件同步
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

# 5. 工程文件完整性
echo "--- 5/5 工程完整性 ---"
REQUIRED_DOCS=(
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
exit $EXIT_CODE
