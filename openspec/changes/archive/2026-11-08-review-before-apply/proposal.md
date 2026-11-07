# Proposal

## Why

После `/opsx-propose` агент может сразу пойти в `tasks.md` и писать код. Нужен стоп: сначала ревью `proposal.md` и `design.md`.

## What Changes

- Apply и любая работа по `tasks.md` только после явного ок пользователя на `proposal.md` и `design.md`
- Propose по-прежнему пишет все артефакты, включая `tasks.md`, но не выполняет их
- Код модели не пишем

## Capabilities

### New Capabilities

- нет

### Modified Capabilities

- `agent-workflow`: шлюз ревью перед apply

## Impact

- `openspec/AGENTS.md`, `.cursor/rules/kuren-01.mdc`, `openspec/config.yaml`, `openspec/specs/agent-workflow`
