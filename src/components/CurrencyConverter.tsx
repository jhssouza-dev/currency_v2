import { useState, useEffect } from "react";

export function CurrencyConverter() {
  type CurrenciesApiResponse = Record<string, string>;
  type Currency = {
    code: string;
    name: string;
  };
  const [currencies, setCurrencies] = useState<Currency[]>([]);

  const [amount, setAmount] = useState<string>("");
  const [fromCurrency, setFromCurrency] = useState<string>("");
  const [toCurrency, setToCurrency] = useState<string>("");
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    async function loadCurrencies() {
      const response = await fetch("https://api.frankfurter.app/currencies");
      const dados = (await response.json()) as CurrenciesApiResponse;
      const arrayDados = Object.entries(dados);
      const lista = arrayDados.map(([code, name]) => {
        return { code, name };
      });
      setCurrencies(lista);
    }
    loadCurrencies();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const responseResult = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );
    const dadosResult = await responseResult.json();
    const valueResult = dadosResult.rates[toCurrency];
    setResult(valueResult);
  }

  return (
    <div className="w-full h-full max-w-xl bg-slate-800 p-6 rounded-2xl shadow-xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-slate-300 text-2xl font-semibold">
          Currency Converter
        </h1>
        <p className="text-sm text-slate-300">
          Converta valores entre diferentes moedas.
        </p>
      </header>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Campo de valor */}
        <div className="space-y-1">
          <label htmlFor="amount" className="text-sm text-slate-200">
            Valor
          </label>
          <input
            id="amount"
            onChange={(event) => setAmount(event.target.value)}
            value={amount}
            type="number"
            placeholder="Ex: 100"
            className="w-full p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-100 outline-none"
          />
        </div>

        {/* Selects de moedas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="from" className="text-sm text-slate-200">
              De
            </label>
            <select
              id="from"
              onChange={(event) => setFromCurrency(event.target.value)}
              value={fromCurrency}
              className="w-full p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-100 outline-none"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label htmlFor="to" className="text-sm text-slate-200">
              Para
            </label>
            <select
              id="to"
              onChange={(event) => setToCurrency(event.target.value)}
              value={toCurrency}
              className="w-full p-2 rounded-lg bg-slate-900/60 border border-slate-700 text-slate-100 outline-none"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão */}
        <button
          type="submit"
          className="w-full py-2 bg-emerald-500 text-slate-900 font-medium rounded-lg hover:bg-emerald-400 transition-colors"
        >
          Converter
        </button>
      </form>
      {result !== null && (
        <div className="text-slate-200 text-lg font-medium">
          {amount} {fromCurrency} = {result} {toCurrency}
        </div>
      )}
    </div>
  );
}
