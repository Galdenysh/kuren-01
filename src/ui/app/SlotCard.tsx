import styles from './SlotCard.module.css'
import type { Slot } from './slots'

export function SlotCard({ slot }: { slot: Slot }) {
  return (
    <article className={styles.card}>
      <p className={styles.status}>
        {slot.status === 'empty' ? 'слот пуст' : 'готово'}
      </p>
      <h2>{slot.title}</h2>
      <p className={styles.path}>{slot.path}</p>
      <p>{slot.note}</p>
    </article>
  )
}
