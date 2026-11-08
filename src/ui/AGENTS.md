# UI

React только рисует снимок из `src/core`. Математику сюда не тащить.

```
src/ui/app       оболочка, App, SlotCard, globals.css, *.module.css
src/ui/lab       NetworkGraph, LossChart, WeightView, TrainingLab — named exports
```

## Правила

- Писать лабораторию только после зелёных тестов ядра этого среза
- Не рисовать фейковую сеть: только числа из снимка
- UI-тексты на русском, идентификаторы на английском
- JSDoc и комментарии в `src/ui/**` — русский (как в [../core/AGENTS.md](../core/AGENTS.md))
- Полный FSD/FDS не использовать как ось репозитория. Если экранов станет много — FSD только внутри `src/ui`
- Стили: CSS modules рядом с компонентом. Токены и reset — `app/globals.css`. Без Tailwind и CSS-in-JS
- Не прятать математику сети в React state updaters

## Проверка

`npm run verify`. Браузер — после того, как пользователь запустил Run Task → Dev. Сервер сам не поднимать.
