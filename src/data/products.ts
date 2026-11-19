import { Product, SmartHomeState } from '../types';

export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const PRODUCTS: Product[] = [
  {
    id: 'iot-bulb-pro',
    name: 'IoTHome Smart Bulb E27 Pro',
    category: 'Smart Lighting',
    shortSpec: 'Wi-Fi 2.4GHz · 9W RGBWW · 850 Lumens',
    description:
      'Matikan atau redupkan lampu rumah dari mana saja lewat smartphone. Dilengkapi penjadwalan otomatis agar tidak ada lagi tagihan listrik membengkak karena lupa mematikan lampu.',
    price: 129000,
    originalPrice: 165000,
    tag: 'Terlaris',
    artwork: 'bulb',
    powerSavingNote: 'Hemat hingga 82% dibanding lampu pijar konvensional',
    compatibleDashboardSection: 'lighting',
    specs: [
      { label: 'Konektivitas', value: 'Wi-Fi 2.4GHz + Bluetooth Mesh' },
      { label: 'Daya Maksimal', value: '9 Watt (Setara 65W)' },
      { label: 'Suhu Warna', value: '2700K Warm – 6500K Cool + 16 Juta RGB' },
      { label: 'Fitting & Umur', value: 'E27 Standar · 25.000 Jam' },
    ],
    variants: [
      { id: 'bulb-1', label: '1 Unit', price: 129000, originalPrice: 165000 },
      { id: 'bulb-2', label: 'Paket 2 Unit', price: 239000, originalPrice: 330000 },
      { id: 'bulb-4', label: 'Paket 4 Unit', price: 449000, originalPrice: 660000 },
    ],
  },
  {
    id: 'iot-cctv-360',
    name: 'IoTHome Smart CCTV 360° AI',
    category: 'Smart Security',
    shortSpec: '2K QHD · Pan-Tilt 355° · Night Vision IR',
    description:
      'Pantau rumah secara real-time siang maupun malam dengan kualitas tajam 2K. Mendeteksi gerakan mencurigakan dan langsung mengirim notifikasi instan ke aplikasi IoTHome Anda.',
    price: 429000,
    originalPrice: 520000,
    tag: 'Keamanan Utama',
    artwork: 'cctv',
    powerSavingNote: 'Konsumsi daya siaga rendah 4.5W · Audio 2 arah',
    compatibleDashboardSection: 'security',
    specs: [
      { label: 'Resolusi Video', value: '2K 2304×1296p Full Color Night Vision' },
      { label: 'Sudut Gerak', value: 'Horizontal 355° · Vertikal 110°' },
      { label: 'Penyimpanan', value: 'MicroSD hingga 256GB & Cloud Terenkripsi' },
      { label: 'Deteksi Cerdas', value: 'AI Human Motion Tracking + Sirene' },
    ],
    variants: [
      { id: 'cctv-only', label: 'Kamera Saja', price: 429000, originalPrice: 520000 },
      { id: 'cctv-64', label: '+ MicroSD 64GB', price: 519000, originalPrice: 635000 },
      { id: 'cctv-dual', label: 'Paket 2 Kamera', price: 799000, originalPrice: 1040000 },
    ],
  },
  {
    id: 'iot-smart-plug',
    name: 'IoTHome Smart Plug Energy Monitor',
    category: 'Smart Plug',
    shortSpec: '16A 3500W · Meteran Daya Real-Time · SNI',
    description:
      'Ubah perangkat elektronik biasa menjadi pintar sekaligus lacak pemakaian listrik (Watt & kWh) secara langsung. Putus aliran daya dispenser, TV, atau charger dari jarak jauh.',
    price: 159000,
    originalPrice: 199000,
    tag: 'Pantau Listrik',
    artwork: 'plug',
    powerSavingNote: 'Memutus beban standby (vampire power) hingga 18%/bulan',
    compatibleDashboardSection: 'plug',
    specs: [
      { label: 'Beban Maksimal', value: '16A / 3500W (Colokan Kaki 2 EU/ID)' },
      { label: 'Sensor Listrik', value: 'Real-time Watt, Voltase, Ampere & kWh' },
      { label: 'Material Aman', value: 'Polikarbonat Tahan Api 750°C + Child Lock' },
      { label: 'Fitur Timer', value: 'Jadwal Harian, Countdown & Auto-Off' },
    ],
    variants: [
      { id: 'plug-1', label: '1 Unit', price: 159000, originalPrice: 199000 },
      { id: 'plug-3', label: 'Paket 3 Unit', price: 439000, originalPrice: 597000 },
    ],
  },
  {
    id: 'iot-smart-ac',
    name: 'IoTHome Smart IR AC Controller',
    category: 'Smart AC',
    shortSpec: 'Universal IR 360° · Sensor Suhu & Kelembapan',
    description:
      'Kendalikan semua merek AC dan TV tanpa perlu mengganti unit lama Anda. Atur suhu kamar sebelum tiba di rumah atau aktifkan mode Eco otomatis saat ruangan kosong.',
    price: 219000,
    originalPrice: 279000,
    tag: 'Kompatibel Semua AC',
    artwork: 'ac-ir',
    powerSavingNote: 'Mode Eco otomatis menjaga suhu stabil hemat daya',
    compatibleDashboardSection: 'ac',
    specs: [
      { label: 'Database Perangkat', value: '8.000+ Merek AC & TV (Daikin, LG, Sharp, dll)' },
      { label: 'Sensor Internal', value: 'Suhu (±0.3°C) & Kelembapan Ruangan' },
      { label: 'Jangkauan IR', value: '360° hingga Radius 10 Meter' },
      { label: 'Catu Daya', value: 'USB-C 5V/1A (Kabel Termasuk)' },
    ],
    variants: [
      { id: 'ac-1', label: '1 Unit Ruangan', price: 219000, originalPrice: 279000 },
      { id: 'ac-2', label: 'Paket 2 Ruangan', price: 409000, originalPrice: 558000 },
    ],
  },
  {
    id: 'iot-wall-switch',
    name: 'IoTHome Smart Wall Switch 2-Gang',
    category: 'Smart Lighting',
    shortSpec: 'Tempered Glass · Tanpa Kabel Netral Opsional',
    description:
      'Ganti saklar dinding rumah Anda dengan panel kaca sentuh elegan yang bisa dikontrol lewat sentuhan fisik maupun aplikasi dashboard IoTHome.',
    price: 249000,
    originalPrice: 299000,
    artwork: 'switch',
    powerSavingNote: 'Indikator status akurat di aplikasi anti-lupa',
    compatibleDashboardSection: 'lighting',
    specs: [
      { label: 'Jumlah Kanal', value: '2 Gang (2 Jalur Lampu Terpisah)' },
      { label: 'Material Panel', value: 'Crystal Tempered Glass Anti-Gores' },
      { label: 'Instalasi', value: 'Support dengan / tanpa Kabel Netral' },
      { label: 'Kontrol Suara', value: 'Google Assistant, Alexa & Siri Shortcut' },
    ],
    variants: [
      { id: 'sw-2g', label: '2 Gang (2 Tombol)', price: 249000, originalPrice: 299000 },
      { id: 'sw-3g', label: '3 Gang (3 Tombol)', price: 289000, originalPrice: 349000 },
    ],
  },
  {
    id: 'iot-door-lock',
    name: 'IoTHome Smart Door Lock Wi-Fi',
    category: 'Smart Security',
    shortSpec: 'Sidik Jari · PIN Sementara · Log Akses Aplikasi',
    description:
      'Buka pintu rumah dengan sidik jari dalam 0.4 detik, kartu NFC, atau PIN tamu sekali pakai dari aplikasi. Dapatkan catatan waktu siapa saja yang keluar masuk rumah.',
    price: 1390000,
    originalPrice: 1690000,
    artwork: 'doorlock',
    powerSavingNote: 'Baterai AA bertahan hingga 10 bulan + USB-C darurat',
    compatibleDashboardSection: 'security',
    specs: [
      { label: 'Metode Akses', value: 'Fingerprint, PIN, Kartu NFC, Kunci Fisik, App' },
      { label: 'Kapasitas', value: '100 Sidik Jari · 50 PIN · 50 Kartu' },
      { label: 'Ketebalan Pintu', value: '35mm – 70mm (Kayu / Baja / Aluminium)' },
      { label: 'Keamanan', value: 'Auto-Lock + Alarm Anti-Congkel' },
    ],
    variants: [
      { id: 'dl-std', label: 'Pintu Kayu Standar', price: 1390000, originalPrice: 1690000 },
      { id: 'dl-pro', label: '+ Pemasangan Jabodetabek', price: 1640000, originalPrice: 1990000 },
    ],
  },
  {
    id: 'iot-starter-bundle',
    name: 'Paket Hemat Smart Home 4-in-1',
    category: 'Paket Bundling',
    shortSpec: '2 Smart Bulb + 1 CCTV 360° + 1 Smart Plug + 1 IR AC',
    description:
      'Paket lengkap sesuai ekosistem utama IoTHome: pencahayaan pintar, keamanan CCTV real-time, pemantau daya listrik, dan kontrol AC dalam satu paket hemat siap pasang.',
    price: 949000,
    originalPrice: 1325000,
    tag: 'Hemat Rp 376.000',
    artwork: 'bundle',
    powerSavingNote: 'Solusi lengkap tekan tagihan listrik hingga 34%',
    compatibleDashboardSection: 'lighting',
    specs: [
      { label: 'Isi Paket', value: '2× Smart Bulb, 1× CCTV 2K, 1× Plug 16A, 1× IR AC' },
      { label: 'Instalasi', value: 'Plug & Play < 15 Menit via Wi-Fi Rumah' },
      { label: 'Kompatibilitas', value: 'Aplikasi IoTHome (Android & iOS) Gratis' },
      { label: 'Garansi Resmi', value: '2 Tahun Tukar Baru' },
    ],
    variants: [
      { id: 'bnd-4in1', label: 'Starter Kit 4-in-1', price: 949000, originalPrice: 1325000 },
      { id: 'bnd-family', label: 'Family Kit (8 Perangkat)', price: 1690000, originalPrice: 2340000 },
    ],
  },
];

