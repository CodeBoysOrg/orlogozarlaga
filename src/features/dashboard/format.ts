import { TransactionType } from "./types";

export function getCurrentMonthKey(monthStart = 1) {
  const now = new Date();
  const utcYear = now.getUTCFullYear();
  const utcMonth = now.getUTCMonth();
  const utcDate = now.getUTCDate();

  if (monthStart <= 1) {
    return `${utcYear}-${String(utcMonth + 1).padStart(2, "0")}`;
  }

  const effectiveDate =
    utcDate >= monthStart
      ? new Date(Date.UTC(utcYear, utcMonth + 1, 1))
      : new Date(Date.UTC(utcYear, utcMonth, 1));

  return `${effectiveDate.getUTCFullYear()}-${String(
    effectiveDate.getUTCMonth() + 1,
  ).padStart(2, "0")}`;
}

export function formatMonthLabel(
  month: string,
  monthStart = 1,
  locale = "en-US",
) {
  const [year, mon] = month.split("-");
  const y = Number(year);
  const m = Number(mon);
  if (Number.isNaN(y) || Number.isNaN(m)) return month;

  if (monthStart > 1) {
    const periodEnd = new Date(Date.UTC(y, m - 1, monthStart));
    const periodStart = new Date(Date.UTC(y, m - 2, monthStart));
    const displayEnd = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000);

    const startLabel = periodStart.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    const endLabel = displayEnd.toLocaleDateString(locale, {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });

    return `${startLabel} - ${endLabel}`;
  }

  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function shiftMonth(month: string, delta: number) {
  const [year, mon] = month.split("-");
  const y = Number(year);
  const m = Number(mon);
  if (Number.isNaN(y) || Number.isNaN(m)) return month;

  const next = new Date(Date.UTC(y, m - 1 + delta, 1));
  const nextYear = next.getUTCFullYear();
  const nextMonth = String(next.getUTCMonth() + 1).padStart(2, "0");
  return `${nextYear}-${nextMonth}`;
}

export function formatMoney(
  amount: number,
  currency: "JPY" | "MNT" | "USD" = "JPY",
  hidden = false,
) {
  if (hidden) {
    return currency === "JPY" ? "•••• ￥" : currency === "USD" ? "$••••" : "•••• ₮";
  }

  const symbol = currency === "JPY" ? "￥" : currency === "USD" ? "$" : "₮";
  const formatted = amount.toLocaleString("en-US");
  return currency === "USD" ? `${symbol}${formatted}` : `${formatted} ${symbol}`;
}

export function formatYen(
  amount: number,
  currency: "JPY" | "MNT" | "USD" = "JPY",
  hidden = false,
) {
  return formatMoney(amount, currency, hidden);
}

export function formatSignedYen(
  type: TransactionType,
  amount: number,
  currency: "JPY" | "MNT" | "USD" = "JPY",
  hidden = false,
) {
  if (type === "TRANSFER") {
    return `↔ ${formatMoney(amount, currency, hidden)}`;
  }
  if (hidden) {
    return type === "EXPENSE"
      ? `- ${formatMoney(amount, currency, true)}`
      : `+ ${formatMoney(amount, currency, true)}`;
  }
  const sign = type === "EXPENSE" ? "-" : "+";
  return `${sign}${formatMoney(amount, currency, false)}`;
}

export function formatIsoDate(date: string, locale = "en-US") {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "UTC",
  });
}
