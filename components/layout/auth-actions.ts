"use server";
import { clearRole } from "@/lib/role";

export async function signOutAction() {
  await clearRole();
}
