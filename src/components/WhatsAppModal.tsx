import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, MessageCircle, X } from 'lucide-react';

export interface WhatsAppContext {
  topic?: string;
  productName?: string;
  orderNumber?: string;
}

interface WhatsAppModalProps {
  isOpen: boolean;
  context: WhatsAppContext | null;
  onClose: () => void;
}

const WHATSAPP_NUMBER = '6289630069368';
const WHATSAPP_DISPLAY = '+62 896-3006-9368';

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  context,
  onClose,
}) => {
  const [topic, setTopic] = useState('Konsultasi Produk & Paket Hemat');
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (context?.orderNumber) {
      setTopic('Bantuan Pesanan & Pengiriman');
      setMessage(
        `Halo Tim IoTHome, saya ingin menanyakan status pesanan ${context.orderNumber}.`
      );
    } else if (context?.productName) {
      setTopic('Konsultasi Produk & Paket Hemat');
      setMessage(
        `Halo Tim IoTHome, saya tertarik dengan produk ${context.productName}. Apakah stoknya tersedia dan bagaimana cara pemasangannya?`
      );
    } else {
      setTopic(context?.topic || 'Konsultasi Produk & Paket Hemat');
      setMessage(
        'Halo Tim IoTHome, saya ingin konsultasi mengenai perangkat Smart Home yang cocok untuk rumah saya.'
      );
    }
    setCopied(false);
  }, [isOpen, context]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const topics = [
    'Konsultasi Produk & Paket Hemat',
    'Panduan Pemasangan & Teknisi',
    'Bantuan Pesanan & Pengiriman',
  ];

  const finalMessage = [
    customerName.trim() ? `Nama: ${customerName.trim()}` : null,
    `Topik: ${topic}`,
    message.trim(),
  ]
    .filter(Boolean)
    .join('\n');

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(finalMessage)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(finalMessage);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failures
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/55 backdrop-blur-xs sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-700 text-white flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 id="wa-modal-title" className="font-display text-base font-bold">
                Hubungi IoTHome via WhatsApp
              </h2>
              <p className="text-xs text-emerald-100 font-mono tabular-nums">
                CS &amp; Teknisi Resmi · {WHATSAPP_DISPLAY}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel WhatsApp"
            className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <div>
            <p className="text-xs font-semibold text-slate-700 mb-2">Pilih Topik Bantuan</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((item) => {
                const active = topic === item;
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setTopic(item)}
                    className={`min-h-[38px] px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'bg-emerald-700 border-emerald-700 text-white'
                        : 'bg-[#F8FAFC] border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label
              htmlFor="wa-customer-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Nama Anda (Opsional)
            </label>
            <input
              id="wa-customer-name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full min-h-[42px] px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div>
            <label
              htmlFor="wa-message"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              Pesan yang Akan Dikirim
            </label>
            <textarea
              id="wa-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-emerald-700"
            />
          </div>

          <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
            Tim IoTHome siap membantu pemilihan perangkat, pengecekan resi pengiriman, hingga
            panduan instalasi Wi-Fi setiap hari pukul 08:00 – 21:00 WIB.
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopy}
              className="min-h-[46px] px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Pesan Disalin</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Salin Pesan</span>
                </>
              )}
            </button>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[46px] px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Chat di WhatsApp Sekarang</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
