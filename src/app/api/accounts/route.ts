import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth/getUserId";
import { accountService } from "@/server/services/account.service";

export async function GET(req: Request) {
  try {
    const userId = await getUserId(req);
    const accounts = await accountService.listByUser(userId);
    return NextResponse.json({ ok: true, accounts });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 400 },
    );
  }
}
