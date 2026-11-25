import { useState } from 'react'
import { createTrainerTools, RuleAgent } from '../../core/agent'
import { Mlp, Trainer, XOR_DATASET } from '../../core/nn'
import { CharLab } from '../char'
import { AgentPanel, SCREEN_AGENT_GOAL, TrainingLab } from '../lab'
import styles from './App.module.css'

type Screen = 'xor' | 'char'

const LAB_SEED = 42

export default function App() {
  const [trainer, setTrainer] = useState(
    () => new Trainer(Mlp.xorMlp(LAB_SEED), XOR_DATASET),
  )
  const [agent, setAgent] = useState(
    () => new RuleAgent(SCREEN_AGENT_GOAL, createTrainerTools(trainer)),
  )
  const [sessionId, setSessionId] = useState(0)
  const [screen, setScreen] = useState<Screen>('xor')

  const [trainRevision, setTrainRevision] = useState(0)
  const [lossHistory, setLossHistory] = useState<number[]>(() => [
    trainer.forwardSnapshot().loss,
  ])

  const appendLosses = (losses: number[]) => {
    if (losses.length === 0) return
    setTrainRevision((n) => n + 1)
    setLossHistory((prev) => [...prev, ...losses])
  }

  const resetNetwork = () => {
    const nextTrainer = new Trainer(Mlp.xorMlp(LAB_SEED), XOR_DATASET)
    setTrainer(nextTrainer)
    setAgent(new RuleAgent(SCREEN_AGENT_GOAL, createTrainerTools(nextTrainer)))
    setTrainRevision(0)
    setLossHistory([nextTrainer.forwardSnapshot().loss])
    setSessionId((id) => id + 1)
  }

  return (
    <main className={styles.shell}>
      <div className={styles.stack}>
        <div className={styles.switcher} role="group" aria-label="Экран">
          <button
            type="button"
            className={screen === 'xor' ? styles.switchActive : styles.switch}
            aria-pressed={screen === 'xor'}
            onClick={() => setScreen('xor')}
          >
            XOR
          </button>
          <button
            type="button"
            className={screen === 'char' ? styles.switchActive : styles.switch}
            aria-pressed={screen === 'char'}
            onClick={() => setScreen('char')}
          >
            Символы
          </button>
        </div>
        <div
          className={screen === 'xor' ? styles.stack : styles.hiddenScreen}
          aria-hidden={screen !== 'xor'}
        >
          <header className={styles.pageHeader}>
            <h1 className={styles.pageTitle}>Лаборатория XOR</h1>
            <p className={styles.pageLead}>
              Сеть 2→2→1 учится на XOR. Схема сети, ошибка (loss) и веса
              считаются в ядре и отображаются без подставных чисел.
            </p>
          </header>
          <AgentPanel
            key={sessionId}
            agent={agent}
            onLossesApplied={appendLosses}
          />
          <TrainingLab
            trainer={trainer}
            lossHistory={lossHistory}
            trainRevision={trainRevision}
            onResetNetwork={resetNetwork}
          />
        </div>
        {screen === 'char' ? <CharLab /> : null}
      </div>
    </main>
  )
}
