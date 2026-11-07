# Design

## Context

См. proposal.md — Why. Сейчас Vite-оболочка, `PLAN.md` и слоты `src/nn`, `src/viz`, `src/agent`. Модели нет — структуру менять дёшево.

## Goals / Non-Goals

**Goals:**

- Одна ось: `core` (чистый TS) vs `ui` (React)
- OpenSpec вместо `PLAN.md`
- Цикл агента: design → plan → TDD → done-gate
- Vitest готов к тестам ядра

**Non-Goals:**

- Полный FSD (`app/pages/widgets/features/entities/shared` на весь репозиторий)
- Реализация XOR / autograd
- jsdom-тесты лаборатории в этом срезе

## Decisions

1. **Не FSD как основной каркас.**  
   Feature-Sliced Design режет UI-продукт по экранам и фичам. Здесь главная граница — «математика не знает про React». Тензор в `entities` или `shared` только путает. FSD можно позже включить *внутри* `src/ui`, если появятся несколько экранов.

2. **Дерево**

   ```
   src/core/nn      математика сети
   src/core/agent   будущий агентный цикл
   src/ui/app       оболочка
   src/ui/lab       лаборатория обучения
   src/main.tsx     вход Vite
   ```

   Альтернатива «всё по фичам» (`training-lab/` со смешанным TS+React) отвергнута: UI снова протечёт в ядро.

3. **Контракт — снимок, не классы тензора.**  
   `ui` получает plain data. Так тесты ядра не тащат React.

4. **Vitest, environment node.**  
   Ядро — чистые функции. jsdom добавит следующий агент, если понадобятся тесты UI.

5. **PLAN.md удаляется, не архивируется в docs.**  
   Иначе снова появится второй план.

## Risks / Trade-offs

- [Агент всё равно начнёт с UI] → tasks XOR идут red-тестами ядра первыми, skill `kuren-handoff` запрещает UI до зелёного ядра
- [Путаница FSD vs FDS] → в spec явно: полный FSD не главная ось
- [Два активных change] → этот срез архивируется сразу после применения, в работе остаётся `xor-training-lab`
