/**
 * Одна размеченная точка XOR: два входа и ожидаемый класс (0 или 1).
 */
export interface XorSample {
  /** Значения на вход сети, например `(0, 1)`. */
  readonly inputs: readonly [number, number]
  /** Верный ответ (0 или 1) для этой пары входов; эталон при расчёте loss (`mseLoss`). */
  readonly target: number
}

/**
 * Весь учебный набор для среза: четыре строки XOR, больше ничего.
 * Каждый `trainStep` в trainer прогоняет все точки; loss усредняется.
 */
export const XOR_DATASET: readonly XorSample[] = [
  { inputs: [0, 0], target: 0 },
  { inputs: [0, 1], target: 1 },
  { inputs: [1, 0], target: 1 },
  { inputs: [1, 1], target: 0 },
]
