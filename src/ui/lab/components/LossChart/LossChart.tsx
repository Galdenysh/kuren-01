import styles from './LossChart.module.css'

interface LossChartProps {
  readonly losses: readonly number[]
}

const WIDTH = 320
const HEIGHT = 160
const PAD = 16

export function LossChart({ losses }: LossChartProps) {
  if (losses.length === 0) {
    return (
      <figure className={styles.figure}>
        <figcaption className={styles.caption}>График loss</figcaption>
        <p className={styles.empty}>Шагов ещё не было</p>
      </figure>
    )
  }

  const min = Math.min(...losses)
  const max = Math.max(...losses)
  const range = max - min || 1

  const points = losses
    .map((loss, index) => {
      const x =
        PAD + (index / Math.max(losses.length - 1, 1)) * (WIDTH - PAD * 2)
      const y = HEIGHT - PAD - ((loss - min) / range) * (HEIGHT - PAD * 2)
      return `${x},${y}`
    })
    .join(' ')

  return (
    <figure className={styles.figure}>
      <figcaption className={styles.caption}>График loss</figcaption>
      <svg
        className={styles.svg}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        role="img"
        aria-label="График loss по шагам"
      >
        <polyline points={points} className={styles.line} fill="none" />
        {losses.map((loss, index) => {
          const x =
            PAD + (index / Math.max(losses.length - 1, 1)) * (WIDTH - PAD * 2)
          const y = HEIGHT - PAD - ((loss - min) / range) * (HEIGHT - PAD * 2)
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={losses.length === 1 ? 4 : 3}
              className={styles.dot}
            />
          )
        })}
      </svg>
      <p className={styles.meta}>
        Точек: {losses.length} · текущий:{' '}
        {losses[losses.length - 1]!.toFixed(4)}
      </p>
    </figure>
  )
}
