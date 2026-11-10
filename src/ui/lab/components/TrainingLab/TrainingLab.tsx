import { useState } from 'react'
import { XOR_DATASET, type Trainer } from '../../../../core/nn'
import { InputProbePicker } from '../InputProbePicker/InputProbePicker'
import { LossChart } from '../LossChart/LossChart'
import { NetworkGraph } from '../NetworkGraph/NetworkGraph'
import styles from './TrainingLab.module.css'
import { WeightView } from '../WeightView/WeightView'

export type TrainingLabProps = {
  trainer: Trainer
  lossHistory: number[]
  trainRevision: number
}

export function TrainingLab({
  trainer,
  lossHistory,
  trainRevision,
}: TrainingLabProps) {
  const [probeIndex, setProbeIndex] = useState(0)
  const probeInputs = XOR_DATASET[probeIndex]!.inputs
  const probeTarget = XOR_DATASET[probeIndex]!.target

  const snapshot = trainer.probeSnapshot(probeInputs)
  const outputProb = snapshot.activations.output[0] ?? 0
  const predicted = outputProb >= 0.5 ? 1 : 0

  const onProbeSelect = (index: number) => {
    setProbeIndex(index)
  }

  return (
    <div className={styles.lab}>
      <p className={styles.lossNow}>
        Loss: <strong>{snapshot.loss.toFixed(4)}</strong>
      </p>

      <InputProbePicker selectedIndex={probeIndex} onSelect={onProbeSelect} />

      <div className={styles.probeContext}>
        <p className={styles.probeMeta}>
          Вход на схеме ({probeInputs[0]}, {probeInputs[1]}). Цель XOR:{' '}
          {probeTarget}. Выход {outputProb.toFixed(2)}, класс (предсказание){' '}
          {predicted}.
        </p>
        <p className={styles.probeHint}>
          Активации в кружках. Веса в таблице ниже.
        </p>
      </div>

      <div className={styles.panels}>
        <NetworkGraph
          key={`${trainRevision}-${probeIndex}`}
          snapshot={snapshot}
        />
        <LossChart losses={lossHistory} />
      </div>

      <WeightView snapshot={snapshot} />
    </div>
  )
}
