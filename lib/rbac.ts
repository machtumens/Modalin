import { redirect } from "next/navigation";
import { auth } from "@/auth";

export type Role = "UMKM" | "INVESTOR" | "ADMIN";

export async function requireRole(role: Role) {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  if (session.user.role !== role) {
    redirect(`/${session.user.role.toLowerCase()}/dashboard`);
  }
  return session;
}

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}
