"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Coins, Plus, Users, Wallet } from "lucide-react";
import InputField from "@/components/ui/InputField";
import { createMockLobby, listMockLobbies } from "./mock-store";
import type { LobbyListItem } from "./types";
import { formatYen } from "../dashboard/format";

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

export default function LobbyListScreen() {
  const router = useRouter();
  const [lobbies, setLobbies] = useState<LobbyListItem[]>(() => listMockLobbies());
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        const payload = (await response.json()) as MeResponse;
        if (!mounted || !response.ok || !payload.success) return;

        const nextUser = payload.data?.user;
        if (!nextUser?.id || !nextUser.email) return;

        setCurrentUser({
          id: nextUser.id,
          name: nextUser.name?.trim() || nextUser.email,
          email: nextUser.email,
        });
      } catch {
        if (mounted) {
          setCurrentUser(null);
        }
      }
    };

    void loadCurrentUser();

    return () => {
      mounted = false;
    };
  }, []);

  const handleCreateLobby = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      setError("Current user is not available.");
      return;
    }

    if (!form.name.trim()) {
      setError("Lobby name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const lobby = createMockLobby({
        name: form.name,
        description: form.description,
        user: currentUser,
      });

      setLobbies(listMockLobbies());
      setForm({
        name: "",
        description: "",
      });
      setError(null);
      router.push(`/lobby/${lobby.id}`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Failed to create lobby");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <section className="panel-surface relative overflow-hidden rounded-[2rem] border border-[#d9e6de] px-5 py-6 sm:px-6 sm:py-7">
        <div className="absolute inset-0 bg-linear-to-br from-[#fbfffd] via-transparent to-[#e4efe8]" />
        <div className="relative flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="soft-text text-xs font-semibold uppercase tracking-[0.16em]">
              Shared Lobbies
            </p>
            <h1 className="mt-2 text-3xl font-semibold leading-tight text-[#173a30] sm:text-4xl">
              Pick a shared fund and move into its dashboard.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4a6559] sm:text-base">
              This mock frontend follows the lobby API contract. Each card maps to the
              contract&apos;s lobby resource and opens a dashboard with members, summary,
              transactions, and add-transaction flow.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 rounded-2xl border border-[#d8e4dd] bg-white/75 p-3 text-center">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Lobbies</p>
              <p className="mt-1 text-xl font-semibold text-[#173a30]">{lobbies.length}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Members</p>
              <p className="mt-1 text-xl font-semibold text-[#173a30]">
                {lobbies.reduce((sum, lobby) => sum + lobby.memberCount, 0)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">Balance</p>
              <p className="mt-1 text-xl font-semibold text-[#173a30]">
                {formatYen(lobbies.reduce((sum, lobby) => sum + lobby.balance, 0))}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="panel-surface rounded-[1.75rem] border border-[#d9e6de] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6f8579]">
              Create Lobby
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-[#173a30]">
              Open a new shared fund.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#4a6559]">
              This mock uses the authenticated user as `createdById` and creates the owner
              member automatically.
            </p>
          </div>

          <form className="grid gap-3" onSubmit={handleCreateLobby}>
            <InputField
              label="Lobby name"
              type="text"
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="April Shared Fund"
            />

            <InputField
              label="Description"
              type="text"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Apartment monthly fund"
            />

            {error ? <p className="text-sm text-[#b93838]">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || !currentUser}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173a30] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#21483c] disabled:cursor-not-allowed disabled:bg-[#8ca398]">
              <Plus size={16} />
              {submitting ? "Creating..." : "Create lobby"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {lobbies.map((lobby) => (
          <Link
            key={lobby.id}
            href={`/lobby/${lobby.id}`}
            className="group panel-surface rounded-[1.75rem] border border-[#d9e6de] p-5 transition hover:-translate-y-0.5 hover:bg-white/90">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6f8579]">
                  {lobby.id}
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-[#173a30]">
                  {lobby.name}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#4a6559]">
                  {lobby.description || "No description"}
                </p>
              </div>
              <ArrowRight
                size={18}
                className="mt-1 text-[#6f8579] transition group-hover:translate-x-0.5 group-hover:text-[#173a30]"
              />
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-3">
                <div className="flex items-center gap-2 text-[#2e5e54]">
                  <Wallet size={16} />
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                    Balance
                  </p>
                </div>
                <p className="mt-2 text-lg font-semibold text-[#173a30]">
                  {formatYen(lobby.balance)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-3">
                <div className="flex items-center gap-2 text-[#2e5e54]">
                  <Users size={16} />
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                    Members
                  </p>
                </div>
                <p className="mt-2 text-lg font-semibold text-[#173a30]">
                  {lobby.memberCount}
                </p>
              </div>

              <div className="rounded-2xl border border-[#d9e6de] bg-white/85 p-3">
                <div className="flex items-center gap-2 text-[#2e5e54]">
                  <Coins size={16} />
                  <p className="text-xs uppercase tracking-[0.12em] text-[#6f8579]">
                    Updated
                  </p>
                </div>
                <p className="mt-2 text-lg font-semibold text-[#173a30]">
                  {new Date(lobby.updatedAt).toLocaleDateString("en-US")}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
