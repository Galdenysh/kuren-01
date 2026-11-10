import type { AgentGoal, RuleDecision } from './types'

/**
 * Фиксированное правило: сначала цель по loss, затем лимит шагов.
 * Сеть не импортируется — на вход только снятый loss и счётчик.
 */
export function decideRule(
  observedLoss: number,
  trainCount: number,
  goal: AgentGoal,
): RuleDecision {
  if (observedLoss <= goal.maxLoss) {
    return { action: 'stop', stopReason: 'goal_reached' }
  }
  if (trainCount >= goal.maxSteps) {
    return { action: 'stop', stopReason: 'step_limit' }
  }
  return { action: 'train' }
}
