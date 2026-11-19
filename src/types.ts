export type ProductCategory =
  | 'Semua'
  | 'Smart Lighting'
  | 'Smart Security'
  | 'Smart Plug'
  | 'Smart AC'
  | 'Paket Bundling';

export type ArtworkKind =
  | 'bulb'
  | 'cctv'
  | 'plug'
  | 'ac-ir'
  | 'switch'
  | 'doorlock'
  | 'sensor'
  | 'bundle';

export interface ProductVariant {
  id: string;
  label: string;
  price: number;
  originalPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<ProductCategory, 'Semua'>;
  shortSpec: string;
  description: string;
  price: number;
  originalPrice?: number;
  tag?: string;
  artwork: ArtworkKind;
  powerSavingNote: string;
  specs: {
    label: string;
    value: string;
  }[];
  variants: ProductVariant[];
  compatibleDashboardSection: 'lighting' | 'security' | 'plug' | 'ac';
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  quantity: number;
  artwork: ArtworkKind;
  category: string;
}

export type RoomFilter = 'Semua Ruangan' | 'Ruang Tamu' | 'Kamar Utama' | 'Teras Depan';

export type SceneMode = 'normal' | 'away' | 'sleep' | 'eco';

export type LightTemperature = 'warm' | 'neutral' | 'cool';

export interface SmartLightState {
  id: string;
  name: string;
  room: Exclude<RoomFilter, 'Semua Ruangan'>;
  isOn: boolean;
  brightness: number; // 10 - 100
  temperature: LightTemperature;
  maxWatt: number;
}

export interface SmartPlugState {
  id: string;
  name: string;
  appliance: string;
  room: Exclude<RoomFilter, 'Semua Ruangan'>;
  isOn: boolean;
  autoSchedule: boolean;
  wattage: number;
}

export interface SmartAcState {
  id: string;
  name: string;
  room: Exclude<RoomFilter, 'Semua Ruangan'>;
  isOn: boolean;
  temperature: number; // 16 - 30
  mode: 'Cool' | 'Eco' | 'Dry' | 'Fan';
  fanSpeed: 'Auto' | 'Pelan' | 'Cepat';
}

export interface SmartCctvState {
  id: string;
  name: string;
  room: Exclude<RoomFilter, 'Semua Ruangan'>;
  isArmed: boolean;
  nightVision: boolean;
  panAngle: -45 | 0 | 45;
  motionDetected: boolean;
  lastEvent: string;
}

export interface SmartHomeState {
  activeScene: SceneMode;
  lights: SmartLightState[];
  plugs: SmartPlugState[];
  ac: SmartAcState;
  cctv: SmartCctvState;
}

export type OrderStatus =
  | 'awaiting_payment'
  | 'packed'
  | 'shipped'
  | 'in_transit'
  | 'delivered';

export interface OrderTimelineEvent {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
}

export interface OrderReceipt {
  orderNumber: string;
  customerName: string;
  whatsapp: string;
  address: string;
  courier: string;
  trackingNumber: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  status: OrderStatus;
  estimatedArrival: string;
  receivedConfirmedByUser: boolean;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}
