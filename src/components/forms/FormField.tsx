interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  hint?: string;
  autoComplete?: string;
}

/** Labelled input. Visual only for now - nothing is submitted or stored. */
export function FormField({ id, label, type = 'text', placeholder, hint, autoComplete }: FormFieldProps) {
  return (
    <div className="form-field">
      <label htmlFor={id} className="form-field__label">
        {label}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="form-field__input"
      />
      {hint && <span className="form-field__hint">{hint}</span>}
    </div>
  );
}
