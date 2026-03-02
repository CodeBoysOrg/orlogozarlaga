import { prisma } from "@/lib/db/prisma";
import { accountRepo } from "../repositories/account.repo";
import { transactionRepo } from "../repositories/transaction.repo";

function isTransactionType(value: string): value is "INCOME" | "EXPENSE" {
  return value === "INCOME" || value === "EXPENSE";
}

export const transactionService = {
  list(args: {
    userId: string;
    start: Date;
    end: Date;
    type?: string | null;
  }) {
    const normalizedType =
      args.type && isTransactionType(args.type) ? args.type : undefined;

    if (args.type && !normalizedType) {
      throw new Error("Invalid transaction type. Use INCOME or EXPENSE");
    }

    return transactionRepo.list({
      userId: args.userId,
      start: args.start,
      end: args.end,
      ...(normalizedType ? { type: normalizedType } : {}),
    });
  },

  async create(
    userId: string,
    input: {
      accountId: string;
      type: "INCOME" | "EXPENSE";
      category: string;
      amount: number;
      description?: string;
      date: Date;
    },
  ) {
    const balanceDelta = input.type === "INCOME" ? input.amount : -input.amount;

    // IMPORTANT: both create transaction + update balance must be atomic
    const created = await prisma.$transaction(async (tx) => {
      const updated = await accountRepo.incrementBalanceIfOwnedTx(tx, {
        accountId: input.accountId,
        userId,
        by: balanceDelta,
      });

      if (updated.count === 0) {
        throw new Error("Account not found");
      }

      return transactionRepo.createTx(tx, {
        userId,
        accountId: input.accountId,
        type: input.type,
        category: input.category,
        amount: input.amount,
        description: input.description,
        date: input.date,
      });
    });

    return created;
  },
};
