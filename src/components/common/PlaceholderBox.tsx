import type { ReactNode } from 'react';

interface PlaceholderBoxProps {
  label: string;
  note?: string;
  /** Taller boxes for areas like maps. */
  size?: 'sm' | 'md' | 'lg';
  children?: ReactNode;
}

/** Dashed box marking where a future feature will go. */
export function PlaceholderBox({ label, note, size = 'md', children }: PlaceholderBoxProps) {
  return (
    <div className={`placeholder-box placeholder-box--${size}`}>
      <strong className="placeholder-box__label">{label}</strong>
      {note && <span className="placeholder-box__note">{note}</span>}
      {children}
    </div>
  );
}
