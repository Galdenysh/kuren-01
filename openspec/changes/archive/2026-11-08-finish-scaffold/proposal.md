# Proposal

## Why

Каркас уже режет `core`/`ui`, но живые спеки, `config.yaml` и проверки разъехались. Следующий агент на XOR может пропустить TDD и импортнуть React в ядро — это ловится только текстом.

## What Changes

- Синхронизировать `openspec/specs/agent-workflow` с оглавлением `AGENTS.md` и `npm run agents:check`
- Укоротить `openspec/config.yaml`: не дублировать nested AGENTS, починить YAML
- Добавить проверку, что `src/core` не импортирует `react` и `src/ui`
- Собрать `npm run verify` как done-gate каркаса
- Подкрутить alwaysApply и XOR-tasks под verify; код модели не писать

## Capabilities

### New Capabilities

- нет

### Modified Capabilities

- `agent-workflow`: оглавление AGENTS.md, verify, не пропускать OpenSpec/TDD
- `project-layout`: запрет импорта core→ui проверяется скриптом

## Impact

- `openspec/config.yaml`, `openspec/specs/**`, `scripts/**`, `package.json`, `.cursor/rules/kuren-01.mdc`, `openspec/changes/xor-training-lab/tasks.md`
- без кода нейросети
