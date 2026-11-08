import type { XorSample } from './dataset'
import type { NetworkSnapshot } from './snapshot'
import { Tensor } from './tensor'

export class Mlp {
  readonly w1: Tensor
  readonly b1: Tensor
  readonly w2: Tensor
  readonly b2: Tensor

  private constructor(w1: Tensor, b1: Tensor, w2: Tensor, b2: Tensor) {
    this.w1 = w1
    this.b1 = b1
    this.w2 = w2
    this.b2 = b2
  }

  static xorMlp(seed: number): Mlp {
    const rand = seededRandom(seed)
    const w1 = Tensor.from(
      [
        [rand(), rand()],
        [rand(), rand()],
      ],
      { requiresGrad: true },
    )
    const b1 = Tensor.from([[rand(), rand()]], { requiresGrad: true })
    const w2 = Tensor.from([[rand()], [rand()]], { requiresGrad: true })
    const b2 = Tensor.from([[rand()]], { requiresGrad: true })
    return new Mlp(w1, b1, w2, b2)
  }

  forwardRow(
    inputs: readonly [number, number],
    captureActivations = false,
  ): {
    output: Tensor
    activations?: NetworkSnapshot['activations']
  } {
    const x = Tensor.from([[inputs[0], inputs[1]]], { requiresGrad: true })
    const hiddenPre = x.matmul(this.w1).add(this.b1)
    const hidden = hiddenPre.sigmoid()
    const outPre = hidden.matmul(this.w2).add(this.b2)
    const output = outPre.sigmoid()

    const activations = captureActivations
      ? {
          input: [...inputs],
          hidden: hidden.toArray()[0],
          output: output.toArray()[0],
        }
      : undefined

    return { output, activations }
  }

  predict(inputs: readonly [number, number]): number[] {
    const { output } = this.forwardRow(inputs)
    return output.toArray()[0]
  }

  parameters(): Tensor[] {
    return [this.w1, this.b1, this.w2, this.b2]
  }

  snapshot(
    loss: number,
    lastActivations: NetworkSnapshot['activations'],
  ): NetworkSnapshot {
    return {
      loss,
      weights: {
        w1: this.w1.toArray(),
        b1: this.b1.toArray(),
        w2: this.w2.toArray(),
        b2: this.b2.toArray(),
      },
      activations: lastActivations,
    }
  }
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0
    return (state / 0x1_0000_0000) * 2 - 1
  }
}

export function mseLoss(
  predictions: Tensor[],
  samples: readonly XorSample[],
): Tensor {
  let total = Tensor.from([[0]], { requiresGrad: true })
  for (let i = 0; i < samples.length; i++) {
    const target = Tensor.from([[samples[i].target]], { requiresGrad: false })
    const diff = predictions[i].add(target.mul(Tensor.from([[-1]])))
    const sq = diff.mul(diff)
    total = total.add(sq)
  }
  const scale = Tensor.from([[1 / samples.length]], { requiresGrad: false })
  return total.mul(scale)
}
