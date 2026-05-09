"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export type Role = "INVESTOR" | "UMKM" | "ADMIN";
const COOKIE = "modalin_role";
const ID_COOKIE = "modalin_id";

export async function getRole(): Promise<Role | null> {
  const c = await cookies();
  const v = c.get(COOKIE)?.value;
  if (v === "INVESTOR" || v === "UMKM" || v === "ADMIN") return v;
  return null;
}

export async function getDemoUserId(): Promise<string | null> {
  const c = await cookies();
  return c.get(ID_COOKIE)?.value ?? null;
}

export async function setRole(role: Role, demoUserId: string) {
  const c = await cookies();
  c.set(COOKIE, role, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
  c.set(ID_COOKIE, demoUserId, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
}

export async function clearRole() {
  const c = await cookies();
  c.delete(COOKIE);
  c.delete(ID_COOKIE);
  revalidatePath("/");
  redirect("/");
}

export async function requireRole(role: Role) {
  const r = await getRole();
  if (!r) redirect("/signin");
  if (r !== role) redirect(`/${r.toLowerCase()}/dashboard`);
  const id = await getDemoUserId();
  return { role: r, demoUserId: id ?? "" };
}
