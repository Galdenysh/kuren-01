# Tasks

## 1. Спеки и config

- [x] 1.1 Укоротить `openspec/config.yaml`, процитировать YAML-строки с `: `. Проверка: `npx openspec validate finish-scaffold` без предупреждения про mapping в rules.tasks.
- [x] 1.2 Обновить alwaysApply-rule и `openspec/AGENTS.md`: индекс, verify, не прыгать в UI. Проверка: в rule есть xor-training-lab и запрет UI до тестов ядра.

## 2. Проверки

- [x] 2.1 Добавить `scripts/check-core-imports.mjs` и включить его в `npm run verify`. Проверка: скрипт зелёный на текущем дереве.
- [x] 2.2 Подделать в уме: если в `src/core` есть `from 'react'`, verify падает. Проверка: точечный прогон скрипта на фикстуре или временном файле, затем файл удалён.
- [x] 2.3 Перевести done-gate XOR на `npm run verify`. Проверка: в `xor-training-lab/tasks.md` нет «три команды» без verify.

## 3. Done gate

- [x] 3.1 Прогнать `npm run verify`. Проверка: код 0.
- [x] 3.2 Заархивировать `finish-scaffold`. Проверка: `npx openspec list` показывает только `xor-training-lab`.
