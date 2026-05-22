import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, UserPlus } from 'lucide-react';
import { customerRegister } from '../services/api';

export function Register() {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      showToast('Por favor completa todos los campos obligatorios', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('La contrasena debe tener al menos 6 caracteres', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Las contrasenas no coinciden', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await customerRegister({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phone: formData.phone.trim() || undefined,
        address: formData.address.trim() || undefined,
      });

      if (response && response.token && response.customer) {
        login(response.token, response.customer);
        showToast('Cuenta creada exitosamente', 'success');
        navigate('/cuenta');
      } else {
        showToast('Error al crear la cuenta', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear la cuenta';
      showToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-4">
            Crear Cuenta
          </h1>
          <p className="text-sm font-montserrat text-luxe-gray-medium">
            Registrate para acceder a promociones exclusivas y gestionar tus pedidos
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-luxe-gray-light p-8"
        >
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Nombre completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Maria Perez"
                  required
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Telefono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="3001234567"
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Direccion
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Calle 123, Ciudad"
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Contrasena *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Confirmar Contrasena *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Repite tu contrasena"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              <UserPlus className="w-4 h-4" />
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-montserrat text-luxe-gray-medium">
              Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-luxe-blue hover:underline font-medium"
              >
                Inicia sesion
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
