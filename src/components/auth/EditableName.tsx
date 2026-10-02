import { useId, useRef, useState, type FormEvent } from 'react';
import { updateAccountName } from '../../services/authClient';
import { DISPLAY_NAME_MAX, cleanDisplayName, markDisplayNameSynced, saveDisplayName } from './authSession';
import './editableName.css';

interface EditableNameProps {
  /** Name shown now. */
  name: string;
  /** Email of the signed-in user. Leave out for a guest. */
  email?: string;
}

/** Shows the user's name with an "Edit name" button that opens a small rename form. */
export function EditableName({ name, email }: EditableNameProps) {
  const id = useId();
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const [error, setError] = useState('');

  const open = () => {
    setDraft(name);
    setError('');
    setEditing(true);
  };

  const close = () => {
    setEditing(false);
    window.setTimeout(() => editButtonRef.current?.focus(), 0);
  };

  const save = (event: FormEvent) => {
    event.preventDefault();
    const clean = cleanDisplayName(draft);
    if (!clean) return setError('Please enter a name.');
    if (clean !== name) {
      if (!saveDisplayName(clean, email)) {
        return setError('We could not save your name in this browser. Please try again.');
      }
      // Logged-in users: also save it to the account, in the background.
      if (email) {
        void updateAccountName({ email, name: clean }).then((saved) => {
          if (saved) markDisplayNameSynced(clean, email);
        });
      }
    }
    close();
  };

  if (!editing) {
    return (
      <span className="editable-name">
        <strong className="editable-name__value">{name}</strong>
        <button ref={editButtonRef} type="button" className="editable-name__edit" onClick={open}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 20 H8 L19 9 L15 5 L4 16 Z M13 7 L17 11" />
          </svg>
          Edit name
        </button>
      </span>
    );
  }

  return (
    <form className="editable-name editable-name--editing" onSubmit={save} noValidate>
      <label htmlFor={id} className="editable-name__label">
        Your name
      </label>
      <div className="editable-name__row">
        <input
          id={id}
          className="form-field__input editable-name__input"
          type="text"
          autoComplete="name"
          maxLength={DISPLAY_NAME_MAX}
          value={draft}
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') close();
          }}
        />
        <button type="submit" className="btn editable-name__save">
          Save
        </button>
        <button type="button" className="editable-name__cancel" onClick={close}>
          Cancel
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="editable-name__error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
