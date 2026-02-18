/**
 * Shared application constants
 * ស្ថិរភាព — កែប្រែតែកន្លែងនេះ
 */

/** KHR to USD exchange rate used across all financial calculations */
export const KHR_TO_USD_RATE = 4100

/** Convert an amount to USD equivalent */
export const toUSD = (amount: number, currency: string): number => {
  return currency === 'KHR' ? amount / KHR_TO_USD_RATE : amount
}

/** Convert an amount to KHR equivalent */
export const toKHR = (amount: number, currency: string): number => {
  return currency === 'KHR' ? amount : amount * KHR_TO_USD_RATE
}
