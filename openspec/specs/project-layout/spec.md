# project-layout Specification

## Purpose

Учебный каркас отделяет чистую математику сети от React-лаборатории. Полный Feature-Sliced Design не является основной структурой проекта.

## Requirements

### Requirement: Core has no UI

Доменная логика MUST жить в `src/core` и MUST NOT импортировать React, `src/ui` или DOM-API ради обучения сети.

#### Scenario: Neural net module

- **WHEN** агент добавляет тензор, autograd, слой, trainer или агентный цикл
- **THEN** файлы лежат в `src/core/nn` или `src/core/agent` и не импортируют `react`

### Requirement: UI only renders snapshots

React-код MUST жить в `src/ui` и MUST получать состояние сети через публичный снимок из `src/core`, а не через приватные поля тензора.

#### Scenario: Lab screen

- **WHEN** агент рисует граф, веса или loss
- **THEN** код лежит в `src/ui/lab` и импортирует только публичный API `src/core`

### Requirement: Import direction

Модули в `src/core` MUST NOT импортировать `src/ui`. Модули в `src/ui` MAY импортировать `src/core`.

#### Scenario: Forbidden reverse import

- **WHEN** файл в `src/core` содержит import из `src/ui` или `react`
- **THEN** это нарушение каркаса

### Requirement: FSD is not the primary split

Проект MUST NOT раскладывать математику сети по слоям Feature-Sliced Design (`pages` / `widgets` / `features` / `entities`). Если UI разрастётся до нескольких экранов, FSD MAY применяться только внутри `src/ui`.

#### Scenario: New folder request

- **WHEN** агент предлагает полный FSD на весь `src`
- **THEN** он оставляет `src/core` целым доменом и не режет тензор на entities/features

### Requirement: Import boundary is checked

Репозиторий MUST содержать автоматическую проверку, что файлы под `src/core` не импортируют `react`, `react-dom` и пути `src/ui`. Проверка MUST входить в `npm run verify`.

#### Scenario: React import in core

- **WHEN** в `src/core` появляется `import … from 'react'` или из `src/ui`
- **THEN** `npm run verify` падает
