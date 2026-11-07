# Spec Delta

## Purpose

Агенты ведут срез строго по схеме design → plan → TDD → проверки. «Готово» нельзя сказать по зелёному UI без тестов и сборки.

## ADDED Requirements

### Requirement: OpenSpec is the plan
Проект MUST хранить план и решения в OpenSpec. `PLAN.md` MUST NOT быть источником правды.

#### Scenario: Agent starts a session
- **WHEN** агент начинает работу
- **THEN** он читает `openspec/config.yaml`, активный change и `AGENTS.md`, а не ищет `PLAN.md`

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
Агент MUST NOT объявлять срез готовым, пока не прошли `npm test`, `npm run lint` и `npm run build`. Если менялся UI, агент MUST проверить экран в браузере.

#### Scenario: Claiming done
- **WHEN** агент пишет, что срез готов
- **THEN** в отчёте есть результаты test, lint, build, и для UI — проверка в браузере
