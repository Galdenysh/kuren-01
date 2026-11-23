# Spec Delta

## MODIFIED Requirements

### Requirement: From-scratch tensor math

Система MUST выполнять тензорные операции внутри собственного TypeScript-кода в `src/core/tensor`. Система MUST NOT подключать PyTorch, TensorFlow, ONNX, Hugging Face или другие рантаймы обученных моделей. Система MUST NOT импортировать React из этих модулей.

#### Scenario: No black-box ML runtime

- **WHEN** агент добавляет зависимость для обучения или inference
- **THEN** это не ML-рантайм, и математика тензора остаётся в `src/core/tensor`

#### Scenario: Softmax and cross-entropy

- **WHEN** тензор считает softmax по строке оценок и кросс-энтропию верного класса
- **THEN** вероятности положительны и в сумме дают 1, ошибка неотрицательна и падает, когда вероятность верного класса растёт, а градиент доходит до `backward`
