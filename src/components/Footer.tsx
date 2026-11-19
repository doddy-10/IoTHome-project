import React from 'react';
import { MessageCircle } from 'lucide-react';
import { IoTHomeLogoMark } from './ProductArtwork';

interface FooterProps {
  onOpenWhatsApp: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWhatsApp }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <IoTHomeLogoMark className="w-7 h-7" />
              <span className="font-display text-lg font-bold text-white">IoTHome</span>
            </div>
            <p className="mt-2 text-sm text-slate-400 max-w-sm">
              Your Smart Living Partner — Wujudkan Smart Home impianmu dengan mudah, aman,
              dan hemat energi bersama IoTHome.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 text-sm">
            <a href="#dashboard" className="hover:text-white transition-colors">
              Dashboard Kontrol
            </a>
            <a href="#katalog" className="hover:text-white transition-colors">
              Katalog Produk
            </a>
            <a href="#lacak-pesanan" className="hover:text-white transition-colors">
              Lacak Pesanan
            </a>
            <a href="#cara-kerja" className="hover:text-white transition-colors">
              Cara Kerja
            </a>
            <button
              type="button"
              onClick={onOpenWhatsApp}
              className="inline-flex items-center gap-2 min-h-[40px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Hubungi WhatsApp</span>
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} IoTHome Indonesia. Seluruh hak cipta dilindungi.</p>
          <p>WhatsApp CS: +62 811-8890-2026 · Senin – Minggu, 08:00 – 21:00 WIB</p>
        </div>
      </div>
    </footer>
  );
};
