# Proposal

## Why

`PLAN.md` дублирует OpenSpec. Текущие папки `src/nn` / `src/viz` смешивают оси «математика» и «экран». Агентам нужна одна схема работы: design → plan → TDD → проверки, иначе они сразу пишут модель.

## What Changes

- Удалить `PLAN.md`. Источник правды — OpenSpec
- Разделить код: `src/core` без React, `src/ui` только отображение
- Не внедрять полный Feature-Sliced Design как основной каркас
- Зафиксировать цикл агента: design, plan, TDD, done-gate
- Поставить Vitest как тестовый раннер, без кода модели
- Обновить срез `xor-training-lab` под новые пути и TDD-задачи

## Capabilities

### New Capabilities

- `project-layout`: слои `core` и `ui`, запрет полного FSD как главной оси
- `agent-workflow`: design → plan → TDD → проверки перед «готово»

### Modified Capabilities

- нет

## Impact

- `src/**`, `AGENTS.md`, `.cursor/**`, `openspec/config.yaml`, `openspec/changes/xor-training-lab`
- devDependency: `vitest`
- без кода нейросети
