export const OTP_LENGTH = 6;

interface OtpInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  invalid?: boolean;
  describedBy?: string;
}

/** Single box for the emailed code. Digits only; phones offer the code from the keyboard. */
export function OtpInput({ id, value, onChange, disabled, invalid, describedBy }: OtpInputProps) {
  return (
    <input
      id={id}
      name="otp"
      className="form-field__input auth-otp"
      type="text"
      inputMode="numeric"
      autoComplete="one-time-code"
      pattern="[0-9]*"
      maxLength={OTP_LENGTH}
      placeholder={'•'.repeat(OTP_LENGTH)}
      value={value}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      autoFocus
      onChange={(event) => onChange(event.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH))}
    />
  );
}
