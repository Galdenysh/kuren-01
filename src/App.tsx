import { slots } from './app/slots'

export default function App() {
  return (
    <main className="shell">
      <header className="hero">
        <p className="eyebrow">Kuren-01</p>
        <h1>Каркас учебной модели</h1>
        <p>
          Нейросеть ещё не написана. Это оболочка для следующих агентов: один
          OpenSpec-срез за сессию.
        </p>
      </header>

      <section className="next">
        <h2>Следующий срез</h2>
        <p>
          <code>xor-training-lab</code> — MLP 2→2→1 на XOR и визуал обучения.
          В Cursor: <code>/opsx-apply</code>.
        </p>
      </section>

      <section className="slots">
        {slots.map((slot) => (
          <article key={slot.id} className="card">
            <p className="status">{slot.status === 'empty' ? 'слот пуст' : 'готово'}</p>
            <h2>{slot.title}</h2>
            <p className="path">{slot.path}</p>
            <p>{slot.note}</p>
          </article>
        ))}
      </section>
    </main>
  )
}
