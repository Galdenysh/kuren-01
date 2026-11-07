# Design

## Context

См. proposal.md — Why. OpenSpec propose уже пишет все артефакты разом. Меняем не схему CLI, а поведение агента.

## Goals / Non-Goals

**Goals:**

- Стоп между propose и apply
- Явный ок на proposal + design

**Non-Goals:**

- Менять OpenSpec CLI / generated skills
- Обязательное ревью `tasks.md` и `specs/` (пользователь назвал два файла)
- Реализация XOR

## Decisions

1. **Propose пишет `tasks.md`, apply его выполняет.**  
   Иначе сломаем spec-driven schema. Ревью — про why/how, не про чеклист.

2. **Сигнал ревью — в этом чате.**  
   Не заводим отдельный файл `REVIEWED.md`.

3. **`/opsx-apply` после ревью считается ок.**  
   Если пользователь зовёт apply, не переспрашивать третий раз.

## Risks / Trade-offs

- [Агент сочтёт любое «делай» за ревью] → в spec: без ревью именно proposal и design — стоп
