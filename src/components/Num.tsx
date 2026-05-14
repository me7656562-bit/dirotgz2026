"use client";

type NumProps = {
  name: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export function Num({ name, label, value, onChange, min = 0, max = 50 }: NumProps) {
  return (
    <div>
      <label htmlFor={name} className="block text-xs font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-400">
        {label}
      </label>
      <div className="mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-stone-200 bg-white font-bold text-stone-700 hover:border-teal-400 hover:text-teal-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
        >
          −
        </button>
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          className="w-16 rounded-lg border border-stone-300 px-2 py-1 text-center text-sm font-semibold tabular-nums dark:border-stone-700 dark:bg-stone-800"
        />
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-stone-200 bg-white font-bold text-stone-700 hover:border-teal-400 hover:text-teal-700 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200"
        >
          +
        </button>
      </div>
    </div>
  );
}