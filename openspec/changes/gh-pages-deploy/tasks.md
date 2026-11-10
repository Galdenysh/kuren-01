# Tasks

Стоп после каждого `##`. После ревью `proposal.md` и `design.md` — apply.

## 1. Сборка под Pages

- [ ] 1.1 Добавить `base` в `vite.config.ts` из `VITE_BASE_PATH` (дефолт `/`). Проверка: локально `npm run build` и `npm run dev` без префикса; `VITE_BASE_PATH=/kuren-01/ npm run build` — в `dist/index.html` пути с `/kuren-01/`.

## 2. GitHub Actions

- [ ] 2.1 Workflow `verify` на `pull_request` → `main`: checkout, setup-node 20, `npm ci`, `npm run verify`. Проверка: YAML валиден, в job нет deploy-pages.
- [ ] 2.2 Workflow `deploy` на `push` → `main`: verify, build с `VITE_BASE_PATH=/kuren-01/`, upload-pages-artifact, deploy-pages, concurrency `pages`. Проверка: permissions и environment `github-pages` по доке GitHub.

## 3. Документация и ручной шаг

- [ ] 3.1 Обновить корневой `README.md`: заметная ссылка **«Стенд»** / **«Демо»** на `https://galdenysh.github.io/kuren-01/` (открывается в новой вкладке), коротко — деплой после merge в `main`, один раз включить Pages → GitHub Actions. Убрать устаревшие формулировки про «модель не написана». Проверка: в README есть кликабельный URL стенда и текст согласован с design.
- [ ] 3.2 После merge: в Settings → Pages source = GitHub Actions; дождаться зелёного run; сайт открывается. Проверка: пользователь подтверждает в отчёте (агент сервер не поднимает).

## 4. Done gate

- [ ] 4.1 `npm run verify` локально, код 0.
- [ ] 4.2 PR с workflows в `main`, оба workflow зелёные, Pages живой URL.

## Workflow follow-up

- Архив change после ревью среза.
