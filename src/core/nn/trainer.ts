import type { XorSample } from './dataset'
import { mseLoss, Mlp } from './mlp'
import type { NetworkSnapshot } from './snapshot'
import { Tensor } from './tensor'

const DEFAULT_LR = 0.5

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

  trainStep(): NetworkSnapshot {
    const outputs: Tensor[] = []
    let activations: NetworkSnapshot['activations'] | undefined

    for (const sample of this.samples) {
      const { output, activations: captured } = this.mlp.forwardRow(
        sample.inputs,
        true,
      )
      outputs.push(output)
      activations = captured
    }

    const loss = mseLoss(outputs, this.samples)
    this.lastLoss = loss.at(0, 0)

    for (const p of this.mlp.parameters()) {
      p.zeroGrad()
    }
    loss.backward()

    for (const p of this.mlp.parameters()) {
      p.applyGrad(this.learningRate)
    }

    if (activations) {
      this.lastActivations = activations
    }

    return this.mlp.snapshot(this.lastLoss, this.lastActivations)
  }

  forwardSnapshot(): NetworkSnapshot {
    this.refreshForwardView()
    return this.mlp.snapshot(this.lastLoss, this.lastActivations)
  }

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
