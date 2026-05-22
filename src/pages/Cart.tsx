import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, isAuthenticated } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <ShoppingBag className="w-16 h-16 text-luxe-gray mx-auto mb-6" />
        <h1 className="text-2xl font-montserrat font-bold text-luxe-black mb-4">
          Tu carrito esta vacio
        </h1>
        <p className="text-sm font-montserrat text-luxe-gray-medium mb-8">
          Descubre nuestra coleccion y encuentra algo que te encante.
        </p>
        <Button onClick={() => navigate('/catalogo')} variant="primary">
          Explorar Productos
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-8">
          Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.id}-${item.size}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex gap-4 pb-6 border-b border-luxe-gray"
                >
                  <Link to={`/producto/${item.id}`} className="w-24 h-32 md:w-32 md:h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </Link>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <Link to={`/producto/${item.id}`}>
                        <h3 className="text-sm font-montserrat font-medium text-luxe-black hover:text-luxe-blue transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-xs font-montserrat text-luxe-gray-medium uppercase tracking-wider mt-1">
                        {item.category}
                      </p>
                      <p className="text-xs font-montserrat text-luxe-gray-medium mt-1">
                        Talla: {item.size}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-luxe-gray">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-luxe-gray-light transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center font-montserrat text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-luxe-gray-light transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-montserrat font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id, item.size)}
                          className="text-luxe-gray-medium hover:text-luxe-coral transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={clearCart}
              className="mt-6 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-coral transition-colors"
            >
              Vaciar carrito
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-luxe-gray-light p-6">
              <h2 className="text-lg font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                Resumen
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-luxe-gray-medium">Subtotal</span>
                  <span className="text-luxe-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-luxe-gray-medium">Envio</span>
                  <span className="text-luxe-green">
                    {cartTotal >= 50000 ? 'Gratis' : formatPrice(4500)}
                  </span>
                </div>
              </div>
              <div className="border-t border-luxe-gray pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-base font-montserrat font-bold text-luxe-black">Total</span>
                  <span className="text-base font-montserrat font-bold text-luxe-black">
                    {formatPrice(cartTotal >= 50000 ? cartTotal : cartTotal + 4500)}
                  </span>
                </div>
              </div>
              <Button
                onClick={() => navigate(isAuthenticated ? '/checkout' : '/login')}
                variant="primary"
                size="lg"
                className="w-full"
              >
                {isAuthenticated ? 'Proceder al Pago' : 'Inicia sesion para pagar'}
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Link
                to="/catalogo"
                className="block text-center mt-4 text-sm font-montserrat text-luxe-gray-medium hover:text-luxe-black transition-colors"
              >
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
