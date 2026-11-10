import { decideRule } from './policy'
import type { AgentGoal, AgentLogEntry, TrainerTools } from './types'

/**
 * Учебный цикл: цель → снимок → правило → инструмент (или стоп).
 * Счётчик trainCount — только шаги этого агента.
 */
export class RuleAgent {
  private trainCount = 0
  private nextIndex = 0
  private goal: AgentGoal
  private readonly tools: TrainerTools

  constructor(goal: AgentGoal, tools: TrainerTools) {
    this.goal = goal
    this.tools = tools
  }

  /** Обновить цель с экрана; счётчик шагов агента не сбрасывается. */
  setGoal(goal: AgentGoal): void {
    this.goal = goal
  }

  /** Один цикл; при стопе инструмент обучения не вызывается. */
  cycle(): AgentLogEntry {
    const observation = this.tools.snapshot()
    const decision = decideRule(observation.loss, this.trainCount, this.goal)
    const index = this.nextIndex++

    if (decision.action === 'stop') {
      return {
        index,
        observedLoss: observation.loss,
        action: 'stop',
        stopReason: decision.stopReason,
        observation,
        snapshot: observation,
      }
    }

    const snapshot = this.tools.trainStep()
    this.trainCount += 1
    return {
      index,
      observedLoss: observation.loss,
      action: 'train',
      observation,
      snapshot,
    }
  }

  /** Повторяет cycle, пока правило не выберет стоп. */
  run(): AgentLogEntry[] {
    const log: AgentLogEntry[] = []
    for (;;) {
      const entry = this.cycle()
      log.push(entry)
      if (entry.action === 'stop') {
        return log
      }
    }
  }
}
