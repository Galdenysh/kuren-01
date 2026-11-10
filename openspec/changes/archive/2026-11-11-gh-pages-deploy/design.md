# Design

## Context

См. proposal.md. Сборка: `npm run build` → `dist/`. SPA без серверного API. Репозиторий **project** pages, не user/org root.

## Goals / Non-Goals

**Goals:**

- После merge в `main` сайт обновляется автоматически.
- PR в `main` не публикует, но не даёт слить сломанный `verify`.
- Локально `base: '/'`, в CI `base: '/kuren-01/'`.

**Non-Goals:**

- Deploy с feature-веток, environment protection, lighthouse.
- Менять `src/core` / лабораторию.

## Decisions

1. **Триггеры.** `pull_request` на `main` — только verify. `push` на `main` — verify + deploy. Merge PR = push в `main`, деплой один раз. Альтернатива «deploy на каждый PR» отвергнута: нет preview-инфраструктуры.

2. **`base` через env.** В workflow: `VITE_BASE_PATH=/kuren-01/ npm run build`. В `vite.config.ts`: `base: process.env.VITE_BASE_PATH ?? '/'`. Альтернатива хардкода в config — хуже для локального preview.

3. **Официальный Pages workflow.** `actions/upload-pages-artifact` + `actions/deploy-pages`, `concurrency` group `pages` с `cancel-in-progress: false`. Альтернатива ветка `gh-pages` + `peaceiris/actions-gh-pages` — старее.

4. **Node.** `actions/setup-node` v4, `cache: npm`, версия из `engines` (20.x).

5. **Права workflow.** `permissions: contents: read, pages: write, id-token: write` только в job deploy.

## Risks / Trade-offs

- [Pages не включены в Settings] → в tasks шаг «включить GitHub Actions» и проверка первого деплоя.
- [Первая сборка с неверным base] → smoke: в build job проверить, что `dist/index.html` ссылается на `/kuren-01/assets/…`.

## Migration Plan

Смержить apply → настроить Pages → дождаться зелёного workflow → открыть URL. Откат: отключить workflow или `base` обратно.

## Open Questions

- Custom domain? (пока нет)
