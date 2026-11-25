import { Tensor } from '../tensor/tensor'
import { readCorpus } from './corpus'

/** Сколько последних символов подаётся на вход одним one-hot. */
const WINDOW = 4
/** Ширина скрытого слоя. */
const HIDDEN = 64
/** Шаг SGD. */
const LEARNING_RATE = 0.8
/** Множитель к seed-весам, чтобы sigmoid на старте не залипала. */
const INIT_SCALE = 0.15

export type CharSnapshot = {
  loss: number
  continuation: string
}

type Example = {
  context: string
  target: number
}

/**
 * Символьная модель: окно one-hot → скрытый sigmoid → softmax по алфавиту.
 * Ошибка шага — кросс-энтропия следующего символа.
 */
export class CharModel {
  private readonly alphabet: readonly string[]
  private readonly charIndex: Map<string, number>
  private readonly examples: readonly Example[]
  private readonly w1: Tensor
  private readonly b1: Tensor
  private readonly w2: Tensor
  private readonly b2: Tensor
  private cursor = 0
  private lastLoss = 0

  private constructor(seed: number, text?: string) {
    const corpus = text ?? readCorpus()
    this.alphabet = [...new Set(corpus)]
    this.charIndex = new Map(this.alphabet.map((char, index) => [char, index]))
    this.examples = windows(corpus, this.charIndex)
    const rand = seededRandom(seed)
    const input = WINDOW * this.alphabet.length
    this.w1 = matrix(input, HIDDEN, rand, INIT_SCALE)
    this.b1 = matrix(1, HIDDEN, rand, INIT_SCALE)
    this.w2 = matrix(HIDDEN, this.alphabet.length, rand, INIT_SCALE)
    this.b2 = matrix(1, this.alphabet.length, rand, INIT_SCALE)
    this.lastLoss = this.loss()
  }

  /**
   * Сеть с весами от `seed`. Один и тот же seed даёт те же стартовые числа.
   * Без `text` берётся фиксированный корпус. С `text` алфавит и окна строятся из него.
   */
  static create(seed: number, text?: string): CharModel {
    return new CharModel(seed, text)
  }

  /** Есть ли хотя бы одно учебное окно. Без окон шаг не двигает веса. */
  hasWindows(): boolean {
    return this.examples.length > 0
  }

  /** Средняя кросс-энтропия по учебным окнам, без шага по весам. */
  loss(): number {
    if (this.examples.length === 0) {
      return 0
    }
    let total = 0
    for (const example of this.examples) {
      total += this.stepLoss(example).at(0, 0)
    }
    return total / this.examples.length
  }

  /**
   * Один шаг: окно из текста, softmax, кросс-энтропия верного символа, SGD.
   * Возвращает ошибку этого окна до обновления весов.
   * Если окон нет, возвращает последнюю конечную ошибку и не вызывает backward.
   */
  trainStep(): number {
    if (this.examples.length === 0) {
      return this.lastLoss
    }
    const example = this.examples[this.cursor % this.examples.length]
    this.cursor += 1
    const loss = this.stepLoss(example)
    const value = loss.at(0, 0)
    for (const parameter of this.parameters()) {
      parameter.zeroGrad()
    }
    loss.backward()
    for (const parameter of this.parameters()) {
      parameter.applyGrad(LEARNING_RATE)
    }
    this.lastLoss = value
    return value
  }

  /**
   * Жадное продолжение: на каждом шаге символ с наибольшей вероятностью,
   * затем окно сдвигается.
   */
  continue(prefix: string, count: number): string {
    if (this.alphabet.length === 0) {
      return ''
    }
    let context = prefix
    let tail = ''
    for (let i = 0; i < count; i++) {
      const probs = this.probabilities(context.slice(-WINDOW)).toArray()[0]
      let best = 0
      for (let classIndex = 1; classIndex < probs.length; classIndex++) {
        if (probs[classIndex] > probs[best]) {
          best = classIndex
        }
      }
      const next = this.alphabet[best]
      tail += next
      context += next
    }
    return tail
  }

  /** Plain-снимок: последнее число ошибки и строка продолжения, без весов. */
  snapshot(prefix: string, count: number): CharSnapshot {
    return {
      loss: this.lastLoss,
      continuation: this.continue(prefix, count),
    }
  }

  private parameters(): Tensor[] {
    return [this.w1, this.b1, this.w2, this.b2]
  }

  /** Строка one-hot длины `WINDOW` × алфавит. Короткий контекст дополняется нулями слева. */
  private oneHot(context: string): number[] {
    const chars = context.slice(-WINDOW)
    const pad = WINDOW - chars.length
    const row = new Array<number>(WINDOW * this.alphabet.length).fill(0)
    for (let i = 0; i < chars.length; i++) {
      const classIndex = this.charIndex.get(chars[i])
      if (classIndex === undefined) {
        continue
      }
      row[(pad + i) * this.alphabet.length + classIndex] = 1
    }
    return row
  }

  private probabilities(context: string): Tensor {
    const input = Tensor.from([this.oneHot(context)])
    const hidden = input.matmul(this.w1).add(this.b1).sigmoid()
    return hidden.matmul(this.w2).add(this.b2).softmax()
  }

  private stepLoss(example: Example): Tensor {
    return this.probabilities(example.context).crossEntropy(example.target)
  }
}

function windows(corpus: string, charIndex: Map<string, number>): Example[] {
  const examples: Example[] = []
  for (const phrase of corpus.split('\n')) {
    const line = phrase.trim()
    for (let i = WINDOW; i < line.length; i++) {
      examples.push({
        context: line.slice(i - WINDOW, i),
        target: charIndex.get(line[i]) ?? 0,
      })
    }
  }
  return examples
}

function matrix(
  rows: number,
  cols: number,
  rand: () => number,
  scale: number,
): Tensor {
  const values: number[][] = []
  for (let r = 0; r < rows; r++) {
    const row: number[] = []
    for (let c = 0; c < cols; c++) {
      row.push(rand() * scale)
    }
    values.push(row)
  }
  return Tensor.from(values, { requiresGrad: true })
}

/** Псевдослучайное число в диапазоне (−1, 1) от целого seed. Один seed — одна последовательность. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return (state / 0x1_0000_0000) * 2 - 1
  }
}
