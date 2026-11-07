# Kuren-01

Учебная нейросеть на TypeScript + React. Практика, чтобы увидеть, как сеть учится, а не продукт «вместо GPT».

Каркас готов. Модель ещё не написана. План — в OpenSpec.

## Запуск

Нужен Node.js только как инструмент (npm, Vite, Vitest). Отдельного бэкенда нет: сеть учится в браузере в `src/core`, React это рисует.

В Cursor: **Terminal → Run Task… → Dev** (или `⇧⌘B`). Агенты сервер сами не поднимают.

Другие задачи: Test, Lint, Build, Verify.

```bash
npm install
```

Проверка каркаса: `npm run verify`. Dev — Run Task, не агентом.

## Слои

- `src/core/nn` — математика сети, без React
- `src/ui/lab` — лаборатория, только рисует снимок
- `src/core/agent` — позже, отдельным срезом

Агенты: корневой `AGENTS.md` — оглавление. Правила в `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`.

## Следующий срез

`openspec/changes/xor-training-lab`  
В Cursor: `/opsx-apply`

## Плагин

Cursor Marketplace → **pstack**. По желанию **teaching**.
