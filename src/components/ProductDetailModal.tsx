import React, { useState } from 'react';
import { Product } from '../types';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  lang: string;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onQuickOrder: (p: Product) => void;
  t: any;
}

export default function ProductDetailModal({
  product,
  lang,
  onClose,
  onAddToCart,
  onQuickOrder,
  t,
}: ProductDetailModalProps) {
  const [zoomScale, setZoomScale] = useState(1);

  if (!product) return null;

  const title = (product as any)['title_' + lang] || product.title_az;
  const isOutOfStock = !product.stock || product.stock <= 0;

  const getEffectivePrice = (p: Product) => {
    const discount = p.discountPercent || 0;
    if (discount > 0) {
      return p.price * (100 - discount) / 100;
    }
    return p.price;
  };

  const handleZoomIn = () => setZoomScale(prev => Math.min(3.5, prev + 0.25));
  const handleZoomOut = () => setZoomScale(prev => Math.max(1, prev - 0.25));
  const handleZoomReset = () => setZoomScale(1);

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden relative shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/90 border border-neutral-100 p-2 rounded-full hover:bg-neutral-100 z-10 transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Dynamic Zoom Image Container */}
        <div className="relative overflow-hidden aspect-[4/3] bg-neutral-100 flex items-center justify-center">
          <img
            src={product.image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-200"
            style={{ transform: `scale(${zoomScale})` }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-neutral-900/85 backdrop-blur px-3 py-2 rounded-xl text-white text-xs shadow-md">
            <span className="font-semibold text-[11px] text-neutral-300">
              {t.zoomInstruction || 'Yaxınlaşdırmaq üçün klikləyin.'}
            </span>
            <div className="flex space-x-1.5 font-bold">
              <button
                onClick={handleZoomIn}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/25 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title={t.zoomIn || 'Yaxınlaşdır'}
              >
                <ZoomIn className="w-3.5 h-3.5" />
                <span>+</span>
              </button>
              <button
                onClick={handleZoomOut}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/25 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title={t.zoomOut || 'Uzaqlaşdır'}
              >
                <ZoomOut className="w-3.5 h-3.5" />
                <span>-</span>
              </button>
              <button
                onClick={handleZoomReset}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/25 rounded transition-colors flex items-center gap-1 cursor-pointer"
                title={t.resetZoom || 'Sıfırla'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Body Info */}
        <div className="p-6 space-y-4 text-left">
          <div className="flex gap-2 items-center">
            <span className="bg-[#FAF9F5] text-emerald-800 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded border border-red-100">
              🛡️ KOD: {product.id}
            </span>
            <span
              className={`text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded ${
                !isOutOfStock ? 'bg-emerald-50 text-emerald-800 border' : 'bg-red-50 text-red-700 border'
              }`}
            >
              {!isOutOfStock ? `${t.inStock || 'Stokda Var'}: ${product.stock}` : (t.outOfStock || 'Tükəndi')}
            </span>
          </div>

          <h2 className="text-2xl font-black text-neutral-900 leading-tight">
            {title}
          </h2>

          <div className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">
            <p className="font-medium text-neutral-800">{product.description_az}</p>
          </div>

          {product.size && (
            <p className="text-xs font-bold text-neutral-450 uppercase">
              {t.sizeLabel || 'Ölçü'}: <span className="text-neutral-800 font-mono font-black border-b pb-0.5">{product.size}</span>
            </p>
          )}

          {/* Pricing & Checkout Block */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-neutral-100">
            <div className="flex flex-col">
              {product.discountPercent && product.discountPercent > 0 ? (
                <>
                  <span className="text-xs text-red-500 line-through font-mono font-bold leading-none mb-1">
                    {product.price.toFixed(2)} ₼
                  </span>
                  <span className="text-3xl font-black font-mono text-emerald-800 flex items-center gap-2 leading-none">
                    {getEffectivePrice(product).toFixed(2)} ₼
                    <span className="bg-emerald-800 text-white text-[10px] px-2 py-0.5 rounded-lg font-black animate-pulse leading-none uppercase">
                      -{product.discountPercent}% {lang === 'az' ? 'ENDİRİM' : lang === 'ru' ? 'СКИДКА' : 'OFF'}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black font-mono text-neutral-950">
                  {product.price.toFixed(2)} ₼
                </span>
              )}
            </div>

            <div className="flex space-x-2 w-full sm:w-auto font-sans font-bold">
              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-none px-5 py-3 bg-neutral-105 hover:bg-neutral-900 hover:text-white rounded-xl text-neutral-700 text-xs font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {t.addToCartBtn || 'Səbətə At'}
              </button>
              <button
                onClick={() => {
                  onQuickOrder(product);
                  onClose();
                }}
                disabled={isOutOfStock}
                className="flex-1 sm:flex-none px-5 py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-black transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                {t.quickOrderBtn || 'Sifariş Et'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
