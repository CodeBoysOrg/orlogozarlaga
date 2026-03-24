import { authService } from "@/server/services/auth.service";
import { fail, ok } from "@/utils/api-response";

export async function GET() {
  try {
    const user = await authService.requireAuthenticatedUser();
    return ok({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return fail(error);
  }
}
