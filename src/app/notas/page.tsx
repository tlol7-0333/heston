import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import NotasClient from "@/components/NotasClient";

export const dynamic = "force-dynamic";

export default async function NotasPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return <NotasClient user={user} />;
}
