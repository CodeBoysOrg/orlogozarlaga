import { prisma } from "@/lib/db/prisma";
import { Prisma } from "@prisma/client";

export const accountRepo = {
  listByUser(userId: string) {
    return prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, balance: true },
    });
  },

  incrementBalanceIfOwnedTx(
    tx: Prisma.TransactionClient,
    args: {
      accountId: string;
      userId: string;
      by: number;
    },
  ) {
    return tx.account.updateMany({
      where: { id: args.accountId, userId: args.userId },
      data: { balance: { increment: args.by } },
    });
  },
};
