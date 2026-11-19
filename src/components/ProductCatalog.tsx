import React, { useMemo, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Product, ProductCategory } from '../types';
import { formatIDR, PRODUCTS } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc'>('popular');

  const categories: ProductCategory[] = [
    'Semua',
    'Smart Lighting',
    'Smart Security',
    'Smart Plug',
    'Smart AC',
    'Paket Bundling',
  ];

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'Semua' || product.category === selectedCategory;
      const matchesQuery =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.shortSpec.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <section id="katalog" className="py-14 lg:py-20 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-2">
              Katalog Perangkat Resmi · Siap Kirim Seluruh Indonesia
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Pilih Perangkat Smart Home IoTHome
            </h2>
          </div>

          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-mono tabular-nums font-semibold text-slate-900">{filteredProducts.length}</span> produk resmi
          </p>
        </div>

        {/* Filter Bar: Categories + Search + Sort */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {categories.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#0F52BA] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari lampu, CCTV, plug..."
                aria-label="Cari produk IoTHome"
                className="w-full sm:w-60 min-h-[42px] pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F52BA]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'price-asc' | 'price-desc')}
              aria-label="Urutkan produk"
              className="min-h-[42px] px-3 py-2 rounded-lg border border-slate-200 bg-[#F8FAFC] text-sm text-slate-700 focus:outline-none focus:border-[#0F52BA] cursor-pointer"
            >
              <option value="popular">Urutan: Terpopuler</option>
              <option value="price-asc">Harga: Terendah</option>
              <option value="price-desc">Harga: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-10 text-center">
            <p className="font-display text-lg font-semibold text-slate-900">
              Produk tidak ditemukan
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Coba ubah kata kunci pencarian atau pilih kategori semua produk.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('Semua');
                setSearchQuery('');
              }}
              className="mt-4 min-h-[44px] px-5 py-2 rounded-lg bg-[#0F52BA] text-white text-sm font-medium hover:bg-[#0A3D91] cursor-pointer"
            >
              Tampilkan Semua Produk
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md"
              >
                {/* Uniform 4:3 Hardware Showcase */}
                <button
                  type="button"
                  onClick={() => onSelectProduct(product)}
                  aria-label={`Lihat detail ${product.name}`}
                  className="w-full aspect-4/3 bg-[#F1F5F9] p-6 flex items-center justify-center relative cursor-pointer focus-visible:outline-2 focus-visible:outline-[#0F52BA]"
                >
                  <ProductArtwork
                    kind={product.artwork}
                    className="w-full h-full max-w-[220px] max-h-[165px] transition-transform duration-200 group-hover:scale-105"
                  />
                </button>

                {/* Clean Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    {/* Zero-pill clean text metadata */}
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                      <span className="truncate">{product.category}</span>
                      {product.tag && (
                        <span className="font-medium text-[#0F52BA] shrink-0">
                          {product.tag}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-1.5 font-display text-base font-bold text-slate-900 leading-snug">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="text-left hover:text-[#0F52BA] transition-colors cursor-pointer"
                      >
                        {product.name}
                      </button>
                    </h3>

                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {product.shortSpec}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2.5 mb-4">
                      <span className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                        {formatIDR(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-xs text-slate-400 line-through tabular-nums">
                          {formatIDR(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 min-h-[44px] px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Detail Produk
                      </button>

                      <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="flex-1 min-h-[44px] px-3 py-2 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4 shrink-0" />
                        <span>Keranjang</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
