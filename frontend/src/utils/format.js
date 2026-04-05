const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

export const formatCurrencyInr = (value) => {
  const amount = Number(value || 0);
  return inrFormatter.format(amount);
};
