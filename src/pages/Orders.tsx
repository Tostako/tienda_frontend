import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { getMyOrders, getOrderById, type OrderResponse } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  ArrowLeft,
  Clock,
  CheckCircle,
  Truck,
  Home,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Tag,
  Hash,
} from 'lucide-react';
import { useState, useEffect } from 'react';

// Fallback mock data with items
const mockOrders: OrderResponse[] = [
  {
    id: '1',
    order_number: 'ORD-2026-001',
    status: 'delivered',
    total: 129990,
    customer_id: 'cust-1',
    created_at: '2026-05-10T00:00:00Z',
    items: [
      {
        id: 'i1',
        product_id: 'p1',
        product_name: 'Vestido Negro Elegante',
        quantity: 1,
        unit_price: 79990,
        discount: 0,
        subtotal: 79990,
        created_at: '2026-05-10T00:00:00Z',
      },
      {
        id: 'i2',
        product_id: 'p2',
        product_name: 'Zapatillas Urbanas Blancas',
        quantity: 1,
        unit_price: 54990,
        discount: 4990,
        subtotal: 50000,
        created_at: '2026-05-10T00:00:00Z',
      },
    ],
  },
  {
    id: '2',
    order_number: 'ORD-2026-002',
    status: 'shipped',
    total: 59990,
    customer_id: 'cust-1',
    created_at: '2026-05-08T00:00:00Z',
    items: [
      {
        id: 'i3',
        product_id: 'p3',
        product_name: 'Jeans Clasico Azul',
        quantity: 1,
        unit_price: 59990,
        discount: 0,
        subtotal: 59990,
        created_at: '2026-05-08T00:00:00Z',
      },
    ],
  },
  {
    id: '3',
    order_number: 'ORD-2026-003',
    status: 'confirmed',
    total: 89990,
    customer_id: 'cust-1',
    created_at: '2026-05-05T00:00:00Z',
    items: [
      {
        id: 'i4',
        product_id: 'p4',
        product_name: 'Camiseta Basica Premium',
        quantity: 2,
        unit_price: 24990,
        discount: 0,
        subtotal: 49980,
        created_at: '2026-05-05T00:00:00Z',
      },
      {
        id: 'i5',
        product_id: 'p5',
        product_name: 'Polo Premium Algodon',
        quantity: 1,
        unit_price: 34990,
        discount: 0,
        subtotal: 34990,
        created_at: '2026-05-05T00:00:00Z',
      },
    ],
  },
];

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string; bg: string; border: string }> = {
  pending:   { label: 'Pendiente',   icon: Clock,       color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  confirmed: { label: 'Confirmado',  icon: CheckCircle, color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  shipped:   { label: 'Enviado',     icon: Truck,       color: 'text-indigo-700', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  delivered: { label: 'Entregado',   icon: Home,        color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200' },
  cancelled: { label: 'Cancelado',   icon: XCircle,     color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200' },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function Orders() {
  const { isAuthenticated, token } = useApp();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState<Record<string, boolean>>({});

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await getMyOrders(token);
      if (data && data.length > 0) {
        setOrders(data);
        setUsingFallback(false);
      } else if (data && data.length === 0) {
        setOrders([]);
        setUsingFallback(false);
      } else {
        setOrders(mockOrders);
        setUsingFallback(true);
      }
    } catch {
      setOrders(mockOrders);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderDetail = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
      return;
    }

    setExpandedOrderId(orderId);

    const order = orders.find((o) => o.id === orderId);
    if (!order) return;

    // If we already have items (mock or loaded), don't fetch again
    if (order.items && order.items.length > 0) return;

    if (!token || usingFallback) return;

    setDetailLoading((prev) => ({ ...prev, [orderId]: true }));
    try {
      const detailed = await getOrderById(token, orderId);
      if (detailed && detailed.items) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, items: detailed.items } : o))
        );
      }
    } catch (err) {
      console.error('Error fetching order detail:', err);
    } finally {
      setDetailLoading((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    if (isAuthenticated && token) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <Package className="w-16 h-16 text-luxe-gray mx-auto mb-6" />
        <h1 className="text-2xl font-montserrat font-bold text-luxe-black mb-4">
          Inicia sesion para ver tus pedidos
        </h1>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm font-montserrat font-medium text-luxe-blue hover:underline"
        >
          Iniciar Sesion
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/cuenta"
              className="flex items-center gap-2 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Link>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black">
              Mis Pedidos
            </h1>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-black transition-colors disabled:opacity-50"
            title="Recargar pedidos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Actualizar</span>
          </button>
        </div>

        {usingFallback && (
          <div className="mb-6 px-4 py-3 bg-amber-50 border border-amber-200 text-amber-800 text-sm font-montserrat rounded">
            No se pudo conectar con el servidor. Mostrando datos de ejemplo.
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-luxe-blue animate-spin mb-4" />
            <p className="text-sm font-montserrat text-luxe-gray-medium">Cargando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <Package className="w-16 h-16 text-luxe-gray mx-auto mb-6" />
            <h2 className="text-xl font-montserrat font-bold text-luxe-black mb-2">
              No tienes pedidos aun
            </h2>
            <p className="text-sm font-montserrat text-luxe-gray-medium mb-6">
              Cuando realices una compra, aparecera aqui.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-luxe-black text-white text-sm font-montserrat font-medium hover:bg-luxe-blue transition-colors"
            >
              Explorar Catalogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, orderIndex) => {
              const status = statusConfig[order.status] || statusConfig.pending;
              const isExpanded = expandedOrderId === order.id;
              const isLoadingDetail = detailLoading[order.id];

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: orderIndex * 0.08 }}
                  className="bg-white border border-luxe-gray hover:border-luxe-gray-medium transition-colors"
                >
                  {/* Order Summary Header — clickable to expand */}
                  <button
                    onClick={() => toggleOrderDetail(order.id)}
                    className="w-full text-left"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-6 py-4 gap-3">
                      {/* Order info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="text-sm font-montserrat font-semibold text-luxe-black uppercase tracking-wider">
                            Pedido #{order.order_number}
                          </p>
                          <span className="text-xs font-montserrat text-luxe-gray-medium">
                            {formatDate(order.created_at)}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-montserrat text-luxe-gray-medium">
                            Total:{' '}
                            <span className="font-semibold text-luxe-black">
                              {formatPrice(order.total)}
                            </span>
                          </p>
                          {order.items && (
                            <p className="text-xs font-montserrat text-luxe-gray-medium">
                              {order.items.reduce((s, i) => s + i.quantity, 0)} articulo
                              {order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status badge + chevron */}
                      <div className="flex items-center gap-3 self-start sm:self-auto">
                        <div className={`flex items-center gap-2 px-3 py-1.5 border ${status.bg} ${status.border}`}>
                          <status.icon className={`w-4 h-4 ${status.color}`} />
                          <span className={`text-xs font-montserrat font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-luxe-gray-medium" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-luxe-gray-medium" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-luxe-gray-light px-6 py-5">
                          {isLoadingDetail ? (
                            <div className="flex items-center gap-3 py-4">
                              <Loader2 className="w-5 h-5 text-luxe-blue animate-spin" />
                              <span className="text-sm font-montserrat text-luxe-gray-medium">
                                Cargando detalle...
                              </span>
                            </div>
                          ) : (
                            <>
                              {/* Items table */}
                              <h4 className="text-xs font-montserrat font-semibold uppercase tracking-wider text-luxe-gray-medium mb-3">
                                Articulos
                              </h4>
                              <div className="space-y-3 mb-5">
                                {order.items && order.items.length > 0 ? (
                                  order.items.map((item) => (
                                    <div
                                      key={item.id}
                                      className="flex items-start justify-between gap-4 py-2 border-b border-luxe-gray-light last:border-0"
                                    >
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-montserrat font-medium text-luxe-black truncate">
                                          {item.product_name || 'Producto'}
                                        </p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                          <span className="text-xs font-montserrat text-luxe-gray-medium">
                                            Cant: {item.quantity}
                                          </span>
                                          {item.product_sku && (
                                            <span className="text-xs font-montserrat text-luxe-gray-medium flex items-center gap-1">
                                              <Hash className="w-3 h-3" />
                                              {item.product_sku}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-right flex-shrink-0">
                                        <p className="text-sm font-montserrat font-semibold text-luxe-black">
                                          {formatPrice(item.subtotal)}
                                        </p>
                                        <p className="text-xs font-montserrat text-luxe-gray-medium">
                                          {formatPrice(item.unit_price)} c/u
                                        </p>
                                        {item.discount > 0 && (
                                          <p className="text-xs font-montserrat text-luxe-coral">
                                            -{formatPrice(item.discount)} desc.
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm font-montserrat text-luxe-gray-medium py-2">
                                    No hay detalle de articulos disponible.
                                  </p>
                                )}
                              </div>

                              {/* Totals */}
                              <div className="bg-luxe-gray-light px-4 py-3 mb-4">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-montserrat text-luxe-gray-medium uppercase">
                                    Subtotal
                                  </span>
                                  <span className="text-sm font-montserrat text-luxe-black">
                                    {formatPrice(
                                      (order.items?.reduce((s, i) => s + i.subtotal, 0) || 0) +
                                        (order.items?.reduce((s, i) => s + i.discount, 0) || 0)
                                    )}
                                  </span>
                                </div>
                                {(order.items?.reduce((s, i) => s + i.discount, 0) || 0) > 0 && (
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-montserrat text-luxe-gray-medium uppercase">
                                      Descuento
                                    </span>
                                    <span className="text-sm font-montserrat text-luxe-coral">
                                      -{formatPrice(order.items?.reduce((s, i) => s + i.discount, 0) || 0)}
                                    </span>
                                  </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t border-luxe-gray">
                                  <span className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black">
                                    Total
                                  </span>
                                  <span className="text-lg font-montserrat font-bold text-luxe-black">
                                    {formatPrice(order.total)}
                                  </span>
                                </div>
                              </div>

                              {/* Notes */}
                              {order.notes && (
                                <div className="flex items-start gap-2 text-xs font-montserrat text-luxe-gray-medium">
                                  <Tag className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                                  <p>{order.notes}</p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
