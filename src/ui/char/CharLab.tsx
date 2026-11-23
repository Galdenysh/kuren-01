import { useEffect, useRef, useState } from 'react'
import { CharModel, readCorpus, type CharSnapshot } from '../../core/lm'
import styles from './CharLab.module.css'

const SEED = 42
const TAIL = 6
const BATCH_STEPS = 4000
const SLICE_STEPS = 50

const CORPUS = readCorpus()

/** Первая фраза корпуса без последних символов хвоста. */
function defaultPrefix(corpus: string): string {
  const phrase = corpus.split('\n')[0]?.trim() ?? ''
  return phrase.slice(0, Math.max(0, phrase.length - TAIL))
}

const INITIAL_PREFIX = defaultPrefix(CORPUS)

/**
 * Экран заучивания короткого текста.
 * Ядро считает шаг и снимок, React хранит модель, начало и последний снимок.
 */
export function CharLab() {
  const [model, setModel] = useState(() => CharModel.create(SEED))
  const [prefix, setPrefix] = useState(INITIAL_PREFIX)
  const [busy, setBusy] = useState(false)
  const [snapshot, setSnapshot] = useState<CharSnapshot>(() =>
    model.snapshot(INITIAL_PREFIX, TAIL),
  )
  const prefixRef = useRef(INITIAL_PREFIX)
  const generationRef = useRef(0)
  const timerRef = useRef<number | null>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    return () => {
      generationRef.current += 1
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [])

  const publish = (current: CharModel, nextPrefix: string) => {
    setSnapshot(current.snapshot(nextPrefix, TAIL))
  }

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const onPrefixChange = (value: string) => {
    prefixRef.current = value
    setPrefix(value)
    publish(model, value)
  }

  const step = () => {
    if (busyRef.current) return
    model.trainStep()
    publish(model, prefixRef.current)
  }

  const train = () => {
    if (busyRef.current) return
    const generation = generationRef.current + 1
    generationRef.current = generation
    busyRef.current = true
    setBusy(true)
    let done = 0

    const runSlice = () => {
      if (generationRef.current !== generation) return
      const count = Math.min(SLICE_STEPS, BATCH_STEPS - done)
      for (let index = 0; index < count; index++) {
        model.trainStep()
      }
      done += count
      publish(model, prefixRef.current)
      if (done >= BATCH_STEPS) {
        timerRef.current = null
        busyRef.current = false
        setBusy(false)
        return
      }
      timerRef.current = window.setTimeout(runSlice, 0)
    }

    timerRef.current = window.setTimeout(runSlice, 0)
  }

  const reset = () => {
    generationRef.current += 1
    clearTimer()
    busyRef.current = false
    setBusy(false)
    const next = CharModel.create(SEED)
    setModel(next)
    publish(next, prefixRef.current)
  }

  return (
    <section className={styles.screen}>
      <header className={styles.header}>
        <h1 className={styles.title}>Символьная модель</h1>
        <p className={styles.lead}>
          Сеть заучивает короткий текст и дописывает хвост по текущему началу.
          Ошибка и хвост берутся из снимка ядра.
        </p>
      </header>

      <div>
        <h2 className={styles.label}>Учебный текст</h2>
        <pre className={styles.corpus}>{CORPUS}</pre>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Начало</span>
        <input
          className={styles.input}
          value={prefix}
          onChange={(event) => onPrefixChange(event.target.value)}
        />
      </label>

      <p className={styles.loss}>
        Ошибка: <strong>{snapshot.loss.toFixed(4)}</strong>
      </p>
      <p className={styles.tail}>
        Хвост: <strong>{snapshot.continuation}</strong>
      </p>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          disabled={busy}
          onClick={step}
        >
          Шаг
        </button>
        <button
          type="button"
          className={styles.button}
          disabled={busy}
          onClick={train}
        >
          Обучить
        </button>
        <button
          type="button"
          className={styles.buttonSecondary}
          onClick={reset}
        >
          Сброс
        </button>
      </div>
    </section>
  )
}
