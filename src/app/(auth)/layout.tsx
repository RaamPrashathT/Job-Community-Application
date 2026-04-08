export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {children}
      <footer className="fixed bottom-0 w-full z-50 pointer-events-none">
        <div className="flex flex-col md:flex-row justify-between items-center px-12 py-8 w-full bg-transparent">
          <p className="font-light text-[10px] uppercase tracking-widest text-[#666666] pointer-events-auto">
            © 2024 OBSIDIAN FOUNDRY. TECHNICAL EDITORIAL STANDARDS.
          </p>
          <div className="flex gap-8 mt-4 md:mt-0 pointer-events-auto">
            <a href="#" className="font-light text-[10px] uppercase tracking-widest text-[#666666] hover:text-[#7EE8A2] transition-colors">
              Privacy
            </a>
            <a href="#" className="font-light text-[10px] uppercase tracking-widest text-[#666666] hover:text-[#7EE8A2] transition-colors">
              Terms
            </a>
            <a href="#" className="font-light text-[10px] uppercase tracking-widest text-[#666666] hover:text-[#7EE8A2] transition-colors">
              Security
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
