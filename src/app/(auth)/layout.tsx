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
          
        </div>
      </footer>
    </div>
  );
}
