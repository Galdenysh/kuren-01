# AGENTS

Kuren-01 — учебная нейросеть. Правила лежат во вложенных `AGENTS.md`, не здесь и не в `.cursor/rules`.
Цикл среза — `openspec/AGENTS.md` в любой области. `.cursor/rules` — адаптер Cursor. Вне Cursor: те же файлы и `npx openspec`.

Перед кодом открой файл области:

| Область                         | Файл                                     |
| ------------------------------- | ---------------------------------------- |
| Цикл среза, OpenSpec, done-gate | [openspec/AGENTS.md](openspec/AGENTS.md) |
| Ядро сети, TDD, XOR             | [src/core/AGENTS.md](src/core/AGENTS.md) |
| Лаборатория, React              | [src/ui/AGENTS.md](src/ui/AGENTS.md)     |
| Skills и Cursor                 | [.cursor/AGENTS.md](.cursor/AGENTS.md)   |

OpenSpec-skills (вызов `/opsx-*`):

- [.cursor/skills/openspec-explore/SKILL.md](.cursor/skills/openspec-explore/SKILL.md) — `/opsx-explore`
- [.cursor/skills/openspec-propose/SKILL.md](.cursor/skills/openspec-propose/SKILL.md) — `/opsx-propose`
- [.cursor/skills/openspec-apply-change/SKILL.md](.cursor/skills/openspec-apply-change/SKILL.md) — `/opsx-apply`
- [.cursor/skills/openspec-update-change/SKILL.md](.cursor/skills/openspec-update-change/SKILL.md) — `/opsx-update`
- [.cursor/skills/openspec-sync-specs/SKILL.md](.cursor/skills/openspec-sync-specs/SKILL.md) — `/opsx-sync`
- [.cursor/skills/openspec-archive-change/SKILL.md](.cursor/skills/openspec-archive-change/SKILL.md) — `/opsx-archive`

Индекс обязан покрывать все вложенные `AGENTS.md` и `SKILL.md`: `npm run agents:check`.

Активный change — `xor-training-agent` (apply). Архив `xor-training-lab`: `2026-11-10`.
