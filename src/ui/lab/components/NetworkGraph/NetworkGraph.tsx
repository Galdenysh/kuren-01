import type { NetworkSnapshot } from '../../../../core/nn'
import { LAYER_X, neuronCenterY } from '../../utils/networkLayout'
import styles from './NetworkGraph.module.css'

interface NetworkGraphProps {
  readonly snapshot: NetworkSnapshot
}

export function NetworkGraph({ snapshot }: NetworkGraphProps) {
  const input = snapshot.activations.input
  const { hidden, output } = snapshot.activations
  const neurons = [
    { layer: 0, values: input },
    { layer: 1, values: hidden },
    { layer: 2, values: output },
  ]

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>Схема 2 → 2 → 1</figcaption>
      <svg
        className={styles.svg}
        viewBox="0 0 360 200"
        role="img"
        aria-label={`Схема нейросети, вход (${input[0]}, ${input[1]})`}
      >
        {neurons.map(({ layer, values }, layerIndex) =>
          values.map((value, row) => {
            const x = LAYER_X[layer]
            const y = neuronCenterY(row, values.length)
            return (
              <g key={`${layer}-${row}`}>
                {layerIndex > 0 &&
                  neurons[layerIndex - 1].values.map((_, prevRow) => {
                    const prevLayer = layerIndex - 1
                    const prevCount = neurons[prevLayer].values.length
                    const prevY = neuronCenterY(prevRow, prevCount)
                    const x1 = LAYER_X[prevLayer] + 28
                    const y1 = prevY
                    const x2 = x - 4
                    const y2 = y
                    return (
                      <line
                        key={`e-${prevRow}-${row}`}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        className={styles.edge}
                      />
                    )
                  })}
                <circle cx={x} cy={y} r={22} className={styles.node} />
                <text x={x} y={y + 4} className={styles.value}>
                  {value.toFixed(2)}
                </text>
              </g>
            )
          }),
        )}
      </svg>
      <div className={styles.labels}>
        <span>Вход</span>
        <span>Скрытый</span>
        <span>Выход</span>
      </div>
    </figure>
  )
}
