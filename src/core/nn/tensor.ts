export type Shape = readonly [number, number]

type BackwardFn = () => void

export class Tensor {
  readonly rows: number
  readonly cols: number
  private readonly data: Float64Array
  readonly requiresGrad: boolean
  grad: Float64Array | null
  private backwardFn: BackwardFn | null
  private readonly parents: Set<Tensor>

  private constructor(
    data: Float64Array,
    rows: number,
    cols: number,
    requiresGrad: boolean,
  ) {
    this.data = data
    this.rows = rows
    this.cols = cols
    this.requiresGrad = requiresGrad
    this.grad = requiresGrad ? new Float64Array(data.length) : null
    this.backwardFn = null
    this.parents = new Set()
  }

  get shape(): Shape {
    return [this.rows, this.cols]
  }

  static from(
    values: number[][],
    options?: { requiresGrad?: boolean },
  ): Tensor {
    const requiresGrad = options?.requiresGrad ?? false
    const rows = values.length
    const cols = rows === 0 ? 0 : values[0].length
    const flat = new Float64Array(rows * cols)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        flat[r * cols + c] = values[r][c]
      }
    }
    return new Tensor(flat, rows, cols, requiresGrad)
  }

  toArray(): number[][] {
    const out: number[][] = []
    for (let r = 0; r < this.rows; r++) {
      const row: number[] = []
      for (let c = 0; c < this.cols; c++) {
        row.push(this.data[r * this.cols + c])
      }
      out.push(row)
    }
    return out
  }

  private idx(r: number, c: number): number {
    return r * this.cols + c
  }

  at(r: number, c: number): number {
    return this.data[this.idx(r, c)]
  }

  private linkParents(...tensors: Tensor[]): void {
    for (const t of tensors) {
      if (t.requiresGrad) {
        this.parents.add(t)
      }
    }
  }

  add(other: Tensor): Tensor {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error('add: shape mismatch')
    }
    const outData = new Float64Array(this.data.length)
    for (let i = 0; i < outData.length; i++) {
      outData[i] = this.data[i] + other.data[i]
    }
    const needsGrad = this.requiresGrad || other.requiresGrad
    const out = new Tensor(outData, this.rows, this.cols, needsGrad)
    out.linkParents(this, other)
    out.backwardFn = () => {
      this.accumGrad(out.grad!)
      other.accumGrad(out.grad!)
    }
    return out
  }

  mul(other: Tensor): Tensor {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error('mul: shape mismatch')
    }
    const outData = new Float64Array(this.data.length)
    for (let i = 0; i < outData.length; i++) {
      outData[i] = this.data[i] * other.data[i]
    }
    const needsGrad = this.requiresGrad || other.requiresGrad
    const out = new Tensor(outData, this.rows, this.cols, needsGrad)
    out.linkParents(this, other)
    out.backwardFn = () => {
      for (let i = 0; i < outData.length; i++) {
        if (this.requiresGrad) {
          this.grad![i] += out.grad![i] * other.data[i]
        }
        if (other.requiresGrad) {
          other.grad![i] += out.grad![i] * this.data[i]
        }
      }
    }
    return out
  }

  matmul(other: Tensor): Tensor {
    if (this.cols !== other.rows) {
      throw new Error('matmul: incompatible shapes')
    }
    const outRows = this.rows
    const outCols = other.cols
    const outData = new Float64Array(outRows * outCols)
    for (let r = 0; r < outRows; r++) {
      for (let c = 0; c < outCols; c++) {
        let sum = 0
        for (let k = 0; k < this.cols; k++) {
          sum += this.data[r * this.cols + k] * other.data[k * other.cols + c]
        }
        outData[r * outCols + c] = sum
      }
    }
    const needsGrad = this.requiresGrad || other.requiresGrad
    const out = new Tensor(outData, outRows, outCols, needsGrad)
    out.linkParents(this, other)
    out.backwardFn = () => {
      if (this.requiresGrad) {
        for (let r = 0; r < outRows; r++) {
          for (let k = 0; k < this.cols; k++) {
            let g = 0
            for (let c = 0; c < outCols; c++) {
              g += out.grad![r * outCols + c] * other.data[k * other.cols + c]
            }
            this.grad![r * this.cols + k] += g
          }
        }
      }
      if (other.requiresGrad) {
        for (let k = 0; k < other.rows; k++) {
          for (let c = 0; c < other.cols; c++) {
            let g = 0
            for (let r = 0; r < outRows; r++) {
              g += this.data[r * this.cols + k] * out.grad![r * outCols + c]
            }
            other.grad![k * other.cols + c] += g
          }
        }
      }
    }
    return out
  }

  sigmoid(): Tensor {
    const outData = new Float64Array(this.data.length)
    for (let i = 0; i < this.data.length; i++) {
      const x = this.data[i]
      outData[i] = 1 / (1 + Math.exp(-x))
    }
    const out = new Tensor(outData, this.rows, this.cols, this.requiresGrad)
    out.linkParents(this)
    out.backwardFn = () => {
      if (this.requiresGrad) {
        for (let i = 0; i < this.data.length; i++) {
          const s = outData[i]
          this.grad![i] += out.grad![i] * s * (1 - s)
        }
      }
    }
    return out
  }

  private accumGrad(source: Float64Array): void {
    if (!this.grad) {
      return
    }
    for (let i = 0; i < this.grad.length; i++) {
      this.grad[i] += source[i]
    }
  }

  zeroGrad(): void {
    if (this.grad) {
      this.grad.fill(0)
    }
  }

  backward(): void {
    if (!this.requiresGrad) {
      return
    }
    const topo = this.topologicalOrder()
    this.grad!.fill(0)
    this.grad![0] = 1
    for (let i = topo.length - 1; i >= 0; i--) {
      const node = topo[i]
      if (node.backwardFn) {
        node.backwardFn()
      }
    }
  }

  applyGrad(learningRate: number): void {
    if (!this.grad) {
      return
    }
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] -= learningRate * this.grad[i]
    }
  }

  private topologicalOrder(): Tensor[] {
    const order: Tensor[] = []
    const visited = new Set<Tensor>()

    const visit = (node: Tensor): void => {
      if (visited.has(node)) {
        return
      }
      visited.add(node)
      for (const parent of node.parents) {
        visit(parent)
      }
      order.push(node)
    }

    visit(this)
    return order
  }
}
