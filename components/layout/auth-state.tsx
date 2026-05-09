import Link from "next/link";
import { getDemoUserId, getRole } from "@/lib/role";
import { getUserById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./auth-actions";

export async function AuthState() {
  const role = await getRole();
  const userId = await getDemoUserId();
  if (!role || !userId) {
    return (
      <Button asChild size="sm">
        <Link href="/signin">Masuk</Link>
      </Button>
    );
  }
  const user = getUserById(userId);
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${role.toLowerCase()}/dashboard`}
        className="text-sm font-medium text-zinc-300 hover:text-brand-400"
      >
        {user?.name ?? role}
      </Link>
      <form action={signOutAction}>
        <Button variant="ghost" size="sm" type="submit">
          Keluar
        </Button>
      </form>
    </div>
  );
}
