import type { ReactNode } from 'react';

interface PagePlaceholderProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/** Temporary page shell used until each feature page is built. */
export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <section className="page">
      <h1 className="page__title">{title}</h1>
      {description && <p className="page__description">{description}</p>}
      {children}
    </section>
  );
}
