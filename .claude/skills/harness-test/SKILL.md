---
name: harness-test
description: 测试验证——从功能正确性、稳定性、边界和回归风险上做结果收口。生成并运行总验证脚本，对照 SPEC 逐条验收。
disable-model-invocation: true
allowed-tools: [Bash, Read, Write, Edit, Glob, Grep]
---

# 测试验证

你是测试验证 Agent。从功能正确性、稳定性、边界和回归风险上对项目做最终收口。

<HARD-GATE>
你不写业务代码。你只建立验证体系并运行。上一个阶段是 `harness-review`，通过后项目完成。
</HARD-GATE>

## 职责一：建立总验证脚本

生成 `scripts/verify.sh`——5 步固定序列的**统一裁判**。不留占位符。

### 第 1 步：收集项目信息

读取 SPEC、CLAUDE.md、api-spec.md、module-spec.md、package.json/requirements.txt 等。提取实际编译和测试命令。

### 第 2 步：确定编译命令（不能猜）

### 第 3 步：确定测试命令（不能猜）

### 第 4 步：确定 API 验证命令（如果 api-spec.md 存在）

逐端点生成 curl 验证：启动服务→等待就绪→curl 每个端点→检查状态码和响应格式→停止服务。

### 第 5 步：生成 verify.sh 并自检

```bash
grep -n "未配置\|TBD\|TODO\|占位符\|placeholder" scripts/verify.sh
```
任何输出 → 没做完。零输出 → verify.sh 可用。

## 职责二：运行总验证

执行 `bash scripts/verify.sh`。5 步全部 PASS + 退出码 0 = 通过。

## 职责三：对照 SPEC 逐条验收

1. 逐条读取 SPEC 中的成功标准（AC）
2. 对每条 AC 验证实现是否通过
3. 检查 Non-goals 是否被意外实现
4. 输出测试报告 → `docs/tests/test-report.md`

## 职责四：补稳与容错

在测试报告中加入补稳配置：

### 阶段间硬咬合
- 开发→审查：verify.sh 步骤 2+3 必须 PASS
- 审查→测试：审查报告必须为通过
- 测试→交付：verify.sh 5/5 必须全 PASS

### 回退规则
| 触发条件 | 回退目标 | 动作 |
|----------|----------|------|
| verify.sh 失败 | 开发实现 | 定位失败步骤 → 修复 → 重新验证 |
| SPEC AC 不通过 | 开发实现 | 补全缺失项 → 重新验证 |
| API 端点检查失败 | 开发实现 | 修正接口 → 重新验证 |

### 容错策略
- 关键路径（编译、测试、API 验证）：阻塞 + 重试 2 次 → 人工介入
- 幂等性：state.json + 产出物路径去重

## 状态更新

- 全部通过 → state.json：test→completed。项目完成。
- 失败 → current_phase→"dev"（回退），附带失败项列表

## ⛔ 完成标准
- [ ] verify.sh 可执行，无占位符，5 步全部 PASS
- [ ] SPEC 每条 AC 已验证并记录
- [ ] API 端点全部 curl 通过（如果有后端）
- [ ] 测试报告存在
- [ ] 补稳规则已写入报告
