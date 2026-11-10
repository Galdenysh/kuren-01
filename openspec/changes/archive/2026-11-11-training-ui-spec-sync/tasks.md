# Tasks

Группа `## N.` — стоп на ревью. После ревью `proposal.md` и `design.md` — apply.

## 1. Сверка UI

- [x] 1.1 Пройти чеклист против `openspec/changes/training-ui-spec-sync/specs/`: нет ручного train в `TrainingLab`; панель агента над лабораторией; свёртка, цель в развёрнутом виде, «Авто до цели»; сброс сети. При расхождении — минимальная правка UI. Проверка: чеклист в отчёте, `npm run build` зелёный.
- [x] 1.2 В `AGENTS.md`, `openspec/AGENTS.md`, `openspec/config.yaml` указать активный change `training-ui-spec-sync`. Проверка: `npm run agents:check` зелёный, формулировки согласованы.

## 2. Done gate

- [x] 2.1 `npm run verify`, код 0.
- [x] 2.2 Пользователь: Run Task → Dev; сброс сети и шаг агента двигают loss и схему. Сервер не поднимать агентом.

## Workflow follow-up

- Архив change и sync спек после ревью готового среза.
