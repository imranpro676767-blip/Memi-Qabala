import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  lang: string;
  onAddToCart: (p: Product) => void;
  onQuickOrder: (p: Product | null) => void;
  onView: (p: Product) => void;
  t: any;
  key?: any;
}

export default function ProductCard({
  product,
  lang,
  onAddToCart,
  onQuickOrder,
  onView,
  t,
}: ProductCardProps) {
  const getEffectivePrice = (p: Product) => {
    const discount = p.discountPercent || 0;
    if (discount > 0) {
      return p.price * (100 - discount) / 100;
    }
    return p.price;
  };

  const title = (product as any)['title_' + lang] || product.title_az;
  const isOutOfStock = !product.stock || product.stock <= 0;

  return (
    <div className="bg-gradient-to-b from-white to-[#FAFBF9] rounded-3xl border border-red-100/85 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-emerald-700/55 transition-all group duration-300">
      {/* Image Showcase */}
      <div className="relative overflow-hidden aspect-[4/3] bg-red-50/30">
        <img
          src={product.image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 cursor-zoom-in"
          onClick={() => onView(product)}
        />
        <span
          className={`absolute top-4 right-4 text-[9px] uppercase font-black tracking-wider px-2.5 py-1 rounded-lg ${
            !isOutOfStock ? 'bg-white text-emerald-800 border border-neutral-100 shadow-sm' : 'bg-red-500 text-white'
          }`}
        >
          {!isOutOfStock ? `${t.inStock || 'Stokda Var'}: ${product.stock}` : (t.outOfStock || 'Tükəndi')}
        </span>
      </div>

      {/* Details Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5 text-left">
          <h4
            className="font-extrabold text-neutral-900 line-clamp-1 group-hover:text-gold-500 cursor-pointer text-base transition-colors"
            onClick={() => onView(product)}
          >
            {title}
          </h4>
          <p className="text-xs text-neutral-500 font-medium line-clamp-2 leading-relaxed h-[36px]">
            {product.description_az}
          </p>
          {product.size && (
            <p className="text-[10px] text-neutral-400 font-bold tracking-wide uppercase">
              {t.sizeLabel || 'Ölçü'}: <span className="text-neutral-700 font-mono font-black">{product.size}</span>
            </p>
          )}
        </div>

        <div className="border-t border-neutral-100 pt-4 mt-4 flex items-center justify-between">
          <div className="flex flex-col text-left">
            {product.discountPercent && product.discountPercent > 0 ? (
              <>
                <span className="text-xs text-red-500 line-through font-mono font-bold leading-none mb-1">
                  {product.price.toFixed(2)} ₼
                </span>
                <span className="text-2xl font-black font-mono text-emerald-800 flex items-center gap-1.5 leading-none">
                  {getEffectivePrice(product).toFixed(2)} ₼
                  <span className="bg-emerald-800 text-white text-[9px] px-1.5 py-0.5 rounded-md font-black animate-pulse leading-none">
                    -{product.discountPercent}%
                  </span>
                </span>
              </>
            ) : (
              <span className="text-2xl font-black font-mono text-neutral-950">
                {product.price.toFixed(2)} ₼
              </span>
            )}
          </div>

          <div className="flex space-x-1.5 font-sans font-bold">
            <button
              onClick={() => onAddToCart(product)}
              disabled={isOutOfStock}
              className="px-3 py-2 bg-neutral-100 hover:bg-neutral-900 hover:text-white rounded-xl text-neutral-700 text-xs font-black transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.addToCartBtn || 'Səbətə At'}
            </button>
            <button
              onClick={() => onQuickOrder(product)}
              disabled={isOutOfStock}
              className="px-3 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {t.quickOrderBtn || 'Sifariş Et'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
