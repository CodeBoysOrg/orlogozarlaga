export type LobbyRole = "OWNER" | "MEMBER";
export type LobbyMemberStatus = "ACTIVE" | "LEFT";
export type LobbyTransactionType = "INCOME" | "EXPENSE";

export type Lobby = {
  id: string;
  name: string;
  description: string | null;
  balance: number;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type LobbyUser = {
  id: string;
  name: string;
  email: string;
};

export type LobbyMember = {
  id: string;
  lobbyId: string;
  userId: string;
  role: LobbyRole;
  status: LobbyMemberStatus;
  joinedAt: string;
  createdAt: string;
  updatedAt: string;
  user: LobbyUser;
};

export type LobbyTransaction = {
  id: string;
  lobbyId: string;
  memberId: string;
  type: LobbyTransactionType;
  category: string;
  amount: number;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  member: {
    id: string;
    role: LobbyRole;
    user: LobbyUser;
  };
};

export type LobbyListItem = Lobby & {
  memberCount: number;
};

export type LobbySummary = {
  lobby: {
    id: string;
    name: string;
    balance: number;
  };
  monthlyIncome: number;
  monthlyExpense: number;
  memberCount: number;
  recentTransactions: Array<{
    id: string;
    type: LobbyTransactionType;
    category: string;
    amount: number;
    date: string;
    member: {
      id: string;
      user: {
        name: string;
      };
    };
  }>;
};

export type LobbyMemberContribution = {
  memberId: string;
  userId: string;
  name: string;
  role: LobbyRole;
  totalIncome: number;
  totalExpense: number;
};

export type MockLobbyState = {
  lobbies: Lobby[];
  members: LobbyMember[];
  transactions: LobbyTransaction[];
};

export type CreateLobbyTransactionInput = {
  memberId: string;
  type: LobbyTransactionType;
  category: string;
  amount: number;
  description?: string;
  date: string;
};

export type CreateLobbyInput = {
  name: string;
  description?: string;
  user: LobbyUser;
};
