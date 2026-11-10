import { Trainer } from '../nn'
import type { TrainerTools } from './types'

/** Обёртка над публичным trainer: только снимок и шаг обучения. */
export function createTrainerTools(trainer: Trainer): TrainerTools {
  return {
    snapshot() {
      return trainer.forwardSnapshot()
    },
    trainStep() {
      return trainer.trainStep()
    },
  }
}
