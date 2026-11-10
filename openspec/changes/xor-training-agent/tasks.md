# Tasks

Группа `## N.` — стоп на ревью кода. Не начинать следующую, пока пользователь не сказал продолжать. Этот файл не выполнять, пока пользователь не принял `proposal.md` и `design.md`.

## 1. TDD ядра (red)

- [x] 1.1 Поправить закон области под этот срез, не трогая запрет tasks про `xor-training-lab` в `openspec/config.yaml`. В `src/core/AGENTS.md`: тесты агента — `src/core/agent/*.test.ts`, цикл живёт в `src/core/agent`, языковая модель и transformer по-прежнему запрещены. В корневом `AGENTS.md`, `openspec/AGENTS.md` и в context `openspec/config.yaml` активный change — `xor-training-agent`. Проверка: эти четыре файла говорят одно и то же, `npm run agents:check` зелёный, код агента ещё не написан.
- [x] 1.2 Написать падающий `src/core/agent/policy.test.ts` на `decideRule` без сети: loss выше порога и бюджет не кончился → `train`; loss не выше порога → стоп `goal_reached`; бюджет исчерпан при всё ещё высоком loss → стоп `step_limit`; при одновременно низком loss и нулевом бюджете причина — цель. Проверка: `npm test` падает на этом файле, реализации политики ещё нет.
- [x] 1.3 Написать падающий `src/core/agent/agent.test.ts` на реальном `Trainer` (`Mlp.xorMlp`, `XOR_DATASET`): `maxLoss: 1` → первый цикл стоп целью, веса те же; `maxLoss: 0` и `maxSteps: 2` → ровно два `train` и следом стоп `step_limit`; у цикла обучения снимок с `loss` / `weights` / `activations` снят до шага; в логе нет экземпляров `Tensor`. Проверка: `npm test` падает на этом файле, `src/core/nn` не изменён.

## 2. Ядро (green)

- [x] 2.1 Реализовать `decideRule` и типы цели в `src/core/agent`, без импорта `src/core/nn`. Проверка: `policy.test.ts` зелёный, `agent.test.ts` всё ещё красный.
- [x] 2.2 Реализовать `createTrainerTools` и `RuleAgent` (`cycle`, `run`) по design.md: инструменты только `forwardSnapshot` и `trainStep` с публичного индекса `src/core/nn`. Проверка: `agent.test.ts` и `policy.test.ts` зелёные, `src/core/nn/xor.test.ts` зелёный.
- [x] 2.3 Дописать `src/core/agent/README.md` по-русски: цикл цель → снимок → действие → инструмент и почему это не языковая модель. Проверка: файл описывает этот цикл, идентификаторы в коде английские.
- [x] 2.4 Прогнать границу импортов. Проверка: `npm run core:imports` зелёный, в `src/core/agent` нет `react`, `src/ui`, `tensor.ts`.

## 3. Лаборатория и лог

- [x] 3.1 Оставить один `Trainer` в `App` (`Mlp.xorMlp(42)`, `XOR_DATASET`) и передать его в `TrainingLab`. Ручные «Шаг» и «Серия шагов» остаются. Проверка: в `TrainingLab` нет своего `new Trainer`, `npm test` зелёный, `npm run build` зелёный. Сервер не поднимать.
- [x] 3.2 Добавить `AgentPanel` и `AgentPanel.module.css`: кнопки «Шаг агента» (один `cycle`) и «Серия циклов (50)» (не больше 50 и раньше, если правило остановилось), цель `{ maxLoss: 0.2, maxSteps: 200 }`, русский лог. История loss общая с лабораторией; граф после шага агента обновляется через `probeSnapshot` выбранного входа, не через активации снимка `trainStep`. Проверка: `npm run build` зелёный, панель не вызывает `run()` с кнопок, стили — CSS module, без Tailwind и CSS-in-JS. Сервер не поднимать.

## 4. Done gate

- [x] 4.1 Прогнать `npm run verify`. Проверка: код 0.
- [ ] 4.2 Попросить пользователя запустить Run Task → Dev и только потом открыть экран. Проверка: один цикл агента пишет русскую строку лога и двигает график loss; серия не длиннее 50 циклов; ручной «Шаг» всё ещё работает; смена входа на графе не подменяет активации чужой парой битов. Сервер самому не поднимать. В отчёт — что видно на экране.

## Workflow follow-up

- Архив change — отдельным шагом после ревью готового среза, не в этом apply.
