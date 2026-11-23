# Core

Чистый TypeScript. Без React и без импортов из `src/ui`.

```
src/core/tensor  тензор, autograd, softmax, кросс-энтропия; тесты в *.test.ts
src/core/nn      MLP, trainer, снимок XOR; *.test.ts
src/core/agent   цикл цель → снимок → правило → инструменты trainer; *.test.ts
src/core/lm      символьная модель: корпус, окно, продолжение; *.test.ts
```

Пакеты `tensor`, `nn`, `agent` и `lm` лежат рядом. `nn` и `lm` импортируют тензор из `tensor` и не импортируют друг друга.

## Правила

- TDD: сначала падающий Vitest-тест, потом код — `src/core/tensor/*.test.ts` для тензора (не `src/core/nn/*.test.ts`), `src/core/nn/*.test.ts` для сети XOR, `src/core/agent/*.test.ts` для агента, `src/core/lm/*.test.ts` для языковой модели
- Снимок XOR для UI: `{ loss, weights, activations }` — plain data
- XOR-срез: MLP `2 → 2 → 1`. Не добавлять `transformer.ts`
- Агент среза `xor-training-agent`: правило и цикл в `src/core/agent`, без языковой модели
- **Идентификаторы** (имена файлов, типов, функций, переменных) — **английский**
- **JSDoc и комментарии** в `src/core/**` — **русский** (учебные пояснения для человека; не переводить в английский)

## Запрещено

- PyTorch, TensorFlow, ONNX, Hugging Face, brain.js, synaptic
- импорт `react` или `src/ui` (`npm run core:imports`)
- языковая модель, tokenizer, transformer, внешний LLM API в учебных срезах XOR
