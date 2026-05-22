import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatPrice } from '../lib/utils';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, ChevronRight } from 'lucide-react';

export function Checkout() {
  const { cart, cartTotal, isAuthenticated, createOrderFromCart } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    region: '',
    notes: '',
  });

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-montserrat font-bold mb-4">Tu carrito esta vacio</h1>
        <Button onClick={() => navigate('/catalogo')} variant="primary">
          Volver al catalogo
        </Button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-montserrat font-bold mb-4">Inicia sesion para continuar</h1>
        <p className="text-sm font-montserrat text-luxe-gray-medium mb-8">
          Debes iniciar sesion para crear un pedido.
        </p>
        <Button onClick={() => navigate('/login')} variant="primary">
          Iniciar Sesion
        </Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const result = await createOrderFromCart(formData.notes);
        if (result) {
          navigate(`/confirmacion/${result.orderNumber}`);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const shippingCost = cartTotal >= 50000 ? 0 : 4500;
  const total = cartTotal + shippingCost;

  const steps = [
    { number: 1, label: 'Envio', icon: MapPin },
    { number: 2, label: 'Pago', icon: CreditCard },
    { number: 3, label: 'Confirmar', icon: ChevronRight },
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-8">
          Checkout
        </h1>

        {/* Progress */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
          {steps.map((s) => (
            <div key={s.number} className="flex items-center gap-2 md:gap-3">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                  step >= s.number ? 'bg-luxe-black text-white' : 'bg-luxe-gray-light text-luxe-gray-medium'
                }`}
              >
                <s.icon className="w-4 h-4" />
              </div>
              <span
                className={`hidden md:block text-sm font-montserrat font-medium ${
                  step >= s.number ? 'text-luxe-black' : 'text-luxe-gray-medium'
                }`}
              >
                {s.label}
              </span>
              {s.number < 3 && (
                <ChevronRight className="w-4 h-4 text-luxe-gray-medium ml-2 md:ml-4" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                    Informacion de Envio
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Nombre
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Apellido
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Email
                      </label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Telefono
                      </label>
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                      Direccion
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Ciudad
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Region
                      </label>
                      <input
                        required
                        type="text"
                        value={formData.region}
                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                        Notas adicionales
                      </label>
                      <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Ej: Entregar en porteria"
                        className="w-full px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-lg font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                    Metodo de Pago
                  </h2>
                  <div className="bg-luxe-gray-light p-6 mb-6">
                    <p className="text-sm font-montserrat text-luxe-gray-medium leading-relaxed">
                      El pago se procesara en el siguiente paso mediante Mercado Pago.
                      Aceptamos tarjeta de credito, debito y PSE.
                    </p>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-lg font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                    Confirmar Pedido
                  </h2>
                  <div className="bg-luxe-gray-light p-6 space-y-4 mb-6">
                    <div>
                      <p className="text-xs font-montserrat uppercase tracking-wider text-luxe-gray-medium mb-1">
                        Enviar a
                      </p>
                      <p className="text-sm font-montserrat text-luxe-black">
                        {formData.firstName} {formData.lastName}
                      </p>
                      <p className="text-sm font-montserrat text-luxe-gray-medium">
                        {formData.address}, {formData.city}, {formData.region}
                      </p>
                    </div>
                    {formData.notes && (
                      <div>
                        <p className="text-xs font-montserrat uppercase tracking-wider text-luxe-gray-medium mb-1">
                          Notas
                        </p>
                        <p className="text-sm font-montserrat text-luxe-black">
                          {formData.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="flex items-center gap-4 mt-8">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(step - 1)}
                  >
                    Anterior
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? 'Procesando...'
                    : step === 3
                    ? 'Confirmar Compra'
                    : 'Continuar'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-luxe-gray-light p-6">
              <h2 className="text-lg font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
                Tu Pedido
              </h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-3">
                    <div className="w-16 h-20 bg-gray-100 flex-shrink-0 overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-montserrat font-medium text-luxe-black">{item.name}</p>
                      <p className="text-xs font-montserrat text-luxe-gray-medium">
                        {item.size} x {item.quantity}
                      </p>
                      <p className="text-sm font-montserrat font-semibold mt-1">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-luxe-gray pt-4 space-y-2">
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-luxe-gray-medium">Subtotal</span>
                  <span className="text-luxe-black">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-sm font-montserrat">
                  <span className="text-luxe-gray-medium">Envio</span>
                  <span className={shippingCost === 0 ? 'text-luxe-green' : 'text-luxe-black'}>
                    {shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}
                  </span>
                </div>
              </div>
              <div className="border-t border-luxe-gray pt-4 mt-4">
                <div className="flex justify-between">
                  <span className="text-base font-montserrat font-bold text-luxe-black">Total</span>
                  <span className="text-base font-montserrat font-bold text-luxe-black">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
