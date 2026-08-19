import assert from "node:assert/strict";
import test from "node:test";

import { formatCurrency } from "../lib/properties/currency";

test("formats integer cents as Brazilian reais", () => {
  assert.match(formatCurrency(65_000_000), /R\$\s*650\.000,00/);
});

test("rejects unsafe monetary input", () => {
  assert.throws(() => formatCurrency(10.5), RangeError);
  assert.throws(() => formatCurrency(-1), RangeError);
});
