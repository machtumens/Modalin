import { redirect } from "next/navigation";
import { getRole } from "@/lib/role";

export default async function PostSignin() {
  const role = await getRole();
  if (!role) redirect("/signin");
  redirect(`/${role.toLowerCase()}/dashboard`);
}
