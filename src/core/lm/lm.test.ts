import { describe, expect, it } from 'vitest'
import { CharModel, readCorpus } from './index'

const SEED = 42
/** Короткий корпус заучивается за это число шагов. */
const TRAIN_STEPS = 4_000
const TAIL = 6

function phrases(corpus: string): string[] {
  return corpus
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function alphabetOf(corpus: string): Set<string> {
  return new Set([...corpus])
}

/** Начало из символов корпуса, которого нет в тексте. */
function unfamiliarPrefix(corpus: string): string {
  const alphabet = [...alphabetOf(corpus)].filter((char) => char !== '\n')
  for (const left of alphabet) {
    for (const right of alphabet) {
      const candidate = `${left}${right}${left}${right}`
      if (!corpus.includes(candidate)) {
        return candidate
      }
    }
  }
  throw new Error('В корпусе не нашлось незнакомого начала')
}

function assertNoParameterArrays(value: unknown): void {
  if (Array.isArray(value)) {
    throw new Error('В снимке не должно быть массивов параметров')
  }
  if (value !== null && typeof value === 'object') {
    for (const child of Object.values(value)) {
      assertNoParameterArrays(child)
    }
  }
}

describe('character language model', () => {
  it('reads the same corpus of several phrases', () => {
    const first = readCorpus()
    const second = readCorpus()
    expect(first).toBe(second)
    expect(phrases(first).length).toBeGreaterThan(1)
  })

  it('returns a non-negative loss and lowers it on the training window', () => {
    const model = CharModel.create(SEED)
    const start = model.loss()
    expect(start).toBeGreaterThan(0)
    expect(model.trainStep()).toBeGreaterThanOrEqual(0)

    for (let step = 0; step < TRAIN_STEPS; step++) {
      model.trainStep()
    }

    expect(model.loss()).toBeLessThan(start)
  })

  it('continues a seen phrase with the corpus text', () => {
    const corpus = readCorpus()
    const phrase = phrases(corpus).reduce((longest, line) =>
      line.length > longest.length ? line : longest,
    )
    expect(phrase.length).toBeGreaterThan(TAIL)
    const prefix = phrase.slice(0, phrase.length - TAIL)
    const expected = phrase.slice(phrase.length - TAIL)

    const model = CharModel.create(SEED)
    for (let step = 0; step < TRAIN_STEPS; step++) {
      model.trainStep()
    }

    const tail = model.continue(prefix, TAIL)
    const alphabet = alphabetOf(corpus)
    expect([...tail].every((char) => alphabet.has(char))).toBe(true)
    expect(tail).toBe(expected)
  })

  it('continues an unfamiliar prefix from the alphabet and returns a plain snapshot', () => {
    const corpus = readCorpus()
    const prefix = unfamiliarPrefix(corpus)
    const model = CharModel.create(SEED)
    for (let step = 0; step < TRAIN_STEPS; step++) {
      model.trainStep()
    }

    const tail = model.continue(prefix, TAIL)
    const alphabet = alphabetOf(corpus)
    expect(tail).toHaveLength(TAIL)
    expect([...tail].every((char) => alphabet.has(char))).toBe(true)

    const snap = model.snapshot(prefix, TAIL)
    expect(typeof snap.loss).toBe('number')
    expect(Number.isFinite(snap.loss)).toBe(true)
    expect(snap.continuation).toBe(tail)
    expect(Object.keys(snap).sort()).toEqual(['continuation', 'loss'])
    assertNoParameterArrays(snap)
  })

  it('memorizes caller text and stays finite when there are no windows', () => {
    const fixed = readCorpus()
    const phrase = 'зебра ела сено'
    expect(fixed.includes(phrase)).toBe(false)
    expect(phrase.length).toBeGreaterThan(TAIL)
    const prefix = phrase.slice(0, phrase.length - TAIL)
    const expected = phrase.slice(phrase.length - TAIL)

    const model = CharModel.create(SEED, phrase)
    for (let step = 0; step < TRAIN_STEPS; step++) {
      model.trainStep()
    }

    expect(model.continue(prefix, TAIL)).toBe(expected)
    expect(readCorpus()).toBe(fixed)
    expect(model.hasWindows()).toBe(true)

    const empty = CharModel.create(SEED, '')
    const blanks = CharModel.create(SEED, '   ')
    expect(empty.hasWindows()).toBe(false)
    expect(blanks.hasWindows()).toBe(false)

    for (const blank of [empty, blanks]) {
      const before = blank.loss()
      expect(Number.isFinite(before)).toBe(true)
      expect(before).toBeGreaterThanOrEqual(0)
      const beforeTail = blank.snapshot(prefix, TAIL).continuation
      expect(() => blank.trainStep()).not.toThrow()
      const snap = blank.snapshot(prefix, TAIL)
      expect(Number.isFinite(snap.loss)).toBe(true)
      expect(snap.loss).toBeGreaterThanOrEqual(0)
      expect(snap.continuation).toBe(beforeTail)
    }

    expect(empty.snapshot(prefix, TAIL).continuation).toBe('')
  })
})
