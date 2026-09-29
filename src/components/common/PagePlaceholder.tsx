import type { ReactNode } from 'react';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  /** Bullet list telling teammates what will be built on this page. */
  planned?: string[];
  children?: ReactNode;
}

/** Temporary page shell used until each feature page is built. */
export function PagePlaceholder({ title, description, planned, children }: PagePlaceholderProps) {
  return (
    <section className="page">
      <header className="page__header">
        <h1 className="page__title">{title}</h1>
        {description && <p className="page__description">{description}</p>}
      </header>

      {children}

      {planned && planned.length > 0 && (
        <div className="planned">
          <h2 className="planned__title">Planned for this page</h2>
          <ul className="planned__list">
            {planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
