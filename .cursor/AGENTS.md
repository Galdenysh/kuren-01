# Cursor

Закон проекта — вложенные `AGENTS.md` и OpenSpec, не `.cursor/rules`.
`.cursor/rules` — адаптер Cursor: какие `AGENTS.md` открыть. Не копируй туда цикл среза.

Skill — плейбук Cursor (`/имя`). Вне Cursor тот же цикл: `npx openspec` и `openspec/AGENTS.md`.
Grok в Cursor может не открыть `SKILL.md`. Не клади туда то, без чего нельзя работать.

## Если skill нужен

- путь: `.cursor/skills/<kebab-name>/SKILL.md`
- `name`: строчные буквы, цифры, дефисы
- `description`: английский, третье лицо, **что** делает и **когда** вызывать; без «I can» / «You can»
- тело короткое, без копипасты `AGENTS.md`
- не переписывай `.cursor/skills/openspec-*` — их ставит CLI
- новый `AGENTS.md` или skill сразу пропиши в корневой `AGENTS.md`, затем `npm run agents:check`
- после любой правки skills или вложенных `AGENTS.md` агент сам запускает `npm run agents:check` и не заканчивает, пока он красный
- done-gate каркаса: `npm run verify`

Плохо: skill «как устроен проект». Хорошо: skill «как выпустить релиз», который зовут `/release`.
