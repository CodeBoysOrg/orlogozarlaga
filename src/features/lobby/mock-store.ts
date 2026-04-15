import {
  CreateLobbyInput,
  CreateLobbyTransactionInput,
  Lobby,
  LobbyListItem,
  LobbyMember,
  LobbyMemberContribution,
  LobbySummary,
  LobbyTransaction,
  MockLobbyState,
} from "./types";

const STORAGE_KEY = "oz.mock.lobbies.v1";

const seedState: MockLobbyState = {
  lobbies: [
    {
      id: "lobby_1",
      name: "April Shared Fund",
      description: "Apartment monthly fund",
      balance: 40000,
      createdById: "user_1",
      createdAt: "2026-04-15T10:00:00.000Z",
      updatedAt: "2026-04-15T10:00:00.000Z",
    },
    {
      id: "lobby_2",
      name: "Trip Food Budget",
      description: "Osaka weekend budget",
      balance: 12000,
      createdById: "user_2",
      createdAt: "2026-04-12T09:00:00.000Z",
      updatedAt: "2026-04-14T08:00:00.000Z",
    },
  ],
  members: [
    {
      id: "user_1",
      lobbyId: "lobby_1",
      userId: "user_1",
      role: "OWNER",
      status: "ACTIVE",
      joinedAt: "2026-04-15T10:00:00.000Z",
      createdAt: "2026-04-15T10:00:00.000Z",
      updatedAt: "2026-04-15T10:00:00.000Z",
      user: { id: "user_1", name: "Bat", email: "bat@example.com" },
    },
    {
      id: "user_2",
      lobbyId: "lobby_1",
      userId: "user_2",
      role: "MEMBER",
      status: "ACTIVE",
      joinedAt: "2026-04-15T10:05:00.000Z",
      createdAt: "2026-04-15T10:05:00.000Z",
      updatedAt: "2026-04-15T10:05:00.000Z",
      user: { id: "user_2", name: "Bold", email: "bold@example.com" },
    },
    {
      id: "user_2",
      lobbyId: "lobby_2",
      userId: "user_2",
      role: "OWNER",
      status: "ACTIVE",
      joinedAt: "2026-04-12T09:00:00.000Z",
      createdAt: "2026-04-12T09:00:00.000Z",
      updatedAt: "2026-04-12T09:00:00.000Z",
      user: { id: "user_2", name: "Bold", email: "bold@example.com" },
    },
    {
      id: "user_3",
      lobbyId: "lobby_2",
      userId: "user_3",
      role: "MEMBER",
      status: "ACTIVE",
      joinedAt: "2026-04-12T09:10:00.000Z",
      createdAt: "2026-04-12T09:10:00.000Z",
      updatedAt: "2026-04-12T09:10:00.000Z",
      user: { id: "user_3", name: "Saraa", email: "saraa@example.com" },
    },
  ],
  transactions: [
    {
      id: "txn_1",
      lobbyId: "lobby_1",
      memberId: "user_1",
      type: "INCOME",
      category: "Monthly Contribution",
      amount: 20000,
      description: "Bat contribution",
      date: "2026-04-01T00:00:00.000Z",
      createdAt: "2026-04-01T09:00:00.000Z",
      updatedAt: "2026-04-01T09:00:00.000Z",
      member: {
        id: "user_1",
        role: "OWNER",
        user: { id: "user_1", name: "Bat", email: "bat@example.com" },
      },
    },
    {
      id: "txn_2",
      lobbyId: "lobby_1",
      memberId: "user_2",
      type: "EXPENSE",
      category: "Food",
      amount: 10000,
      description: "Groceries",
      date: "2026-04-03T00:00:00.000Z",
      createdAt: "2026-04-03T10:00:00.000Z",
      updatedAt: "2026-04-03T10:00:00.000Z",
      member: {
        id: "user_2",
        role: "MEMBER",
        user: { id: "user_2", name: "Bold", email: "bold@example.com" },
      },
    },
    {
      id: "txn_3",
      lobbyId: "lobby_1",
      memberId: "user_2",
      type: "INCOME",
      category: "Monthly Contribution",
      amount: 30000,
      description: "Bold contribution",
      date: "2026-04-04T00:00:00.000Z",
      createdAt: "2026-04-04T09:00:00.000Z",
      updatedAt: "2026-04-04T09:00:00.000Z",
      member: {
        id: "user_2",
        role: "MEMBER",
        user: { id: "user_2", name: "Bold", email: "bold@example.com" },
      },
    },
    {
      id: "txn_4",
      lobbyId: "lobby_2",
      memberId: "user_2",
      type: "INCOME",
      category: "Initial Pool",
      amount: 20000,
      description: "Trip starting budget",
      date: "2026-04-12T00:00:00.000Z",
      createdAt: "2026-04-12T11:00:00.000Z",
      updatedAt: "2026-04-12T11:00:00.000Z",
      member: {
        id: "user_2",
        role: "OWNER",
        user: { id: "user_2", name: "Bold", email: "bold@example.com" },
      },
    },
    {
      id: "txn_5",
      lobbyId: "lobby_2",
      memberId: "user_3",
      type: "EXPENSE",
      category: "Snacks",
      amount: 8000,
      description: "Station snacks",
      date: "2026-04-13T00:00:00.000Z",
      createdAt: "2026-04-13T13:00:00.000Z",
      updatedAt: "2026-04-13T13:00:00.000Z",
      member: {
        id: "user_3",
        role: "MEMBER",
        user: { id: "user_3", name: "Saraa", email: "saraa@example.com" },
      },
    },
  ],
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function cloneState(state: MockLobbyState) {
  return JSON.parse(JSON.stringify(state)) as MockLobbyState;
}

export function getMockLobbyState(): MockLobbyState {
  if (!canUseStorage()) {
    return cloneState(seedState);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const nextState = cloneState(seedState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  }

  try {
    return JSON.parse(raw) as MockLobbyState;
  } catch {
    const nextState = cloneState(seedState);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return nextState;
  }
}

function saveMockLobbyState(state: MockLobbyState) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isInMonth(dateIso: string, month: string) {
  return dateIso.slice(0, 7) === month;
}

function compareDescByDate(a: { date: string }, b: { date: string }) {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

export function listMockLobbies(): LobbyListItem[] {
  const state = getMockLobbyState();
  return state.lobbies
    .map((lobby) => ({
      ...lobby,
      memberCount: state.members.filter(
        (member) => member.lobbyId === lobby.id && member.status === "ACTIVE",
      ).length,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getMockLobbyById(lobbyId: string): Lobby | null {
  const state = getMockLobbyState();
  return state.lobbies.find((lobby) => lobby.id === lobbyId) ?? null;
}

export function listMockLobbyMembers(lobbyId: string): LobbyMember[] {
  const state = getMockLobbyState();
  return state.members.filter(
    (member) => member.lobbyId === lobbyId && member.status === "ACTIVE",
  );
}

export function listMockLobbyTransactions(args: {
  lobbyId: string;
  month?: string;
  type?: "INCOME" | "EXPENSE";
  page?: number;
  pageSize?: number;
}) {
  const state = getMockLobbyState();
  const page = args.page ?? 1;
  const pageSize = args.pageSize ?? 20;

  const filtered = state.transactions
    .filter((transaction) => transaction.lobbyId === args.lobbyId)
    .filter((transaction) => (args.month ? isInMonth(transaction.date, args.month) : true))
    .filter((transaction) => (args.type ? transaction.type === args.type : true))
    .sort(compareDescByDate);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;

  return {
    items: filtered.slice(startIndex, startIndex + pageSize),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
    },
  };
}

export function getMockLobbySummary(lobbyId: string, month: string): LobbySummary | null {
  const lobby = getMockLobbyById(lobbyId);
  if (!lobby) return null;

  const members = listMockLobbyMembers(lobbyId);
  const monthlyTransactions = listMockLobbyTransactions({
    lobbyId,
    month,
    page: 1,
    pageSize: 999,
  }).items;

  let monthlyIncome = 0;
  let monthlyExpense = 0;

  monthlyTransactions.forEach((transaction) => {
    if (transaction.type === "INCOME") monthlyIncome += transaction.amount;
    if (transaction.type === "EXPENSE") monthlyExpense += transaction.amount;
  });

  return {
    lobby: {
      id: lobby.id,
      name: lobby.name,
      balance: lobby.balance,
    },
    monthlyIncome,
    monthlyExpense,
    memberCount: members.length,
    recentTransactions: monthlyTransactions.slice(0, 4).map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      member: {
        id: transaction.member.id,
        user: {
          name: transaction.member.user.name,
        },
      },
    })),
  };
}

export function getMockMemberSummary(
  lobbyId: string,
  month: string,
): LobbyMemberContribution[] {
  const members = listMockLobbyMembers(lobbyId);
  const transactions = listMockLobbyTransactions({
    lobbyId,
    month,
    page: 1,
    pageSize: 999,
  }).items;

  return members.map((member) => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach((transaction) => {
      if (transaction.memberId !== member.id) return;
      if (transaction.type === "INCOME") totalIncome += transaction.amount;
      if (transaction.type === "EXPENSE") totalExpense += transaction.amount;
    });

    return {
      memberId: member.id,
      userId: member.userId,
      name: member.user.name,
      role: member.role,
      totalIncome,
      totalExpense,
    };
  });
}

export function createMockLobbyTransaction(
  lobbyId: string,
  input: CreateLobbyTransactionInput,
): LobbyTransaction {
  const state = getMockLobbyState();
  const lobby = state.lobbies.find((item) => item.id === lobbyId);
  if (!lobby) {
    throw new Error("Lobby not found");
  }

  const member = state.members.find(
    (item) => item.id === input.memberId && item.lobbyId === lobbyId && item.status === "ACTIVE",
  );
  if (!member) {
    throw new Error("Member not found for this lobby");
  }

  const now = new Date().toISOString();
  const transaction: LobbyTransaction = {
    id: `txn_${Date.now()}`,
    lobbyId,
    memberId: member.id,
    type: input.type,
    category: input.category,
    amount: input.amount,
    description: input.description?.trim() || null,
    date: input.date,
    createdAt: now,
    updatedAt: now,
    member: {
      id: member.id,
      role: member.role,
      user: member.user,
    },
  };

  state.transactions.unshift(transaction);
  lobby.balance += input.type === "INCOME" ? input.amount : -input.amount;
  lobby.updatedAt = now;
  saveMockLobbyState(state);
  return transaction;
}

export function createMockLobby(input: CreateLobbyInput): Lobby {
  const state = getMockLobbyState();
  const now = new Date().toISOString();
  const lobbyId = `lobby_${Date.now()}`;

  const lobby: Lobby = {
    id: lobbyId,
    name: input.name.trim(),
    description: input.description?.trim() || null,
    balance: 0,
    createdById: input.user.id,
    createdAt: now,
    updatedAt: now,
  };

  const member: LobbyMember = {
    id: input.user.id,
    lobbyId,
    userId: input.user.id,
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: now,
    createdAt: now,
    updatedAt: now,
    user: input.user,
  };

  state.lobbies.unshift(lobby);
  state.members.unshift(member);
  saveMockLobbyState(state);
  return lobby;
}