export const INITIAL_SMART_HOME_STATE: SmartHomeState = {
  activeScene: 'normal',
  lights: [
    {
      id: 'light-living',
      name: 'Lampu Ruang Tamu',
      room: 'Ruang Tamu',
      isOn: true,
      brightness: 80,
      temperature: 'warm',
      maxWatt: 9,
    },
    {
      id: 'light-bedroom',
      name: 'Lampu Kamar Utama',
      room: 'Kamar Utama',
      isOn: true,
      brightness: 65,
      temperature: 'neutral',
      maxWatt: 9,
    },
    {
      id: 'light-porch',
      name: 'Lampu Teras Depan',
      room: 'Teras Depan',
      isOn: false,
      brightness: 100,
      temperature: 'cool',
      maxWatt: 12,
    },
  ],
  plugs: [
    {
      id: 'plug-dispenser',
      name: 'Smart Plug Dispenser & Kopi',
      appliance: 'Dispenser Air Panas',
      room: 'Ruang Tamu',
      isOn: true,
      autoSchedule: true,
      wattage: 340,
    },
    {
      id: 'plug-entertainment',
      name: 'Smart Plug TV & Konsol',
      appliance: 'Smart TV 55" + Audio',
      room: 'Ruang Tamu',
      isOn: false,
      autoSchedule: true,
      wattage: 115,
    },
    {
      id: 'plug-desk',
      name: 'Smart Plug Meja Kerja',
      appliance: 'Monitor & Charger',
      room: 'Kamar Utama',
      isOn: true,
      autoSchedule: false,
      wattage: 65,
    },
  ],
  ac: {
    id: 'ac-master',
    name: 'AC Kamar Utama',
    room: 'Kamar Utama',
    isOn: true,
    temperature: 23,
    mode: 'Cool',
    fanSpeed: 'Auto',
  },
  cctv: {
    id: 'cctv-front',
    name: 'Smart CCTV 360° Teras',
    room: 'Teras Depan',
    isArmed: true,
    nightVision: true,
    panAngle: 0,
    motionDetected: false,
    lastEvent: 'Area depan terpantau aman · Gerakan terakhir 18:42 WIB',
  },
};

