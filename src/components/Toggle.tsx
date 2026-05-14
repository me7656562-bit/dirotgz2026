"use client";

type ToggleProps = {
  name: string;
  label: string;
  emoji?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

export function Toggle({ name, label, emoji, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-stone-100 px-3 py-2.5 dark:border-stone-800">
      <span className="flex items-center gap-2 text-sm text-stone-700 dark:text-stone-300">
        {emoji && <span className="text-base">{emoji}</span>}
        {label}
      </span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-teal-600"
      />
    </label>
  );
}