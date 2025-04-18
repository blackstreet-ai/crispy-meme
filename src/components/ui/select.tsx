import * as React from "react"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function Select({ options, value, onChange, label, ...props }: SelectProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      {label && <label className="text-xs font-medium text-muted-foreground mb-1">{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-md px-3 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}
