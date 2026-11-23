# Spec Delta

## MODIFIED Requirements

### Requirement: Core has no UI

Доменная логика MUST жить в `src/core` и MUST NOT импортировать React, `src/ui` или DOM-API ради обучения сети.

#### Scenario: Neural net module

- **WHEN** агент добавляет слой MLP, trainer или агентный цикл
- **THEN** файлы MLP и trainer лежат в `src/core/nn`, агентный цикл в `src/core/agent`, и они не импортируют `react`

#### Scenario: Shared tensor module

- **WHEN** агент добавляет тензор, autograd, softmax или кросс-энтропию
- **THEN** файлы лежат в `src/core/tensor` и не импортируют `react`, `src/core/nn` или `src/core/lm`

#### Scenario: Character model module

- **WHEN** агент добавляет символьную модель, которая продолжает короткий текст
- **THEN** файлы лежат в `src/core/lm`, импортируют тензор из `src/core/tensor`, не импортируют `src/core/nn` и не импортируют `react`
