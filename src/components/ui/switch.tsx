import * as React from "react"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  label?: string
}

export function Switch({ checked, onCheckedChange, label, ...props }: SwitchProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-muted-foreground mb-1 flex-1">{label}</label>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onCheckedChange(e.target.checked)}
        className="w-10 h-5 rounded-full bg-muted checked:bg-primary focus:outline-none transition-colors cursor-pointer"
        {...props}
      />
    </div>
  )
}
