# agent-workflow Specification

## Purpose
Агенты ведут срез строго по схеме propose → ревью proposal/design → apply/`tasks.md` → TDD → проверки. «Готово» нельзя сказать по зелёному UI без тестов и сборки.

## Requirements

### Requirement: OpenSpec is the plan
Проект MUST хранить план и решения в OpenSpec. `PLAN.md` MUST NOT быть источником правды. Корневой `AGENTS.md` MUST быть только оглавлением. Правила области MUST жить во вложенных `openspec/AGENTS.md`, `src/core/AGENTS.md`, `src/ui/AGENTS.md`, `.cursor/AGENTS.md`.

#### Scenario: Agent starts a session
- **WHEN** агент начинает работу
- **THEN** он читает корневой `AGENTS.md` как индекс, затем вложенный файл области, активный change и `openspec/config.yaml`, а не ищет `PLAN.md`

### Requirement: Design before code
Агент MUST NOT писать код среза, пока у change нет `design.md` и `tasks.md`.

#### Scenario: Apply without design
- **WHEN** change не имеет design или tasks
- **THEN** агент сначала дописывает артефакты и не начинает реализацию

### Requirement: TDD for core
Поведение в `src/core` MUST сначала описываться падающим тестом, затем кодом, пока тест не станет зелёным. UI MUST начинаться только после зелёных тестов ядра этого среза.

#### Scenario: XOR slice
- **WHEN** агент делает `xor-training-lab`
- **THEN** сначала тесты тензора/autograd/XOR, потом реализация `src/core/nn`, потом `src/ui/lab`

### Requirement: Done gate
Агент MUST NOT объявлять срез готовым, пока не прошёл `npm run verify` (`agents:check`, lint, test, build). Если менялся UI, агент MUST проверить экран в браузере только после того, как пользователь сам запустил Dev.

#### Scenario: Claiming done
- **WHEN** агент пишет, что срез готов
- **THEN** в отчёте есть `npm run verify`, и для UI — проверка в браузере

### Requirement: User owns the dev server
Агент MUST NOT запускать `vite`, `npm run dev` или другие долгоживущие серверы, если пользователь явно не попросил это в текущем сообщении. Пользователь запускает приложение через Run Task → Dev.

#### Scenario: UI needs a running app
- **WHEN** агенту нужна проверка в браузере, а сервер не запущен
- **THEN** он просит пользователя запустить Dev и не поднимает процесс сам

### Requirement: Agents index stays complete
Корневой `AGENTS.md` MUST упоминать каждый вложенный `AGENTS.md` и каждый проектный `SKILL.md`. `npm run agents:check` MUST падать, если индекс неполный или ссылка битая.

#### Scenario: New skill without index
- **WHEN** агент добавляет `.cursor/skills/foo/SKILL.md` и не пишет путь в корневой `AGENTS.md`
- **THEN** `npm run agents:check` завершается с ненулевым кодом

### Requirement: Human review before apply
Агент MUST NOT выполнять задачи из `tasks.md` и MUST NOT писать код среза, пока пользователь в этом разговоре явно не принял `proposal.md` и `design.md`. Допустимые сигналы: ок на эти файлы, «ревью ок», `/opsx-apply` после ревью. Написание самих артефактов propose (включая черновик `tasks.md`) MAY происходить до ревью.

#### Scenario: Propose just finished
- **WHEN** агент создал `proposal.md` и `design.md`
- **THEN** он останавливается, указывает пути файлов и ждёт ревью; код и чекбоксы `tasks.md` не трогает

#### Scenario: Apply without review
- **WHEN** агента просят «просто сделай» по срезу, который пользователь ещё не ревьюил
- **THEN** агент не начинает `tasks.md` и просит сначала прочитать `proposal.md` и `design.md`

### Requirement: Apply the named change
Агент MUST реализовывать код модели только по задачам текущего OpenSpec change, и только после ревью `proposal.md` и `design.md`. Для первого среза это `xor-training-lab`. Агент MUST NOT писать `src/ui/lab`, пока тесты ядра этого среза красные или отсутствуют.

#### Scenario: Skipping to UI
- **WHEN** агента просят «сделать сеть» без ревью и без `/opsx-apply`
- **THEN** он открывает `xor-training-lab`, указывает `proposal.md` и `design.md` и ждёт ревью, а не пишет тесты или React
