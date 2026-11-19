import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import {
  CartItem,
  LightTemperature,
  OrderReceipt,
  OrderStatus,
  Product,
  ProductVariant,
  RoomFilter,
  SceneMode,
  SmartAcState,
  SmartHomeState,
} from './types';
import { INITIAL_SMART_HOME_STATE, PRODUCTS } from './data/products';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SmartDashboard } from './components/SmartDashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderTrackingSection } from './components/OrderTrackingSection';
import { StoryboardSection } from './components/StoryboardSection';
import { ProductModal } from './components/ProductModal';
import { CartDrawer, buildInitialTimeline } from './components/CartDrawer';
import { WhatsAppContext, WhatsAppModal } from './components/WhatsAppModal';
import { Footer } from './components/Footer';

const SMART_STATE_STORAGE_KEY = 'iothome_smart_state_v1';
const CART_STORAGE_KEY = 'iothome_cart_v1';
const ORDERS_STORAGE_KEY = 'iothome_orders_v1';

const DELIVERY_SEQUENCE: OrderStatus[] = [
  'awaiting_payment',
  'packed',
  'shipped',
  'in_transit',
  'delivered',
];

export default function App() {
  const [smartState, setSmartState] = useState<SmartHomeState>(() => {
    try {
      const saved = localStorage.getItem(SMART_STATE_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as SmartHomeState) : INITIAL_SMART_HOME_STATE;
    } catch {
      return INITIAL_SMART_HOME_STATE;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<OrderReceipt[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as OrderReceipt[]) : [];
    } catch {
      return [];
    }
  });

  const [activeOrderId, setActiveOrderId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      const parsed = saved ? (JSON.parse(saved) as OrderReceipt[]) : [];
      return parsed[0]?.orderNumber ?? null;
    } catch {
      return null;
    }
  });

  const [selectedRoom, setSelectedRoom] = useState<RoomFilter>('Semua Ruangan');
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [whatsAppContext, setWhatsAppContext] = useState<WhatsAppContext | null>(null);
  const [whatsAppOpen, setWhatsAppOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(SMART_STATE_STORAGE_KEY, JSON.stringify(smartState));
    } catch {
      // Ignore storage quota errors
    }
  }, [smartState]);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Ignore storage quota errors
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // Ignore storage quota errors
    }
  }, [orders]);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Calculate live power draw (Watts) and monthly PLN bill estimate
  const { activeWatts, estimatedMonthlyBill, monthlySavings } = useMemo(() => {
    const lightsWatt = smartState.lights.reduce(
      (sum, l) => sum + (l.isOn ? l.maxWatt * (l.brightness / 100) : 0),
      0
    );

    const plugsWatt = smartState.plugs.reduce(
      (sum, p) => sum + (p.isOn ? p.wattage : 0),
      0
    );

    const acWatt = smartState.ac.isOn
      ? smartState.ac.mode === 'Eco'
        ? 420
        : smartState.ac.mode === 'Fan'
        ? 65
        : Math.max(450, 820 - (smartState.ac.temperature - 16) * 28)
      : 0;

    const cctvWatt = smartState.cctv.isArmed ? 4.5 : 0;

    const totalWatts = lightsWatt + plugsWatt + acWatt + cctvWatt;

    const monthlyKwh = (totalWatts / 1000) * 8 * 30;
    const estimatedBill = Math.round(monthlyKwh * 1445);

    const unmanagedBaseline = 760000;
    const savings = Math.max(0, unmanagedBaseline - estimatedBill);

    return {
      activeWatts: totalWatts,
      estimatedMonthlyBill: estimatedBill,
      monthlySavings: savings,
    };
  }, [smartState]);

  // Device Handlers
  const handleToggleLight = (id: string) => {
    setSmartState((prev) => ({
      ...prev,
      lights: prev.lights.map((l) => (l.id === id ? { ...l, isOn: !l.isOn } : l)),
    }));
  };

  const handleChangeLightBrightness = (id: string, brightness: number) => {
    setSmartState((prev) => ({
      ...prev,
      lights: prev.lights.map((l) => (l.id === id ? { ...l, brightness } : l)),
    }));
  };

  const handleChangeLightTemp = (id: string, temperature: LightTemperature) => {
    setSmartState((prev) => ({
      ...prev,
      lights: prev.lights.map((l) => (l.id === id ? { ...l, temperature } : l)),
    }));
  };

  const handleTurnOffAllLights = () => {
    setSmartState((prev) => ({
      ...prev,
      lights: prev.lights.map((l) => ({ ...l, isOn: false })),
    }));
  };

  const handleTogglePlug = (id: string) => {
    setSmartState((prev) => ({
      ...prev,
      plugs: prev.plugs.map((p) => (p.id === id ? { ...p, isOn: !p.isOn } : p)),
    }));
  };

  const handleTogglePlugSchedule = (id: string) => {
    setSmartState((prev) => ({
      ...prev,
      plugs: prev.plugs.map((p) =>
        p.id === id ? { ...p, autoSchedule: !p.autoSchedule } : p
      ),
    }));
  };

  const handleToggleAc = () => {
    setSmartState((prev) => ({
      ...prev,
      ac: { ...prev.ac, isOn: !prev.ac.isOn },
    }));
  };

  const handleStepAcTemp = (delta: number) => {
    setSmartState((prev) => ({
      ...prev,
      ac: {
        ...prev.ac,
        temperature: Math.min(30, Math.max(16, prev.ac.temperature + delta)),
      },
    }));
  };

  const handleChangeAcMode = (mode: SmartAcState['mode']) => {
    setSmartState((prev) => ({
      ...prev,
      ac: { ...prev.ac, mode },
    }));
  };

  const handleChangeAcFan = (fanSpeed: SmartAcState['fanSpeed']) => {
    setSmartState((prev) => ({
      ...prev,
      ac: { ...prev.ac, fanSpeed },
    }));
  };

  const handleToggleCctvArmed = () => {
    setSmartState((prev) => ({
      ...prev,
      cctv: {
        ...prev.cctv,
        isArmed: !prev.cctv.isArmed,
        motionDetected: !prev.cctv.isArmed ? prev.cctv.motionDetected : false,
        lastEvent: !prev.cctv.isArmed
          ? 'Kamera aktif memantau Teras Depan'
          : 'Pemantauan dijeda oleh pengguna',
      },
    }));
  };

  const handleToggleCctvNightVision = () => {
    setSmartState((prev) => ({
      ...prev,
      cctv: { ...prev.cctv, nightVision: !prev.cctv.nightVision },
    }));
  };

  const handlePanCctv = (panAngle: -45 | 0 | 45) => {
    setSmartState((prev) => ({
      ...prev,
      cctv: { ...prev.cctv, panAngle },
    }));
  };

  const handleSimulateMotion = () => {
    setSmartState((prev) => {
      const nextMotion = !prev.cctv.motionDetected;
      return {
        ...prev,
        cctv: {
          ...prev.cctv,
          isArmed: true,
          motionDetected: nextMotion,
          lastEvent: nextMotion
            ? 'Peringatan Gerakan di Teras Depan · Baru saja'
            : 'Status dikonfirmasi aman · Baru saja',
        },
      };
    });
  };

  const handleApplyScene = (scene: SceneMode) => {
    setSmartState((prev) => {
      if (scene === 'away') {
        return {
          ...prev,
          activeScene: 'away',
          lights: prev.lights.map((l) => ({
            ...l,
            isOn: l.room === 'Teras Depan',
            brightness: l.room === 'Teras Depan' ? 60 : l.brightness,
          })),
          plugs: prev.plugs.map((p) => ({ ...p, isOn: false })),
          ac: { ...prev.ac, isOn: false },
          cctv: {
            ...prev.cctv,
            isArmed: true,
            nightVision: true,
            lastEvent: 'Mode Pergi aktif · CCTV siaga penuh',
          },
        };
      }
      if (scene === 'sleep') {
        return {
          ...prev,
          activeScene: 'sleep',
          lights: prev.lights.map((l) => ({
            ...l,
            isOn: l.room === 'Kamar Utama',
            brightness: l.room === 'Kamar Utama' ? 20 : l.brightness,
            temperature: 'warm',
          })),
          plugs: prev.plugs.map((p) => ({
            ...p,
            isOn: p.id === 'plug-desk',
          })),
          ac: { ...prev.ac, isOn: true, temperature: 25, mode: 'Eco' },
          cctv: {
            ...prev.cctv,
            isArmed: true,
            nightVision: true,
            lastEvent: 'Mode Tidur aktif · Pengawasan malam nyala',
          },
        };
      }
      if (scene === 'eco') {
        return {
          ...prev,
          activeScene: 'eco',
          lights: prev.lights.map((l) => ({
            ...l,
            brightness: Math.min(l.brightness, 50),
          })),
          plugs: prev.plugs.map((p) => ({
            ...p,
            isOn: p.id !== 'plug-dispenser',
            autoSchedule: true,
          })),
          ac: { ...prev.ac, isOn: true, temperature: 26, mode: 'Eco' },
        };
      }
      return {
        ...INITIAL_SMART_HOME_STATE,
        activeScene: 'normal',
      };
    });
  };

  const handleResetDashboard = () => {
    setSmartState(INITIAL_SMART_HOME_STATE);
    setSelectedRoom('Semua Ruangan');
  };

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1
  ) => {
    const chosenVariant = variant ?? product.variants[0];
    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          item.productId === product.id && item.variantId === chosenVariant.id
      );
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id && item.variantId === chosenVariant.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          variantId: chosenVariant.id,
          name: product.name,
          variantLabel: chosenVariant.label,
          price: chosenVariant.price,
          quantity,
          artwork: product.artwork,
          category: product.category,
        },
      ];
    });
    setToastMessage(`${product.name} (${chosenVariant.label}) ditambahkan ke keranjang`);
  };

  const handleUpdateCartQty = (
    productId: string,
    variantId: string,
    delta: number
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.variantId === variantId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, variantId: string) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.variantId === variantId)
      )
    );
  };

  // Order Lifecycle Handlers (from purchase to package arrival at destination)
  const handleOrderCreated = (order: OrderReceipt) => {
    setOrders((prev) => [order, ...prev]);
    setActiveOrderId(order.orderNumber);
  };

  const handleAdvanceOrderToStatus = (orderNumber: string, targetStatus: OrderStatus) => {
    const nowLabel = new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const targetIdx = DELIVERY_SEQUENCE.indexOf(targetStatus);

    setOrders((prev) =>
      prev.map((order) => {
        if (order.orderNumber !== orderNumber) return order;

        const updatedTimeline = order.timeline.map((event) => {
          const eventIdx = DELIVERY_SEQUENCE.indexOf(event.status);
          if (eventIdx <= targetIdx) {
            return {
              ...event,
              completed: true,
              timestamp: event.completed ? event.timestamp : nowLabel,
            };
          }
          return event;
        });

        return {
          ...order,
          status: targetStatus,
          estimatedArrival:
            targetStatus === 'delivered'
              ? `Tiba ${nowLabel}`
              : targetStatus === 'in_transit'
              ? 'Kurir sedang menuju alamat Anda'
              : order.estimatedArrival,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const handleVerifyPayment = (orderNumber: string) => {
    handleAdvanceOrderToStatus(orderNumber, 'packed');
    setToastMessage(`Pembayaran pesanan #${orderNumber} terverifikasi`);
  };

  const handleAdvanceDelivery = (orderNumber: string) => {
    const current = orders.find((o) => o.orderNumber === orderNumber);
    if (!current) return;
    const idx = DELIVERY_SEQUENCE.indexOf(current.status);
    if (idx < DELIVERY_SEQUENCE.length - 1) {
      const nextStatus = DELIVERY_SEQUENCE[idx + 1];
      handleAdvanceOrderToStatus(orderNumber, nextStatus);
      if (nextStatus === 'delivered') {
        setToastMessage(`Paket #${orderNumber} telah tiba di alamat tujuan!`);
      }
    }
  };

  const handleConfirmPackageReceived = (orderNumber: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.orderNumber === orderNumber
          ? { ...order, receivedConfirmedByUser: true }
          : order
      )
    );
    setToastMessage(`Penerimaan paket #${orderNumber} berhasil dikonfirmasi`);
  };

  const handleCreateDemoOrder = () => {
    const starterBundle = PRODUCTS.find((p) => p.id === 'iot-starter-bundle') ?? PRODUCTS[0];
    const nowLabel = new Date().toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    const courier = 'IoTHome Express (1–2 Hari)';
    const demoOrder: OrderReceipt = {
      orderNumber: `IOT-${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: 'Bagas Prakoso',
      whatsapp: '0812-8890-1122',
      address: 'Jl. Ahmad Yani No. 45, Bekasi Selatan, Jawa Barat 17141',
      courier,
      trackingNumber: `IOTEXP-${Math.floor(1000000 + Math.random() * 9000000)}`,
      paymentMethod: 'QRIS / E-Wallet (GoPay, OVO, Dana)',
      items: [
        {
          productId: starterBundle.id,
          variantId: starterBundle.variants[0].id,
          name: starterBundle.name,
          variantLabel: starterBundle.variants[0].label,
          price: starterBundle.variants[0].price,
          quantity: 1,
          artwork: starterBundle.artwork,
          category: starterBundle.category,
        },
      ],
      subtotal: starterBundle.variants[0].price,
      shippingCost: 0,
      total: starterBundle.variants[0].price,
      status: 'packed',
      estimatedArrival: 'Estimasi tiba 1–2 hari kerja',
      receivedConfirmedByUser: false,
      timeline: buildInitialTimeline(true, courier, nowLabel),
      createdAt: nowLabel,
    };

    setOrders((prev) => [demoOrder, ...prev]);
    setActiveOrderId(demoOrder.orderNumber);
    setToastMessage(`Simulasi pesanan #${demoOrder.orderNumber} dibuat`);
  };

  const handleTrackOrder = (orderNumber: string) => {
    setActiveOrderId(orderNumber);
    const el = document.getElementById('lacak-pesanan');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openWhatsApp = (context?: WhatsAppContext) => {
    setWhatsAppContext(context ?? null);
    setWhatsAppOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      <Navbar cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />

      <main className="flex-1">
        <HeroSection
          smartState={smartState}
          activeWatts={activeWatts}
          estimatedMonthlyBill={estimatedMonthlyBill}
          onToggleLight={handleToggleLight}
          onTogglePlug={handleTogglePlug}
          onToggleAc={handleToggleAc}
          onToggleCctv={handleToggleCctvArmed}
          onOpenWhatsApp={() => openWhatsApp({ topic: 'Konsultasi Produk & Paket Hemat' })}
        />

        <SmartDashboard
          state={smartState}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
          activeWatts={activeWatts}
          estimatedMonthlyBill={estimatedMonthlyBill}
          monthlySavings={monthlySavings}
          onApplyScene={handleApplyScene}
          onToggleLight={handleToggleLight}
          onChangeLightBrightness={handleChangeLightBrightness}
          onChangeLightTemp={handleChangeLightTemp}
          onTurnOffAllLights={handleTurnOffAllLights}
          onTogglePlug={handleTogglePlug}
          onTogglePlugSchedule={handleTogglePlugSchedule}
          onToggleAc={handleToggleAc}
          onStepAcTemp={handleStepAcTemp}
          onChangeAcMode={handleChangeAcMode}
          onChangeAcFan={handleChangeAcFan}
          onToggleCctvArmed={handleToggleCctvArmed}
          onToggleCctvNightVision={handleToggleCctvNightVision}
          onPanCctv={handlePanCctv}
          onSimulateMotion={handleSimulateMotion}
          onResetDashboard={handleResetDashboard}
        />

        <ProductCatalog
          onSelectProduct={setActiveProduct}
          onAddToCart={(product) => handleAddToCart(product)}
        />

        <OrderTrackingSection
          orders={orders}
          activeOrderId={activeOrderId}
          onSelectOrder={setActiveOrderId}
          onVerifyPayment={handleVerifyPayment}
          onAdvanceDelivery={handleAdvanceDelivery}
          onConfirmReceived={handleConfirmPackageReceived}
          onCreateDemoOrder={handleCreateDemoOrder}
          onContactWhatsApp={(orderNumber) =>
            openWhatsApp({
              topic: 'Bantuan Pesanan & Pengiriman',
              orderNumber,
            })
          }
        />

        <StoryboardSection />
      </main>

      <Footer
        onOpenWhatsApp={() =>
          openWhatsApp({ topic: 'Konsultasi Produk & Paket Hemat' })
        }
      />

      {/* Product Detail Modal */}
      <ProductModal
        product={activeProduct}
        onClose={() => setActiveProduct(null)}
        onAddToCart={handleAddToCart}
        onAskWhatsApp={(productName) =>
          openWhatsApp({
            topic: 'Konsultasi Produk & Paket Hemat',
            productName,
          })
        }
      />

      {/* Slide-Over Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => setCartItems([])}
        onOrderCreated={handleOrderCreated}
        onVerifyPayment={handleVerifyPayment}
        onTrackOrder={handleTrackOrder}
        onContactWhatsApp={(orderNumber) =>
          openWhatsApp({
            topic: 'Bantuan Pesanan & Pengiriman',
            orderNumber,
          })
        }
      />

      {/* WhatsApp Consultation & Support Modal */}
      <WhatsAppModal
        isOpen={whatsAppOpen}
        context={whatsAppContext}
        onClose={() => setWhatsAppOpen(false)}
      />

      {/* Compact WhatsApp Quick Trigger (Hidden while Cart Drawer or Toast is active) */}
      {!cartOpen && !whatsAppOpen && !toastMessage && (
        <button
          type="button"
          onClick={() => openWhatsApp({ topic: 'Konsultasi Produk & Paket Hemat' })}
          aria-label="Hubungi IoTHome melalui WhatsApp"
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 h-12 px-4 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg border border-emerald-600 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-transform duration-150 hover:scale-[1.03] cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span className="hidden sm:inline">WhatsApp CS</span>
        </button>
      )}

      {/* Non-intrusive Cart / Order Toast Feedback */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-40 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm truncate">{toastMessage}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setToastMessage(null);
              setCartOpen(true);
            }}
            className="text-xs font-semibold text-sky-300 hover:text-sky-200 whitespace-nowrap shrink-0 cursor-pointer"
          >
            Lihat
          </button>
        </div>
      )}
    </div>
  );
}
