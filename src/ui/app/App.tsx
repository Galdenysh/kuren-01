import { useState } from 'react'
import { createTrainerTools, RuleAgent } from '../../core/agent'
import { Mlp, Trainer, XOR_DATASET } from '../../core/nn'
import { AgentPanel, SCREEN_AGENT_GOAL, TrainingLab } from '../lab'
import styles from './App.module.css'

const LAB_SEED = 42

export default function App() {
  const [trainer] = useState(
    () => new Trainer(Mlp.xorMlp(LAB_SEED), XOR_DATASET),
  )
  const [agent] = useState(
    () => new RuleAgent(SCREEN_AGENT_GOAL, createTrainerTools(trainer)),
  )

  const [trainRevision, setTrainRevision] = useState(0)
  const [lossHistory, setLossHistory] = useState<number[]>(() => [
    trainer.forwardSnapshot().loss,
  ])

  const appendLosses = (losses: number[]) => {
    if (losses.length === 0) return
    setTrainRevision((n) => n + 1)
    setLossHistory((prev) => [...prev, ...losses])
  }

  return (
    <main className={styles.shell}>
      <div className={styles.stack}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Лаборатория XOR</h1>
          <p className={styles.pageLead}>
            Сеть 2→2→1 учится на XOR. Схема сети, ошибка (loss) и веса считаются
            в ядре и отображаются без подставных чисел.
          </p>
        </header>
        <AgentPanel agent={agent} onLossesApplied={appendLosses} />
        <TrainingLab
          trainer={trainer}
          lossHistory={lossHistory}
          trainRevision={trainRevision}
        />
      </div>
    </main>
  )
}
