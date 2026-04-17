"use client";

import React, { useState } from "react";
import StatCard from "@/components/ui/StatCard";
import {
  useDashboard,
} from "@/features/dashboard/DashboardProvider";
import { getCopy } from "@/features/settings/copy";
import { useUserPreferences } from "@/features/settings/useUserPreferences";
import {
  formatMonthLabel,
  formatYen,
  shiftMonth,
} from "@/features/dashboard/format";

const SummaryPanel = () => {
  const { month, setMonth, summary, isLoadingMonthData } = useDashboard();
  const { preferences } = useUserPreferences();
  const copy = getCopy(preferences.language);
  const locale = preferences.language === "MN" ? "mn-MN" : "en-US";
  const [wrap, setWrap] = useState(false);

  return (
    <div className="panel-surface flex flex-col items-center gap-3 rounded-3xl p-3">
      <div className="flex w-full items-center justify-center gap-2">
        <button
          className="theme-chip cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold"
          onClick={() => setMonth((current) => shiftMonth(current, -1))}>
          {"<"}
        </button>
        <button className="theme-button-secondary rounded-lg px-3 py-2 text-xs font-semibold">
          {formatMonthLabel(month, Number(preferences.monthStart), locale)}
        </button>
        <button
          className="theme-chip cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold"
          onClick={() => setMonth((current) => shiftMonth(current, 1))}>
          {">"}
        </button>
      </div>

      <div className="flex w-full flex-col gap-2 lg:flex-row">
        <div className="flex flex-1 flex-col gap-2">
          <StatCard
            title={copy.income}
            value={formatYen(
              summary.incomeTotal,
              preferences.currency,
              preferences.hideBalances,
            )}
            className="theme-card-income w-full"
            valueClassName="text-2xl text-end"
          />

          {(wrap ? summary.incomeByCategory : summary.incomeByCategory.slice(0, 2)).map(
            (item) => (
              <StatCard
                key={`income-${item.category}`}
                title={item.category}
                value={formatYen(
                  item.amount,
                  preferences.currency,
                  preferences.hideBalances,
                )}
                className="theme-surface-soft w-full"
                valueClassName="text-xl text-end"
              />
            ),
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <StatCard
            title={copy.expense}
            value={formatYen(
              summary.expenseTotal,
              preferences.currency,
              preferences.hideBalances,
            )}
            className="theme-card-expense w-full"
            valueClassName="text-2xl text-end"
          />

          {(wrap
            ? summary.expenseByCategory
            : summary.expenseByCategory.slice(0, 2)
          ).map((item) => (
            <StatCard
              key={`expense-${item.category}`}
              title={item.category}
              value={formatYen(
                item.amount,
                preferences.currency,
                preferences.hideBalances,
              )}
              className="theme-surface-soft w-full"
              valueClassName="text-xl text-end"
            />
          ))}
        </div>
      </div>

      {isLoadingMonthData && (
        <p className="theme-muted w-full px-1 text-center text-xs">
          {copy.monthSummaryLoading}
        </p>
      )}

      <button
        className="theme-button-secondary cursor-pointer rounded-lg px-2 py-1 text-xs font-medium"
        onClick={() => setWrap(!wrap)}>
        {wrap ? copy.showLess : copy.showMore}
      </button>
    </div>
  );
};

export default SummaryPanel;
