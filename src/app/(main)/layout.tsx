import { Navbar } from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black relative">
      <Navbar />
      <main className="relative z-10">{children}</main>
    </div>
  );
}
