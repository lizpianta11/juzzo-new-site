export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510]">
      <div className="w-full max-w-md px-6">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xl">
              J
            </div>
            <span className="text-white font-bold text-2xl">Juzzo</span>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
