import { describe, expect, it } from 'vitest'
import { decideRule } from './policy'
import type { AgentGoal } from './types'

const goal = (maxLoss: number, maxSteps: number): AgentGoal => ({
  maxLoss,
  maxSteps,
})

describe('decideRule', () => {
  it('выбирает train, пока loss выше порога и бюджет не исчерпан', () => {
    expect(decideRule(0.5, 0, goal(0.2, 10))).toEqual({ action: 'train' })
    expect(decideRule(0.21, 9, goal(0.2, 10))).toEqual({ action: 'train' })
  })

  it('останавливается с goal_reached, когда loss не выше порога', () => {
    expect(decideRule(0.2, 0, goal(0.2, 10))).toEqual({
      action: 'stop',
      stopReason: 'goal_reached',
    })
    expect(decideRule(0.05, 3, goal(0.2, 10))).toEqual({
      action: 'stop',
      stopReason: 'goal_reached',
    })
  })

  it('останавливается с step_limit, когда бюджет кончился при высоком loss', () => {
    expect(decideRule(0.5, 2, goal(0.2, 2))).toEqual({
      action: 'stop',
      stopReason: 'step_limit',
    })
  })

  it('при нулевом бюджете и уже низком loss причина — цель, а не лимит', () => {
    expect(decideRule(0.1, 0, goal(0.2, 0))).toEqual({
      action: 'stop',
      stopReason: 'goal_reached',
    })
  })
})