export const STORYBOARD_STEPS = [
  {
    step: '01',
    sceneRef: 'Scene 1 – 2',
    title: 'Masalah Tagihan Listrik & Lupa Matikan Lampu',
    problem: '“Aduh... tagihan listriknya kok bisa sebesar ini? Pasti karena lupa matikan lampu lagi...”',
    solution:
      'Banyak rumah tangga kehilangan hingga 30% biaya listrik bulanan akibat lampu yang menyala seharian dan perangkat standby saat penghuni bekerja.',
  },
  {
    step: '02',
    sceneRef: 'Scene 3 – 4',
    title: 'Kontrol Penuh dari Smartphone di Mana Saja',
    problem: '“Ah, ada IoTHome! Sekarang lampu bisa dimatikan dari mana saja.”',
    solution:
      'Cukup satu sentuhan di aplikasi IoTHome, status seluruh lampu langsung berubah menjadi Mati dan konsumsi daya berhenti seketika.',
  },
  {
    step: '03',
    sceneRef: 'Scene 5',
    title: 'Pantau Keamanan Rumah Secara Real-Time',
    problem: '“Rumah jadi lebih aman, terpantau langsung dari layar ponsel.”',
    solution:
      'Smart CCTV 360° dengan Night Vision dan deteksi gerakan AI memberi peringatan instan saat ada aktivitas mencurigakan di halaman.',
  },
  {
    step: '04',
    sceneRef: 'Scene 6 – 8',
    title: 'Semua Terkendali dalam Satu Aplikasi',
    problem: '“Rumah lebih praktis, semua terkendali. Wujudkan Smart Home impianmu.”',
    solution:
      'Smart Lighting, Smart Security, Smart Plug, dan Smart AC bekerja serempak dalam skenario otomatis untuk kenyamanan keluarga modern.',
  },
];

