import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function PostSignin() {
  const session = await auth();
  if (!session?.user) redirect("/signin");
  const role = session.user.role.toLowerCase();
  redirect(`/${role}/dashboard`);
}
