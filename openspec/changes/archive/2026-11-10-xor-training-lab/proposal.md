# Proposal

## Why

Каркас уже есть, а учебного стенда нет: нельзя увидеть forward, backward и как сеть учит XOR. Это первый срез для следующего агента, а не задача каркаса.

## What Changes

- Свой крошечный тензор и autograd в `src/core/nn`, TDD-first
- MLP `2 → 2 → 1`, обучение на XOR, пока тесты не зелёные
- React-лаборатория в `src/ui/lab`: граф нейронов, активации, loss, шаг Train
- Оболочка `src/ui/app` показывает лабораторию вместо заглушки слотов
- Агентный цикл, transformer и языковая модель **вне скоупа**

## Capabilities

### New Capabilities

- `nn-core`: тензор, autograd, слои и trainer, которые можно открыть и проследить по числам
- `training-lab`: экран обучения, где видны сеть, активации и loss

### Modified Capabilities

- нет

## Impact

- `src/core/nn/**`, `src/ui/lab/**`, `src/ui/app/**`
- без новых ML-библиотек
- `src/core/agent` не трогать
