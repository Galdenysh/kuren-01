# Core

Чистый TypeScript. Без React и без импортов из `src/ui`.

```
src/core/nn      тензор, autograd, layers, mlp, trainer, snapshot, *.test.ts
src/core/agent   агентный цикл — не трогать в xor-training-lab
```

## Правила

- TDD: сначала падающий Vitest-тест в `src/core/nn/*.test.ts`, потом код
- Снимок для UI: `{ loss, weights, activations }` — plain data
- XOR-срез: MLP `2 → 2 → 1`. Не добавлять `transformer.ts`
- **Идентификаторы** (имена файлов, типов, функций, переменных) — **английский**
- **JSDoc и комментарии** в `src/core/**` — **русский** (учебные пояснения для человека; не переводить в английский)

## Запрещено

- PyTorch, TensorFlow, ONNX, Hugging Face, brain.js, synaptic
- импорт `react` или `src/ui` (`npm run core:imports`)
- агентный цикл и LM в срезе XOR
