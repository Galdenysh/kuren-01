import { useState } from 'react'
import { XOR_DATASET, type Trainer } from '../../../../core/nn'
import { InputProbePicker } from '../InputProbePicker/InputProbePicker'
import { LossChart } from '../LossChart/LossChart'
import { NetworkGraph } from '../NetworkGraph/NetworkGraph'
import styles from './TrainingLab.module.css'
import { WeightView } from '../WeightView/WeightView'

const BURST_STEPS = 50

export type TrainingLabProps = {
  trainer: Trainer
  lossHistory: number[]
  trainRevision: number
  onManualSteps: (losses: number[]) => void
}

export function TrainingLab({
  trainer,
  lossHistory,
  trainRevision,
  onManualSteps,
}: TrainingLabProps) {
  const [probeIndex, setProbeIndex] = useState(0)
  const probeInputs = XOR_DATASET[probeIndex]!.inputs
  const probeTarget = XOR_DATASET[probeIndex]!.target

  const snapshot = trainer.probeSnapshot(probeInputs)

  const runSteps = (count: number) => {
    const newLosses: number[] = []
    for (let i = 0; i < count; i++) {
      const step = trainer.trainStep()
      newLosses.push(step.loss)
    }
    onManualSteps(newLosses)
  }

  const onProbeSelect = (index: number) => {
    setProbeIndex(index)
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

      <InputProbePicker selectedIndex={probeIndex} onSelect={onProbeSelect} />

      <div className={styles.panels}>
        <NetworkGraph
          key={`${trainRevision}-${probeIndex}`}
          snapshot={snapshot}
          expectedTarget={probeTarget}
        />
        <LossChart losses={lossHistory} />
      </div>

      <WeightView snapshot={snapshot} />
    </div>
  )
}
