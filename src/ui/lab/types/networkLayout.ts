/** Подписанное ребро для таблицы весов. */
export interface LabeledEdge {
  readonly id: string
  readonly fromLabel: string
  readonly toLabel: string
  readonly weight: number
  readonly code: string
}

/** Bias одного нейрона для таблицы. */
export interface LabeledBias {
  readonly id: string
  readonly neuronLabel: string
  readonly value: number
  readonly code: string
}
