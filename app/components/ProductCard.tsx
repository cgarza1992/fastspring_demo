interface ProductCardProps {
  product: {
    product: string;
    display: { en: string };
    description?: { summary: { en: string } };
    pricing?: { price: { USD: number } };
  };
  onBuyNow: (productPath: string) => void;
}

// Map product names to a tier style so each card feels distinct
function getTierStyle(name: string): { gradient: string; icon: string; badge: string } {
  const lower = name.toLowerCase();
  if (lower.includes('enterprise') || lower.includes('team')) {
    return {
      gradient: 'from-violet-500/20 via-purple-500/10 to-slate-900',
      icon: '🏢',
      badge: 'Most Popular',
    };
  }
  if (lower.includes('pro') || lower.includes('growth')) {
    return {
      gradient: 'from-cyan-500/20 via-blue-500/10 to-slate-900',
      icon: '⚡',
      badge: 'Best Value',
    };
  }
  return {
    gradient: 'from-slate-700/30 via-slate-800/10 to-slate-900',
    icon: '🚀',
    badge: '',
  };
}

export default function ProductCard({ product, onBuyNow }: ProductCardProps) {
  const tier = getTierStyle(product.display.en);

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col h-full">
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>

      {/* Tier header — replaces placeholder image */}
      <div className={`relative h-44 bg-gradient-to-br ${tier.gradient} flex flex-col items-center justify-center border-b border-slate-700/50 overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent"></div>
        <span className="text-5xl mb-3 relative z-10">{tier.icon}</span>
        <span className="text-slate-300 text-sm font-medium tracking-widest uppercase relative z-10">
          {product.display.en}
        </span>
        {tier.badge && (
          <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
            {tier.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col flex-grow relative z-10">
        <p className="text-slate-400 flex-grow mb-8 text-sm leading-relaxed">
          {product.description?.summary?.en || 'Professional-grade engineering analytics for teams of all sizes.'}
        </p>

        {/* Price */}
        <div className="mb-8 pb-8 border-b border-slate-700/50">
          <p className="text-slate-400 text-sm mb-1">Starting at</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white">
              ${product.pricing?.price?.USD ?? '0'}
            </span>
            <span className="text-slate-400">/mo</span>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onBuyNow(product.product)}
          className="w-full relative overflow-hidden py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 group/btn cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/btn:shadow-lg group-hover/btn:shadow-cyan-500/30 transition-all"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-all"></div>
          <span className="relative flex items-center justify-center gap-2">
            Get started
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
