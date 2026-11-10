import type { XorSample } from './dataset'
import { mseLoss, Mlp } from './mlp'
import type { NetworkSnapshot } from './snapshot'
import { Tensor } from './tensor'

/** Скорость обучения (learning rate) по умолчанию */
const DEFAULT_LR = 0.5

/**
 * Цикл обучения: связывает {@link Mlp}, датасет и autograd.
 * Кнопка «Шаг» в UI зовёт {@link trainStep}; граф — {@link probeSnapshot}.
 */
export class Trainer {
  private readonly mlp: Mlp
  private readonly samples: readonly XorSample[]
  private readonly learningRate: number
  private lastLoss = 0
  private lastActivations: NetworkSnapshot['activations'] = {
    input: [0, 0],
    hidden: [0, 0],
    output: [0],
  }

  /**
   * @param mlp — сеть с обучаемыми весами
   * @param samples — обычно `XOR_DATASET`; каждый шаг обучения по всему списку
   * @param learningRate — множитель SGD (`applyGrad`), по умолчанию 0.5
   */
  constructor(
    mlp: Mlp,
    samples: readonly XorSample[],
    learningRate = DEFAULT_LR,
  ) {
    this.mlp = mlp
    this.samples = samples
    this.learningRate = learningRate
    this.refreshForwardView()
  }

  /**
   * Один шаг обучения: forward по всем примерам → loss → backward → update весов.
   * Веса и loss в снимке — после update; активации — с refresh (первый пример датасета).
   */
  trainStep(): NetworkSnapshot {
    const outputs: Tensor[] = []

    // 1) Forward по всем 4 примерам XOR
    for (const sample of this.samples) {
      const { output } = this.mlp.forwardRow(sample.inputs, true)
      outputs.push(output)
    }

    // 2) Один loss на всех (среднеквадратичная ошибка)
    const loss = mseLoss(outputs, this.samples)
    this.lastLoss = loss.at(0, 0)

    // 3) Backward: градиенты от loss к весам
    for (const p of this.mlp.parameters()) {
      p.zeroGrad()
    }
    loss.backward() // градиенты в p.grad у тех же тензоров, что w1…b2

    // 4) Update весов (шаг SGD): data -= lr * grad
    for (const p of this.mlp.parameters()) {
      p.applyGrad(this.learningRate)
    }

    // Loss и веса в снимке — уже после update (для графика и лога агента)
    this.refreshForwardView()

    return this.mlp.snapshot(this.lastLoss, this.lastActivations)
  }

  /**
   * Пересчитать loss по всему датасету **без** update; вернуть снимок.
   * Старт лаборатории и тесты до первого `trainStep`.
   */
  forwardSnapshot(): NetworkSnapshot {
    this.refreshForwardView()
    return this.mlp.snapshot(this.lastLoss, this.lastActivations)
  }

  /**
   * Один forward для выбранного входа; только activations для графа.
   * Веса не меняются; обучение по-прежнему только в {@link trainStep}.
   */
  forwardActivations(
    inputs: readonly [number, number],
  ): NetworkSnapshot['activations'] {
    const { activations } = this.mlp.forwardRow(inputs, true)
    if (!activations) {
      throw new Error('forwardActivations: expected activations')
    }
    return activations
  }

  /**
   * Снимок для UI: текущие loss и веса, активации под выбранную пару битов.
   * Используется при переключении входа на графе (без обучения).
   */
  probeSnapshot(inputs: readonly [number, number]): NetworkSnapshot {
    return this.mlp.snapshot(this.lastLoss, this.forwardActivations(inputs))
  }

  /** Сохранить `lastLoss` и активации для первой строки датасета (0,0). */
  private refreshForwardView(): void {
    const sample = this.samples[0]
    const outputs: Tensor[] = []

    for (const s of this.samples) {
      const { output, activations } = this.mlp.forwardRow(
        s.inputs,
        s === sample,
      )
      outputs.push(output)
      if (activations) {
        this.lastActivations = activations
      }
    }

    const loss = mseLoss(outputs, this.samples)
    this.lastLoss = loss.at(0, 0)
  }
}
