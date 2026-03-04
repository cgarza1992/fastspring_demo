import Image from "next/image";

interface ProductCardProps {
  product: {
    product: string;
    display: { en: string };
    description?: { summary: { en: string } };
    pricing?: { price: { USD: number } };
  };
  onBuyNow: (productPath: string) => void;
}

export default function ProductCard({ product, onBuyNow }: ProductCardProps) {
  return (
    <div 
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 border border-slate-700/50 backdrop-blur-xl hover:border-cyan-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/5 flex flex-col h-full cursor-pointer"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-cyan-500/10 group-hover:to-blue-500/10 transition-all duration-300"></div>

      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden border-b border-slate-700/50">
        <Image 
          src="https://placehold.co/500x400?text=Premium" 
          alt={product.display.en}
          width={500}
          height={400}
          unoptimized
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Product Content */}
      <div className="p-8 flex flex-col flex-grow relative z-10">
        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
          {product.display.en}
        </h3>
        
        <p className="text-slate-400 flex-grow mb-8 text-sm leading-relaxed">
          {product.description?.summary?.en || 'Professional-grade solution for teams of all sizes'}
        </p>

        {/* Price */}
        <div className="mb-8 pb-8 border-b border-slate-700/50">
          <p className="text-slate-400 text-sm mb-2">Starting at</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white">
              ${product.pricing?.price?.USD || '0'}
            </span>
            <span className="text-slate-400">/mo</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => onBuyNow(product.product)}
          className="w-full relative overflow-hidden py-3 px-6 rounded-lg font-semibold text-white transition-all duration-300 group/btn cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover/btn:shadow-lg group-hover/btn:shadow-cyan-500/50 transition-all"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover/btn:opacity-100 transition-all"></div>
          <span className="relative flex items-center justify-center gap-2">
            Get Started
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}
