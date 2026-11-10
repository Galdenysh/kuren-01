import { useState } from 'react'
import type {
  AgentGoal,
  AgentLogEntry,
  RuleAgent,
} from '../../../../core/agent'
import { SCREEN_AGENT_GOAL } from '../../config/screenAgentGoal'
import styles from './AgentPanel.module.css'

const SERIES_CYCLES = 50

export type AgentPanelProps = {
  agent: RuleAgent
  onLossesApplied: (losses: number[]) => void
}

function formatLogLine(entry: AgentLogEntry): string {
  if (entry.action === 'train') {
    return `Цикл ${entry.index + 1}: loss ${entry.observedLoss.toFixed(4)} → обучение (после шага ${entry.snapshot.loss.toFixed(4)})`
  }
  const reason =
    entry.stopReason === 'goal_reached' ? 'цель достигнута' : 'лимит шагов'
  return `Цикл ${entry.index + 1}: loss ${entry.observedLoss.toFixed(4)} → стоп (${reason})`
}

function goalFromForm(maxLoss: string, maxSteps: string): AgentGoal | null {
  const loss = Number.parseFloat(maxLoss)
  const steps = Number.parseInt(maxSteps, 10)
  if (!Number.isFinite(loss) || loss < 0) return null
  if (!Number.isFinite(steps) || steps < 0) return null
  return { maxLoss: loss, maxSteps: steps }
}

export function AgentPanel({ agent, onLossesApplied }: AgentPanelProps) {
  const [expanded, setExpanded] = useState(false)
  const [logLines, setLogLines] = useState<string[]>([])
  const [maxLossInput, setMaxLossInput] = useState(
    String(SCREEN_AGENT_GOAL.maxLoss),
  )
  const [maxStepsInput, setMaxStepsInput] = useState(
    String(SCREEN_AGENT_GOAL.maxSteps),
  )

  const applyGoalFromInputs = () => {
    const goal = goalFromForm(maxLossInput, maxStepsInput)
    if (goal) {
      agent.setGoal(goal)
    }
  }

  const applyEntries = (entries: readonly AgentLogEntry[]) => {
    if (entries.length === 0) return
    setLogLines((prev) => [
      ...prev,
      ...entries.map((entry) => formatLogLine(entry)),
    ])
    const losses = entries
      .filter((entry) => entry.action === 'train')
      .map((entry) => entry.snapshot.loss)
    if (losses.length > 0) {
      onLossesApplied(losses)
    }
  }

  const onAgentStep = () => {
    applyGoalFromInputs()
    applyEntries([agent.cycle()])
  }

  const onAgentSeries = () => {
    applyGoalFromInputs()
    const batch: AgentLogEntry[] = []
    for (let i = 0; i < SERIES_CYCLES; i++) {
      const entry = agent.cycle()
      batch.push(entry)
      if (entry.action === 'stop') {
        break
      }
    }
    applyEntries(batch)
  }

  const onRunUntilStop = () => {
    applyGoalFromInputs()
    applyEntries(agent.run())
  }

  return (
    <section
      className={expanded ? styles.panel : styles.panelCollapsed}
      aria-labelledby="agent-panel-title"
    >
      <div className={styles.titleRow}>
        <h2 id="agent-panel-title" className={styles.title}>
          Агент по правилу
        </h2>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Свернуть' : 'Лог и настройки'}
        </button>
      </div>

      <div className={styles.toolbar}>
        <button type="button" className={styles.button} onClick={onAgentStep}>
          Шаг агента
        </button>
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={onAgentSeries}
        >
          Серия циклов ({SERIES_CYCLES})
        </button>
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={onRunUntilStop}
        >
          Авто до цели
        </button>
      </div>

      {expanded ? (
        <div className={styles.expanded}>
          <fieldset className={styles.settings}>
            <legend className={styles.settingsLegend}>Цель агента</legend>
            <div className={styles.settingsGrid}>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>Порог loss (maxLoss)</span>
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  step={0.01}
                  value={maxLossInput}
                  onChange={(e) => setMaxLossInput(e.target.value)}
                  onBlur={applyGoalFromInputs}
                />
              </label>
              <label className={styles.field}>
                <span className={styles.fieldLabel}>
                  Бюджет шагов (maxSteps)
                </span>
                <input
                  className={styles.input}
                  type="number"
                  min={0}
                  step={1}
                  value={maxStepsInput}
                  onChange={(e) => setMaxStepsInput(e.target.value)}
                  onBlur={applyGoalFromInputs}
                />
              </label>
            </div>
            <p className={styles.settingsHint}>
              Правило: пока loss выше порога и остался бюджет — один шаг
              обучения за цикл.
            </p>
          </fieldset>

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
        </div>
      ) : null}
    </section>
  )
}
