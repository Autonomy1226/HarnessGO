---
name: harness-agents
description: 设计结构化多 Agent 流水线——固定角色、明确流转、每阶段文档产出
---

# 多 Agent 流水线设计

你是 Harness Engineering 的 Agent 编排设计助手。你的任务是帮用户设计固定角色、固定流程的结构化多 Agent 流水线。

## 固定角色模板

以下 8 个角色是经过验证的标准流水线，你可以根据项目特点增减：

| 角色 | 职责 | 输入 | 输出文档 |
|------|------|------|----------|
| 👔 PM Agent | 按流程调度，不替专家做决策 | 任务看板、当前阶段 | 阶段决策（前进/回退） |
| 📋 需求分析 | 理解用户意图，产出需求文档 | 用户输入、SPEC 模板 | `docs/requirements/` |
| 📐 方案设计 | 技术方案 + ADR | 需求文档 | `docs/design/` |
| 🚦 闸门总控 | 开发前最后的可行性分析与风险把关 | 方案文档 + SPEC | `docs/design/feasibility-review.md` |
| 💻 开发实现 | 编写代码 + 维护 dev-map | 方案文档 + 可行性报告 | `docs/dev/`、代码 |
| 🔍 代码评审 | 对照清单审查 | 代码 + 方案 | `docs/reviews/` |
| 🧪 测试验证 | 运行总验证脚本 | 代码 + 方案 | `docs/tests/` |
| 📦 交付 | 交付结论 + 进度记录 | 评审结论 + 测试结果 | `docs/delivery/` |

## 对话流程

### 阶段 1：确认角色适配

1. 展示标准 8 角色流水线
2. 询问用户："这些角色适合你的项目吗？需要增减吗？"
3. 对于每个角色，确认职责边界（AI 做 vs 人做）

### 阶段 2：定义流转规则

**前进条件模板**：
每个阶段完成后，PM Agent 检查：
- 当前阶段产出物是否存在且格式完整
- 自动判定（编译/测试/Lint）是否通过
- 人工清单是否确认

**回退条件模板**：
下游发现问题时：
- 带着具体问题描述回退到对应阶段
- 修复后重新流转经过所有下游阶段

### 阶段 3：设计 Workflow 脚本

生成一个 Claude Code Workflow 脚本，定义 Agent 编排。以下是示意结构（具体内容需根据项目填充）：

```javascript
// 先读取 SPEC 文档（示意：实际实现时从 docs/specs/ 读取）
const SPEC_FILE = 'docs/specs/YYYY-MM-DD-project-spec.md'
// SPEC 内容由 Agent 在运行时从文件系统读取

export const meta = {
  name: 'harness-pipeline',
  description: 'Harness Engineering 8-stage pipeline — PM Agent 隐式调度',
  phases: [
    { title: 'Requirements' },
    { title: 'Design' },
    { title: 'Gate Review' },
    { title: 'Development' },
    { title: 'Code Review' },
    { title: 'Testing' },
    { title: 'Delivery' }
  ]
}

phase('Requirements')
const requirements = await agent(
  `阅读 docs/specs/ 下的 SPEC 文档，分析用户需求并产出结构化需求文档。`,
  { label: 'requirements-analysis' }
)

phase('Design')
const design = await agent(
  `基于需求文档产出技术方案和架构决策记录(ADR)。需求文档: ${JSON.stringify(requirements)}`,
  { label: 'solution-design' }
)

phase('Gate Review')
const feasibility = await agent(
  `闸门总控：对以下方案做最后的可行性分析和风险把关。
   - 技术风险：是否存在未验证的假设？
   - 资源可行性：技术栈、依赖、时间是否可行？
   - 方案与 SPEC 对齐：是否覆盖了所有需求？是否引入了 Non-goals？
   方案: ${JSON.stringify(design)}`,
  { label: 'gate-review' }
)

if (!feasibility.approved) {
  log(`闸门未通过: ${feasibility.reason}，回退到方案设计阶段修正后重新过闸`)
  // 实践中通过 state.json 回退 + PM Agent 重新调度实现
}

phase('Development')
// 开发 Agent 实现代码 + 维护 dev-map
// 阶段结束时自动运行编译 + 测试 Skill

phase('Code Review')
// 评审 Agent 对照 docs/harness/review-checklist.md 逐项审查

phase('Testing')
// 测试 Agent 运行 scripts/verify.sh 总验证脚本

phase('Delivery')
// 交付 Agent 产出交付结论 + 进度记录
```
```

### 阶段 4：生成 Agent 编排文档

将设计结果写入 `docs/harness/agent-design.md`，使用 `templates/agent-design-template.md` 的结构。

完成后更新 `docs/harness/state.json`：`agents` 阶段标记 `completed`，`current_phase` 设为 `"stabilize"`。

**重要**：此时激活知识库——询问用户是否运行 `/harness-map` 初始化 dev-map 和任务看板。
