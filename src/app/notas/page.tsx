import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import NotasClient from "@/components/NotasClient";

export const dynamic = "force-dynamic";

export default async function NotasPage({
  searchParams,
}: {
  searchParams?: { chat?: string; name?: string; community?: string };
}) {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <NotasClient
      user={user}
      initialChatUser={searchParams?.chat || null}
      initialChatName={searchParams?.name || null}
      initialCommunityId={searchParams?.community || null}
    />
  );
}
