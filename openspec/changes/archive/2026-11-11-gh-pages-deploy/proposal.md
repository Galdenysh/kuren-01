# Proposal

## Why

Лабораторию XOR хотят открыть по постоянной ссылке без локального `npm run dev`. Репозиторий на GitHub (`Galdenysh/kuren-01`), CI пока нет. Нужен предсказуемый деплой на GitHub Pages после слияния PR в `main`.

## What Changes

- `base` Vite для project site: `/kuren-01/` (ассеты не ломаются на `*.github.io/kuren-01/`).
- GitHub Actions: на **pull_request → main** — `npm ci` + `npm run verify`; на **push → main** — то же и публикация в GitHub Pages (`actions/deploy-pages`).
- В настройках репозитория: Source = GitHub Actions (ручной шаг один раз).
- Обновить `README.md`: ссылка на стенд `https://galdenysh.github.io/kuren-01/` и как устроен релиз.

## Capabilities

### New Capabilities

- `deployment`: CI verify и выкладка статики на GitHub Pages.

### Modified Capabilities

(нет)

## Impact

- `vite.config.ts`, `.github/workflows/*.yml`, `README.md` (если есть)
- Секреты не нужны (OIDC + `permissions` pages)
- Вне среза: Netlify/Vercel, preview deploy на каждый PR, custom domain, версионирование релизов npm
