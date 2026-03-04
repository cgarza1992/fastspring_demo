export default function FeaturesSection() {
  const features = [
    {
      emoji: '⚡',
      title: 'Lightning Fast',
      description: 'Optimized API calls and edge-case handling for sub-second checkout loads.'
    },
    {
      emoji: '🔐',
      title: 'Enterprise Secure',
      description: 'PCI DSS Level 1 compliance. API keys never exposed to browser.'
    },
    {
      emoji: '🌐',
      title: 'Global Ready',
      description: '150+ countries, 135+ currencies, local payment methods included.'
    }
  ];

  return (
    <section className="py-20 px-6 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 backdrop-blur-sm hover:border-slate-600/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center mb-4">
                <span className="text-xl">{feature.emoji}</span>
              </div>
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-slate-400 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
