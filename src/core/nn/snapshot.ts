export interface NetworkSnapshot {
  readonly loss: number
  readonly weights: {
    readonly w1: number[][]
    readonly b1: number[][]
    readonly w2: number[][]
    readonly b2: number[][]
  }
  readonly activations: {
    readonly input: number[]
    readonly hidden: number[]
    readonly output: number[]
  }
}
