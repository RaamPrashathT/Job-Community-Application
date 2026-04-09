import { Navbar } from "@/components/Navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505]">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
