import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOffers, type OfferResponse } from '../services/api';
import { formatPrice } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import {
  Tag,
  Loader2,
  RefreshCw,
  Copy,
  Check,
  ShoppingBag,
  Calendar,
  ArrowRight,
} from 'lucide-react';

// Fallback mock offers with product images
const mockOffers: OfferResponse[] = [
  {
    id: '1',
    title: 'Verano 2026',
    description: '20% de descuento en toda la tienda. Aprovecha esta oportunidad unica.',
    discount_type: 'percentage',
    discount_value: 20,
    scope: 'storewide',
    code: 'VERANO26',
    starts_at: '2026-01-01T00:00:00Z',
    ends_at: '2026-03-31T23:59:59Z',
    product_name: null,
    category_name: null,
  },
  {
    id: '2',
    title: 'Descuento en Camisetas',
    description: 'Aprovecha un 15% de descuento en todas las camisetas de la coleccion.',
    discount_type: 'percentage',
    discount_value: 15,
    scope: 'category',
    code: 'CAMISETAS15',
    starts_at: '2026-02-01T00:00:00Z',
    ends_at: '2026-02-28T23:59:59Z',
    product_name: null,
    category_name: 'Camisetas',
  },
  {
    id: '3',
    title: 'Jeans Clasico en Oferta',
    description: 'Llevate el clasico jeans azul con un descuento especial por tiempo limitado.',
    discount_type: 'fixed_amount',
    discount_value: 10000,
    scope: 'product',
    code: null,
    starts_at: '2026-01-15T00:00:00Z',
    ends_at: '2026-02-15T23:59:59Z',
    product_name: 'Jeans Clasico Azul',
    category_name: null,
    product_image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop',
    product_price: 59990,
  },
  {
    id: '4',
    title: 'Camiseta Premium',
    description: 'Camiseta basica de algodon organico con 25% de descuento.',
    discount_type: 'percentage',
    discount_value: 25,
    scope: 'product',
    code: 'CAMISETA25',
    starts_at: '2026-01-01T00:00:00Z',
    ends_at: '2026-02-28T23:59:59Z',
    product_name: 'Camiseta Basica Premium',
    category_name: null,
    product_image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
    product_price: 24990,
  },
  {
    id: '5',
    title: 'Zapatillas Urbanas',
    description: 'Descuento de $15.000 en zapatillas urbanas blancas.',
    discount_type: 'fixed_amount',
    discount_value: 15000,
    scope: 'product',
    code: null,
    starts_at: '2026-01-01T00:00:00Z',
    ends_at: '2026-03-15T23:59:59Z',
    product_name: 'Zapatillas Urbanas Blancas',
    category_name: null,
    product_image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
    product_price: 54990,
  },
  {
    id: '6',
    title: 'Vestido Negro Elegante',
    description: 'Elegancia atemporal con 30% de descuento por tiempo limitado.',
    discount_type: 'percentage',
    discount_value: 30,
    scope: 'product',
    code: 'VESTIDO30',
    starts_at: '2026-01-20T00:00:00Z',
    ends_at: '2026-02-20T23:59:59Z',
    product_name: 'Vestido Negro Elegante',
    category_name: null,
    product_image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
    product_price: 79990,
  },
];

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function isActive(start: string, end: string): boolean {
  const now = new Date();
  return now >= new Date(start) && now <= new Date(end);
}

function calculateDiscountedPrice(price: number, type: 'percentage' | 'fixed_amount', value: number): number {
  if (type === 'percentage') {
    return Math.round(price * (1 - value / 100));
  }
  return Math.max(0, price - value);
}

