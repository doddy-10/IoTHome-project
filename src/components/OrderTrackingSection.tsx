import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  MessageCircle,
  Package,
  Search,
  SlidersHorizontal,
  Truck,
} from 'lucide-react';
import { OrderReceipt, OrderStatus } from '../types';
import { formatIDR } from '../data/products';

interface OrderTrackingSectionProps {
  orders: OrderReceipt[];
  activeOrderId: string | null;
  onSelectOrder: (orderNumber: string) => void;
  onVerifyPayment: (orderNumber: string) => void;
  onAdvanceDelivery: (orderNumber: string) => void;
  onConfirmReceived: (orderNumber: string) => void;
  onCreateDemoOrder: () => void;
  onContactWhatsApp: (orderNumber?: string) => void;
}

const STATUS_BADGE_MAP: Record<
  OrderStatus,
  { label: string; colorClass: string }
> = {
  awaiting_payment: {
    label: 'Menunggu Pembayaran',
    colorClass: 'text-amber-700',
  },
  packed: {
    label: 'Sedang Dikemas',
    colorClass: 'text-[#0F52BA]',
  },
  shipped: {
    label: 'Diserahkan ke Kurir',
    colorClass: 'text-[#0F52BA]',
  },
  in_transit: {
    label: 'Dalam Perjalanan ke Tujuan',
    colorClass: 'text-[#0F52BA]',
  },
  delivered: {
    label: 'Paket Telah Tiba di Tujuan',
    colorClass: 'text-emerald-700',
  },
};

