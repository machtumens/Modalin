import { redirect } from "next/navigation";
import { signIn, auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SigninPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    const role = session.user.role.toLowerCase();
    redirect(`/${role}/dashboard`);
  }
  const sp = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Masuk ke Modalin</CardTitle>
          <CardDescription>
            Akun demo: <code>admin@modalin.id</code>, <code>andi@inv.id</code>, atau salah satu UMKM (mis. <code>andi.kopitani@umkm.id</code>). Sandi: <code>Demo123!</code>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async (formData) => {
              "use server";
              const email = String(formData.get("email") ?? "");
              const password = String(formData.get("password") ?? "");
              await signIn("credentials", {
                email,
                password,
                redirectTo: "/post-signin",
              });
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required defaultValue="andi@inv.id" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Kata Sandi</Label>
              <Input id="password" name="password" type="password" required defaultValue="Demo123!" />
            </div>
            {sp.error && (
              <p className="text-sm text-red-600">Email atau sandi salah.</p>
            )}
            <Button type="submit" className="w-full">Masuk</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
