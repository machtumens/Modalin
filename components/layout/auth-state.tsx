import Link from "next/link";
import { getDemoUserId, getRole, clearRole } from "@/lib/role";
import { getUserById } from "@/lib/data";
import { Button } from "@/components/ui/button";

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
        className="text-sm font-medium text-zinc-700 hover:text-brand-700"
      >
        {user?.name ?? role}
      </Link>
      <form
        action={async () => {
          "use server";
          await clearRole();
        }}
      >
        <Button variant="ghost" size="sm" type="submit">
          Keluar
        </Button>
      </form>
    </div>
  );
}
