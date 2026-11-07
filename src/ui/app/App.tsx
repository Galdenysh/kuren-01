import styles from './App.module.css'
import { SlotCard } from './SlotCard'
import { slots } from './slots'

export default function App() {
  return (
    <main className={styles.shell}>
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Kuren-01</p>
        <h1>Каркас учебной модели</h1>
        <p>
          Нейросеть ещё не написана. Агенты работают по OpenSpec: design → plan
          → TDD → проверки, один срез за сессию.
        </p>
      </header>

      <section className={styles.next}>
        <h2>Следующий срез</h2>
        <p>
          <code>xor-training-lab</code> — сначала тесты ядра, потом MLP 2→2→1,
          потом лаборатория. В Cursor: <code>/opsx-apply</code>.
        </p>
      </section>

      <section className={styles.slots}>
        {slots.map((slot) => (
          <SlotCard key={slot.id} slot={slot} />
        ))}
      </section>
    </main>
  )
}
