# OpenSpec

Один change за сессию. Не пиши модель целиком.

## Цикл

1. Propose — `proposal.md`, specs, `design.md`, черновик `tasks.md`
2. СТОП — пользователь ревьюит `proposal.md` и `design.md`
3. Apply / `tasks.md` — только после явного ок или `/opsx-apply` после ревью
4. TDD ядра — падающий тест, потом код
5. UI — только после зелёных тестов ядра
6. Готово — `npm run verify`. UI в браузере только если пользователь сам запустил Dev

Перед кодом: `npx openspec list` и `npx openspec status --change <name>`.

Следующий срез: `xor-training-lab` через `/opsx-apply` после ревью его `proposal.md` и `design.md`. Не начинать с React.

## Запрещено

- поднимать `vite` / `npm run dev` без явной просьбы в этом сообщении. Сервер — Run Task → Dev
- коммит и git remote, пока пользователь не попросил
- выполнять `tasks.md` или писать код среза, пока пользователь не принял `proposal.md` и `design.md`
- объявлять «готово» без `npm run verify`
