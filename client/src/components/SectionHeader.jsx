import BotanicalDecor from './BotanicalDecor.jsx';

export default function SectionHeader({ eyebrow, title, text, align = 'center', as: Tag = 'h2', children }) {
  return (
    <header className={`section-header section-header--${align}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="section-header__title">{title}</Tag>
      {align === 'center' && <BotanicalDecor variant="divider" />}
      {text && <p className="section-header__text">{text}</p>}
      {children}
    </header>
  );
}
