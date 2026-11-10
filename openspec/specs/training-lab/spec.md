# training-lab Specification

## Purpose
Экран лаборатории, где видно, как крошечная сеть учит XOR: слои, активации, веса и график loss.

## Requirements

### Requirement: Lab shows live network

Лаборатория MUST показать граф MLP `2 → 2 → 1` и текущие активации нейронов после последнего forward.

#### Scenario: Activations after a step

- **WHEN** пользователь нажимает Train
- **THEN** граф обновляет активации без перезагрузки страницы

### Requirement: Lab shows weights and loss

Лаборатория MUST показать веса рёбер или матриц и график loss по шагам.

#### Scenario: Loss chart grows

- **WHEN** пользователь делает несколько шагов Train
- **THEN** график добавляет точку loss на каждый шаг

### Requirement: Manual stepping

Лаборатория MUST дать запустить один шаг и серию шагов. Этот экран MUST появляться только после зелёных тестов `src/core/nn` в этом срезе.

#### Scenario: Train button

- **WHEN** лаборатория открыта и trainer готов
- **THEN** кнопка Train делает один шаг и обновляет граф, веса и loss

### Requirement: Russian UI

Весь пользовательский текст лаборатории MUST быть на русском. Имена в коде MUST оставаться на английском.

#### Scenario: Visible copy

- **WHEN** пользователь открывает лабораторию
- **THEN** заголовки, кнопки и подписи на русском
