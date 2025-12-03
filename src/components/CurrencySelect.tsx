import { currencyToCountry } from "../utils/currencyUtils";
import type { Currency, CurrencyCode } from "../utils/currencyUtils";



type CurrencySelectProps = {
  label: string;
  selected: CurrencyCode;
  currencies: Currency[];
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (code: CurrencyCode) => void;
};

export function CurrencySelect({
  label,
  selected,
  currencies,
  isOpen,
  onToggle,
  onSelect,
}: CurrencySelectProps) {
  return (
    <div className="space-y-1.5 relative">
      <label className="text-xs font-medium text-slate-300 uppercase tracking-[0.12em]">
        {label}
      </label>

      <button
        type="button"
        onClick={onToggle}
        className="flex items-center gap-2 w-full justify-between h-12 rounded-2xl border border-slate-500/80 bg-slate-900/80 px-4 hover:bg-slate-900 hover:border-emerald-500/70 transition-colors"
      >
        <span className="flex items-center gap-2">
          <img
            src={`https://flagcdn.com/24x18/${currencyToCountry[selected]}.png`}
            className="w-6 h-4 rounded-sm object-cover"
            alt={selected}
          />
          <span className="font-semibold text-slate-50 tracking-wide text-sm">
            {selected}
          </span>
        </span>
        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-100 text-lg">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-2 z-20">
          <div className="max-h-64 overflow-y-auto pr-1">
            {currencies.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => onSelect(c.code as CurrencyCode)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left ${
                  c.code === selected
                    ? "bg-slate-800"
                    : "hover:bg-slate-800/80"
                }`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${
                    currencyToCountry[c.code as CurrencyCode]
                  }.png`}
                  className="w-6 h-4 rounded-sm object-cover"
                  alt={c.code}
                />
                <div className="flex flex-col">
                  <span className="font-medium text-slate-50 leading-tight text-sm">
                    {c.code}
                  </span>
                  <span className="text-slate-400 text-xs truncate">
                    {c.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
