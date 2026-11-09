import type { NetworkSnapshot } from '../../core/nn'
import {
  listWeightEdges,
  type LabeledBias,
  type LabeledEdge,
} from './networkLayout'
import styles from './WeightView.module.css'

interface WeightViewProps {
  readonly snapshot: NetworkSnapshot
}

function EdgeTable({
  title,
  edges,
}: {
  readonly title: string
  readonly edges: readonly LabeledEdge[]
}) {
  return (
    <div className={styles.block}>
      <h4 className={styles.subheading}>{title}</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Откуда</th>
            <th className={styles.arrowCol} aria-hidden>
              →
            </th>
            <th>Куда</th>
            <th className={styles.numCol}>Вес</th>
            <th className={styles.codeCol}>В коде</th>
          </tr>
        </thead>
        <tbody>
          {edges.map((edge) => (
            <tr key={edge.id}>
              <td>{edge.fromLabel}</td>
              <td className={styles.arrowCol} aria-hidden>
                →
              </td>
              <td>{edge.toLabel}</td>
              <td className={styles.numCol}>{edge.weight.toFixed(3)}</td>
              <td className={styles.codeCol}>
                <code>{edge.code}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BiasTable({ biases }: { readonly biases: readonly LabeledBias[] }) {
  return (
    <div className={styles.block}>
      <h4 className={styles.subheading}>Смещения (bias)</h4>
      <p className={styles.biasLead}>
        Добавляются к сумме входов <em>до</em> sigmoid — отдельной стрелки на
        графе нет.
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Нейрон</th>
            <th className={styles.numCol}>Значение</th>
            <th className={styles.codeCol}>В коде</th>
          </tr>
        </thead>
        <tbody>
          {biases.map((bias) => (
            <tr key={bias.id}>
              <td>{bias.neuronLabel}</td>
              <td className={styles.numCol}>{bias.value.toFixed(3)}</td>
              <td className={styles.codeCol}>
                <code>{bias.code}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function WeightView({ snapshot }: WeightViewProps) {
  const { inputToHidden, hiddenToOutput, biases } = listWeightEdges(
    snapshot.weights,
  )

  return (
    <section className={styles.section}>
      <h3 className={styles.heading}>Веса по рёбрам</h3>
      <p className={styles.lead}>
        Одна строка = одна стрелка на графе. <strong>W₁[вход, скрытый]</strong>:
        первый индекс — вход (0 сверху, 1 снизу), второй — скрытый нейрон (0
        сверху, 1 снизу).
      </p>
      <div className={styles.stack}>
        <EdgeTable title="Вход → скрытый (W₁)" edges={inputToHidden} />
        <EdgeTable title="Скрытый → выход (W₂)" edges={hiddenToOutput} />
        <BiasTable biases={biases} />
      </div>
    </section>
  )
}