export const TESTIMONIALS = [
  {
    name: 'Bagas Prakoso',
    role: 'Karyawan Swasta · Bekasi',
    outcome: 'Tagihan listrik turun Rp 265.000/bulan sejak pakai Smart Plug & Bulb IoTHome',
    quote:
      'Dulu sering panik pas sudah di kantor baru sadar lampu teras dan dispenser belum dimatikan. Sekarang cukup cek dashboard dari HP langsung beres.',
  },
  {
    name: 'Nadia Kusuma',
    role: 'Ibu Rumah Tangga · Bandung',
    outcome: 'Pantau 2 sudut halaman 24 jam dengan notifikasi gerak instan',
    quote:
      'Pemasangannya tidak perlu bobok tembok sama sekali. CCTV langsung terhubung ke Wi-Fi rumah dan gambarnya tetap jernih waktu malam.',
  },
  {
    name: 'Hendra Wijaya',
    role: 'Arsitek Interior · Surabaya',
    outcome: 'Menghemat waktu pengaturan 12 titik lampu & 3 unit AC lewat 1 aplikasi',
    quote:
      'Desain saklar dan kontroler AC IoTHome rapi, responsnya cepat, dan fitur Mode Pergi benar-benar membuat rumah terasa praktis setiap hari.',
  },
];
