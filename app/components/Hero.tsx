export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-32 px-6" id="home">
      {/* Gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-slate-800/60 border border-slate-700/50 rounded-full px-4 py-1.5 text-sm text-slate-300 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
          Engineering analytics, powered by FastSpring
        </div>

        <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
          Ship faster with{" "}
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
            engineering intelligence
          </span>
        </h1>

        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
          DevMetrics gives engineering teams real-time visibility into deployment health, PR cycle time, and code quality — so you spend less time firefighting and more time building.
        </p>

        <div className="flex flex-wrap gap-3 justify-center mb-16">
          {/* DORA Metrics */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            DORA Metrics
          </div>
          {/* GitHub & CI/CD */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            <svg className="w-4 h-4 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub & CI/CD Integrated
          </div>
          {/* Zero-Config */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Zero-Config Setup
          </div>
          {/* Global Billing */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300 backdrop-blur-sm">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Global Billing via FastSpring
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="#pricing"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/25"
          >
            View plans →
          </a>
          <a
            href="#features"
            className="px-8 py-3 rounded-lg border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white font-semibold transition-all"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
