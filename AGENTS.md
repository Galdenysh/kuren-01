# AGENTS

Kuren-01 — учебная нейросеть и позже агент. Практика, не конкурент GPT/Claude.

Каркас уже поднят. **Не пиши модель целиком в одной сессии.**

## Перед работой

1. Прочитай `PLAN.md`.
2. Открой текущий срез: `npx openspec list` и `npx openspec status --change xor-training-lab`.
3. Реализуй только этот срез: `/opsx-apply` или skill `openspec-apply-change`.
4. Skills: `kuren-handoff`, `kuren-nn`, `kuren-viz`.

## Слоты

| Путь        | Сейчас     | Кто заполняет              |
| ----------- | ---------- | -------------------------- |
| `src/nn`    | пусто      | агент среза `xor-training-lab` |
| `src/viz`   | пусто      | тот же срез                |
| `src/agent` | пусто      | отдельный будущий срез     |
| `src/app`   | оболочка   | можно подключить лабораторию |

## Запрещено

- ML-рантаймы: PyTorch, TensorFlow, ONNX, Hugging Face, brain.js, synaptic
- transformer / LM / агентный цикл в срезе XOR
- коммит и git remote, пока пользователь не попросил

## Стек

TypeScript, React, Vite. `npm run dev`, `npm run build`.

## Плагин для Grok / Composer

Агент не может поставить Marketplace-плагин за пользователя.

1. Cursor → **Marketplace**
2. Поставить **pstack** (основной: меньше кода, проверяемые шаги)
3. По желанию **teaching** (учебные сессии)

После установки перезапусти Cursor. Grok 4.6 и Composer работают с pstack без отдельного «Grok-only» плагина.
