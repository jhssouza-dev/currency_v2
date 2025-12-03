// src/services/currencyService.ts

import type {
  Currency,
  CurrencyCode,
  CurrenciesApiResponse,
} from "../utils/currencyUtils";


const BASE_URL = "https://api.frankfurter.app";

export async function fetchCurrencies(): Promise<Currency[]> {
  const response = await fetch(`${BASE_URL}/currencies`);

  if (!response.ok) {
    throw new Error("Failed to load currencies");
  }

  const data = (await response.json()) as CurrenciesApiResponse;

  return Object.entries(data).map(([code, name]) => ({
    code,
    name,
  }));
}

export async function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): Promise<number> {
  const response = await fetch(
    `${BASE_URL}/latest?amount=${amount}&from=${from}&to=${to}`
  );

  if (!response.ok) {
    throw new Error("Failed to convert");
  }

  const data = await response.json();
  return data.rates[to];
}
