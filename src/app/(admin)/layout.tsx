import { redirect } from "next/navigation";
import { getCurrentUser } from "@/features/auth/lib/getCurrentUser";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/admin-login");
  }

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {children}
    </div>
  );
}
