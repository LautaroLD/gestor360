export const FormatDate = (date: Date | string, longDate = false) => {
  return longDate
    ? new Date(date).toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(date).toLocaleDateString()
}
export const FormatCurrency = (amount: number | string) => {
  const numberAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numberAmount)
}