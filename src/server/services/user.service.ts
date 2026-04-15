import { UserProfileDto } from "@/types";
import { NotFoundError } from "@/utils/errors";
import { userRepo } from "../repositories/user.repo";

function toProfileDto(user: {
  id: string;
  email: string;
  name: string | null;
}): UserProfileDto {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export const userService = {
  async getProfile(userId: string) {
    const user = await userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }

    return toProfileDto(user);
  },

  async updateProfile(userId: string, input: { name: string | null }) {
    const updated = await userRepo.updateProfile(userId, {
      name: input.name,
    });

    return toProfileDto(updated);
  },
};
