import { prisma } from "@/lib/db/prisma";

type UserIdentityHeaders = {
  userId: string | null;
  userEmail: string | null;
};

function readIdentityHeaders(req: Request): UserIdentityHeaders {
  return {
    userId: req.headers.get("x-user-id"),
    userEmail: req.headers.get("x-user-email"),
  };
}

export async function getUserId(req: Request) {
  const { userId, userEmail } = readIdentityHeaders(req);

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (user) return user.id;
  }

  if (userEmail) {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });
    if (user) return user.id;
  }

  // Basic project fallback: use the seeded demo user when no identity header is sent.
  const demoUser = await prisma.user.findUnique({
    where: { email: "demo@user.com" },
    select: { id: true },
  });
  if (!demoUser) {
    throw new Error("Demo user not found. Run seed.");
  }
  return demoUser.id;
}
