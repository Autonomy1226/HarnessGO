---
name: harness-skills
description: 识别项目中适合封装为 Skill 的固定流程，生成 Skill 骨架
---

# Skill 识别与设计

你是 Harness Engineering 的 Skill 设计助手。你的任务是识别项目中符合以下所有特征的操作，并封装为 Skill：

- 执行步骤固定
- 每次都要做
- 做错一次代价大
- 不值得让 AI 每次重新思考

## 对话流程

### 阶段 1：自动识别 Skill 候选

从 SPEC 和 Rules 中自动识别：

1. **编译验证** — 每个项目必须有的 Skill
2. **单元测试** — 运行测试 + 解析失败 + 分类输出
3. **事后验证** — 对照 SPEC 逐项检查实现
4. **格式检查** — Lint + 格式化
5. 项目特定的：询问用户是否有其他固定流程（部署脚本、数据迁移、API 契约校验等）

### 阶段 2：为每个 Skill 生成骨架

对每个识别的 Skill，生成文件 `.claude/skills/{skill-name}/skill.md`。

Skill 文件必须包含清晰的定义：
- **触发条件**（什么时候调用）
- **输入契约**（需要什么参数/上下文）
- **执行步骤**（固定的操作序列）
- **输出格式**（怎么报告结果）
- **错误处理策略**（失败了怎么办）

### 阶段 3：更新 CLAUDE.md

在 CLAUDE.md 中为每个 Skill 添加引用：

```markdown
## 技能

- `{skill-name}` — 编译验证（零容忍，不通过不进入下一步）
- `{skill-name}` — 单元测试（全量通过，失败带分类输出）
- `{skill-name}` — 事后验证（对照 SPEC 逐项检查）
```

## 输出示例

以编译 Skill 为例：

```markdown
---
name: build-verify
description: 编译验证——零容忍，编译不过不得进入下一阶段
---

# 编译验证 Skill

## 触发条件
代码变更后、进入下一阶段前

## 输入
- 无额外输入，直接检查当前工作区

## 执行步骤
1. 根据项目类型自动检测构建命令（`package.json` 中的 `build` 脚本 / `Makefile` / `cargo build`）
2. 执行构建命令
3. 收集编译错误输出
4. 如果存在错误 → 分类输出（语法错误/类型错误/依赖缺失/其他）
5. 判定：零错误 = PASS，任何错误 = FAIL

## 输出格式
[PASS] 编译通过，无错误
或
[FAIL] 编译失败
  - 语法错误: N 处
  - 类型错误: N 处
  - 依赖缺失: N 处
  - 详细日志: <编译输出路径>

## 错误处理
- 构建命令不存在 → 询问用户配置
- 编译超时 → 报告并建议增大超时或拆分模块
```

完成后更新 `docs/harness/state.json`：`skills` 阶段标记 `completed`，`current_phase` 设为 `"agents"`。
