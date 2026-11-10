import { describe, expect, it } from 'vitest'
import { XOR_DATASET } from '../nn/dataset'
import { Mlp } from '../nn/mlp'
import { Tensor } from '../nn/tensor'
import { Trainer } from '../nn/trainer'
import type { NetworkSnapshot } from '../nn/snapshot'
import { RuleAgent, createTrainerTools } from './index'
import type { AgentLogEntry } from './types'

const XOR_SEED = 42

function assertNoTensor(value: unknown): void {
  if (value instanceof Tensor) {
    throw new Error('В логе не должно быть экземпляров Tensor')
  }
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) {
      assertNoTensor(child)
    }
  }
}

function weightsEqual(
  a: NetworkSnapshot['weights'],
  b: NetworkSnapshot['weights'],
): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

describe('RuleAgent на реальном Trainer', () => {
  it('при maxLoss: 1 первый цикл — стоп целью, веса не меняются', () => {
    const trainer = new Trainer(Mlp.xorMlp(XOR_SEED), XOR_DATASET)
    const before = trainer.forwardSnapshot()
    const agent = new RuleAgent(
      { maxLoss: 1, maxSteps: 200 },
      createTrainerTools(trainer),
    )

    const entry = agent.cycle()

    expect(entry.action).toBe('stop')
    expect(entry.stopReason).toBe('goal_reached')
    expect(
      weightsEqual(trainer.forwardSnapshot().weights, before.weights),
    ).toBe(true)
  })

  it('при maxLoss: 0 и maxSteps: 2 — ровно два train и стоп step_limit', () => {
    const trainer = new Trainer(Mlp.xorMlp(XOR_SEED), XOR_DATASET)
    const manual = new Trainer(Mlp.xorMlp(XOR_SEED), XOR_DATASET)
    manual.trainStep()
    manual.trainStep()
    const expectedWeights = manual.forwardSnapshot().weights

    const agent = new RuleAgent(
      { maxLoss: 0, maxSteps: 2 },
      createTrainerTools(trainer),
    )
    const log = agent.run()

    const trains = log.filter((e) => e.action === 'train')
    const stops = log.filter((e) => e.action === 'stop')
    expect(trains).toHaveLength(2)
    expect(stops).toHaveLength(1)
    expect(stops[0]?.stopReason).toBe('step_limit')
    expect(
      weightsEqual(trainer.forwardSnapshot().weights, expectedWeights),
    ).toBe(true)
  })

  it('на цикле обучения снимок наблюдения снят до trainStep', () => {
    const trainer = new Trainer(Mlp.xorMlp(XOR_SEED), XOR_DATASET)
    const pre = trainer.forwardSnapshot()
    const agent = new RuleAgent(
      { maxLoss: 0, maxSteps: 5 },
      createTrainerTools(trainer),
    )

    const entry = agent.cycle()

    expect(entry.action).toBe('train')
    expect(entry.observation.loss).toBe(pre.loss)
    expect(entry.observation.weights).toEqual(pre.weights)
    expect(entry.observation.activations).toEqual(pre.activations)
    expect(weightsEqual(trainer.forwardSnapshot().weights, pre.weights)).toBe(
      false,
    )
  })

  it('лог run — plain data, без Tensor', () => {
    const trainer = new Trainer(Mlp.xorMlp(XOR_SEED), XOR_DATASET)
    const agent = new RuleAgent(
      { maxLoss: 0, maxSteps: 2 },
      createTrainerTools(trainer),
    )
    const log: AgentLogEntry[] = agent.run()

    for (const entry of log) {
      assertNoTensor(entry)
    }
  })
})
