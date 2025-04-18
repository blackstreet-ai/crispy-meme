import * as React from "react"

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Slider({ min = 0, max = 100, step = 1, value, onChange, label, ...props }: SliderProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="text-xs font-medium text-muted-foreground mb-1">{label}</label>}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full accent-primary h-2 rounded-lg appearance-none bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      />
      <div className="text-xs text-right text-muted-foreground">{value}</div>
    </div>
  )
}
