import type { NetworkSnapshot } from '../../../core/nn'
import type { LabeledBias, LabeledEdge } from '../types/networkLayout'

export type { LabeledBias, LabeledEdge } from '../types/networkLayout'

export const LAYER_X = [40, 180, 320] as const

const INPUT_LABELS = ['вход 0 (верх)', 'вход 1 (низ)'] as const
const HIDDEN_LABELS = ['скрытый 0 (верх)', 'скрытый 1 (низ)'] as const
const OUTPUT_LABEL = 'выход'

/** Y-центр нейрона в полосе 120px: два нейрона — верх/низ; один — по середине между ними. */
export function neuronCenterY(neuronIndex: number, count: number): number {
  const bandTop = 40 + 14
  const bandHeight = 120
  if (count <= 1) {
    return bandTop + bandHeight / 2
  }
  return bandTop + neuronIndex * (bandHeight / (count - 1))
}

/** x @ W₁: вес ребра «вход i → скрытый j» = W₁[i][j] */
export function listWeightEdges(weights: NetworkSnapshot['weights']): {
  readonly inputToHidden: readonly LabeledEdge[]
  readonly hiddenToOutput: readonly LabeledEdge[]
  readonly biases: readonly LabeledBias[]
} {
  const { w1, w2, b1, b2 } = weights

  const inputToHidden: LabeledEdge[] = []
  for (let hidden = 0; hidden < 2; hidden++) {
    for (let input = 0; input < 2; input++) {
      inputToHidden.push({
        id: `w1-${input}-${hidden}`,
        fromLabel: INPUT_LABELS[input],
        toLabel: HIDDEN_LABELS[hidden],
        weight: w1[input]![hidden]!,
        code: `W₁[${input},${hidden}]`,
      })
    }
  }

  const hiddenToOutput: LabeledEdge[] = []
  for (let hidden = 0; hidden < 2; hidden++) {
    hiddenToOutput.push({
      id: `w2-${hidden}`,
      fromLabel: HIDDEN_LABELS[hidden],
      toLabel: OUTPUT_LABEL,
      weight: w2[hidden]![0]!,
      code: `W₂[${hidden},0]`,
    })
  }

  const biases: LabeledBias[] = [
    {
      id: 'b1-0',
      neuronLabel: HIDDEN_LABELS[0],
      value: b1[0]![0]!,
      code: 'b₁[0]',
    },
    {
      id: 'b1-1',
      neuronLabel: HIDDEN_LABELS[1],
      value: b1[0]![1]!,
      code: 'b₁[1]',
    },
    {
      id: 'b2-0',
      neuronLabel: OUTPUT_LABEL,
      value: b2[0]![0]!,
      code: 'b₂',
    },
  ]

  return { inputToHidden, hiddenToOutput, biases }
}
