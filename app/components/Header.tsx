export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/50 backdrop-blur-md bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            DevMetrics
          </h1>
          <p className="text-xs text-slate-400">Powered by FastSpring</p>
        </div>
        <div className="text-sm text-slate-400">
          Production-Ready Checkout
        </div>
      </div>
    </header>
  );
}
