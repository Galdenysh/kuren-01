# Spec Delta

## ADDED Requirements

### Requirement: Human review before apply
Агент MUST NOT выполнять задачи из `tasks.md` и MUST NOT писать код среза, пока пользователь в этом разговоре явно не принял `proposal.md` и `design.md`. Допустимые сигналы: ок на эти файлы, «ревью ок», `/opsx-apply` после ревью. Написание самих артефактов propose (включая черновик `tasks.md`) MAY происходить до ревью.

#### Scenario: Propose just finished
- **WHEN** агент создал `proposal.md` и `design.md`
- **THEN** он останавливается, указывает пути файлов и ждёт ревью; код и чекбоксы `tasks.md` не трогает

#### Scenario: Apply without review
- **WHEN** агента просят «просто сделай» по срезу, который пользователь ещё не ревьюил
- **THEN** агент не начинает `tasks.md` и просит сначала прочитать `proposal.md` и `design.md`

## MODIFIED Requirements

### Requirement: Apply the named change
Агент MUST реализовывать код модели только по задачам текущего OpenSpec change, и только после ревью `proposal.md` и `design.md`. Для первого среза это `xor-training-lab`. Агент MUST NOT писать `src/ui/lab`, пока тесты ядра этого среза красные или отсутствуют.

#### Scenario: Skipping to UI
- **WHEN** агента просят «сделать сеть» без ревью и без `/opsx-apply`
- **THEN** он открывает `xor-training-lab`, указывает `proposal.md` и `design.md` и ждёт ревью, а не пишет тесты или React
