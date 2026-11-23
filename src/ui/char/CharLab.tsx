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
 * Ядро считает шаг и снимок. React хранит учебный текст, модель, начало и последний снимок.
 */
export function CharLab() {
  const [text, setText] = useState(CORPUS)
  const [model, setModel] = useState(() => CharModel.create(SEED, CORPUS))
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

  const replaceModel = (nextText: string) => {
    generationRef.current += 1
    clearTimer()
    busyRef.current = false
    setBusy(false)
    const next = CharModel.create(SEED, nextText)
    setModel(next)
    publish(next, prefixRef.current)
  }

  const onTextChange = (value: string) => {
    setText(value)
    replaceModel(value)
  }

  const step = () => {
    if (busyRef.current || !model.hasWindows()) return
    model.trainStep()
    publish(model, prefixRef.current)
  }

  const train = () => {
    if (busyRef.current || !model.hasWindows()) return
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
    replaceModel(text)
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

      <div className={styles.block}>
        <label className={styles.field}>
          <span className={styles.label}>Учебный текст</span>
          <textarea
            className={styles.corpus}
            value={text}
            spellCheck={false}
            aria-describedby="corpus-rules"
            onChange={(event) => onTextChange(event.target.value)}
          />
        </label>
        <ul id="corpus-rules" className={styles.hint}>
          <li>
            Каждая строка — отдельная фраза. Сеть смотрит четыре предыдущих
            символа и учит следующий. Через перевод строки окно не переходит.
          </li>
          <li>
            Пробелы по краям строки снимаются. Если после этого в строке четыре
            символа или меньше, окна из неё нет.
          </li>
          <li>
            Когда окон нет совсем, «Шаг» и «Обучить» недоступны. Так бывает у
            пустого поля и у строки из одних пробелов.
          </li>
        </ul>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>Начало</span>
        <input
          className={styles.input}
          value={prefix}
          onChange={(event) => onPrefixChange(event.target.value)}
        />
      </label>

      <div className={styles.block}>
        <h2 className={styles.label}>Выход</h2>
        <ul className={styles.hint}>
          <li>
            Ошибка — число из снимка. До первого шага это среднее по окнам,
            после шага — ошибка последнего окна. Без окон число остаётся
            конечным.
          </li>
          <li>
            Хвост — {TAIL} символов после поля «Начало». Каждый символ — самый
            вероятный следующий из алфавита учебного текста. Пустой текст даёт
            пустой хвост.
          </li>
        </ul>
        <p className={styles.loss}>
          Ошибка: <strong>{snapshot.loss.toFixed(4)}</strong>
        </p>
        <p className={styles.tail}>
          Хвост: <strong>{snapshot.continuation}</strong>
        </p>
      </div>

      <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.button}
          disabled={busy || !model.hasWindows()}
          onClick={step}
        >
          Шаг
        </button>
        <button
          type="button"
          className={styles.button}
          disabled={busy || !model.hasWindows()}
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
