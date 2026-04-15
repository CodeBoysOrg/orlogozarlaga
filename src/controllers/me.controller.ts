import { authService } from "@/server/services/auth.service";
import { userService } from "@/server/services/user.service";
import { fail, ok } from "@/utils/api-response";
import { updateProfileSchema } from "@/validators/user.validator";

export const meController = {
  async get() {
    try {
      const user = await authService.requireAuthenticatedUser();
      const profile = await userService.getProfile(user.id);
      return ok({ user: profile });
    } catch (error) {
      return fail(error);
    }
  },

  async update(req: Request) {
    try {
      const user = await authService.requireAuthenticatedUser();
      const body = await req.json();
      const parsed = updateProfileSchema.parse(body);
      const profile = await userService.updateProfile(user.id, {
        name: parsed.name,
      });
      return ok({ user: profile });
    } catch (error) {
      return fail(error);
    }
  },
};
