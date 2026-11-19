import React, { useState } from 'react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { IoTHomeLogoMark } from './ProductArtwork';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ cartCount, onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#dashboard', label: 'Dashboard' },
    { href: '#katalog', label: 'Katalog' },
    { href: '#lacak-pesanan', label: 'Lacak Pesanan' },
    { href: '#cara-kerja', label: 'Cara Kerja' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-[#0F52BA] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0F52BA] rounded"
        >
          <IoTHomeLogoMark className="w-7 h-7" />
          <span className="font-display text-xl font-bold tracking-tight text-slate-900">
            IoTHome
          </span>
        </a>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
        >
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="py-1 text-slate-600 hover:text-[#0F52BA] transition-colors duration-150 whitespace-nowrap shrink-0 hover:underline underline-offset-8 decoration-2 decoration-[#0F52BA]/60"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action (+ mobile menu toggle on small viewports) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`Buka keranjang belanja, ${cartCount} barang`}
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F52BA]"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Keranjang</span>
            <span className="font-mono text-xs tabular-nums bg-white/15 px-1.5 py-0.5 rounded">
              {cartCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 shadow-sm">
          <nav className="flex flex-col gap-1" aria-label="Navigasi Mobile">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="min-h-[44px] flex items-center px-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F52BA] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};
