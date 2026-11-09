import { XOR_DATASET } from '../../core/nn'
import styles from './InputProbePicker.module.css'

interface InputProbePickerProps {
  readonly selectedIndex: number
  readonly onSelect: (index: number) => void
}

function formatSample(index: number): string {
  const { inputs, target } = XOR_DATASET[index]!
  return `(${inputs[0]}, ${inputs[1]}) → ${target}`
}

export function InputProbePicker({
  selectedIndex,
  onSelect,
}: InputProbePickerProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>Вход на графе</legend>
      <p className={styles.hint}>
        Обучение каждый шаг идёт по всем четырём точкам. Здесь выбираешь, для
        какой пары показать активации.
      </p>
      <div className={styles.options} role="radiogroup" aria-label="Вход XOR">
        {XOR_DATASET.map((_, index) => {
          const id = `probe-${index}`
          return (
            <label key={id} className={styles.option}>
              <input
                type="radio"
                name="xor-probe"
                id={id}
                checked={selectedIndex === index}
                onChange={() => onSelect(index)}
              />
              <span className={styles.optionLabel}>{formatSample(index)}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
