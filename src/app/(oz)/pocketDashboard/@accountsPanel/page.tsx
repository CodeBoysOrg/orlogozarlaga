"use client";

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { useDashboard } from "@/features/dashboard/DashboardProvider";
import { getCopy } from "@/features/settings/copy";
import { useUserPreferences } from "@/features/settings/useUserPreferences";
import { formatYen } from "@/features/dashboard/format";

const AccountsPanel = () => {
  const { accounts, isLoadingAccounts, isSubmitting, error, createAccount } =
    useDashboard();
  const { preferences } = useUserPreferences();
  const copy = getCopy(preferences.language);
  const safeAccounts = Array.isArray(accounts) ? accounts : [];
  const totalBalance = safeAccounts.reduce(
    (sum, account) => sum + account.balance,
    0,
  );
  const [wrap, setWrap] = useState(false);
  const [name, setName] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleCreateAccount() {
    setFormError(null);

    const normalizedName = name.trim();
    if (!normalizedName) {
      setFormError("Account name is required.");
      return;
    }

    const success = await createAccount({
      name: normalizedName,
    });

    if (!success) {
      return;
    }

    setName("");
    setIsComposerOpen(false);
  }

  return (
    <div className="panel-surface flex flex-col gap-2 rounded-3xl p-3">
      <StatCard
        title={copy.totalBalance}
        value={formatYen(
          totalBalance,
          preferences.currency,
          preferences.hideBalances,
        )}
        className="theme-card-balance w-full"
        valueClassName="text-2xl text-end"
      />

      {safeAccounts.map((account, index) => {
        if (!wrap && index >= 2) return null;

        return (
          <StatCard
            key={account.id}
            title={account.name}
            value={formatYen(
              account.balance,
              preferences.currency,
              preferences.hideBalances,
            )}
            className="w-full"
            valueClassName="text-xl text-end"
          />
        );
      })}

      {isLoadingAccounts && (
        <p className="theme-muted px-1 text-xs">{copy.loadingAccounts}</p>
      )}

      {!isLoadingAccounts && !safeAccounts.length && (
        <p className="theme-empty-state rounded-lg px-2 py-3 text-center text-xs">
          {copy.noAccounts}
        </p>
      )}

      <div className="theme-surface-muted mt-1 rounded-2xl p-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="theme-muted text-[11px] font-semibold uppercase tracking-[0.16em]">
              {copy.createAccount}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsComposerOpen((open) => !open);
              setFormError(null);
            }}
            className="theme-button-secondary inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-semibold shadow-[0_6px_14px_rgba(26,70,55,0.08)]">
            {isComposerOpen ? (
              <>
                <X size={14} />
                {copy.close}
              </>
            ) : (
              <>
                <Plus size={14} />
                {copy.new}
              </>
            )}
          </button>
        </div>

        {isComposerOpen && (
          <div className="theme-card-default mt-2.5 rounded-xl p-2">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={60}
                placeholder={copy.accountName}
                className="theme-input min-w-0 flex-1 rounded-lg px-3 py-2 text-sm outline-none transition"
              />

              <button
                type="button"
                onClick={() => void handleCreateAccount()}
                disabled={isSubmitting || isLoadingAccounts}
                className="theme-button-primary rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
                {isSubmitting ? copy.creating : copy.add}
              </button>
            </div>

            {(formError || error) && (
              <p className="theme-status-error mt-2 rounded-lg px-2 py-1.5 text-xs">
                {formError ?? error}
              </p>
            )}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setWrap(!wrap)}
        disabled={!safeAccounts.length}
        className="theme-button-secondary mt-1 cursor-pointer rounded-lg px-2 py-1 text-xs font-medium">
        {wrap ? copy.showLess : copy.showMore}
      </button>
    </div>
  );
};

export default AccountsPanel;
