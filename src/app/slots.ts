export type SlotStatus = 'empty' | 'ready'

export type Slot = {
  id: 'nn' | 'viz' | 'agent'
  title: string
  path: string
  status: SlotStatus
  note: string
}

export const slots: Slot[] = [
  {
    id: 'nn',
    title: 'Ядро сети',
    path: 'src/nn',
    status: 'empty',
    note: 'Тензор, autograd, MLP и trainer. Срез xor-training-lab.',
  },
  {
    id: 'viz',
    title: 'Лаборатория',
    path: 'src/viz',
    status: 'empty',
    note: 'Граф нейронов, активации, веса, loss. Тот же срез.',
  },
  {
    id: 'agent',
    title: 'Агент',
    path: 'src/agent',
    status: 'empty',
    note: 'Позже, отдельным срезом. Сейчас не трогать.',
  },
]
