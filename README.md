# Kuren-01

Учебная нейросеть на TypeScript + React. Практика, чтобы увидеть, как сеть учится, а не продукт «вместо GPT».

Каркас готов. Модель ещё не написана. План — в OpenSpec.

## Запуск

Нужен Node.js **>= 20.19** (в `.nvmrc` стоит 22). Vite 8 на 18 не стартует. Отдельного бэкенда нет: сеть учится в браузере в `src/core`, React это рисует.

В Cursor: **Terminal → Run Task… → Dev** (или `⇧⌘B`). Агенты сервер сами не поднимают.

Другие задачи: Test, Lint, Format, Build, Verify.

```bash
npm install
```

Проверка каркаса: `npm run verify`. Dev — Run Task, не агентом.

## Слои

- `src/core/nn` — математика сети, без React
- `src/ui/lab` — лаборатория, только рисует снимок
- `src/core/agent` — позже, отдельным срезом

Агенты: корневой `AGENTS.md` — оглавление. Правила в `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`.

## Срез XOR (готово)

Архив: `openspec/changes/archive/2026-11-10-xor-training-lab`  
Спеки: `openspec/specs/nn-core`, `openspec/specs/training-lab`  
Следующий срез: `/opsx-propose`

## Плагин

Cursor Marketplace → **pstack**. По желанию **teaching**.
