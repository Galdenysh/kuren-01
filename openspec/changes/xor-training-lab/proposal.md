# Proposal

## Why

Каркас уже есть, а учебного стенда нет: нельзя увидеть forward, backward и как сеть учит XOR. Это первый срез для следующего агента, а не задача каркаса.

## What Changes

- Свой крошечный тензор и autograd в `src/nn`
- MLP `2 → 2 → 1`, обучение на XOR
- React-лаборатория в `src/viz`: граф нейронов, активации, loss, шаг Train
- Оболочка `src/app` показывает лабораторию вместо заглушки слотов
- Агентный цикл, transformer и языковая модель **вне скоупа**

## Capabilities

### New Capabilities

- `nn-core`: тензор, autograd, слои и trainer, которые можно открыть и проследить по числам
- `training-lab`: экран обучения, где видны сеть, активации и loss

### Modified Capabilities

- нет

## Impact

- `src/nn/**`, `src/viz/**`, `src/app/**` / `src/App.tsx`
- без новых ML-библиотек
- `src/agent` не трогать
