# Design

## Context

См. proposal.md — Why. Слои `src/core` / `src/ui` уже есть. Спеки и `config.yaml` описывают более ранний каркас.

## Goals / Non-Goals

**Goals:**

- Спеки = текущий каркас
- Один команда `verify` для done-gate
- Запрет `core → ui` / `react` ловится скриптом, не только текстом

**Non-Goals:**

- XOR / autograd / лаборатория
- ESLint вместо oxlint
- Редактировать архив `core-ui-split`

## Decisions

1. **`npm run verify` = agents:check + core-imports + lint + test + build.**  
   Не прятать check внутрь `test`: разные причины падения.

2. **Импорты ядра — отдельный скрипт, не oxlint.**  
   Oxlint не гарантирует `no-restricted-imports` в этой версии. Скрипт читает `src/core/**/*.{ts,tsx}` как текст.

3. **`config.yaml` только для артефактов OpenSpec.**  
   Смысл проекта — во вложенных AGENTS.md. Context сводится к «читай индекс».

4. **XOR-tasks 4.1 переводится на `npm run verify`.**  
   Чтобы следующий агент не гонял три команды и забывал индекс.

## Risks / Trade-offs

- [Скрипт импортов ловит комментарии `from 'react'`] → достаточно для каркаса; ложные срабатывания редки
- [Два активных change] → этот архивируется сразу, XOR остаётся единственным к apply
