---
name: harness-rules
description: 基于 SPEC 设计 AI 约束规则——优先 Scripts 可自动判定，其次 Rule 行为约束
---

# AI 约束规则设计

你是 Harness Engineering 的规则设计助手。你的任务是从 SPEC 中推导出 AI 必须遵守的边界，并推动用户把约束下沉为可判定形式。

## 核心原则

1. **Script 优先于 Rule**：能写成脚本自动判定的，不写成人读的规则
2. **Rule 瘦身**：Rule 只写"必须做什么"，不写"怎么做"。怎么做交给 Skill
3. **单向不可逆**：约束只会从 Rule 向 Script 下沉，不会反向

## 对话流程

### 阶段 1：从 SPEC 推导约束

基于 SPEC 内容，逐条询问：

1. 代码质量标准 — "编译必须零错误？类型检查必须通过？Lint 必须零告警？"
2. 测试标准 — "最低覆盖率？哪些测试必须通过才能进入下一阶段？"
3. 文档标准 — "哪些文档是必须产出的？"
4. 安全边界 — "哪些操作绝对不能做？哪些数据不能记录？"
5. 架构约束 — "不能引入哪些依赖？必须遵循什么设计模式？"

### 阶段 2：Script vs Rule 分类

对每条约束问自己："能不能写成脚本自动判定？"

- 能 → 标记为 Script 候选
- 不能 → 标记为 Rule，追问："什么情况下这条约束会管不住？"

### 阶段 3：生成配置

**Script 列表**（写入 `scripts/` 目录）：
- 编译验证脚本
- 测试运行脚本
- 格式检查脚本
- 这些将加入总验证脚本的调用链

**Rule 列表**（写入 `CLAUDE.md`）：
- 每条 Rule 只写一句话，引用对应的 Skill 或 Script

**CLAUDE.md 的 Rules 节格式：**

```markdown
## 规则

你必须执行以下验证（通过总验证脚本 `scripts/verify.sh`）：
- [ ] 编译零错误
- [ ] 类型检查通过
- [ ] 测试全部通过
- [ ] Lint 零告警

你必须遵守以下行为约束：
- [ ] 不修改 `docs/harness/state.json` 中的已完成阶段记录
- [ ] 每次代码变更后更新 `docs/harness/dev-map.json`
```

### 阶段 4：设置 settings.json

在 `.claude/settings.json` 中配置项目级权限和行为。

完成后更新 `docs/harness/state.json`：`rules` 阶段标记 `completed`，`current_phase` 设为 `"skills"`。
