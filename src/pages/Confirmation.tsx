import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Home } from 'lucide-react';

export function Confirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-20 h-20 bg-luxe-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-luxe-green" />
          </div>
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold text-luxe-black mb-4">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-sm font-montserrat text-luxe-gray-medium mb-2">
            Tu pedido ha sido confirmado exitosamente.
          </p>
          <p className="text-lg font-montserrat font-bold text-luxe-black mb-8">
            Orden: #{orderNumber}
          </p>

          <div className="bg-luxe-gray-light p-6 mb-8">
            <h2 className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-6">
              Seguimiento de tu pedido
            </h2>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-luxe-gray" />
              {[
                { icon: CheckCircle, label: 'Confirmado', active: true },
                { icon: Package, label: 'Preparando', active: false },
                { icon: Truck, label: 'Enviado', active: false },
                { icon: Home, label: 'Entregado', active: false },
              ].map((step, index) => (
                <div key={index} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step.active ? 'bg-luxe-green text-white' : 'bg-white text-luxe-gray-medium border border-luxe-gray'
                    }`}
                  >
                    <step.icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-montserrat uppercase tracking-wider mt-2 text-luxe-gray-medium">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/seguimiento">
              <Button variant="primary" size="lg">
                Rastrear Pedido
              </Button>
            </Link>
            <Link to="/catalogo">
              <Button variant="outline" size="lg">
                Seguir Comprando
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
