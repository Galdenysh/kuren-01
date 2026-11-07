---
name: kuren-nn
description: Implements Kuren-01 neural net code from scratch in TypeScript. Use when working in src/nn, autograd, tensors, MLP, trainer, XOR, or training loops.
---

# Kuren-01 neural net

## Rules

- All math lives in `src/nn` as TypeScript.
- Forbidden: PyTorch, TensorFlow, ONNX, Hugging Face, `brain.js`, `synaptic`, WebGPU ML kits, calling an external LLM as the model.
- Allowed: ordinary npm for tests, UI, and types.
- Export a snapshot the UI can read: loss, weights, activations. Do not make viz reach into private tensor fields.
- Keep the first net tiny: MLP `2 → 2 → 1` for XOR.
- Prefer explicit `forward` / `backward` over magic.

## Layout

```
src/nn/
  tensor.ts
  autograd.ts
  layers.ts
  mlp.ts
  trainer.ts
  snapshot.ts
```

Names may differ if the change says so. Do not add `src/nn/transformer.ts` during `xor-training-lab`.

## Check

- `npx tsc -b`
- XOR: four points correct at threshold 0.5 after training
- No new ML-runtime dependency in `package.json`
