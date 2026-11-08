export interface XorSample {
  readonly inputs: readonly [number, number]
  readonly target: number
}

export const XOR_DATASET: readonly XorSample[] = [
  { inputs: [0, 0], target: 0 },
  { inputs: [0, 1], target: 1 },
  { inputs: [1, 0], target: 1 },
  { inputs: [1, 1], target: 0 },
]
