# Spec Delta

## MODIFIED Requirements

### Requirement: UI only renders snapshots

React-код MUST жить в `src/ui` и MUST получать состояние сети через публичный снимок из `src/core`, а не через приватные поля тензора.

#### Scenario: Lab screen

- **WHEN** агент рисует граф XOR, таблицу весов XOR или график loss XOR
- **THEN** код лежит в `src/ui/lab` и импортирует только публичный API `src/core`

#### Scenario: Character screen loss

- **WHEN** агент рисует число ошибки и хвост символьного снимка
- **THEN** код лежит в `src/ui/char` и импортирует только публичный API `src/core/lm`
