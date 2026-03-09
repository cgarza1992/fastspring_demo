const features = [
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    title: 'Deployment Frequency',
    description: 'Track how often your team ships. Benchmark against DORA metrics and identify which squads are shipping confidently vs. stalling.'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'PR Cycle Time',
    description: 'From first commit to merged PR. Spot bottlenecks in your review process before they compound into missed sprints.'
  },
  {
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'Quality Gates',
    description: 'Enforce test coverage and linting thresholds on every PR. Set baselines per repo, get alerts when standards slip.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-6 border-t border-slate-800/50" id="features">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">Why DevMetrics</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Built around how teams actually ship</h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No vanity metrics. Just the signals that tell you whether your engineering org is healthy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-slate-800/50 transition-all"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
