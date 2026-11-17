import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthFlow from "@/components/AuthFlow";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/home");
  }

  return <AuthFlow initialStep="welcome" />;
}
