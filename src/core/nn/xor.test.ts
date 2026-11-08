import { describe, expect, it } from 'vitest'
import { XOR_DATASET } from './dataset'
import { Mlp } from './mlp'
import { Trainer } from './trainer'

const XOR_SEED = 42

describe('XOR MLP 2 → 2 → 1', () => {
  it('learns four XOR points with loss below start', () => {
    const mlp = Mlp.xorMlp(XOR_SEED)
    const trainer = new Trainer(mlp, XOR_DATASET)

    const initial = trainer.forwardSnapshot()
    const initialLoss = initial.loss

    for (let step = 0; step < 8_000; step++) {
      trainer.trainStep()
    }

    const final = trainer.forwardSnapshot()
    expect(final.loss).toBeLessThan(initialLoss)

    for (const sample of XOR_DATASET) {
      const out = mlp.predict(sample.inputs)
      const prob = out[0]
      const predicted = prob >= 0.5 ? 1 : 0
      expect(predicted).toBe(sample.target)
    }
  })
})
