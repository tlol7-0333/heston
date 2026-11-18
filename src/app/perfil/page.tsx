import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import PerfilClient from "@/components/PerfilClient";

export const dynamic = "force-dynamic";

export default async function PerfilPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <PerfilClient user={user} />;
}
