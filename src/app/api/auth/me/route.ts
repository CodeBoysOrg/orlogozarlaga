import { meController } from "@/controllers/me.controller";
import { withObservedRequest } from "@/utils/observability";

export async function GET(req: Request) {
  return withObservedRequest("api.auth.me.get", req, () => meController.get());
}

export async function PATCH(req: Request) {
  return withObservedRequest("api.auth.me.update", req, () =>
    meController.update(req),
  );
}
