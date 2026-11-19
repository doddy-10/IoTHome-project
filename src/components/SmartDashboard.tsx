import React from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Camera,
  Eye,
  Home,
  Leaf,
  Lightbulb,
  LogOut,
  Minus,
  Moon,
  PlugZap,
  Plus,
  Power,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Snowflake,
  Sun,
} from 'lucide-react';
import {
  LightTemperature,
  RoomFilter,
  SceneMode,
  SmartAcState,
  SmartHomeState,
} from '../types';
import { formatIDR } from '../data/products';

interface SmartDashboardProps {
  state: SmartHomeState;
  selectedRoom: RoomFilter;
  onSelectRoom: (room: RoomFilter) => void;
  activeWatts: number;
  estimatedMonthlyBill: number;
  monthlySavings: number;
  onApplyScene: (scene: SceneMode) => void;
  onToggleLight: (id: string) => void;
  onChangeLightBrightness: (id: string, brightness: number) => void;
  onChangeLightTemp: (id: string, temp: LightTemperature) => void;
  onTurnOffAllLights: () => void;
  onTogglePlug: (id: string) => void;
  onTogglePlugSchedule: (id: string) => void;
  onToggleAc: () => void;
  onStepAcTemp: (delta: number) => void;
  onChangeAcMode: (mode: SmartAcState['mode']) => void;
  onChangeAcFan: (fan: SmartAcState['fanSpeed']) => void;
  onToggleCctvArmed: () => void;
  onToggleCctvNightVision: () => void;
  onPanCctv: (angle: -45 | 0 | 45) => void;
  onSimulateMotion: () => void;
  onResetDashboard: () => void;
}

