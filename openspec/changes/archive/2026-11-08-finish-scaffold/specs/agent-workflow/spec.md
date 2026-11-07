# Spec Delta

## MODIFIED Requirements

### Requirement: OpenSpec is the plan
Проект MUST хранить план и решения в OpenSpec. `PLAN.md` MUST NOT быть источником правды. Корневой `AGENTS.md` MUST быть только оглавлением. Правила области MUST жить во вложенных `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`, `.cursor/AGENTS.md`.

#### Scenario: Agent starts a session
- **WHEN** агент начинает работу
- **THEN** он читает корневой `AGENTS.md` как индекс, затем вложенный файл области, активный change и `openspec/config.yaml`, а не ищет `PLAN.md`

### Requirement: Done gate
Агент MUST NOT объявлять срез готовым, пока не прошёл `npm run verify` (`agents:check`, lint, test, build). Если менялся UI, агент MUST проверить экран в браузере только после того, как пользователь сам запустил Dev.

#### Scenario: Claiming done
- **WHEN** агент пишет, что срез готов
- **THEN** в отчёте есть `npm run verify`, и для UI — проверка в браузере

## ADDED Requirements

### Requirement: Agents index stays complete
Корневой `AGENTS.md` MUST упоминать каждый вложенный `AGENTS.md` и каждый проектный `SKILL.md`. `npm run agents:check` MUST падать, если индекс неполный или ссылка битая.

#### Scenario: New skill without index
- **WHEN** агент добавляет `.cursor/skills/foo/SKILL.md` и не пишет путь в корневой `AGENTS.md`
- **THEN** `npm run agents:check` завершается с ненулевым кодом

### Requirement: Apply the named change
Агент MUST реализовывать код модели только по задачам текущего OpenSpec change. Для первого среза это `xor-training-lab`. Агент MUST NOT писать `src/ui/lab`, пока тесты ядра этого среза красные или отсутствуют.

#### Scenario: Skipping to UI
- **WHEN** агента просят «сделать сеть» без `/opsx-apply`
- **THEN** он открывает `xor-training-lab` и идёт с падающих тестов в `src/core/nn`, а не с React
