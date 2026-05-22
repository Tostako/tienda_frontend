import { Truck, ShieldCheck, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: Truck,
    title: 'ENVIO GRATIS',
    description: 'En compras superiores a $50.000',
    color: 'text-luxe-blue',
    bgColor: 'bg-blue-50',
  },
  {
    icon: ShieldCheck,
    title: 'COMPRA SEGURA',
    description: 'Proteccion garantizada en cada transaccion',
    color: 'text-luxe-coral',
    bgColor: 'bg-red-50',
  },
  {
    icon: TrendingUp,
    title: 'ULTIMA MODA',
    description: 'Tendencias actuales del mercado',
    color: 'text-luxe-green',
    bgColor: 'bg-green-50',
  },
];

export function Benefits() {
  return (
    <section className="bg-luxe-gray-light py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-16 h-16 rounded-full ${benefit.bgColor} flex items-center justify-center mb-4`}>
                <benefit.icon className={`w-7 h-7 ${benefit.color}`} />
              </div>
              <h3 className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-2">
                {benefit.title}
              </h3>
              <p className="text-sm font-montserrat text-luxe-gray-medium">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
