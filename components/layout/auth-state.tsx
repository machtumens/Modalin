import Link from "next/link";
import { auth, signOut } from "@/auth";
import { Button } from "@/components/ui/button";

export async function AuthState() {
  const session = await auth();
  if (!session?.user) {
    return (
      <Button asChild size="sm">
        <Link href="/signin">Masuk</Link>
      </Button>
    );
  }
  const role = session.user.role.toLowerCase();
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/${role}/dashboard`}
        className="text-sm font-medium text-zinc-700 hover:text-brand-700"
      >
        {session.user.name}
      </Link>
      <form
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/" });
        }}
      >
        <Button variant="ghost" size="sm" type="submit">
          Keluar
        </Button>
      </form>
    </div>
  );
}
