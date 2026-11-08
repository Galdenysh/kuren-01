import { useState } from 'react'
import { Mlp, Trainer, XOR_DATASET, type NetworkSnapshot } from '../../core/nn'
import { LossChart } from './LossChart'
import { NetworkGraph } from './NetworkGraph'
import styles from './TrainingLab.module.css'
import { WeightView } from './WeightView'

const LAB_SEED = 42
const BURST_STEPS = 50

export function TrainingLab() {
  const [trainer] = useState(
    () => new Trainer(Mlp.xorMlp(LAB_SEED), XOR_DATASET),
  )

  const [snapshot, setSnapshot] = useState<NetworkSnapshot>(() =>
    trainer.forwardSnapshot(),
  )
  const [lossHistory, setLossHistory] = useState<number[]>(() => [
    snapshot.loss,
  ])

  const runSteps = (count: number) => {
    let last: NetworkSnapshot = snapshot
    const newLosses: number[] = []
    for (let i = 0; i < count; i++) {
      last = trainer.trainStep()
      newLosses.push(last.loss)
    }
    setSnapshot(last)
    setLossHistory((prev) => [...prev, ...newLosses])
  }

  return (
    <div className={styles.lab}>
      <header className={styles.header}>
        <h1 className={styles.title}>Лаборатория XOR</h1>
        <p className={styles.lead}>
          MLP 2→2→1: один шаг — forward, backward, обновление весов. Числа из
          снимка ядра, без фейка.
        </p>
      </header>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          onClick={() => runSteps(1)}
        >
          Шаг
        </button>
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={() => runSteps(BURST_STEPS)}
        >
          Серия шагов ({BURST_STEPS})
        </button>
        <p className={styles.lossNow}>
          Loss: <strong>{snapshot.loss.toFixed(4)}</strong>
        </p>
      </div>

      <div className={styles.panels}>
        <NetworkGraph snapshot={snapshot} />
        <LossChart losses={lossHistory} />
      </div>

      <WeightView snapshot={snapshot} />
    </div>
  )
}
