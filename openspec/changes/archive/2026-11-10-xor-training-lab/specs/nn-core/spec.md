# Spec Delta

## Purpose

Учебное ядро сети: тензор, autograd, слои и trainer, которые можно открыть и проследить по числам без внешних ML-рантаймов.

## ADDED Requirements

### Requirement: From-scratch tensor math

Система MUST выполнять тензорные операции внутри собственного TypeScript-кода в `src/core/nn`. Система MUST NOT подключать PyTorch, TensorFlow, ONNX, Hugging Face или другие рантаймы обученных моделей. Система MUST NOT импортировать React из этих модулей.

#### Scenario: No black-box ML runtime

- **WHEN** агент добавляет зависимость для обучения или inference
- **THEN** это не ML-рантайм, и математика сети остаётся в `src/core/nn`

### Requirement: Visible autograd

Система MUST считать градиенты через явный backward по графу операций. Значения тензоров и градиентов MUST быть доступны коду визуализации без разбора приватных полей фреймворка.

#### Scenario: Read weights after a step

- **WHEN** trainer делает один шаг обучения
- **THEN** визуализация может прочитать веса, активации и loss как обычные числа

### Requirement: XOR MLP trains

Система MUST обучать MLP с входом размера 2, одним скрытым слоем размера 2 и выходом размера 1 на четырёх точках XOR. После обучения предсказания MUST отделять два класса XOR лучше случайного угадывания.

#### Scenario: Four XOR points

- **WHEN** trainer прогоняет согласованное число шагов на `(0,0)=0`, `(0,1)=1`, `(1,0)=1`, `(1,1)=0`
- **THEN** loss падает относительно старта, и все четыре точки классифицируются правильно при пороге 0.5

### Requirement: Stepwise trainer

Система MUST уметь сделать ровно один шаг обучения по запросу UI. Система MUST отдавать снимок: loss, веса, активации последнего forward.

#### Scenario: Single train step

- **WHEN** UI запрашивает один шаг
- **THEN** trainer делает один forward, один backward, один update и возвращает снимок состояния
