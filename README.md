# Harness Engineering

**A structured engineering pipeline for Claude Code. 7 Skills guide you from a rough idea to a verified, deliverable codebase — with traceability at every step.**

Not a code generator. Each Skill enforces a specific phase of work: requirements are questioned until they're unambiguous, designs are precise to function signatures, code is written to contract, and verification is scripted — not subjective.

---

## Pipeline

```
Rough idea
    │
 ① harness             Project Manager — init, routing, progress, knowledge base
    │
 ② harness-spec         Requirement Analyst — deep-dive → traceable PRD
    │
 ③ harness-design       Solution Architect — PRD → technical blueprint (4 reader-specific docs)
    │
 ④ harness-gate         Gate Reviewer — feasibility & risk assessment (AI review + human sign-off)
    │
 ⑤ harness-dev          Dev Orchestrator — dispatches module agents per blueprint, integration check
    │
 ⑥ harness-review       Code Reviewer — quality × requirement alignment × design consistency
    │
 ⑦ harness-test         Test & Verification Engineer — layered test scripts + AC-by-AC acceptance
    │
 ✅ Ship
```

---

## Document Chain

```
PRD (harness-spec output)
  ↓  read only by harness-design
Design blueprint (design.md + dev/ + gate/ + test/)
  ↓  read by harness-gate, harness-dev, harness-review, harness-test
```

Each phase reads only its designated input. Downstream never reads upstream directly — no information leak, no confusion.

---

## Installation

Copy `.claude/skills/` and `templates/` to your project:

```
your-project/
  .claude/skills/         # 7 Skill files (SKILL.md)
  templates/              # Templates for generated artifacts
```

---

## Usage

Open Claude Code in your project directory, then invoke in sequence:

```
harness            PM — initialize skeleton, check progress
harness-spec       Write PRD with FR/AC/NFR ID traceability
harness-design     Produce design.md + dev/ + gate/ + test/
harness-gate       Feasibility review with human approval gate
harness-dev        Dispatch module agents per design blueprint
harness-review     3D review (quality × requirements × design)
harness-test       Generate layered test scripts, run, AC-by-AC acceptance
```

---

## The 7 Skills

| Skill | Role | Primary Output |
|-------|------|----------------|
| `harness` | Engineering PM | `state.json`, `dev-map.json`, `task-board.json` |
| `harness-spec` | Product Requirement Analyst | PRD with glossary, ID system, assumption register |
| `harness-design` | Solution Architect | `design.md` + `dev/` + `gate/` + `test/` |
| `harness-gate` | Gate Reviewer | `feasibility-review.md` (AI assessment + human sign-off) |
| `harness-dev` | Dev Orchestrator | Code + `dev-report.md` + per-module `dev-log.md` + updated `dev-map.json` |
| `harness-review` | Code Reviewer | `review-report.md` (🔴 Blocker / 🟡 Major / 🔵 Minor) |
| `harness-test` | Test & Verification Engineer | `scripts/test/*.sh` + `verify.sh` + `test-report.md` |

---

## Quality Framework

Every Skill is built on the same 7-layer structure. When a Skill says it's done, it can prove it:

| # | Layer | What it means |
|---|-------|---------------|
| ① | Professional Identity | The Skill knows its role and won't do another Skill's job |
| ② | Iron Rules | Non-negotiable constraints — violated rules block output |
| ③ | ID Traceability | Every claim references a specific upstream requirement ID |
| ④ | Self-Check | Mandatory verification before declaring completion |
| ⑤ | Prohibitions | Explicit list of what must never be done |
| ⑥ | Completion Standards | Verifiable criteria — not "looks good", but "passes these checks" |
| ⑦ | STOP Boundary | The Skill stops at the end of its phase and hands off |

---

## Design Principles

**One-way document flow.** PRD → Design → Dev/Review/Test. No phase reads documents more than one step upstream. This prevents "I read the original requirement and interpreted it differently" — interpretation happens once, in design.

**Rules define what; Skills define how.** A Rule says "after every change: compile, test, post-verify. All three must pass." A Skill defines the exact commands, output format, and failure handling. The AI doesn't interpret the rule — it invokes a proven method.

**verification is scripted, not subjective.** `scripts/verify.sh` orchestrates layered test scripts (unit, integration, API, E2E, security, performance). Every acceptance criterion maps to a specific test step. Pass = ship. Fail = blocked. No "looks fine to me."

**dev-map: the codebase navigation map.** Not a file listing. It answers: where does feature X live? How do I access service Y? Where is config Z defined? What breaks if I change this module? What's the standard pattern here? What must I not touch?

---

## Self-Verification

This project validates itself. Running `bash scripts/verify.sh`:

```
[PASS] PRD integrity check
[PASS] Rule file sync (CLAUDE.md + settings.json)
[PASS] Required documentation present (README, state.json, dev-map, task-board)
```

---

## License

MIT
