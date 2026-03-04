import ProductCard from "./ProductCard";

interface Product {
  product: string;
  display: { en: string };
  description?: { summary: { en: string } };
  pricing?: { price: { USD: number } };
}

interface ProductsSectionProps {
  products: Product[];
  loading: boolean;
  onBuyNow: (productPath: string) => void;
}

export default function ProductsSection({ products, loading, onBuyNow }: ProductsSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-cyan-400 font-semibold mb-2 uppercase tracking-wider text-sm">Choose Your Plan</p>
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Simple, transparent pricing</h3>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            All plans include core features. No surprises, no hidden fees.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-slate-700"></div>
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-400 animate-spin"></div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={index} 
              product={product} 
              onBuyNow={onBuyNow}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
