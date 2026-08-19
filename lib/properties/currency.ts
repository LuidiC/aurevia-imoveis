const brlFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatCurrency(amountInCents: number): string {
  if (!Number.isSafeInteger(amountInCents) || amountInCents < 0) {
    throw new RangeError("amountInCents must be a non-negative safe integer.");
  }

  return brlFormatter.format(amountInCents / 100);
}
