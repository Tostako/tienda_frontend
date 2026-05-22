import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { products as localProducts } from '../data/products';
import { useBackendProduct } from '../hooks/useBackend';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag, Truck, ShieldCheck, RotateCcw } from 'lucide-react';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Try backend first
  const { product: backendProduct } = useBackendProduct(id || '');

  // Fallback to local data
  const localProduct = localProducts.find((p) => String(p.id) === id);

  const product = backendProduct || localProduct;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-montserrat font-bold mb-4">Producto no encontrado</h1>
        <Button onClick={() => navigate('/catalogo')} variant="outline">
          Volver al catalogo
        </Button>
      </div>
    );
  }

  const relatedProducts = localProducts
    .filter((p) => p.category === product.category && String(p.id) !== String(product.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(product as typeof localProducts[0], selectedSize || 'Unico');
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-black transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[3/4] bg-gray-100 overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs font-montserrat uppercase tracking-wider text-luxe-gray-medium mb-2">
              {product.category}
            </p>
            <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-luxe-black mb-4">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl font-montserrat font-bold text-luxe-black">
                {formatPrice(product.price)}
              </span>
              {'originalPrice' in product && product.originalPrice && (
                <span className="text-lg font-montserrat text-luxe-gray-medium line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-sm font-montserrat text-luxe-gray-medium leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-montserrat font-medium text-luxe-black mb-3">
                  Talla: {selectedSize || 'Selecciona una talla'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 font-montserrat text-sm border transition-all ${
                        selectedSize === size
                          ? 'bg-luxe-black text-white border-luxe-black'
                          : 'bg-white text-luxe-black border-luxe-gray hover:border-luxe-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-8">
              <p className="text-sm font-montserrat font-medium text-luxe-black">Cantidad:</p>
              <div className="flex items-center border border-luxe-gray">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-luxe-black hover:bg-luxe-gray-light transition-colors"
                >
                  -
                </button>
                <span className="w-10 h-10 flex items-center justify-center font-montserrat text-sm">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-luxe-black hover:bg-luxe-gray-light transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              className="w-full sm:w-auto mb-8"
              disabled={product.sizes && product.sizes.length > 0 && !selectedSize}
            >
              <ShoppingBag className="w-5 h-5" />
              Agregar al Carrito
            </Button>

            {/* Benefits */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-luxe-gray">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck className="w-5 h-5 text-luxe-blue" />
                <span className="text-[10px] font-montserrat uppercase tracking-wider text-luxe-gray-medium">Envio Gratis</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck className="w-5 h-5 text-luxe-green" />
                <span className="text-[10px] font-montserrat uppercase tracking-wider text-luxe-gray-medium">Compra Segura</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <RotateCcw className="w-5 h-5 text-luxe-coral" />
                <span className="text-[10px] font-montserrat uppercase tracking-wider text-luxe-gray-medium">Devolucion 30 dias</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-8">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <Link key={p.id} to={`/producto/${p.handle || p.id}`} className="group block">
                  <div className="aspect-[3/4] overflow-hidden mb-4 bg-gray-200">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <h3 className="text-sm font-montserrat font-medium text-luxe-black group-hover:text-luxe-blue transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-sm font-montserrat font-semibold text-luxe-black mt-1">
                    {formatPrice(p.price)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
