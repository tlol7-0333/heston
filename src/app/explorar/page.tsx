import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import ExplorarClient from "@/components/ExplorarClient";

export const dynamic = "force-dynamic";

export default async function ExplorarPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <ExplorarClient user={user} />;
}
