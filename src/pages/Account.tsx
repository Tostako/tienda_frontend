
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { User, ShoppingBag, Package, Bell, ArrowRight } from 'lucide-react';

export function Account() {
  const navigate = useNavigate();
  const { customer, isAuthenticated, logout } = useApp();

  if (!isAuthenticated || !customer) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <User className="w-16 h-16 text-luxe-gray mx-auto mb-6" />
        <h1 className="text-2xl font-montserrat font-bold text-luxe-black mb-4">
          No has iniciado sesion
        </h1>
        <p className="text-sm font-montserrat text-luxe-gray-medium mb-8">
          Inicia sesion o crea una cuenta para acceder a tu perfil.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button onClick={() => navigate('/login')} variant="primary">
            Iniciar Sesion
          </Button>
          <Button onClick={() => navigate('/registro')} variant="outline">
            Crear Cuenta
          </Button>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: ShoppingBag,
      title: 'Carrito',
      description: 'Revisa los productos en tu carrito y finaliza tu compra.',
      href: '/carrito',
      color: 'text-luxe-blue',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Package,
      title: 'Mis Pedidos',
      description: 'Visualiza el estado de tus pedidos y su historial.',
      href: '/pedidos',
      color: 'text-luxe-green',
      bgColor: 'bg-green-50',
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Configura y revisa tus alertas y promociones.',
      href: '#notificaciones',
      color: 'text-luxe-coral',
      bgColor: 'bg-red-50',
    },
    {
      icon: User,
      title: 'Editar Cuenta',
      description: 'Actualiza tu informacion personal y direccion.',
      href: '#editar',
      color: 'text-luxe-black',
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-luxe-black flex items-center justify-center">
              <span className="text-xl font-montserrat font-bold text-white">
                {customer.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-montserrat font-bold text-luxe-black">
                {customer.name}
              </h1>
              <p className="text-sm font-montserrat text-luxe-gray-medium">
                {customer.email}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.href}
                className="group flex items-start gap-4 bg-luxe-gray-light p-6 hover:bg-luxe-gray transition-colors"
              >
                <div className={`w-12 h-12 ${item.bgColor} flex items-center justify-center flex-shrink-0`}>
                  <item.icon className={`w-6 h-6 ${item.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-montserrat font-bold uppercase tracking-wider text-luxe-black">
                      {item.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-luxe-gray-medium group-hover:text-luxe-black group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-xs font-montserrat text-luxe-gray-medium leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 text-center"
        >
          <Button onClick={logout} variant="outline">
            Cerrar Sesion
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
