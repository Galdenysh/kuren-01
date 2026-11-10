# Core

Чистый TypeScript. Без React и без импортов из `src/ui`.

```
src/core/nn      тензор, autograd, layers, mlp, trainer, snapshot, *.test.ts
src/core/agent   цикл цель → снимок → правило → инструменты trainer; *.test.ts
```

## Правила

- TDD: сначала падающий Vitest-тест, потом код — `src/core/nn/*.test.ts` для сети, `src/core/agent/*.test.ts` для агента
- Снимок для UI: `{ loss, weights, activations }` — plain data
- XOR-срез: MLP `2 → 2 → 1`. Не добавлять `transformer.ts`
- Агент среза `xor-training-agent`: правило и цикл в `src/core/agent`, без языковой модели
- **Идентификаторы** (имена файлов, типов, функций, переменных) — **английский**
- **JSDoc и комментарии** в `src/core/**` — **русский** (учебные пояснения для человека; не переводить в английский)

## Запрещено

- PyTorch, TensorFlow, ONNX, Hugging Face, brain.js, synaptic
- импорт `react` или `src/ui` (`npm run core:imports`)
- языковая модель, tokenizer, transformer, внешний LLM API в учебных срезах XOR
