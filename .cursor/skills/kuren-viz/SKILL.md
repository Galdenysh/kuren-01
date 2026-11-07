---
name: kuren-viz
description: Builds the Kuren-01 React lab that shows neurons, activations, weights, and loss. Use when working in src/viz, src/app, training UI, charts, or network graphs.
---

# Kuren-01 visualization

## Rules

- React **displays** trainer snapshots. Training math stays in `src/nn`.
- The lab must show, at minimum: network graph, activations, weights, loss over steps.
- UI copy is Russian. Code identifiers are English.
- Step training from the UI: one step and a short series of steps.
- Do not fetch a remote model or draw a fake network with random CSS that is not tied to `src/nn`.

## Layout

```
src/viz/
  NetworkGraph.tsx
  LossChart.tsx
  WeightView.tsx
  TrainingLab.tsx
```

Wire the lab into the existing app shell. Do not rebuild Vite from scratch.

## Check

- After Train, activations and loss change on screen
- `npm run build` passes
