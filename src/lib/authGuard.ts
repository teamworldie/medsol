import "server-only";
import { auth } from "@/auth";

export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

/** Throws unless there's a logged-in session. Call at the top of every mutating Server Action. */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) throw new UnauthorizedError();
  return session;
}

/** Throws unless the logged-in user has the ADMIN role. */
export async function requireAdmin() {
  const session = await requireSession();
  if (session.user.role !== "ADMIN") throw new UnauthorizedError();
  return session;
}
