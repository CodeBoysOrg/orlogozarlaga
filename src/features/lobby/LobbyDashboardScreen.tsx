"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  Coins,
  ReceiptText,
  Users,
} from "lucide-react";
import InputField from "@/components/ui/InputField";
import TransactionRow from "@/components/ui/TransactionRow";
import { formatIsoDate, formatMonthLabel, formatYen } from "../dashboard/format";
import {
  createMockLobbyTransaction,
  getMockLobbyById,
  getMockLobbySummary,
  getMockMemberSummary,
  listMockLobbyMembers,
  listMockLobbyTransactions,
} from "./mock-store";
import type {
  CreateLobbyTransactionInput,
  Lobby,
  LobbyMember,
  LobbyMemberContribution,
  LobbySummary,
  LobbyTransaction,
} from "./types";

type LobbyDashboardScreenProps = {
  lobbyId: string;
};

type MeResponse = {
  success: boolean;
  data?: {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
    };
  };
};

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function LobbyDashboardScreen({
  lobbyId,
}: LobbyDashboardScreenProps) {
  const [month, setMonth] = useState(getCurrentMonth());
  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [members, setMembers] = useState<LobbyMember[]>([]);
  const [summary, setSummary] = useState<LobbySummary | null>(null);
  const [memberSummary, setMemberSummary] = useState<LobbyMemberContribution[]>([]);
  const [transactions, setTransactions] = useState<LobbyTransaction[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CreateLobbyTransactionInput>({
    memberId: "",
    type: "EXPENSE",
    category: "",
    amount: 0,
    description: "",
    date: `${getCurrentMonth()}-01T00:00:00.000Z`,
  });

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as MeResponse;
        if (!mounted || !response.ok || !payload.success) return;

        const nextUserId = payload.data?.user?.id;
        if (nextUserId) {
          setCurrentUserId(nextUserId);
        }
      } catch {
        if (mounted) {
          setCurrentUserId(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const nextLobby = getMockLobbyById(lobbyId);
    if (!nextLobby) {
      setError("Lobby not found");
      return;
    }

    const nextMembers = listMockLobbyMembers(lobbyId);
    const nextSummary = getMockLobbySummary(lobbyId, month);
    const nextTransactions = listMockLobbyTransactions({
      lobbyId,
      month,
      page: 1,
      pageSize: 20,
    });

    setLobby(nextLobby);
    setMembers(nextMembers);
    setSummary(nextSummary);
    setMemberSummary(getMockMemberSummary(lobbyId, month));
    setTransactions(nextTransactions.items);
    setError(null);

    const matchingMember =
      nextMembers.find((member) => member.id === currentUserId) ?? nextMembers[0];

    if (matchingMember && form.memberId !== matchingMember.id) {
      setForm((current) => ({
        ...current,
        memberId: matchingMember.id,
      }));
    }
  }, [currentUserId, form.memberId, lobbyId, month]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.memberId || !form.category.trim() || form.amount <= 0 || !form.date) {
      setError("Fill member, category, amount, and date.");
      return;
    }

    setSubmitting(true);
    try {
      createMockLobbyTransaction(lobbyId, {
        ...form,
        category: form.category.trim(),
        description: form.description?.trim(),
      });

      const nextLobby = getMockLobbyById(lobbyId);
      const nextSummary = getMockLobbySummary(lobbyId, month);
      const nextTransactions = listMockLobbyTransactions({
        lobbyId,
        month,
        page: 1,
        pageSize: 20,
      });

      setLobby(nextLobby);
      setSummary(nextSummary);
      setTransactions(nextTransactions.items);
      setMemberSummary(getMockMemberSummary(lobbyId, month));
      setForm((current) => ({
        ...current,
        category: "",
        amount: 0,
        description: "",
      }));
      setError(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to add transaction");
    } finally {
      setSubmitting(false);
    }
  };

  if (!lobby || !summary) {
    return (
      <div className="panel-surface rounded-[1.75rem] p-6 text-sm text-[#4a6559]">
        {error ?? "Loading lobby..."}
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      <section className="panel-surface relative overflow-hidden rounded-[2rem] border border-[#d9e6de] px-5 py-6 sm:px-6 sm:py-7">
        <div className="absolute inset-0 bg-linear-to-br from-[#f9fffc] via-transparent to-[#e2f1e8]" />
        <div className="relative">
          <Link
            href="/lobby"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2e5e54] hover:text-[#173a30]">
            <ArrowLeft size={16} />
            Back to lobby list
          </Link>

          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f8579]">
                {lobby.id}
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-[#173a30] sm:text-4xl">
                {lobby.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4a6559]">
                {lobby.description || "No description"}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                  Current balance
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#173a30]">
                  {formatYen(lobby.balance)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                  Month
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#173a30]">
                  {formatMonthLabel(month)}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                  Members
                </p>
                <p className="mt-2 text-2xl font-semibold text-[#173a30]">
                  {summary.memberCount}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="panel-surface rounded-2xl border border-[#d8e4dd] p-4">
          <div className="flex items-center gap-2 text-[#2e5e54]">
            <Coins size={16} />
            <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Monthly income</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#173a30]">
            {formatYen(summary.monthlyIncome)}
          </p>
        </div>
        <div className="panel-surface rounded-2xl border border-[#d8e4dd] p-4">
          <div className="flex items-center gap-2 text-[#2e5e54]">
            <ReceiptText size={16} />
            <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Monthly expense</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#173a30]">
            {formatYen(summary.monthlyExpense)}
          </p>
        </div>
        <div className="panel-surface rounded-2xl border border-[#d8e4dd] p-4">
          <div className="flex items-center gap-2 text-[#2e5e54]">
            <Users size={16} />
            <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Active members</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#173a30]">{members.length}</p>
        </div>
        <div className="panel-surface rounded-2xl border border-[#d8e4dd] p-4">
          <div className="flex items-center gap-2 text-[#2e5e54]">
            <Calendar size={16} />
            <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Transactions</p>
          </div>
          <p className="mt-2 text-2xl font-semibold text-[#173a30]">{transactions.length}</p>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-4">
          <div className="panel-surface rounded-[1.75rem] border border-[#d8e4dd] p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
                  Lobby dashboard
                </p>
                <h2 className="mt-1 text-xl font-semibold text-[#173a30]">
                  Recent transactions
                </h2>
              </div>

              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                className="rounded-xl border border-[#d9e6de] bg-white/85 px-3 py-2 text-sm text-[#173a30] outline-none focus:border-[#2f8f70]"
              />
            </div>

            <div className="mt-5 space-y-3">
              {transactions.map((transaction) => (
                <TransactionRow
                  key={transaction.id}
                  Icon={transaction.type === "INCOME" ? ArrowUpRight : ReceiptText}
                  title={transaction.category}
                  meta={`${transaction.member.user.name} • ${formatIsoDate(transaction.date)}`}
                  amount={`${transaction.type === "EXPENSE" ? "-" : "+"}${formatYen(transaction.amount)}`}
                  amountClassName={
                    transaction.type === "EXPENSE"
                      ? "text-lg md:text-xl text-end font-semibold text-[#7a4727]"
                      : "text-lg md:text-xl text-end font-semibold text-[#1c5b48]"
                  }
                />
              ))}

              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-[#d9e6de] bg-white/85 px-4 py-6 text-sm text-[#4a6559]">
                  No transactions for this month yet.
                </div>
              ) : null}
            </div>
          </div>

          <div className="panel-surface rounded-[1.75rem] border border-[#d8e4dd] p-5 sm:p-6">
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Member summary
            </p>
            <h2 className="mt-1 text-xl font-semibold text-[#173a30]">
              Contribution and spending
            </h2>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {memberSummary.map((member) => (
                <div
                  key={member.memberId}
                  className="rounded-2xl border border-[#d9e6de] bg-white/85 p-4">
                  <p className="text-base font-semibold text-[#173a30]">{member.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                    {member.role}
                  </p>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                        Income
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#1c5b48]">
                        {formatYen(member.totalIncome)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                        Expense
                      </p>
                      <p className="mt-1 text-lg font-semibold text-[#7a4727]">
                        {formatYen(member.totalExpense)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="panel-surface rounded-[1.75rem] border border-[#d8e4dd] p-5 sm:p-6">
          <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
            Add transaction
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#173a30]">
            Mock contract form
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#4a6559]">
            This form uses the contract fields: `memberId`, `type`, `category`,
            `amount`, `description`, and `date`.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div className="rounded-xl border border-[#d4e3d9] bg-[#f4faf6] p-2.5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#4f665c]">
                Type
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["INCOME", "EXPENSE"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((current) => ({ ...current, type }))}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${
                      form.type === type
                        ? "bg-[#1e4f48] text-white"
                        : "border border-[#d5e3da] bg-white text-[#2f4b41]"
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <InputField
              label="Category"
              type="text"
              placeholder="Monthly Contribution"
              value={form.category}
              onChange={(event) =>
                setForm((current) => ({ ...current, category: event.target.value }))
              }
            />

            <InputField
              label="Amount"
              type="number"
              min={1}
              value={form.amount || ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  amount: Number(event.target.value),
                }))
              }
            />

            <InputField
              label="Date"
              type="date"
              value={form.date.slice(0, 10)}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  date: `${event.target.value}T00:00:00.000Z`,
                }))
              }
            />

            <div className="rounded-xl border border-[#d4e3d9] bg-[#f4faf6] p-2.5">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#4f665c]">
                Description
              </p>
              <textarea
                value={form.description ?? ""}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                rows={4}
                className="mt-1 w-full resize-none rounded-lg border border-[#d5e3da] bg-white px-2.5 py-2 outline-none focus:border-[#65a48b]"
                placeholder="April contribution"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-linear-to-r from-[#2f8f70] to-[#2a7262] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(35,108,86,0.25)] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? "Saving..." : "Add transaction"}
            </button>
          </form>

          {error ? (
            <div className="mt-4 rounded-2xl border border-[#f0c9a6] bg-[#fff7ef] p-4 text-sm leading-6 text-[#7a4a1d]">
              {error}
            </div>
          ) : null}
        </aside>
      </section>
    </div>
  );
}
