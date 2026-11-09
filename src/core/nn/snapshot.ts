/** Снимок ядра для UI: ошибка, веса и числа на графе после одного forward. */
export interface NetworkSnapshot {
  readonly loss: number
  readonly weights: {
    readonly w1: number[][]
    readonly b1: number[][]
    readonly w2: number[][]
    readonly b2: number[][]
  }
  /**
   * Значения по слоям для графа. `hidden` и `output` — **после sigmoid** (активации нейронов).
   * `input` — исходные биты входа, не через sigmoid.
   */
  readonly activations: {
    /** Сырой вход (0/1), как на выбранной строке XOR. */
    readonly input: number[]
    /** Два скрытых нейрона после sigmoid. */
    readonly hidden: number[]
    /** Выходной нейрон после sigmoid (вероятность класса 1). */
    readonly output: number[]
  }
}
