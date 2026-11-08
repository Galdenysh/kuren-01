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
})