export function Offers() {
  const { showToast } = useApp();
  const [offers, setOffers] = useState<OfferResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const data = await getOffers();
      if (data && data.length > 0) {
        setOffers(data);
        setUsingFallback(false);
      } else if (data && data.length === 0) {
        setOffers([]);
        setUsingFallback(false);
      } else {
        setOffers(mockOffers);
        setUsingFallback(true);
      }
    } catch {
      setOffers(mockOffers);
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code);
      showToast('Codigo copiado al portapapeles', 'success');
      setTimeout(() => setCopiedCode(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-luxe-blue animate-spin mb-4" />
            <p className="text-sm font-montserrat text-luxe-gray-medium">Cargando ofertas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <div className="inline-flex items-center gap-2 bg-luxe-coral/10 text-luxe-coral px-4 py-2 mb-4">
              <Tag className="w-4 h-4" />
              <span className="text-sm font-montserrat font-bold uppercase tracking-wider">
                Ofertas Especiales
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-4">
              Descuentos Exclusivos
            </h1>
            <p className="text-sm font-montserrat text-luxe-gray-medium max-w-lg mx-auto">
              Aprovecha nuestras ofertas por tiempo limitado en productos seleccionados.
            </p>
          </div>
          <button
            onClick={fetchOffers}
            disabled={loading}
            className="flex items-center gap-2 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-black transition-colors disabled:opacity-50 ml-4"
            title="Recargar ofertas"
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

        {offers.length === 0 ? (
          <div className="text-center py-24">
            <Tag className="w-16 h-16 text-luxe-gray mx-auto mb-6" />
            <h2 className="text-xl font-montserrat font-bold text-luxe-black mb-2">
              No hay ofertas disponibles
            </h2>
            <p className="text-sm font-montserrat text-luxe-gray-medium mb-6">
              Vuelve pronto para descubrir nuestras promociones.
            </p>
            <Link
              to="/catalogo"
              className="inline-flex items-center gap-2 px-6 py-3 bg-luxe-black text-white text-sm font-montserrat font-medium hover:bg-luxe-blue transition-colors"
            >
              Explorar Catalogo
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {offers.map((offer, index) => {
              const active = isActive(offer.starts_at, offer.ends_at);
              const hasProduct = offer.scope === 'product' && offer.product_image;
              const originalPrice = offer.product_price ?? 0;
              const discountedPrice = originalPrice > 0
                ? calculateDiscountedPrice(originalPrice, offer.discount_type, offer.discount_value)
                : 0;

              return (
                <motion.div
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  className="group bg-white border border-luxe-gray hover:border-luxe-gray-medium hover:shadow-lg transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-200">
                    {hasProduct ? (
                      <>
                        <img
                          src={offer.product_image!}
                          alt={offer.product_name || offer.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {/* Discount badge */}
                        <div className="absolute top-3 right-3 bg-luxe-coral text-white text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1.5 shadow-sm">
                          {offer.discount_type === 'percentage'
                            ? `-${offer.discount_value}%`
                            : `-${formatPrice(offer.discount_value)}`}
                        </div>
                        {/* Status badge */}
                        {!active && (
                          <div className="absolute top-3 left-3 bg-luxe-black/70 text-white text-[10px] font-montserrat font-bold uppercase tracking-wider px-2.5 py-1.5">
                            Finalizada
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-luxe-gray-light p-6 text-center">
                        <Tag className="w-12 h-12 text-luxe-coral mb-3" />
                        <span className="text-lg font-montserrat font-bold text-luxe-coral uppercase tracking-wider">
                          {offer.discount_type === 'percentage'
                            ? `${offer.discount_value}%`
                            : formatPrice(offer.discount_value)}
                        </span>
                        <span className="text-xs font-montserrat text-luxe-gray-medium uppercase tracking-wider mt-1">
                          {offer.discount_type === 'percentage' ? 'Descuento' : 'Ahorro'}
                        </span>
                        {!active && (
                          <span className="mt-3 text-[10px] font-montserrat font-bold uppercase tracking-wider bg-luxe-black/70 text-white px-2.5 py-1">
                            Finalizada
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Scope label */}
                    <div className="flex items-center gap-2 mb-2">
                      {offer.scope === 'storewide' && (
                        <span className="flex items-center gap-1 text-[10px] font-montserrat font-bold uppercase tracking-wider text-luxe-blue bg-blue-50 px-2 py-1">
                          <ShoppingBag className="w-3 h-3" />
                          Toda la tienda
                        </span>
                      )}
                      {offer.scope === 'category' && offer.category_name && (
                        <span className="flex items-center gap-1 text-[10px] font-montserrat font-bold uppercase tracking-wider text-luxe-blue bg-blue-50 px-2 py-1">
                          <Tag className="w-3 h-3" />
                          {offer.category_name}
                        </span>
                      )}
                      {offer.scope === 'product' && (
                        <span className="flex items-center gap-1 text-[10px] font-montserrat font-bold uppercase tracking-wider text-luxe-green bg-green-50 px-2 py-1">
                          <ShoppingBag className="w-3 h-3" />
                          Producto
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-montserrat font-bold text-luxe-black uppercase tracking-wider mb-1 group-hover:text-luxe-blue transition-colors">
                      {offer.title}
                    </h3>

                    {/* Product name if available */}
                    {offer.product_name && (
                      <p className="text-xs font-montserrat text-luxe-gray-medium mb-2">
                        {offer.product_name}
                      </p>
                    )}

                    {/* Description */}
                    {offer.description && (
                      <p className="text-xs font-montserrat text-luxe-gray-medium mb-3 line-clamp-2">
                        {offer.description}
                      </p>
                    )}

                    {/* Price section */}
                    {originalPrice > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg font-montserrat font-bold text-luxe-coral">
                          {formatPrice(discountedPrice)}
                        </span>
                        <span className="text-xs font-montserrat text-luxe-gray-medium line-through">
                          {formatPrice(originalPrice)}
                        </span>
                      </div>
                    )}

                    {/* Validity */}
                    <div className="flex items-center gap-1.5 text-[10px] font-montserrat text-luxe-gray-medium mb-3">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {formatDateShort(offer.starts_at)} - {formatDateShort(offer.ends_at)}
                      </span>
                    </div>

                    {/* Code */}
                    {offer.code && (
                      <button
                        onClick={() => handleCopyCode(offer.code!)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-dashed border-luxe-coral text-luxe-coral font-montserrat font-semibold uppercase tracking-wider text-xs hover:bg-luxe-coral hover:text-white transition-colors mb-3"
                      >
                        {copiedCode === offer.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            {offer.code}
                          </>
                        )}
                      </button>
                    )}

                    {/* CTA Button */}
                    {offer.scope === 'product' && offer.product_name ? (
                      <Link
                        to={`/catalogo?search=${encodeURIComponent(offer.product_name)}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-luxe-black text-white text-xs font-montserrat font-semibold uppercase tracking-wider hover:bg-luxe-blue transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Ver Producto
                      </Link>
                    ) : offer.scope === 'category' && offer.category_name ? (
                      <Link
                        to={`/catalogo/${offer.category_name.toLowerCase()}`}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-luxe-black text-white text-xs font-montserrat font-semibold uppercase tracking-wider hover:bg-luxe-blue transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Ver Categoria
                      </Link>
                    ) : (
                      <Link
                        to="/catalogo"
                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-luxe-black text-white text-xs font-montserrat font-semibold uppercase tracking-wider hover:bg-luxe-blue transition-colors"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                        Explorar Catalogo
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
