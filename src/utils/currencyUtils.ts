// src/utils/currencyUtils.ts

export const currencyToCountry = {
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

export type CurrencyCode = keyof typeof currencyToCountry;

export type CurrenciesApiResponse = Record<string, string>;

export type Currency = {
  code: string;
  name: string;
};
