import { describe, expect, it } from 'vitest'
import { Tensor } from './tensor'

describe('Tensor', () => {
  it('exposes shape from constructor data', () => {
    const t = Tensor.from([
      [1, 2],
      [3, 4],
    ])
    expect(t.shape).toEqual([2, 2])
  })

  it('adds same-shaped tensors element-wise', () => {
    const a = Tensor.from([
      [1, 2],
      [3, 4],
    ])
    const b = Tensor.from([
      [10, 20],
      [30, 40],
    ])
    const c = a.add(b)
    expect(c.toArray()).toEqual([
      [11, 22],
      [33, 44],
    ])
  })

  it('multiplies compatible matrices', () => {
    const a = Tensor.from([[1, 2]])
    const b = Tensor.from([[3], [4]])
    const c = a.matmul(b)
    expect(c.shape).toEqual([1, 1])
    expect(c.toArray()).toEqual([[11]])
  })

  it('applies sigmoid element-wise', () => {
    const t = Tensor.from([[0]])
    const s = t.sigmoid()
    expect(s.toArray()[0][0]).toBeCloseTo(0.5, 5)
    const neg = Tensor.from([[-10]])
    expect(neg.sigmoid().toArray()[0][0]).toBeCloseTo(0, 4)
  })

  it('softmax is positive and sums to 1 per row', () => {
    const probs = Tensor.from([
      [1, 2, 3],
      [0, 0, 0],
    ]).softmax()
    for (const row of probs.toArray()) {
      for (const value of row) {
        expect(value).toBeGreaterThan(0)
      }
      expect(row.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 5)
    }
  })

  it('cross-entropy of the correct class is non-negative and falls as that probability grows', () => {
    const unlikely = Tensor.from([[0.2, 0.8]]).crossEntropy(0)
    const likely = Tensor.from([[0.9, 0.1]]).crossEntropy(0)
    expect(unlikely.at(0, 0)).toBeGreaterThanOrEqual(0)
    expect(likely.at(0, 0)).toBeGreaterThanOrEqual(0)
    expect(likely.at(0, 0)).toBeLessThan(unlikely.at(0, 0))
  })

  it('sends cross-entropy gradient back to the scores', () => {
    const scores = Tensor.from([[1, 2, 0.5]], { requiresGrad: true })
    const loss = scores.softmax().crossEntropy(0)
    loss.backward()
    expect(scores.grad![0]).not.toBe(0)
  })
})