export const OrderTrackingSection: React.FC<OrderTrackingSectionProps> = ({
  orders,
  activeOrderId,
  onSelectOrder,
  onVerifyPayment,
  onAdvanceDelivery,
  onConfirmReceived,
  onCreateDemoOrder,
  onContactWhatsApp,
}) => {
  const [searchCode, setSearchCode] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const currentOrder =
    orders.find((o) => o.orderNumber === activeOrderId) ?? orders[0] ?? null;

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = searchCode.trim().toUpperCase();
    if (!cleaned) {
      setSearchFeedback(null);
      return;
    }
    const found = orders.find(
      (o) =>
        o.orderNumber.toUpperCase() === cleaned ||
        o.trackingNumber.toUpperCase() === cleaned
    );
    if (found) {
      onSelectOrder(found.orderNumber);
      setSearchFeedback(null);
    } else {
      setSearchFeedback(`Nomor pesanan atau resi "${cleaned}" tidak ditemukan.`);
    }
  };

  const getStepIcon = (status: OrderStatus, completed: boolean) => {
    const cls = completed ? 'w-4 h-4 text-white' : 'w-4 h-4 text-slate-400';
    switch (status) {
      case 'awaiting_payment':
        return <CreditCard className={cls} />;
      case 'packed':
        return <Package className={cls} />;
      case 'shipped':
      case 'in_transit':
        return <Truck className={cls} />;
      case 'delivered':
        return <Home className={cls} />;
    }
  };

  return (
    <section id="lacak-pesanan" className="py-14 lg:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading + Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-2">
              Alur Pembelian Lengkap · Dari Checkout hingga Paket Tiba
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Lacak Pengiriman &amp; Status Pesanan Anda
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Pantau setiap tahapan mulai dari konfirmasi pembayaran, pengemasan di gudang,
              pengiriman kurir, hingga paket tiba di depan rumah Anda.
            </p>
          </div>

          <form onSubmit={handleLookup} className="flex items-center gap-2 shrink-0">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Cari No. Pesanan / Resi..."
                aria-label="Cari nomor pesanan atau resi"
                className="w-full min-h-[42px] pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0F52BA]"
              />
            </div>
            <button
              type="submit"
              className="min-h-[42px] px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
            >
              Lacak
            </button>
          </form>
        </div>

        {searchFeedback && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm px-4 py-3 rounded-xl">
            {searchFeedback}
          </div>
        )}

        {/* Order Selector Tabs if user has multiple orders */}
        {orders.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4">
            {orders.map((order) => {
              const isSelected = currentOrder?.orderNumber === order.orderNumber;
              return (
                <button
                  key={order.orderNumber}
                  type="button"
                  onClick={() => onSelectOrder(order.orderNumber)}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#0F52BA] border-[#0F52BA] text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  #{order.orderNumber}
                </button>
              );
            })}
          </div>
        )}

        {!currentOrder ? (
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 text-center">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Belum Ada Pesanan Aktif
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 max-w-md mx-auto">
              Tambahkan perangkat IoTHome dari katalog lalu selesaikan checkout, atau jalankan
              simulasi pesanan untuk melihat alur pengiriman hingga tiba di tujuan.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#katalog"
                className="min-h-[44px] px-5 py-2.5 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold inline-flex items-center gap-2 transition-colors"
              >
                <span>Pilih Produk di Katalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={onCreateDemoOrder}
                className="min-h-[44px] px-5 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium cursor-pointer transition-colors"
              >
                Buat Simulasi Pesanan Sekarang
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-8">
            {/* Order Header Summary */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono font-semibold text-slate-900">
                    #{currentOrder.orderNumber}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Resi: {currentOrder.trackingNumber}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentOrder.courier}</span>
                </div>
                <h3 className="mt-1.5 font-display text-lg sm:text-xl font-bold text-slate-900">
                  <span className={STATUS_BADGE_MAP[currentOrder.status].colorClass}>
                    {STATUS_BADGE_MAP[currentOrder.status].label}
                  </span>
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-600">
                  Tujuan: <strong>{currentOrder.customerName}</strong> — {currentOrder.address}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                {currentOrder.status === 'awaiting_payment' && (
                  <button
                    type="button"
                    onClick={() => onVerifyPayment(currentOrder.orderNumber)}
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors whitespace-nowrap"
                  >
                    Konfirmasi Pembayaran
                  </button>
                )}

                {(currentOrder.status === 'packed' ||
                  currentOrder.status === 'shipped' ||
                  currentOrder.status === 'in_transit') && (
                  <button
                    type="button"
                    onClick={() => onAdvanceDelivery(currentOrder.orderNumber)}
                    className="min-h-[44px] px-4 py-2 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                  >
                    <Truck className="w-4 h-4 shrink-0" />
                    <span>Simulasikan Tahap Pengiriman Berikutnya</span>
                  </button>
                )}

                {currentOrder.status === 'delivered' &&
                  !currentOrder.receivedConfirmedByUser && (
                    <button
                      type="button"
                      onClick={() => onConfirmReceived(currentOrder.orderNumber)}
                      className="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Konfirmasi Paket Diterima</span>
                    </button>
                  )}

                <button
                  type="button"
                  onClick={() => onContactWhatsApp(currentOrder.orderNumber)}
                  className="min-h-[44px] px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs sm:text-sm font-medium text-slate-700 inline-flex items-center gap-2 cursor-pointer transition-colors whitespace-nowrap"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Tanya via WhatsApp</span>
                </button>
              </div>
            </div>

            {/* 5-Stage Delivery Timeline */}
            <div className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7">
                <p className="text-xs font-semibold text-slate-500 mb-4">
                  Riwayat Perjalanan Paket
                </p>
                <ol className="space-y-4">
                  {currentOrder.timeline.map((event, idx) => {
                    const isLast = idx === currentOrder.timeline.length - 1;
                    return (
                      <li key={event.status} className="relative flex gap-3.5">
                        {!isLast && (
                          <span
                            aria-hidden="true"
                            className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${
                              event.completed ? 'bg-[#0F52BA]' : 'bg-slate-200'
                            }`}
                          />
                        )}
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                            event.completed
                              ? event.status === 'delivered'
                                ? 'bg-emerald-700'
                                : 'bg-[#0F52BA]'
                              : 'bg-slate-100 border border-slate-200'
                          }`}
                        >
                          {getStepIcon(event.status, event.completed)}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <p
                              className={`text-sm font-semibold ${
                                event.completed ? 'text-slate-900' : 'text-slate-400'
                              }`}
                            >
                              {event.title}
                            </p>
                            <span className="font-mono text-xs text-slate-500 tabular-nums">
                              {event.timestamp}
                            </span>
                          </div>
                          <p
                            className={`mt-0.5 text-xs leading-relaxed ${
                              event.completed ? 'text-slate-600' : 'text-slate-400'
                            }`}
                          >
                            {event.description}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Order Items & Arrival Next Step */}
              <div className="lg:col-span-5 flex flex-col justify-between gap-5 bg-[#F8FAFC] border border-slate-200 rounded-xl p-5">
                <div>
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <span className="text-xs font-semibold text-slate-700">Rincian Paket</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      {currentOrder.estimatedArrival}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200 my-2">
                    {currentOrder.items.map((item) => (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="py-2.5 flex justify-between gap-3 text-xs sm:text-sm"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-900 truncate">{item.name}</p>
                          <p className="text-xs text-slate-500">
                            {item.variantLabel} × {item.quantity}
                          </p>
                        </div>
                        <span className="font-mono font-semibold text-slate-900 tabular-nums shrink-0">
                          {formatIDR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-200 space-y-1 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Pembayaran</span>
                      <span className="text-slate-900 font-medium">{currentOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-slate-900 pt-1">
                      <span>Total Dibayar</span>
                      <span className="font-mono tabular-nums">{formatIDR(currentOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {currentOrder.status === 'delivered' && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 space-y-3">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-900">
                      {currentOrder.receivedConfirmedByUser
                        ? 'Penerimaan paket telah dikonfirmasi! Perangkat IoTHome Anda siap dihubungkan.'
                        : 'Paket telah tiba di alamat tujuan. Silakan periksa kelengkapan perangkat Anda.'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href="#dashboard"
                        className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Buka Dashboard Kontrol</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => onContactWhatsApp(currentOrder.orderNumber)}
                        className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white border border-emerald-300 text-emerald-900 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Panduan Pasang WA</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
