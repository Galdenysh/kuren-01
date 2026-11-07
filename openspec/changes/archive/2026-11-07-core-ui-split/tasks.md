# Tasks

## 1. Слои и OpenSpec

- [x] 1.1 Перенести слоты в `src/core/nn`, `src/core/agent`, `src/ui/app`, `src/ui/lab` и удалить старые `src/nn`, `src/viz`, `src/agent`, `src/app`. Проверка: дерево существует, `src/App.tsx` больше не точка входа.
- [x] 1.2 Удалить `PLAN.md` и перенести правила в `openspec/config.yaml` и `AGENTS.md`. Проверка: в репозитории нет `PLAN.md`, README ссылается на OpenSpec.
- [x] 1.3 Обновить `xor-training-lab` на новые пути и TDD-порядок задач. Проверка: `npx openspec validate xor-training-lab` проходит.

## 2. Цикл агента и тесты

- [x] 2.1 Поставить Vitest и скрипт `npm test`. Проверка: `npm test` завершается кодом 0 при нуле тестов модели.
- [x] 2.2 Обновить skills/rules: design → plan → TDD → done-gate, `core` не импортирует `ui`. Проверка: в `AGENTS.md` и `kuren-handoff` нет отсылок к `PLAN.md` и `src/nn`.
- [x] 2.3 Прогнать `npm test`, `npm run lint`, `npm run build` и открыть оболочку в браузере. Проверка: все три команды зелёные, на экране пути `src/core/*` и `src/ui/*`.