export const SmartDashboard: React.FC<SmartDashboardProps> = ({
  state,
  selectedRoom,
  onSelectRoom,
  activeWatts,
  estimatedMonthlyBill,
  monthlySavings,
  onApplyScene,
  onToggleLight,
  onChangeLightBrightness,
  onChangeLightTemp,
  onTurnOffAllLights,
  onTogglePlug,
  onTogglePlugSchedule,
  onToggleAc,
  onStepAcTemp,
  onChangeAcMode,
  onChangeAcFan,
  onToggleCctvArmed,
  onToggleCctvNightVision,
  onPanCctv,
  onSimulateMotion,
  onResetDashboard,
}) => {
  const rooms: RoomFilter[] = ['Semua Ruangan', 'Ruang Tamu', 'Kamar Utama', 'Teras Depan'];

  const scenes: { id: SceneMode; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      id: 'normal',
      label: 'Di Rumah',
      desc: 'Pencahayaan nyaman',
      icon: <Home className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'away',
      label: 'Mode Pergi',
      desc: 'Matikan lampu & CCTV siaga',
      icon: <LogOut className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'sleep',
      label: 'Mode Tidur',
      desc: 'Redupkan lampu · AC 25°C',
      icon: <BedDouble className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'eco',
      label: 'Hemat Listrik',
      desc: 'Optimasi konsumsi daya',
      icon: <Leaf className="w-4 h-4 shrink-0" />,
    },
  ];

  const filteredLights = state.lights.filter(
    (l) => selectedRoom === 'Semua Ruangan' || l.room === selectedRoom
  );

  const filteredPlugs = state.plugs.filter(
    (p) => selectedRoom === 'Semua Ruangan' || p.room === selectedRoom
  );

  const showAc = selectedRoom === 'Semua Ruangan' || state.ac.room === selectedRoom;
  const showCctv = selectedRoom === 'Semua Ruangan' || state.cctv.room === selectedRoom;

  const anyLightOn = state.lights.some((l) => l.isOn);

  const acWatt = state.ac.isOn
    ? state.ac.mode === 'Eco'
      ? 420
      : state.ac.mode === 'Fan'
      ? 65
      : Math.max(450, 820 - (state.ac.temperature - 16) * 28)
    : 0;

  return (
    <section id="dashboard" className="py-14 lg:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-xs sm:text-sm font-medium text-[#0F52BA] mb-2">
              Simulasi Kontrol Langsung · Sinkron dengan Mobile Preview
            </p>
            <h2
              className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight"
              style={{ textWrap: 'balance' }}
            >
              Dashboard Kontrol Rumah Pintar IoTHome
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Coba matikan lampu, atur suhu AC, pantau Smart CCTV, atau aktifkan Mode Pergi untuk
              melihat penurunan daya dan estimasi tagihan listrik Anda secara langsung.
            </p>
          </div>

          <button
            type="button"
            onClick={onResetDashboard}
            className="self-start lg:self-auto inline-flex items-center gap-2 min-h-[40px] px-3.5 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Simulasi</span>
          </button>
        </div>

        {/* Energy & Bill Telemetry Bar (Solves Scene 1 & 2) */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
            <div>
              <p className="text-xs font-medium text-slate-500">Beban Listrik Saat Ini</p>
              <p className="mt-1 font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                {activeWatts.toFixed(0)} <span className="text-sm font-normal text-slate-500">W</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {activeWatts === 0
                  ? 'Semua perangkat non-esensial padam'
                  : 'Pemantauan daya aktif real-time'}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Estimasi Tagihan / Bulan</p>
              <p className="mt-1 font-mono text-2xl sm:text-3xl font-semibold text-slate-900 tabular-nums">
                {formatIDR(estimatedMonthlyBill)}
              </p>
              <p className="mt-1 text-xs text-slate-500">Tarif R-1/TR Rp 1.445/kWh</p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Penghematan Bulanan</p>
              <p className="mt-1 font-mono text-2xl sm:text-3xl font-semibold text-emerald-700 tabular-nums">
                {formatIDR(monthlySavings)}
              </p>
              <p className="mt-1 text-xs text-emerald-700">
                Dibanding perangkat menyala tanpa kontrol
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Status Keamanan Rumah</p>
              <div className="mt-1 flex items-center gap-2">
                {state.cctv.motionDetected ? (
                  <>
                    <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                    <span className="font-display text-lg sm:text-xl font-bold text-red-600">
                      Gerakan Terdeteksi
                    </span>
                  </>
                ) : state.cctv.isArmed ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span className="font-display text-lg sm:text-xl font-bold text-slate-900">
                      Terkendali &amp; Aman
                    </span>
                  </>
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-amber-600 shrink-0" />
                    <span className="font-display text-lg sm:text-xl font-bold text-amber-700">
                      Kamera Dijeda
                    </span>
                  </>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500 truncate">{state.cctv.lastEvent}</p>
            </div>
          </div>
        </div>

        {/* Skenario Otomatis & Filter Ruangan */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Quick Scene Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {scenes.map((scene) => {
              const isSelected = state.activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => onApplyScene(scene.id)}
                  className={`inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-[#0F52BA] border-[#0F52BA] text-white'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {scene.icon}
                  <span>{scene.label}</span>
                </button>
              );
            })}
          </div>

          {/* Room Segmented Control (scrollable cleanly on small phones) */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto max-w-full">
            {rooms.map((room) => {
              const active = selectedRoom === room;
              return (
                <button
                  key={room}
                  type="button"
                  onClick={() => onSelectRoom(room)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {room}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Device Control Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 1. Smart Lighting Panel */}
          {filteredLights.length > 0 && (
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Lightbulb className="w-5 h-5 text-[#0F52BA]" />
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Smart Lighting
                    </h3>
                    <p className="text-xs text-slate-500">
                      Kontrol kecerahan &amp; matikan lampu jarak jauh
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onTurnOffAllLights}
                  disabled={!anyLightOn}
                  className="min-h-[38px] px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Matikan Semua
                </button>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {filteredLights.map((light) => {
                  const activeWatt = light.isOn
                    ? (light.maxWatt * (light.brightness / 100)).toFixed(1)
                    : '0.0';

                  return (
                    <div key={light.id} className="py-4 first:pt-2 last:pb-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {light.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                            {light.room} · {light.isOn ? `${light.brightness}%` : 'Lampu Mati'} ·{' '}
                            {activeWatt} W
                          </p>
                        </div>

                        <button
                          type="button"
                          role="switch"
                          aria-checked={light.isOn}
                          aria-label={`Ubah status ${light.name}`}
                          onClick={() => onToggleLight(light.id)}
                          className={`min-h-[44px] min-w-[84px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center justify-center gap-1.5 ${
                            light.isOn
                              ? 'bg-[#0F52BA] text-white hover:bg-[#0A3D91]'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>{light.isOn ? 'Nyala' : 'Mati'}</span>
                        </button>
                      </div>

                      {/* Brightness & Color Temp Controls */}
                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="flex-1 flex items-center gap-3">
                          <Sun className="w-4 h-4 text-slate-400 shrink-0" />
                          <input
                            type="range"
                            min={10}
                            max={100}
                            step={5}
                            value={light.brightness}
                            disabled={!light.isOn}
                            aria-label={`Kecerahan ${light.name}`}
                            onChange={(e) =>
                              onChangeLightBrightness(light.id, Number(e.target.value))
                            }
                            className="iot-slider w-full disabled:opacity-40"
                          />
                        </div>

                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-start sm:self-auto">
                          {(
                            [
                              { id: 'warm', label: 'Warm' },
                              { id: 'neutral', label: 'Netral' },
                              { id: 'cool', label: 'Cool' },
                            ] as const
                          ).map((preset) => (
                            <button
                              key={preset.id}
                              type="button"
                              disabled={!light.isOn}
                              onClick={() => onChangeLightTemp(light.id, preset.id)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-40 ${
                                light.temperature === preset.id
                                  ? 'bg-white text-slate-900 shadow-xs'
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Smart Security CCTV Interactive Feed (Scene 5) */}
          {showCctv && (
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <Camera className="w-5 h-5 text-[#0F52BA]" />
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      {state.cctv.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {state.cctv.room} · Sudut {state.cctv.panAngle > 0 ? `+${state.cctv.panAngle}°` : `${state.cctv.panAngle}°`} ·{' '}
                      {state.cctv.nightVision ? 'Mode Malam IR' : 'Mode Siang'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onToggleCctvArmed}
                  className={`min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    state.cctv.isArmed
                      ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {state.cctv.isArmed ? 'Aktif Siaga' : 'Kamera Jeda'}
                </button>
              </div>

              {/* Interactive Camera Viewport */}
              <div className="mt-4 relative rounded-xl overflow-hidden bg-slate-950 aspect-video border border-slate-800">
                {state.cctv.isArmed ? (
                  <svg
                    viewBox="0 0 400 225"
                    className="w-full h-full transition-transform duration-300 ease-out"
                    style={{
                      transform: `translateX(${state.cctv.panAngle * -0.45}px) scale(1.12)`,
                      filter: state.cctv.nightVision ? 'grayscale(85%) contrast(1.1)' : 'none',
                    }}
                    aria-label="Tampilan simulasi kamera CCTV Teras Depan"
                  >
                    {/* Sky / Backdrop */}
                    <rect
                      x="-40"
                      y="0"
                      width="480"
                      height="225"
                      fill={state.cctv.nightVision ? '#090F1A' : '#1E293B'}
                    />
                    {/* House Wall & Terrace */}
                    <rect x="20" y="55" width="360" height="125" fill="#1E293B" />
                    <rect x="55" y="78" width="90" height="102" fill="#0F172A" stroke="#334155" strokeWidth="2" />
                    {/* Door */}
                    <rect x="180" y="72" width="60" height="108" fill="#334155" />
                    <circle cx="230" cy="128" r="2.5" fill="#94A3B8" />
                    {/* Porch Light */}
                    <circle
                      cx="265"
                      cy="82"
                      r="6"
                      fill={state.lights[2]?.isOn ? '#FDE68A' : '#475569'}
                    />
                    {/* Ground / Driveway */}
                    <polygon points="-40,180 440,180 440,225 -40,225" fill="#0F172A" />
                    <line x1="-40" y1="180" x2="440" y2="180" stroke="#475569" strokeWidth="1.5" />
                    {/* Fence */}
                    <rect x="285" y="130" width="95" height="50" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />

                    {/* Simulated Intruder / Motion Figure when Motion Triggered */}
                    {state.cctv.motionDetected && (
                      <g>
                        <rect
                          x="280"
                          y="104"
                          width="48"
                          height="84"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                        />
                        <circle cx="304" cy="122" r="9" fill="#E2E8F0" />
                        <path
                          d="M289 178L294 136H314L319 178H289Z"
                          fill="#CBD5E1"
                        />
                        <rect x="275" y="88" width="58" height="14" rx="3" fill="#DC2626" />
                        <text
                          x="304"
                          y="98"
                          textAnchor="middle"
                          fill="#FFFFFF"
                          fontSize="8"
                          fontWeight="700"
                        >
                          GERAKAN
                        </text>
                      </g>
                    )}

                    {/* Subtle Camera Crosshair Overlay */}
                    <path d="M16 16H32M16 16V32" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
                    <path d="M384 16H368M384 16V32" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
                    <path d="M16 209H32M16 209V193" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
                    <path d="M384 209H368M384 209V193" stroke="#FFFFFF" strokeOpacity="0.4" strokeWidth="1.5" />
                  </svg>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <Camera className="w-8 h-8 mb-2 text-slate-500" />
                    <p className="text-sm font-medium text-slate-300">Kamera dalam Mode Jeda</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Klik &ldquo;Kamera Jeda&rdquo; di atas untuk mengaktifkan pantauan 2K.
                    </p>
                  </div>
                )}

                {/* HUD Info inside Viewport */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-white pointer-events-none">
                  <span className="bg-black/65 px-2 py-1 rounded">
                    {state.cctv.isArmed ? 'TERAS DEPAN · 2K LIVE' : 'OFFLINE'}
                  </span>
                  <span className="bg-black/65 px-2 py-1 rounded tabular-nums">
                    {state.cctv.nightVision ? 'IR ON' : 'COLOR'}
                  </span>
                </div>

                {state.cctv.motionDetected && state.cctv.isArmed && (
                  <div className="absolute bottom-3 left-3 right-3 bg-red-600/95 text-white px-3 py-2 rounded-lg flex items-center justify-between gap-2 text-xs font-medium">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      Peringatan: Gerakan terdeteksi di Teras Depan!
                    </span>
                    <button
                      type="button"
                      onClick={onSimulateMotion}
                      className="underline font-semibold cursor-pointer shrink-0"
                    >
                      Tandai Aman
                    </button>
                  </div>
                )}
              </div>

              {/* Camera Controls */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={!state.cctv.isArmed}
                    onClick={() => onPanCctv(-45)}
                    aria-label="Putar kamera ke kiri"
                    className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-40 ${
                      state.cctv.panAngle === -45
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kiri</span>
                  </button>
                  <button
                    type="button"
                    disabled={!state.cctv.isArmed}
                    onClick={() => onPanCctv(0)}
                    className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer disabled:opacity-40 ${
                      state.cctv.panAngle === 0
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Tengah
                  </button>
                  <button
                    type="button"
                    disabled={!state.cctv.isArmed}
                    onClick={() => onPanCctv(45)}
                    aria-label="Putar kamera ke kanan"
                    className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-1 cursor-pointer disabled:opacity-40 ${
                      state.cctv.panAngle === 45
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>Kanan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!state.cctv.isArmed}
                    onClick={onToggleCctvNightVision}
                    className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40 ${
                      state.cctv.nightVision
                        ? 'bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>Night Vision</span>
                  </button>

                  <button
                    type="button"
                    disabled={!state.cctv.isArmed}
                    onClick={onSimulateMotion}
                    className="min-h-[40px] px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#0F52BA]" />
                    <span>{state.cctv.motionDetected ? 'Reset Alert' : 'Uji Deteksi'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Smart Plug Energy Monitor */}
          {filteredPlugs.length > 0 && (
            <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <PlugZap className="w-5 h-5 text-[#0F52BA]" />
                  <div>
                    <h3 className="font-display text-base font-bold text-slate-900">
                      Smart Plug &amp; Pemantau Daya
                    </h3>
                    <p className="text-xs text-slate-500">
                      Putus arus perangkat standby untuk mencegah pemborosan listrik
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100 mt-2">
                {filteredPlugs.map((plug) => (
                  <div
                    key={plug.id}
                    className="py-4 first:pt-2 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{plug.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono tabular-nums">
                        {plug.room} · {plug.appliance} ·{' '}
                        <span className={plug.isOn ? 'text-slate-900 font-medium' : 'text-slate-400'}>
                          {plug.isOn ? `${plug.wattage} W` : '0 W (Terputus)'}
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onTogglePlugSchedule(plug.id)}
                        className={`min-h-[40px] px-3 py-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                          plug.autoSchedule
                            ? 'bg-slate-100 border-slate-300 text-slate-900'
                            : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'
                        }`}
                      >
                        {plug.autoSchedule ? 'Auto-Off Aktif' : 'Jadwal Manual'}
                      </button>

                      <button
                        type="button"
                        role="switch"
                        aria-checked={plug.isOn}
                        aria-label={`Ubah status ${plug.name}`}
                        onClick={() => onTogglePlug(plug.id)}
                        className={`min-h-[44px] min-w-[84px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                          plug.isOn
                            ? 'bg-[#0F52BA] text-white hover:bg-[#0A3D91]'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{plug.isOn ? 'Nyala' : 'Mati'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Smart AC Controller */}
          {showAc && (
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <Snowflake className="w-5 h-5 text-[#0F52BA]" />
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">
                        {state.ac.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-mono tabular-nums">
                        {state.ac.room} · {state.ac.isOn ? `${acWatt} W` : '0 W (Nonaktif)'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={state.ac.isOn}
                    aria-label="Nyalakan atau matikan Smart AC"
                    onClick={onToggleAc}
                    className={`min-h-[44px] min-w-[84px] px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 ${
                      state.ac.isOn
                        ? 'bg-[#0F52BA] text-white hover:bg-[#0A3D91]'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{state.ac.isOn ? 'Nyala' : 'Mati'}</span>
                  </button>
                </div>

                {/* Temperature Stepper */}
                <div className="my-6 flex items-center justify-between gap-4 bg-[#F8FAFC] border border-slate-200 rounded-xl p-4">
                  <button
                    type="button"
                    disabled={!state.ac.isOn || state.ac.temperature <= 16}
                    onClick={() => onStepAcTemp(-1)}
                    aria-label="Turunkan suhu AC"
                    className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center text-slate-900 cursor-pointer"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <p className="text-xs text-slate-500">Target Suhu</p>
                    <p className="font-mono text-4xl font-bold text-slate-900 tabular-nums mt-0.5">
                      {state.ac.isOn ? `${state.ac.temperature}°C` : '--°C'}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={!state.ac.isOn || state.ac.temperature >= 30}
                    onClick={() => onStepAcTemp(1)}
                    aria-label="Naikkan suhu AC"
                    className="w-12 h-12 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 flex items-center justify-center text-slate-900 cursor-pointer"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mode & Fan Speed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">Mode Operasi</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {(['Cool', 'Eco', 'Dry', 'Fan'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        disabled={!state.ac.isOn}
                        onClick={() => onChangeAcMode(mode)}
                        className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 ${
                          state.ac.mode === mode
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500">Kecepatan Kipas</span>
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {(['Auto', 'Pelan', 'Cepat'] as const).map((fan) => (
                      <button
                        key={fan}
                        type="button"
                        disabled={!state.ac.isOn}
                        onClick={() => onChangeAcFan(fan)}
                        className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer disabled:opacity-40 ${
                          state.ac.fanSpeed === fan
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {fan}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
