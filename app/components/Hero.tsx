export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 px-6">
      {/* Gradient orbs for visual interest */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        <h2 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
          Fast, Secure
          <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Payment Processing
          </span>
        </h2>
        
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          Built with modern web technologies. Powered by FastSpring's battle-tested payment infrastructure. No redirects. Just embedded checkout that works.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-16">
          <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            ✨ Type-Safe (TypeScript)
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            🔒 Server-Side Auth
          </div>
          <div className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            🌍 Multi-Currency
          </div>
        </div>
      </div>
    </section>
  );
}
