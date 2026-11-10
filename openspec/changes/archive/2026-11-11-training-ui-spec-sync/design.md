# Design

## Context

См. proposal.md. UI уже реализован после `xor-training-agent`; срез выравнивает главные спеки с экраном.

## Goals / Non-Goals

**Goals:**

- Зафиксировать в спеках: агент сверху, без ручного train в lab, сброс, свёртка, «Авто до цели», редактируемая цель.

**Non-Goals:**

- Менять `RuleAgent` / `Trainer` контракты, добавлять тесты на UI, откатывать UI.

## Decisions

1. **Doc-first apply.** Сначала сверка кода со спекой; правки кода только при расхождении.
2. **Сброс в `App`.** Новый `Trainer` + новый `RuleAgent` + `sessionId` для сброса лога; без API в ядре.
3. **`run()` на кнопке «Авто до цели».** Допустимо в UI: стоп по правилу/бюджету; серия по-прежнему capped 50.

## Risks / Trade-offs

- [Спека опережает мелкий UI-drift] → чеклист в tasks при apply.
- [Двойная дата в archive] → обычный `openspec archive`.

## Migration Plan

Только merge спек; поведение для пользователя не меняется.

## Open Questions

Нет.
