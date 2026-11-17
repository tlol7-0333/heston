import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import AuthFlow from "@/components/AuthFlow";

export const dynamic = "force-dynamic";

interface RegisterPageProps {
  searchParams?: {
    role?: string;
  };
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const user = await getSessionUser();
  if (user) {
    redirect("/home");
  }

  const roleParam = searchParams?.role?.toUpperCase();
  const hasExplicitRole = roleParam === "USUARIO" || roleParam === "EMPRESA";

  return (
    <AuthFlow
      initialStep={hasExplicitRole ? "register" : "select-role"}
      initialRole={roleParam === "EMPRESA" ? "EMPRESA" : "USUARIO"}
    />
  );
}
