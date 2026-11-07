export type SlotStatus = 'empty' | 'ready'

export type Slot = {
  id: 'nn' | 'lab' | 'agent'
  title: string
  path: string
  status: SlotStatus
  note: string
}

export const slots: Slot[] = [
  {
    id: 'nn',
    title: 'Ядро сети',
    path: 'src/core/nn',
    status: 'empty',
    note: 'Тензор, autograd, MLP и trainer. Без React. Срез xor-training-lab.',
  },
  {
    id: 'lab',
    title: 'Лаборатория',
    path: 'src/ui/lab',
    status: 'empty',
    note: 'Граф нейронов, активации, веса, loss. Только снимок из core.',
  },
  {
    id: 'agent',
    title: 'Агент',
    path: 'src/core/agent',
    status: 'empty',
    note: 'Позже, отдельным срезом. Сейчас не трогать.',
  },
]
