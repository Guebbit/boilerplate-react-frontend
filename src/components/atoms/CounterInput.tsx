import type { ChangeEvent } from 'react';

interface CounterInputProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function CounterInput({ value, onChange, min, max }: CounterInputProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value);
    if (!Number.isFinite(nextValue)) return;
    if (typeof min === 'number' && nextValue < min) return;
    if (typeof max === 'number' && nextValue > max) return;
    onChange(nextValue);
  };

  return (
    <input
      className="theme-input"
      type="number"
      value={value}
      min={min}
      max={max}
      onChange={handleChange}
      aria-label="Counter value"
    />
  );
}
