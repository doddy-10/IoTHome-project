import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  MessageCircle,
  PlugZap,
  ShieldCheck,
  SlidersHorizontal,
  Snowflake,
} from 'lucide-react';
import { SmartHomeState } from '../types';
import { IoTHomeLogoMark } from './ProductArtwork';

interface HeroSectionProps {
  smartState: SmartHomeState;
  activeWatts: number;
  estimatedMonthlyBill: number;
  onToggleLight: (id: string) => void;
  onTogglePlug: (id: string) => void;
  onToggleAc: () => void;
  onToggleCctv: () => void;
  onOpenWhatsApp: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  smartState,
  activeWatts,
  estimatedMonthlyBill,
  onToggleLight,
  onTogglePlug,
  onToggleAc,
  onToggleCctv,
  onOpenWhatsApp,
}) => {
  const livingRoomLight = smartState.lights[0];
  const mainPlug = smartState.plugs[0];

  const proofMetrics = [
    {
      value: 'Hingga 34%',
      label: 'Penghematan tagihan listrik bulanan via jadwal otomatis',
    },
    {
      value: '24/7 Real-Time',
      label: 'Pemantauan Smart CCTV 2K dengan notifikasi gerakan',
    },
    {
      value: '1 Aplikasi',
      label: 'Kendali Lighting, Security, Smart Plug & AC sekaligus',
    },
    {
      value: 'Garansi 2 Tahun',
      label: 'Dukungan purna jual resmi dan panduan instalasi cepat',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-12 lg:pt-16 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-4">
              Your Smart Living Partner · Ekosistem Rumah Pintar
            </p>

            <h1
              className="font-display font-bold text-slate-900 tracking-tight leading-[1.12] max-w-2xl"
              style={{
                fontSize: 'clamp(2.125rem, 4vw, 3.35rem)',
                textWrap: 'balance',
              }}
            >
              Rumah canggih, aman, dan praktis kini bukan lagi mimpi.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Wujudkan Smart Home impianmu dengan mudah bersama IoTHome. Kendalikan
              lampu yang lupa dimatikan, pantau keamanan rumah real-time, dan tekan
              tagihan listrik langsung dari smartphone.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <a
                href="#katalog"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-[#0F52BA] hover:bg-[#0A3D91] text-white text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F52BA]"
              >
                <span>Belanja Produk Pintar</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </a>

              <a
                href="#dashboard"
                className="inline-flex items-center justify-center gap-2 min-h-[48px] px-6 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
              >
                <SlidersHorizontal className="w-4 h-4 shrink-0 text-[#0F52BA]" />
                <span>Coba Kontrol Dashboard</span>
              </a>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={onOpenWhatsApp}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-700 hover:text-emerald-800 hover:underline underline-offset-4 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Butuh konsultasi paket rumah pintar? Hubungi via WhatsApp</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-500">
              <span>Instalasi Plug &amp; Play &lt; 15 menit</span>
              <span aria-hidden="true">·</span>
              <span>Tanpa bongkar kabel tembok</span>
              <span aria-hidden="true">·</span>
              <span>Terhubung langsung ke Wi-Fi rumah</span>
            </div>
          </div>

          {/* Right Column: Synchronized Interactive Smartphone App Preview */}
          <div className="lg:col-span-5 flex items-center justify-center">
            <div className="w-full max-w-[360px] rounded-[2rem] bg-slate-900 p-3 shadow-lg border border-slate-800">
              {/* Phone Screen */}
              <div className="rounded-[1.5rem] bg-[#F8FAFC] overflow-hidden border border-slate-200/20">
                {/* Phone Top App Header */}
                <div className="bg-white px-4 pt-4 pb-3 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IoTHomeLogoMark className="w-6 h-6" />
                    <span className="font-display font-bold text-sm text-slate-900">
                      IoTHome App
                    </span>
                  </div>
                  <span className="text-xs font-mono tabular-nums font-medium text-[#0F52BA]">
                    {activeWatts.toFixed(0)} W aktif
                  </span>
                </div>

                {/* Scene 4 Highlight: Quick Light Action Card */}
                <div className="p-4 space-y-3">
                  <div
                    className={`rounded-xl p-4 border transition-colors duration-150 ${
                      livingRoomLight?.isOn
                        ? 'bg-amber-50/70 border-amber-200'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            livingRoomLight?.isOn
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-[#0F52BA]/10 text-[#0F52BA]'
                          }`}
                        >
                          {livingRoomLight?.isOn ? (
                            <Lightbulb className="w-5 h-5" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 truncate">
                            {livingRoomLight?.room}
                          </p>
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {livingRoomLight?.isOn ? 'Lampu Menyala' : 'Lampu Mati'}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => livingRoomLight && onToggleLight(livingRoomLight.id)}
                        className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          livingRoomLight?.isOn
                            ? 'bg-slate-900 text-white hover:bg-slate-800'
                            : 'bg-[#0F52BA] text-white hover:bg-[#0A3D91]'
                        }`}
                      >
                        {livingRoomLight?.isOn ? 'Matikan' : 'Nyalakan'}
                      </button>
                    </div>
                  </div>

                  {/* Scene 6: 4 Core Pillars Interactive Grid */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => livingRoomLight && onToggleLight(livingRoomLight.id)}
                      className={`text-left p-3 rounded-xl border transition-colors cursor-pointer min-h-[82px] ${
                        livingRoomLight?.isOn
                          ? 'bg-white border-[#0F52BA]/40'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Lightbulb
                          className={`w-4 h-4 ${
                            livingRoomLight?.isOn ? 'text-amber-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          {livingRoomLight?.isOn ? 'Aktif' : 'Mati'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">Smart Lighting</p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                        {livingRoomLight?.isOn ? `${livingRoomLight.brightness}%` : '0 W'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleCctv}
                      className={`text-left p-3 rounded-xl border transition-colors cursor-pointer min-h-[82px] ${
                        smartState.cctv.isArmed
                          ? 'bg-white border-[#0F52BA]/40'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <ShieldCheck
                          className={`w-4 h-4 ${
                            smartState.cctv.isArmed ? 'text-emerald-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          {smartState.cctv.isArmed ? 'Siaga' : 'Jeda'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">Smart Security</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {smartState.cctv.motionDetected ? 'Gerakan!' : 'Aman 24/7'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => mainPlug && onTogglePlug(mainPlug.id)}
                      className={`text-left p-3 rounded-xl border transition-colors cursor-pointer min-h-[82px] ${
                        mainPlug?.isOn
                          ? 'bg-white border-[#0F52BA]/40'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <PlugZap
                          className={`w-4 h-4 ${
                            mainPlug?.isOn ? 'text-[#0F52BA]' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          {mainPlug?.isOn ? 'Nyala' : 'Mati'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">Smart Plug</p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                        {mainPlug?.isOn ? `${mainPlug.wattage} W` : '0 W'}
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={onToggleAc}
                      className={`text-left p-3 rounded-xl border transition-colors cursor-pointer min-h-[82px] ${
                        smartState.ac.isOn
                          ? 'bg-white border-[#0F52BA]/40'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Snowflake
                          className={`w-4 h-4 ${
                            smartState.ac.isOn ? 'text-sky-600' : 'text-slate-400'
                          }`}
                        />
                        <span className="text-[11px] font-medium text-slate-500">
                          {smartState.ac.isOn ? smartState.ac.mode : 'Mati'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-900">Smart AC</p>
                      <p className="text-[11px] text-slate-500 font-mono tabular-nums mt-0.5">
                        {smartState.ac.isOn ? `${smartState.ac.temperature}°C` : 'Nonaktif'}
                      </p>
                    </button>
                  </div>

                  {/* Estimated Bill Bar inside Phone */}
                  <div className="rounded-xl bg-slate-900 text-white px-3.5 py-3 flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] text-slate-300">Estimasi Listrik/Bln</p>
                      <p className="text-sm font-mono font-semibold tabular-nums">
                        Rp {estimatedMonthlyBill.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <a
                      href="#dashboard"
                      className="px-3 py-2 rounded-lg bg-[#1D63DC] hover:bg-[#0F52BA] text-xs font-semibold text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      Mulai Sekarang
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Proof Strip Below Hero Split */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {proofMetrics.map((metric) => (
            <div key={metric.value}>
              <p className="font-display text-2xl font-bold text-slate-900 tabular-nums">
                {metric.value}
              </p>
              <p className="mt-1 text-sm text-slate-600 leading-snug">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
