import { useState } from 'react';
import SectionHeader from '../components/SectionHeader.jsx';
import Loader from '../components/Loader.jsx';
import Mascot from '../components/Mascot.jsx';
import { ErrorState } from '../components/States.jsx';
import { useApi } from '../hooks/useApi.js';
import { metaService } from '../services/flowerService.js';

export default function Tips() {
  const { data, loading, error, reload } = useApi((signal) => metaService.tips({ signal }), []);
  const [topic, setTopic] = useState('');
  const [curiosityIndex, setCuriosityIndex] = useState(0);

  if (loading) return <Loader label="Reuniendo consejos…" />;
  if (error) return <div className="container page"><ErrorState error={error} onRetry={reload} /></div>;

  const tips = topic ? data.tips.filter((t) => t.topic === topic) : data.tips;
  const curiosity = data.curiosities[curiosityIndex % data.curiosities.length];

  return (
    <div className="container page">
      <SectionHeader as="h1" eyebrow="Aprende" title="Consejos botánicos" text="Buenas prácticas generales de jardinería. Cada ficha incluye además los cuidados específicos de su especie." />

      <div className="filters__chips filters__chips--center" role="group" aria-label="Filtrar consejos por tema">
        <button type="button" className={`chip chip--toggle ${!topic ? 'is-active' : ''}`} aria-pressed={!topic} onClick={() => setTopic('')}>Todos</button>
        {data.topics.map((t) => (
          <button key={t} type="button" className={`chip chip--toggle ${topic === t ? 'is-active' : ''}`} aria-pressed={topic === t} onClick={() => setTopic(t)}>{t}</button>
        ))}
      </div>

      <div className="tips-grid">
        {tips.map((tip, i) => (
          <article key={tip.id} className="tip-card fade-up" style={{ '--delay': `${i * 40}ms` }}>
            <span className="tip-card__icon" aria-hidden="true">{tip.icon}</span>
            <p className="tip-card__topic">{tip.topic}</p>
            <h2 className="tip-card__title">{tip.title}</h2>
            <p>{tip.text}</p>
          </article>
        ))}
      </div>

      <section className="curiosity card-surface" aria-live="polite">
        <Mascot expression="surprised" pose="idle" size={100} />
        <div>
          <p className="eyebrow">¿Sabías que…?</p>
          <p className="curiosity__text">{curiosity.text}</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setCuriosityIndex((i) => i + 1)}>✨ Otra curiosidad</button>
        </div>
      </section>
    </div>
  );
}
