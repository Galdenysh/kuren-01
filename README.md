# Kuren-01

Учебная нейросеть на TypeScript и React. На экране XOR сеть `2 → 2 → 1` учит XOR, а **агент по правилу** решает «учить или стоп». На экране «Символы» маленькая модель заучивает короткий текст и дописывает хвост.

**<a href="https://galdenysh.github.io/kuren-01/" target="_blank" rel="noopener noreferrer">Стенд</a>** — лаборатория в браузере (GitHub Pages).

Математика в `src/core`, экран в `src/ui`. Отдельного бэкенда нет.

## Деплой

Стенд на GitHub Pages, деплой через GitHub Actions: после merge в `main` workflow **Deploy** обновляет [https://galdenysh.github.io/kuren-01/](https://galdenysh.github.io/kuren-01/). На pull request в `main` workflow **Verify** гоняет `npm run verify` без публикации.

## Запуск

Нужен Node.js **>= 20.19** (см. `.nvmrc`, обычно 22).

```bash
npm install
npm run verify   # тесты, lint, build
```

В Cursor: **Terminal → Run Task… → Dev** (`⇧⌘B`). Лабораторию открой в браузере после старта dev.

## Слои

| Путь              | Назначение                                |
| ----------------- | ----------------------------------------- |
| `src/core/tensor` | Тензор и autograd                         |
| `src/core/nn`     | MLP, trainer, снимок XOR                  |
| `src/core/agent`  | `RuleAgent`, правило, инструменты trainer |
| `src/core/lm`     | Символьная модель: короткий текст         |
| `src/ui/app`      | Оболочка и переключатель экранов          |
| `src/ui/lab`      | Лаборатория XOR и панель агента           |
| `src/ui/char`     | Экран символьной модели                   |

Правила: корневой [`AGENTS.md`](AGENTS.md) — индекс; детали в `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`.

## На экране

Переключатель **XOR** / **Символы**. При открытии виден XOR. Лаборатория остаётся смонтированной, поэтому возврат сохраняет веса, график, лог агента и выбранный вход.

**XOR**

- **Агент**: шаг, серия, авто до цели, лог и настройки цели.
- Схема сети, график loss, веса, выбор входа, **сброс сети** (seed 42).

**Символы**

- Учебный текст можно править. Поле «Начало», число ошибки и хвост из снимка.
- **Шаг**, **Обучить** (4000 шагов) и **сброс** весов. Сброс оставляет текст в поле. Если окон нет, шаг и обучение недоступны.

## OpenSpec

Живые спеки: `openspec/specs/nn-core`, `char-lm`, `char-lab`, `training-lab`, `training-agent`, `project-layout`, `agent-workflow`, `deployment`.

Архив срезов: `openspec/changes/archive/` (`xor-training-lab`, `xor-training-agent`, `training-ui-spec-sync`, `gh-pages-deploy`, `char-lm`, `char-lab`, `editable-corpus`, …).

Новый срез: `/opsx-propose`, применение после ревью `proposal.md` и `design.md`.

## Плагин (опционально)

Cursor Marketplace → **pstack**. По желанию **teaching**.
