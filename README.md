# Harness Engineering

**7 specialized AI Agents that turn vague ideas into deliverable code.**

Not a code generator — an engineering pipeline. Each agent has a clear professional identity, hard boundaries, iron rules, and self-check checklists.

---

## Pipeline

```
Vague idea
    │
 ① harness (PM)         Project Manager — init, routing, progress, knowledge base
    │
 ② harness-spec         Requirement Analyst — deep-dive user intent → traceable PRD
    │
 ③ harness-design       Solution Architect — SPEC → complete technical blueprint
    │
 ④ harness-gate         Gate Reviewer — final feasibility & risk check (AI review + human sign-off)
    │
 ⑤ harness-dev          Dev Orchestrator — dispatches parallel module agents per blueprint
    │
 ⑥ harness-review       Code Reviewer — quality + requirement alignment + design alignment
    │
 ⑦ harness-test         Test Engineer — verify.sh + AC-by-AC validation + stabilization
    │
 ✅ Delivery
```

---

## Document Chain

```
SPEC (requirements doc)
  ↓ read only by harness-design
Design docs (design.md + dev/ + gate/ + test/)
  ↓ read by gate, dev, review, test
```

Downstream agents never read SPEC — only design docs. Each agent has its own information boundary.

---

## Quick Start

Copy `.claude/skills/` and `templates/` to your project:

```
your-project/
  .claude/skills/       # 7 agent skill files
  templates/            # Templates (spec, state, dev-map, etc.)
```

Then invoke in Claude Code:

```
harness            PM — init skeleton + view progress
harness-spec       Write SPEC with FR/AC/NFR ID traceability
harness-design     Produce design.md + api-spec + modules + gate/test briefs
harness-gate       Feasibility review (AI review + human approval)
harness-dev        Dispatch parallel module agents to write code
harness-review     3D review (quality + requirements + design consistency)
harness-test       Generate verify.sh → run → AC-by-AC acceptance
```

---

## 7 Agents

| Agent | Identity | Core Output |
|-------|----------|-------------|
| `harness` | Engineering PM | state.json, dev-map, task-board |
| `harness-spec` | Product Requirement Analyst | SPEC (PRD with glossary, ID system, assumptions) |
| `harness-design` | Solution Architect | design.md + api-spec + modules + gate/test briefs |
| `harness-gate` | Gate Reviewer | feasibility-review.md (AI review + human approval) |
| `harness-dev` | Dev Orchestrator | Code + dev-report + dev-log + dev-map |
| `harness-review` | Code Reviewer | review-report.md (🔴🟡🔵 three-level review) |
| `harness-test` | Test & Verification Engineer | verify.sh + test-report + stabilization rules |

---

## Quality Framework

Every agent follows a 7-layer quality framework:

| Layer | Content |
|-------|---------|
| ① Professional Identity | Who I am, what value I bring |
| ② Iron Rules | Non-negotiable constraints |
| ③ ID Traceability | Every conclusion traceable to upstream docs |
| ④ Self-Check | Mandatory checks before output |
| ⑤ Prohibitions | What I must never do |
| ⑥ Completion Standards | Verifiable item-by-item |
| ⑦ STOP Boundary | Stop when done, don't overstep |

---

## Core Design Principles

### One-way document flow

SPEC → Design → Dev/Review/Test. Downstream never reads upstream directly.

### Rules = principle constraints, Skills = process execution

Rule (one sentence): "After every change: compile, test, post-verify. All three must pass."
Skill spells out each step: how to compile, how to test, how to verify. AI doesn't interpret — it invokes a proven method.

### verify.sh is the unified judge

`scripts/verify.sh` — 5-step fixed sequence. Pass = deliverable. Fail = blocked. No placeholders.

### dev-map is a navigation map

Not a file list. Answers: feature landing points, service access, config locations, impact chains, standard patterns, no-go zones. Whoever changes code updates the map.

---

## Project Status

Harness Engineering is itself a Harness project, validated by its own `scripts/verify.sh`:

```
[PASS] SPEC check
[PASS] Rule sync
[PASS] File completeness
```

---

## File Structure

```
.claude/skills/           # 7 agents (SKILL.md + SKILL.en.md)
templates/                # Templates (spec, state, dev-map, task-board, module-spec, verify)
docs/superpowers/
  specs/                  # Design specs
  plans/                  # Implementation plans
docs/harness/             # Project state (state.json, dev-map.json, task-board.json)
scripts/verify.sh         # Unified verification script
CLAUDE.md                 # AI behavior rules
```

---

## License

MIT
