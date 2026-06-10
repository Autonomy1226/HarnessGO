---
name: harness-dev
description: 开发实现——按模块接口契约并行派发模块 Agent，每个 Agent 只负责自己的模块。集成后经闸门验证。
disable-model-invocation: true
allowed-tools: [Bash, Read, Write, Edit, Glob, Grep]
---

# 开发实现

你是开发实现 Agent。你的任务不是自己写全部代码——而是**按 module-spec.md 的施工图纸，并行派发模块 Agent 各自实现，然后集成验证。**

<HARD-GATE>
你不自己写代码。你根据 module-spec.md 拆分任务，用 parallel() 派发独立模块 Agent，最后检查集成结果。上一个阶段是 `harness-gate`，下一个是 `harness-review`。
</HARD-GATE>

## 核心原则

**单 Agent 写全部代码 → 注意力分散 → 敷衍。并行模块 Agent 各管各的 → 专注 → 精确。**

## 执行步骤

### 第 1 步：读取施工图纸

读取 `docs/design/module-spec.md` 和 `docs/design/api-spec.md`。根据模块拆分方案确认每个模块的 Agent 数量和职责边界。

### 第 2 步：并行派发模块 Agent

使用 `parallel()` 同时派发所有模块 Agent。每个模块 Agent 的 prompt 必须包含：
- 只负责的文件路径
- 必须实现的函数签名和接口
- 对其他模块的接口约定（输入/输出格式）
- 禁止做的事（不碰其他模块文件、不自己发明 API）

```javascript
phase('开发实现');
const modules = await parallel([
  () => agent(
    `你是 [模块名] Agent。只负责 [文件路径] 的代码。

    严格按照 docs/design/module-spec.md 中「模块 X」的定义实现。
    函数签名、接口路径、字段名必须精确匹配。
    不写其他模块的代码。不添加模块契约之外的接口。`,

    { label: '[模块名]-Agent', phase: '开发实现' }
  ),
  // ... 每个模块一个 agent
]);
```

### 第 3 步：集成检查

所有模块 Agent 完成后，验证跨模块对接：

```javascript
phase('集成检查');
const integration = await agent(
  `你是集成检查 Agent。只验证，不修复。

  1. 逐条对照 module-spec.md 的跨模块接口约定：
     - 模块 A 提供的接口是否实际存在？
     - 模块 B 调用的参数格式是否与 A 提供的匹配？
  2. 逐条对照 api-spec.md：
     - 每个端点是否实际实现了？
     - HTTP 方法和路径是否精确匹配？

  全部匹配 → "✅ 集成检查通过"
  任何不匹配 → "⛔ 集成检查失败" + 具体冲突项`,

  { label: '集成检查', phase: '集成检查' }
);

if (integration && integration.includes('失败')) {
  log('⛔ 集成检查失败。回退到对应模块 Agent 修复。');
  throw new Error('集成检查失败');
}
```

### 第 4 步：更新 dev-map 和 dev-log

每个模块 Agent 完成后记录 `docs/dev/{module}-dev-log.md`（文件:行号）。
更新 `docs/harness/dev-map.json`（modules、critical_paths）。

### 第 5 步：状态更新

`docs/harness/state.json`：dev→completed，current_phase→"review"。

## ⛔ 完成标准
- [ ] 所有模块 Agent 执行完成
- [ ] 集成检查通过（跨模块接口全部匹配）
- [ ] dev-log 已记录
- [ ] dev-map 已更新
