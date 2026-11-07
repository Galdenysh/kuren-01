# Spec Delta

## ADDED Requirements

### Requirement: Import boundary is checked
Репозиторий MUST содержать автоматическую проверку, что файлы под `src/core` не импортируют `react`, `react-dom` и пути `src/ui`. Проверка MUST входить в `npm run verify`.

#### Scenario: React import in core
- **WHEN** в `src/core` появляется `import … from 'react'` или из `src/ui`
- **THEN** `npm run verify` падает
