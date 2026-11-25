import { describe, expect, it } from 'vitest'
import { Tensor } from './tensor'

describe('autograd', () => {
  it('backprops dL/dw for y = x * w + b when L = y', () => {
    const x = Tensor.from([[2]], { requiresGrad: true })
    const w = Tensor.from([[3]], { requiresGrad: true })
    const b = Tensor.from([[1]], { requiresGrad: true })

    const y = x.mul(w).add(b)
    y.backward()

    expect(w.grad![0]).toBeCloseTo(2, 5)
  })
})
