import { MONTHS, MONTHS_SHORT } from '../data/navigation.js';

/** Franja de 12 meses que diferencia plantación y floración. */
export default function MonthStrip({ planting = [], bloom = [], currentMonth = new Date().getMonth() + 1 }) {
  return (
    <div className="month-strip">
      <ol className="month-strip__months">
        {MONTHS_SHORT.map((label, i) => {
          const month = i + 1;
          const plant = planting.includes(month);
          const flower = bloom.includes(month);
          const states = [plant && 'plantación', flower && 'floración'].filter(Boolean).join(' y ') || 'sin actividad destacada';
          return (
            <li
              key={label}
              className={`month-strip__cell ${plant ? 'is-plant' : ''} ${flower ? 'is-bloom' : ''} ${month === currentMonth ? 'is-current' : ''}`}
              title={`${MONTHS[i]}: ${states}`}
            >
              <span className="month-strip__label">{label}</span>
              <span className="month-strip__bars" aria-hidden="true">
                <i className="bar-plant" />
                <i className="bar-bloom" />
              </span>
              <span className="sr-only">{MONTHS[i]}: {states}</span>
            </li>
          );
        })}
      </ol>
      <div className="month-strip__legend">
        <span><i className="legend legend--plant" /> Plantación / siembra</span>
        <span><i className="legend legend--bloom" /> Floración</span>
      </div>
    </div>
  );
}
