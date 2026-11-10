# deployment Specification

## Purpose

Автоматическая проверка и публикация учебной лаборатории на GitHub Pages из ветки `main`.

## Requirements

### Requirement: Pull requests to main are verified

Для pull request с целевой веткой `main` CI MUST запустить `npm ci` и `npm run verify` и MUST NOT публиковать сайт.

#### Scenario: PR opened or updated

- **WHEN** открыт или обновлён pull request в `main`
- **THEN** workflow проверки завершается с кодом 0 только если `npm run verify` зелёный

### Requirement: Main publishes GitHub Pages

Для push в `main` CI MUST собрать production-бандл и MUST опубликовать содержимое `dist/` в GitHub Pages.

#### Scenario: Merge to main

- **WHEN** изменения попали в `main` через push (включая merge PR)
- **THEN** GitHub Pages отдаёт новый статический сайт с актуальной сборкой

### Requirement: Project site base path

Production-сборка для GitHub Pages MUST использовать base path `/kuren-01/`, чтобы ассеты грузились на project URL.

#### Scenario: Built index references repo base

- **WHEN** CI собирает сайт для Pages
- **THEN** ссылки на скрипты и стили в `index.html` начинаются с `/kuren-01/`

### Requirement: Local dev keeps root base

Локальная сборка и dev без `VITE_BASE_PATH` MUST использовать `base` `/`, чтобы `npm run dev` работал с корня.

#### Scenario: Developer runs dev server

- **WHEN** разработчик запускает dev без переменной base
- **THEN** приложение открывается с путями от `/`, без префикса репозитория
