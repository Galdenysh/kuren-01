import { useState } from 'react'
import type { AgentLogEntry, RuleAgent } from '../../../../core/agent'
import { SCREEN_AGENT_GOAL } from '../../config/screenAgentGoal'
import styles from './AgentPanel.module.css'

const SERIES_CYCLES = 50

export type AgentPanelProps = {
  agent: RuleAgent
  onTrainApplied: (loss: number) => void
}

function formatLogLine(entry: AgentLogEntry): string {
  if (entry.action === 'train') {
    return `Цикл ${entry.index + 1}: loss ${entry.observedLoss.toFixed(4)} → обучение (после шага ${entry.snapshot.loss.toFixed(4)})`
  }
  const reason =
    entry.stopReason === 'goal_reached' ? 'цель достигнута' : 'лимит шагов'
  return `Цикл ${entry.index + 1}: loss ${entry.observedLoss.toFixed(4)} → стоп (${reason})`
}

export function AgentPanel({ agent, onTrainApplied }: AgentPanelProps) {
  const [logLines, setLogLines] = useState<string[]>([])

  const applyEntry = (entry: AgentLogEntry) => {
    setLogLines((prev) => [...prev, formatLogLine(entry)])
    if (entry.action === 'train') {
      onTrainApplied(entry.snapshot.loss)
    }
  }

  const onAgentStep = () => {
    applyEntry(agent.cycle())
  }

  const onAgentSeries = () => {
    for (let i = 0; i < SERIES_CYCLES; i++) {
      const entry = agent.cycle()
      applyEntry(entry)
      if (entry.action === 'stop') {
        break
      }
    }
  }

  return (
    <section className={styles.panel} aria-labelledby="agent-panel-title">
      <header className={styles.header}>
        <h2 id="agent-panel-title" className={styles.title}>
          Агент по правилу
        </h2>
        <p className={styles.lead}>
          Цель: loss ≤ {SCREEN_AGENT_GOAL.maxLoss}, бюджет{' '}
          {SCREEN_AGENT_GOAL.maxSteps} шагов обучения. Не языковая модель — только
          снимок и правило.
        </p>
      </header>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          onClick={onAgentStep}
        >
          Шаг агента
        </button>
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={onAgentSeries}
        >
          Серия циклов ({SERIES_CYCLES})
        </button>
      </div>

      <div className={styles.log} role="log" aria-live="polite">
        {logLines.length === 0 ? (
          <p className={styles.logEmpty}>Лог циклов пока пуст.</p>
        ) : (
          <ul className={styles.logList}>
            {logLines.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
