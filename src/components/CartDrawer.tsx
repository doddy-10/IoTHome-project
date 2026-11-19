import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from 'lucide-react';
import { CartItem, OrderReceipt, OrderStatus, OrderTimelineEvent } from '../types';
import { formatIDR } from '../data/products';
import { ProductArtwork } from './ProductArtwork';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onUpdateQty: (productId: string, variantId: string, delta: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onClearCart: () => void;
  onOrderCreated: (order: OrderReceipt) => void;
  onVerifyPayment: (orderNumber: string) => void;
  onTrackOrder: (orderNumber: string) => void;
  onContactWhatsApp: (orderNumber: string) => void;
}

export const buildInitialTimeline = (
  isCod: boolean,
  courier: string,
  nowLabel: string
): OrderTimelineEvent[] => [
  {
    status: 'awaiting_payment',
    title: isCod
      ? 'Pesanan COD Dibuat & Dikonfirmasi'
      : 'Pesanan Dibuat — Menunggu Pembayaran',
    description: isCod
      ? 'Pesanan Cash on Delivery terverifikasi. Siap disiapkan di gudang IoTHome.'
      : 'Silakan selesaikan pembayaran melalui QRIS atau Virtual Account untuk mulai pengemasan.',
    timestamp: nowLabel,
    completed: true,
  },
  {
    status: 'packed',
    title: 'Dikemas di Gudang IoTHome',
    description:
      'Tim QC menguji konektivitas Wi-Fi perangkat dan mengemas paket dengan pelindung ekstra.',
    timestamp: isCod ? nowLabel : 'Menunggu pembayaran',
    completed: isCod,
  },
  {
    status: 'shipped',
    title: `Diserahkan ke Kurir (${courier})`,
    description: 'Paket telah diambil kurir dari Hub Jakarta dan resi pengiriman aktif.',
    timestamp: 'Estimasi hari ini',
    completed: false,
  },
  {
    status: 'in_transit',
    title: 'Dalam Perjalanan ke Alamat Tujuan',
    description: 'Kurir sedang menuju kota dan kecamatan alamat pengiriman Anda.',
    timestamp: 'Estimasi 1–2 hari',
    completed: false,
  },
  {
    status: 'delivered',
    title: 'Paket Telah Tiba di Tujuan',
    description:
      'Paket berhasil diterima di alamat tujuan. Perangkat siap dihubungkan ke dashboard IoTHome.',
    timestamp: 'Menunggu tiba',
    completed: false,
  },
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onVerifyPayment,
  onTrackOrder,
  onContactWhatsApp,
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [courier, setCourier] = useState('IoTHome Express (1–2 Hari)');
  const [paymentMethod, setPaymentMethod] = useState(
    'QRIS / E-Wallet (GoPay, OVO, Dana)'
  );
  const [formError, setFormError] = useState('');
  const [receipt, setReceipt] = useState<OrderReceipt | null>(null);
  const [paymentConfirmedInDrawer, setPaymentConfirmedInDrawer] = useState(false);

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

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const freeShippingThreshold = 500000;
  const shippingCost = subtotal === 0 || subtotal >= freeShippingThreshold ? 0 : 22000;
  const total = subtotal + shippingCost;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedWa = whatsapp.replace(/\D/g, '');
    if (customerName.trim().length < 2) {
      setFormError('Masukkan nama lengkap penerima.');
      return;
    }
    if (cleanedWa.length < 9) {
      setFormError('Masukkan nomor WhatsApp aktif yang valid.');
      return;
    }
    if (address.trim().length < 10) {
      setFormError('Masukkan alamat pengiriman lengkap termasuk kota dan kode pos.');
      return;
    }

    setFormError('');
    const nowLabel = new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const isCod = paymentMethod.startsWith('COD');
    const initialStatus: OrderStatus = isCod ? 'packed' : 'awaiting_payment';

    const newReceipt: OrderReceipt = {
      orderNumber: `IOT-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customerName.trim(),
      whatsapp: whatsapp.trim(),
      address: address.trim(),
      courier,
      trackingNumber: `IOTEXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      paymentMethod,
      items: [...items],
      subtotal,
      shippingCost,
      total,
      status: initialStatus,
      estimatedArrival: courier.includes('Express')
        ? 'Estimasi tiba 1–2 hari kerja'
        : 'Estimasi tiba 2–3 hari kerja',
      receivedConfirmedByUser: false,
      timeline: buildInitialTimeline(isCod, courier, nowLabel),
      createdAt: nowLabel,
    };

    setReceipt(newReceipt);
    setPaymentConfirmedInDrawer(isCod);
    onOrderCreated(newReceipt);
    onClearCart();
    setStep('confirmed');
  };

  const handleCloseDrawer = () => {
    if (step === 'confirmed') {
      setStep('cart');
      setReceipt(null);
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-label="Keranjang Belanja IoTHome"
      onClick={handleCloseDrawer}
    >
      <div
        className="w-full max-w-md h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#0F52BA]" />
            <h2 className="font-display text-base font-bold text-slate-900">
              {step === 'cart'
                ? 'Keranjang Belanja'
                : step === 'checkout'
                ? 'Pengiriman & Pembayaran'
                : 'Pesanan Dikonfirmasi'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleCloseDrawer}
            aria-label="Tutup keranjang"
            className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-center text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {step === 'confirmed' && receipt ? (
            <div className="space-y-5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle2 className="w-6 h-6 shrink-0" />
                  <div>
                    <p className="font-display text-base font-bold">
                      Pesanan #{receipt.orderNumber} Dibuat
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">{receipt.createdAt}</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-emerald-900 leading-relaxed">
                  {paymentConfirmedInDrawer
                    ? 'Pembayaran terverifikasi. Pesanan sedang disiapkan di gudang IoTHome untuk segera dikirim.'
                    : 'Selesaikan pembayaran untuk memproses pengemasan dan pengiriman kurir.'}
                </p>
              </div>

              {!paymentConfirmedInDrawer && (
                <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-slate-900">
                    Instruksi Pembayaran ({receipt.paymentMethod})
                  </p>
                  <p className="font-mono text-sm font-bold text-[#0F52BA] tabular-nums">
                    VA / Kode Bayar: 8801-{receipt.orderNumber.replace('IOT-', '')}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onVerifyPayment(receipt.orderNumber);
                      setPaymentConfirmedInDrawer(true);
                    }}
                    className="w-full min-h-[44px] rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    Konfirmasi Pembayaran Sekarang
                  </button>
                </div>
              )}

              <div className="border border-slate-200 rounded-xl p-4 space-y-3 text-sm">
                <p className="font-display font-semibold text-slate-900">Ringkasan Pesanan</p>
                <div className="divide-y divide-slate-100">
                  {receipt.items.map((item) => (
                    <div
                      key={`${item.productId}-${item.variantId}`}
                      className="py-2 flex justify-between gap-3 text-xs sm:text-sm"
                    >
                      <span className="text-slate-600">
                        {item.name} ({item.variantLabel}) × {item.quantity}
                      </span>
                      <span className="font-mono font-medium text-slate-900 tabular-nums shrink-0">
                        {formatIDR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Kurir &amp; Resi</span>
                    <span className="text-slate-900 font-medium font-mono">
                      {receipt.courier} · {receipt.trackingNumber}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Alamat Pengiriman</span>
                    <span className="text-slate-900 text-right max-w-[200px]">
                      {receipt.address}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 text-sm font-bold text-slate-900">
                    <span>Total Tagihan</span>
                    <span className="font-mono tabular-nums">{formatIDR(receipt.total)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => {
                    const orderNo = receipt.orderNumber;
                    handleCloseDrawer();
                    onTrackOrder(orderNo);
                  }}
                  className="w-full min-h-[48px] rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Truck className="w-4 h-4" />
                  <span>Pantau Pengiriman Hingga Tiba</span>
                </button>

                <button
                  type="button"
                  onClick={() => onContactWhatsApp(receipt.orderNumber)}
                  className="w-full min-h-[44px] rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Konfirmasi via WhatsApp CS</span>
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="w-10 h-10 text-slate-300 mb-3" />
              <p className="font-display text-base font-semibold text-slate-900">
                Keranjang Anda masih kosong
              </p>
              <p className="text-sm text-slate-500 mt-1 max-w-xs">
                Pilih lampu pintar, CCTV, smart plug, atau paket hemat dari katalog kami.
              </p>
              <a
                href="#katalog"
                onClick={onClose}
                className="mt-5 min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold inline-flex items-center"
              >
                Lihat Katalog Produk
              </a>
            </div>
          ) : step === 'cart' ? (
            <div className="space-y-4">
              {/* Free Shipping Status */}
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
                {subtotal >= freeShippingThreshold ? (
                  <p className="font-medium text-emerald-700">
                    Gratis Ongkir aktif untuk pesanan Anda.
                  </p>
                ) : (
                  <p>
                    Tambah{' '}
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {formatIDR(freeShippingThreshold - subtotal)}
                    </span>{' '}
                    lagi untuk Gratis Ongkir.
                  </p>
                )}
              </div>

              <div className="divide-y divide-slate-200">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantId}`}
                    className="py-4 flex gap-3.5"
                  >
                    <div className="w-20 h-16 rounded-lg bg-[#F1F5F9] p-2 flex items-center justify-center shrink-0">
                      <ProductArtwork kind={item.artwork} className="w-full h-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.variantLabel}</p>
                      <p className="font-mono text-sm font-semibold text-slate-900 tabular-nums mt-1">
                        {formatIDR(item.price * item.quantity)}
                      </p>

                      <div className="mt-2.5 flex items-center justify-between gap-2">
                        <div className="inline-flex items-center border border-slate-200 rounded-lg bg-[#F8FAFC]">
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.productId, item.variantId, -1)}
                            aria-label={`Kurangi ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQty(item.productId, item.variantId, 1)}
                            aria-label={`Tambah ${item.name}`}
                            className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.productId, item.variantId)}
                          aria-label={`Hapus ${item.name}`}
                          className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <form id="checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-medium px-3.5 py-2.5 rounded-lg">
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="checkout-name"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nama Lengkap Penerima
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Andi Pratama"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-wa"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Nomor WhatsApp Aktif
                </label>
                <input
                  id="checkout-wa"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Alamat Lengkap &amp; Kota
                </label>
                <textarea
                  id="checkout-address"
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Jl. Merdeka No. 12, Kec. Menteng, Jakarta Pusat 10310"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#0F52BA]"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-courier"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Pilih Layanan Pengiriman
                </label>
                <select
                  id="checkout-courier"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:border-[#0F52BA]"
                >
                  <option value="IoTHome Express (1–2 Hari)">
                    IoTHome Express (1–2 Hari Kerja)
                  </option>
                  <option value="SiCepat BEST (1–2 Hari)">SiCepat BEST (1–2 Hari Kerja)</option>
                  <option value="JNE Reguler (2–3 Hari)">JNE Reguler (2–3 Hari Kerja)</option>
                </select>
              </div>

              <div>
                <p className="block text-xs font-semibold text-slate-700 mb-2">
                  Metode Pembayaran
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    'QRIS / E-Wallet (GoPay, OVO, Dana)',
                    'Transfer Bank Virtual Account (BCA, Mandiri, BNI)',
                    'COD (Bayar di Tempat saat Barang Tiba)',
                  ].map((method) => (
                    <label
                      key={method}
                      className={`min-h-[44px] px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm flex items-center gap-2.5 cursor-pointer ${
                        paymentMethod === method
                          ? 'border-[#0F52BA] bg-[#0F52BA]/5 text-slate-900 font-medium'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-[#0F52BA]"
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-5 border-t border-slate-200 bg-[#F8FAFC] space-y-3">
            <div className="space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal Produk</span>
                <span className="font-mono tabular-nums">{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Ongkos Kirim</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'Gratis' : formatIDR(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900 text-base">
                <span>Total</span>
                <span className="font-mono tabular-nums">{formatIDR(total)}</span>
              </div>
            </div>

            {step === 'cart' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full min-h-[48px] rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold transition-colors cursor-pointer"
              >
                Lanjut ke Pengiriman
              </button>
            ) : (
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep('cart')}
                  className="min-h-[48px] px-4 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-sm font-medium text-slate-700 cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  form="checkout-form"
                  className="flex-1 min-h-[48px] rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Buat Pesanan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
