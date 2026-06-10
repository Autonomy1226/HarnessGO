// ============================================================
// Harness 8 角色流水线 — 示例（多 Agent 可视化看板）
// 由 harness-agents 生成，经 harness-stabilize/verify 完善后执行
// 入口: args = { project: string, spec_file: string }
// ============================================================

export const meta = {
  name: 'harness-pipeline',
  description: 'Harness 8 角色流水线 — PM 调度 + 双验证闸门',
  phases: [
    { title: '需求分析',       detail: '📋 产出需求文档' },
    { title: '方案设计',       detail: '📐 技术方案 + API 契约' },
    { title: '闸门总控',       detail: '🚦 可行性审查 → 人工审批' },
    { title: '开发实现',       detail: '💻 按契约编码 + 维护 dev-map' },
    { title: '验证闸门1',      detail: '🛡️ 编译 + 测试 + API 端点检查' },
    { title: '代码评审',       detail: '🔍 对照清单 + 对照 API 契约' },
    { title: '测试验证',       detail: '🧪 SPEC AC 逐条验收' },
    { title: '验证闸门2',      detail: '🛡️ 全量 verify.sh 5/5' },
    { title: '交付',           detail: '📦 交付报告 + 看板更新' },
  ],
};

const { project, spec_file } = args;

// ============================================================
// Phase 1: 需求分析
// ============================================================
phase('需求分析');
const requirements = await agent(
  `你是需求分析师。阅读 ${spec_file}，产出需求文档。

## 任务
1. 将 SPEC 中的用户故事拆解为功能需求（FR-xxx）
2. 补充非功能需求（NFR-xxx）
3. 识别需求边界和约束
4. 写入 docs/requirements/requirements.md

## 格式
- FR-001: [描述] — 来源: [SPEC 用户故事]
- NFR-001: [描述] — 验收标准: [可测量条件]

## 约束
- 不写代码、不设计技术方案。只产出需求文档。`,

  { label: '需求分析', phase: '需求分析' }
);

// ============================================================
// Phase 2: 方案设计（含 API 契约）
// ============================================================
phase('方案设计');
const design = await agent(
  `你是方案设计师。基于 docs/requirements/requirements.md 产出技术方案。

## 任务
1. 系统架构设计（组件图 + 数据流）
2. 技术选型 + ADR（每个决策必须有理由）
3. 数据模型设计
4. 输出到 docs/design/design.md

## ⚠️ API 契约（必须有）

如果项目有后端，必须产出 docs/design/api-spec.md，每个端点逐一定义：

| 方法 | 路径 | 功能 | 请求参数 | 响应格式 | 错误码 |
|------|------|------|----------|----------|--------|
| GET | /api/agents | 获取 agent 列表 | ?project_id=int | {agents: [{id,name,phase}]} | 404 |
| POST | /api/agents | 创建 agent | {name,phase,project_id} | {id,created_at} | 400,409 |
| GET | /api/agents/:id | 获取单个 agent | — | {id,name,phase,artifacts} | 404 |
| PUT | /api/agents/:id/notes | 更新备注 | {note} | {updated_at} | 400,404 |
| GET | /api/agents/:id/notes | 获取备注历史 | — | {notes: [{content,created_at}]} | 404 |

不得使用"提供 CRUD 接口"等模糊描述。每个端点必须写出完整路径和方法。
如果没有后端，标注「本项目无后端 API」。

## 技术栈约束（来自 SPEC）
- 前端: Vue 3（SFC），禁止 JSX/TSX
- 后端: Python FastAPI，Controller → Service → Repository 三层
- 数据: SQLite`,

  { label: '方案设计', phase: '方案设计' }
);

// ============================================================
// Phase 3: 闸门总控
// ============================================================
phase('闸门总控');
const feasibility = await agent(
  `你是闸门总控。对技术方案做可行性分析和风险评估。审批后输出到 docs/design/feasibility-review.md。

## 检查清单
### 范围检查
- [ ] 是否覆盖 SPEC 全部需求
- [ ] 是否引入了 Non-goals 中声明不做的事

### 风险评估
| 风险 | 等级 | 缓解措施 |
|------|------|----------|

### 结论
- ✅ 通过（可进入开发）
- ⚠️ 有条件通过（需修正以下项后进入开发）
- ❌ 驳回（退回方案设计阶段）

## ⚠️ 重要
报告末尾留人工审批区域。不要替人做决策。`,

  { label: '闸门总控', phase: '闸门总控' }
);

log(`⚠️ 闸门总控已完成 AI 审查。请人工审批后继续。报告: docs/design/feasibility-review.md`);
// 人工审批通过后，继续下一阶段

// ============================================================
// Phase 4: 开发实现（按 API 契约编码 + 维护 dev-map）
// ============================================================
phase('开发实现');
const implementation = await agent(
  `你是开发工程师。基于通过审批的技术方案和 API 契约，实现代码。

## 实现约束（硬性）

### 必须严格按 docs/design/api-spec.md 编码
- 路由路径必须逐字匹配
- HTTP 方法必须匹配
- 请求参数名和响应字段名必须匹配
- 错误码定义必须匹配
- 不得添加 API 契约之外的端点
- 不得省略契约中定义的任何端点

### 代码规范
- 后端: Controller → Service → Repository 三层
- 前端: Vue3 SFC，禁止 JSX/TSX
- 注释: 中文
- 安全: 参数化 SQL，无硬编码密钥，输入校验

### dev-map 维护（每完成一个模块后）
更新 docs/harness/dev-map.json:
- 新增模块 → 加入 modules（含 dependencies）
- 关键文件 → 加入 critical_paths（含 why_important）
- 标准模式 → 标记 pattern_demo

## 验证
每完成一个子任务后，自动运行对应 Skill:
- type-check: mypy backend/ --strict
- lint-check: ESLint + Prettier
- 全量: bash scripts/verify.sh`,

  { label: '开发实现', phase: '开发实现' }
);

