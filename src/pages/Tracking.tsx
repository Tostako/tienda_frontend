import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Search, Package, Truck, Home, CheckCircle, Clock } from 'lucide-react';

const mockOrders = [
  {
    orderNumber: 'ABC123XYZ',
    date: '2026-05-10',
    status: 'enviado',
    steps: [
      { label: 'Confirmado', done: true, date: '10/05' },
      { label: 'Preparando', done: true, date: '11/05' },
      { label: 'Enviado', done: true, date: '11/05' },
      { label: 'Entregado', done: false, date: '-' },
    ],
  },
  {
    orderNumber: 'DEF456UVW',
    date: '2026-05-08',
    status: 'entregado',
    steps: [
      { label: 'Confirmado', done: true, date: '08/05' },
      { label: 'Preparando', done: true, date: '09/05' },
      { label: 'Enviado', done: true, date: '09/05' },
      { label: 'Entregado', done: true, date: '10/05' },
    ],
  },
];

export function Tracking() {
  const [searchNumber, setSearchNumber] = useState('');
  const [order, setOrder] = useState<typeof mockOrders[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const found = mockOrders.find((o) => o.orderNumber.toLowerCase() === searchNumber.toLowerCase());
    setOrder(found || null);
    setSearched(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregado':
        return <CheckCircle className="w-5 h-5 text-luxe-green" />;
      case 'enviado':
        return <Truck className="w-5 h-5 text-luxe-blue" />;
      default:
        return <Clock className="w-5 h-5 text-luxe-coral" />;
    }
  };

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-8">
          Rastrear Pedido
        </h1>

        <form onSubmit={handleSearch} className="flex gap-3 mb-12">
          <input
            type="text"
            value={searchNumber}
            onChange={(e) => setSearchNumber(e.target.value)}
            placeholder="Ingresa tu numero de orden"
            className="flex-1 px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none"
          />
          <Button type="submit" variant="primary">
            <Search className="w-4 h-4" />
            Buscar
          </Button>
        </form>

        {searched && !order && (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-luxe-gray mx-auto mb-4" />
            <p className="text-sm font-montserrat text-luxe-gray-medium">
              No encontramos ningun pedido con ese numero. Intenta nuevamente.
            </p>
          </div>
        )}

        {order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-luxe-gray-light p-6 md:p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-montserrat uppercase tracking-wider text-luxe-gray-medium mb-1">
                  Orden #{order.orderNumber}
                </p>
                <p className="text-sm font-montserrat text-luxe-gray-medium">
                  Fecha: {order.date}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="text-sm font-montserrat font-medium capitalize">{order.status}</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-4 left-0 right-0 h-0.5 bg-luxe-gray" />
              <div className="flex justify-between relative z-10">
                {order.steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.done
                          ? 'bg-luxe-black text-white'
                          : 'bg-white text-luxe-gray-medium border border-luxe-gray'
                      }`}
                    >
                      {index === 0 && <CheckCircle className="w-4 h-4" />}
                      {index === 1 && <Package className="w-4 h-4" />}
                      {index === 2 && <Truck className="w-4 h-4" />}
                      {index === 3 && <Home className="w-4 h-4" />}
                    </div>
                    <span className="text-[10px] font-montserrat uppercase tracking-wider mt-2 text-luxe-gray-medium">
                      {step.label}
                    </span>
                    <span className="text-[10px] font-montserrat text-luxe-gray-medium">
                      {step.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
