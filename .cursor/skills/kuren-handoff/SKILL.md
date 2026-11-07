---
name: kuren-handoff
description: Limits Kuren-01 work to one OpenSpec change per session and forbids implementing the whole model at once. Use when starting work, implementing nn/viz/agent, or when the user asks to build the model, trainer, transformer, or agent loop.
---

# Kuren-01 handoff

## Hard limits

- Implement **one** OpenSpec change per session.
- Do not write a transformer, tokenizer, language model, or agent loop unless the current change names it.
- Do not fill empty slots "while you are here".
- If the change is `xor-training-lab`, stop after XOR MLP + lab UI.

## Start of session

1. Read `AGENTS.md` and `PLAN.md`.
2. Run `npx openspec list` and `npx openspec status --change <name>`.
3. Apply the named change. Default next change: `xor-training-lab`.
4. Leave `src/agent` untouched unless the change says otherwise.

## End of session

- Say what landed, what is still empty, and which OpenSpec change is next.
- Do not start that next change in the same session.