// ============================================================
// 验证闸门 1: 编译 + 测试 + API 端点检查（开发→评审之间）
// ============================================================
phase('验证闸门1');
const gate1 = await agent(
  `你的唯一任务：运行验证。不做其他任何事情。

## 执行

### 1. 编译和测试检查
执行: bash scripts/verify.sh
检查输出中第 2 步（编译）和第 3 步（测试）是否都为 PASS。

### 2. API 契约检查（如果 docs/design/api-spec.md 存在）
- 启动后端服务（后台运行）
- 等待服务就绪
- 逐条读取 api-spec.md 中的端点
- 对每个端点执行 curl，检查：
  - HTTP 状态码是否与契约匹配
  - 响应体 JSON 结构是否与契约匹配
- 停止后端服务
- 报告每个端点的 PASS/FAIL

## 输出
如果全部 PASS → "✅ 闸门1 通过"
如果任何一项 FAIL → "⛔ 闸门1 未通过" + 具体失败项

不要写代码、不要修复问题、不要给建议。你只判定。`,

  { label: '验证闸门1-编译测试API', phase: '验证闸门1' }
);

if (gate1 && gate1.includes('未通过')) {
  log(`⛔ 闸门1 未通过：编译、测试或 API 契约检查失败。回退到开发阶段修复。`);
  log(`失败详情: ${gate1}`);
  throw new Error('闸门1 未通过');
}
log('✅ 闸门1 通过：编译、测试和 API 端点验证全部通过');

// ============================================================
// Phase 5: 代码评审
// ============================================================
phase('代码评审');
const review = await agent(
  `你是代码评审员。对照审查清单和 API 契约逐项审查。

## 审查维度
### 对照 API 契约检查
- 每个端点的路由路径是否与 api-spec.md 精确匹配
- 请求参数名和响应字段名是否匹配
- 错误码处理是否完整

### 对照审查清单检查
- 类型检查通过（mypy --strict）
- Lint 通过
- 安全扫描通过
- 测试覆盖率达标
- 架构分层正确
- 注释语言（中文）
- 无硬编码配置
- SQL 参数化

## 输出
审查报告 → docs/reviews/review-report.md
每个问题标注严重级别: 🔴 阻塞 / 🟡 严重 / 🔵 建议`,

  { label: '代码评审', phase: '代码评审' }
);

// ============================================================
// Phase 6: 测试验证
// ============================================================
phase('测试验证');
const testing = await agent(
  `你是测试工程师。运行全量验证并对照 SPEC 逐条验收。

## 任务
1. 启动服务 → 运行 scripts/verify.sh 全量验证
2. 对照 SPEC 验收标准（AC），逐条记录通过/失败
3. 检查 Non-goals 是否被意外实现
4. 输出测试报告 → docs/tests/test-report.md

## 如果失败
- 带具体失败项回退到开发阶段
- 不丢弃已有产出`,

  { label: '测试验证', phase: '测试验证' }
);

// ============================================================
// 验证闸门 2: 全量 verify.sh 5/5（测试→交付之间）
// ============================================================
phase('验证闸门2');
const gate2 = await agent(
  `你的唯一任务：运行全量验证。不做其他任何事情。

执行: bash scripts/verify.sh
检查: 5 步必须全部 PASS，退出码必须为 0。

如果全部 PASS → "✅ 闸门2 通过"
如果任何一步 FAIL → "⛔ 闸门2 未通过"

不要写代码、不要修复问题、不要给建议。你只判定。`,

  { label: '验证闸门2-全量验证', phase: '验证闸门2' }
);

if (gate2 && gate2.includes('未通过')) {
  log(`⛔ 闸门2 未通过：全量验证失败。回退到开发阶段修复。`);
  throw new Error('闸门2 未通过');
}
log('✅ 闸门2 通过：全量验证 5/5');

// ============================================================
// Phase 7: 交付
// ============================================================
phase('交付');
const delivery = await agent(
  `你是交付经理。汇总各阶段产出并记录交付结论。

## 任务
1. 对照 SPEC 交付物清单逐项确认
2. 汇总各阶段产出路径
3. 记录交付结论: ✅ 可交付 / ⚠️ 有遗留项 / ❌ 不可交付
4. 更新 docs/harness/task-board.json（当前任务→completed，填写交付结论）
5. 输出交付报告 → docs/delivery/delivery-report.md`,

  { label: '交付', phase: '交付' }
);

// ============================================================
// 流水线完成
// ============================================================
log(`
=========================================
  Harness 8 角色流水线执行完成
=========================================
项目: ${project}
各阶段产出:
  📋 需求: docs/requirements/
  📐 设计: docs/design/ + api-spec.md
  🚦 闸门: docs/design/feasibility-review.md
  💻 开发: docs/dev/ + 代码
  🛡️ 闸门1: 编译+测试+API 端点 通过
  🔍 评审: docs/reviews/
  🧪 测试: docs/tests/
  🛡️ 闸门2: 全量 5/5 通过
  📦 交付: docs/delivery/
=========================================
`);
