import { accountRepo } from "@/server/repositories/account.repo";

export const accountService = {
  listByUser(userId: string) {
    return accountRepo.listByUser(userId);
  },
};
