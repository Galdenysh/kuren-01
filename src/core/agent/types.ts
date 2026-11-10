import type { NetworkSnapshot } from '../nn'

/** Учебная цель: порог loss и бюджет шагов обучения агента. */
export interface AgentGoal {
  readonly maxLoss: number
  readonly maxSteps: number
}

export type StopReason = 'goal_reached' | 'step_limit'

/** Решение правила без сети — только числа и цель. */
export type RuleDecision =
  | { readonly action: 'train' }
  | { readonly action: 'stop'; readonly stopReason: StopReason }

/** Два инструмента поверх публичного API trainer. */
export interface TrainerTools {
  snapshot(): NetworkSnapshot
  trainStep(): NetworkSnapshot
}

/** Одна запись лога цикла — plain data для UI и тестов. */
export interface AgentLogEntry {
  readonly index: number
  readonly observedLoss: number
  readonly action: 'train' | 'stop'
  readonly stopReason?: StopReason
  /** Снимок до действия (наблюдение). */
  readonly observation: NetworkSnapshot
  /** Снимок для экрана после цикла. */
  readonly snapshot: NetworkSnapshot
}
