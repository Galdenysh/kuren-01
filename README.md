# Kuren-01

Учебная нейросеть на TypeScript + React: смотришь, как MLP `2 → 2 → 1` учится XOR, и как простой **агент по правилу** решает «учить или стоп» — без языковой модели.

**<a href="https://galdenysh.github.io/kuren-01/" target="_blank" rel="noopener noreferrer">Стенд</a>** — лаборатория в браузере (GitHub Pages).

Математика в `src/core`, экран в `src/ui`. Отдельного бэкенда нет.

## Деплой

После merge в `main` workflow **Deploy** собирает сайт и выкладывает его на Pages. Один раз в репозитории: **Settings → Pages → Build and deployment → Source: GitHub Actions**. URL стенда: `https://galdenysh.github.io/kuren-01/`. На pull request в `main` workflow **Verify** гоняет `npm run verify` без публикации.

## Запуск

Нужен Node.js **>= 20.19** (см. `.nvmrc`, обычно 22).

```bash
npm install
npm run verify   # тесты, lint, build
```

В Cursor: **Terminal → Run Task… → Dev** (`⇧⌘B`). Лабораторию открой в браузере после старта dev.

## Слои

| Путь             | Назначение                                |
| ---------------- | ----------------------------------------- |
| `src/core/nn`    | Тензор, autograd, MLP, trainer, снимок    |
| `src/core/agent` | `RuleAgent`, правило, инструменты trainer |
| `src/ui/lab`     | Лаборатория и панель агента (React)       |

Правила: корневой [`AGENTS.md`](AGENTS.md) — индекс; детали в `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`.

## На экране

- Заголовок, **агент** (шаг / серия / авто до цели, лог и настройки цели).
- Схема сети, график loss, веса, выбор входа XOR, **сброс сети** (seed 42).

## OpenSpec

Живые спеки: `openspec/specs/nn-core`, `training-lab`, `training-agent`.

Архив срезов: `openspec/changes/archive/` (`xor-training-lab`, `xor-training-agent`, `training-ui-spec-sync`, …).

Новый срез: `/opsx-propose`, применение после ревью `proposal.md` и `design.md`.

## Плагин (опционально)

Cursor Marketplace → **pstack**. По желанию **teaching**.
