import React, { useEffect, useState } from 'react';
import { MessageCircle, Minus, Plus, SlidersHorizontal, X } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { formatIDR } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, variant: ProductVariant, quantity: number) => void;
  onAskWhatsApp: (productName: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAskWhatsApp,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants[0]);
      setQuantity(1);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (product) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [product, onClose]);

  if (!product || !selectedVariant) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <p className="text-xs font-medium text-slate-500">
            {product.category} · Spesifikasi Resmi IoTHome
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup detail produk"
            className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Split */}
        <div className="p-5 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8">
          {/* Artwork & Efficiency Note */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="aspect-4/3 bg-[#F1F5F9] rounded-xl p-6 flex items-center justify-center border border-slate-200">
              <ProductArtwork kind={product.artwork} className="w-full h-full max-w-[220px]" />
            </div>

            <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-[#0F52BA]">Efisiensi &amp; Keunggulan</p>
              <p className="mt-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
                {product.powerSavingNote}
              </p>
            </div>
          </div>

          {/* Purchase Module & Specs */}
          <div className="md:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <h2
                id="modal-product-title"
                className="font-display text-xl sm:text-2xl font-bold text-slate-900"
              >
                {product.name}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                  {formatIDR(selectedVariant.price)}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="font-mono text-sm text-slate-400 line-through tabular-nums">
                    {formatIDR(selectedVariant.originalPrice)}
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="mt-5">
                <p className="text-xs font-semibold text-slate-700 mb-2">Pilih Paket / Varian</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const active = variant.id === selectedVariant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`min-h-[42px] px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#0F52BA] border-[#0F52BA] text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {variant.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Technical Specs */}
              <div className="mt-6 pt-5 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-3">Spesifikasi Teknis</p>
                <dl className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="py-2 flex justify-between gap-4">
                      <dt className="text-slate-500">{spec.label}</dt>
                      <dd className="text-slate-900 font-medium text-right">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center justify-between sm:justify-start border border-slate-200 rounded-lg bg-[#F8FAFC] px-2 h-12">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Kurangi jumlah"
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-mono text-sm font-semibold tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Tambah jumlah"
                  className="w-9 h-9 flex items-center justify-center text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedVariant, quantity);
                  onClose();
                }}
                className="flex-1 min-h-[48px] px-5 py-3 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
              >
                Tambah ke Keranjang · {formatIDR(selectedVariant.price * quantity)}
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onAskWhatsApp(`${product.name} (${selectedVariant.label})`);
                }}
                aria-label="Tanya produk via WhatsApp"
                className="min-h-[48px] px-4 py-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Tanya WA</span>
              </button>

              <a
                href="#dashboard"
                onClick={onClose}
                className="min-h-[48px] px-4 py-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#0F52BA]" />
                <span>Uji Kontrol</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
