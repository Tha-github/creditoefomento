import { solutionsContent } from '@/content/solutions';

import styles from './ReceivablesDiagram.module.css';

const BASELINE = 150;
const TODAY_X = 60;
const RECEIVABLES = [
  { x: 190, peak: 40 },
  { x: 290, peak: 10 },
  { x: 390, peak: -20 },
];
const DOCUMENT_WIDTH = 28;
const DOCUMENT_HEIGHT = 36;

/** Representa o conceito do produto: valores futuros trazidos para o presente. Sem datas nem valores. */
export function ReceivablesDiagram() {
  const { today, future, description } = solutionsContent.featured.diagram;
  const documentTop = BASELINE - DOCUMENT_HEIGHT;

  return (
    <figure className={styles.diagram}>
      <svg
        className={styles.svg}
        viewBox="0 0 480 170"
        width="480"
        height="170"
        fill="none"
        role="img"
        aria-label={description}
      >
        <line className={styles.line} x1="20" y1={BASELINE} x2="460" y2={BASELINE} />

        {RECEIVABLES.map(({ x, peak }) => (
          <g key={x}>
            <rect
              className={styles.line}
              x={x - DOCUMENT_WIDTH / 2}
              y={documentTop}
              width={DOCUMENT_WIDTH}
              height={DOCUMENT_HEIGHT}
            />
            <path
              className={styles.arc}
              d={`M${x} ${documentTop}C${x} ${peak} ${TODAY_X} ${peak} ${TODAY_X} ${BASELINE - 10}`}
            />
          </g>
        ))}

        <circle className={styles.ring} cx={TODAY_X} cy={BASELINE} r="10" />
        <circle className={styles.dot} cx={TODAY_X} cy={BASELINE} r="4" />
      </svg>

      <figcaption className={styles.labels} aria-hidden="true">
        <span className={styles.today}>{today}</span>
        <span className={styles.future}>{future}</span>
      </figcaption>
    </figure>
  );
}
