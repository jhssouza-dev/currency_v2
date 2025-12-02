import { useEffect, useState } from "react";

// Mapa moeda → país (FlagCDN)
const currencyToCountry = {
  AUD: "au",
  EUR: "eu",
  BGN: "bg",
  BRL: "br",
  CAD: "ca",
  CHF: "ch",
  CNY: "cn",
  CZK: "cz",
  DKK: "dk",
  GBP: "gb",
  HKD: "hk",
  HUF: "hu",
  IDR: "id",
  ILS: "il",
  INR: "in",
  ISK: "is",
  JPY: "jp",
  KRW: "kr",
  MXN: "mx",
  MYR: "my",
  NOK: "no",
  NZD: "nz",
  PHP: "ph",
  PLN: "pl",
  RON: "ro",
  SEK: "se",
  SGD: "sg",
  THB: "th",
  TRY: "tr",
  USD: "us",
  ZAR: "za",
} as const;

type CurrencyCode = keyof typeof currencyToCountry;

type CurrenciesApiResponse = Record<string, string>;

type Currency = {
  code: string;
  name: string;
};

export function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>("EUR");
  const [toCurrency, setToCurrency] = useState<CurrencyCode>("USD");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rate, setRate] = useState<number | null>(null);

  const [isFromPickerOpen, setIsFromPickerOpen] = useState(false);
  const [isToPickerOpen, setIsToPickerOpen] = useState(false);

  useEffect(() => {
    async function loadCurrencies() {
      const response = await fetch("https://api.frankfurter.app/currencies");
      const data = (await response.json()) as CurrenciesApiResponse;
      const list = Object.entries(data).map(([code, name]) => ({
        code,
        name,
      }));
      setCurrencies(list);
    }

    loadCurrencies();
  }, []);

  useEffect(() => {
    setResult(null);
  }, [amount, fromCurrency, toCurrency]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (fromCurrency === toCurrency) {
      setError("Choose different currencies");
      return;
    }

    setError(null);

    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );
    const data = await response.json();

    const valueResult = data.rates[toCurrency];
    setResult(valueResult);

    const exchangeRate = valueResult / Number(amount);
    setRate(exchangeRate);
  }

  function handleSwap() {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult(null);
    setRate(null);
  }

  // Toggle dropdowns
  const toggleFromPicker = () => {
    setIsFromPickerOpen((prev) => !prev);
    setIsToPickerOpen(false);
  };

  const toggleToPicker = () => {
    setIsToPickerOpen((prev) => !prev);
    setIsFromPickerOpen(false);
  };

  function handleSelectFrom(code: CurrencyCode) {
    setFromCurrency(code);
    setIsFromPickerOpen(false);
  }

  function handleSelectTo(code: CurrencyCode) {
    setToCurrency(code);
    setIsToPickerOpen(false);
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-900/80 shadow-[0_18px_60px_rgba(15,23,42,0.9)] p-6 md:p-7 space-y-6">
        <header className="space-y-1">
          <h1 className="text-slate-50 text-2xl md:text-3xl font-semibold tracking-tight">
            Currency Converter
          </h1>
          <p className="text-sm text-slate-400">
            Convert values between different currencies in real time.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Campo de valor */}
          <div className="space-y-1.5">
            <label
              htmlFor="amount"
              className="text-xs font-medium text-slate-300 uppercase tracking-[0.12em]"
            >
              Value
            </label>
            <input
              id="amount"
              onChange={(event) => setAmount(event.target.value)}
              value={amount}
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex: 100"
              className="w-full h-11 rounded-xl bg-slate-900/70 border border-slate-700 px-3 text-slate-100 text-sm placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-emerald-500/70 focus:border-emerald-400 transition-all"
              autoFocus
            />
          </div>

          {/* Selects de moedas */}
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1.3fr)] gap-4 md:gap-3 items-end">
            {/* FROM */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-[0.12em]">
                From
              </label>

              <button
                type="button"
                onClick={toggleFromPicker}
                className="flex items-center gap-2 w-full justify-between h-12 rounded-2xl border border-slate-500/80 bg-slate-900/80 px-4 hover:bg-slate-900 hover:border-emerald-500/70 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/24x18/${currencyToCountry[fromCurrency]}.png`}
                    className="w-6 h-4 rounded-sm object-cover"
                    alt={fromCurrency}
                  />
                  <span className="font-semibold text-slate-50 tracking-wide text-sm">
                    {fromCurrency}
                  </span>
                </span>
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-100 text-lg">
                  ▾
                </span>
              </button>

              {isFromPickerOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-2 z-20">
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() =>
                          handleSelectFrom(c.code as CurrencyCode)
                        }
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left ${
                          c.code === fromCurrency
                            ? "bg-slate-800"
                            : "hover:bg-slate-800/80"
                        }`}
                      >
                        <img
                          src={`https://flagcdn.com/24x18/${currencyToCountry[c.code as CurrencyCode]}.png`}
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

            {/* Botão de Swap */}
            <div className="flex justify-center md:pb-1">
              <button
                type="button"
                onClick={handleSwap}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700 text-slate-100 hover:bg-slate-800 hover:border-emerald-500/70 transition-colors text-lg"
              >
                ⇆
              </button>
            </div>

            {/* TO */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-medium text-slate-300 uppercase tracking-[0.12em]">
                To
              </label>

              <button
                type="button"
                onClick={toggleToPicker}
                className="flex items-center gap-2 w-full justify-between h-12 rounded-2xl border border-slate-500/80 bg-slate-900/80 px-4 hover:bg-slate-900 hover:border-emerald-500/70 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <img
                    src={`https://flagcdn.com/24x18/${currencyToCountry[toCurrency]}.png`}
                    className="w-6 h-4 rounded-sm object-cover"
                    alt={toCurrency}
                  />
                  <span className="font-semibold text-slate-50 tracking-wide text-sm">
                    {toCurrency}
                  </span>
                </span>
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 text-slate-100 text-lg">
                  ▾
                </span>
              </button>

              {isToPickerOpen && (
                <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl p-2 z-20">
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {currencies.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleSelectTo(c.code as CurrencyCode)}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left ${
                          c.code === toCurrency
                            ? "bg-slate-800"
                            : "hover:bg-slate-800/80"
                        }`}
                      >
                        <img
                          src={`https://flagcdn.com/24x18/${currencyToCountry[c.code as CurrencyCode]}.png`}
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
          </div>

          {/* Botão Converter */}
          <button
            type="submit"
            className="w-full h-11 rounded-2xl bg-emerald-500 text-slate-950 font-semibold text-sm tracking-wide hover:bg-emerald-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={!amount}
          >
            Converter
          </button>
        </form>

        {/* Resultado / Erros */}
        <div className="space-y-1">
          {error && <p className="text-red-400 text-sm">{error}</p>}

          {result !== null && (
            <div className="text-slate-50 text-lg font-medium">
              <p className="mb-1">
                {amount} {fromCurrency} ={" "}
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: toCurrency,
                }).format(result)}{" "}
                {toCurrency}
              </p>
              {rate !== null && (
                <p className="text-slate-400 text-xs">
                  Rate used: 1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
