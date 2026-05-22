import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { customerLogin } from '../services/api';

export function Login() {
  const navigate = useNavigate();
  const { login, showToast } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const response = await customerLogin({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (response && response.token && response.customer) {
        login(response.token, response.customer);
        showToast('Inicio de sesion exitoso', 'success');
        navigate('/cuenta');
      } else {
        showToast('Error al iniciar sesion', 'error');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al iniciar sesion';
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
            Iniciar Sesion
          </h1>
          <p className="text-sm font-montserrat text-luxe-gray-medium">
            Accede a tu cuenta para gestionar tus pedidos y favoritos
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-luxe-gray-light p-8"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-montserrat font-medium text-luxe-black mb-2">
                Email
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
                Contrasena
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-luxe-gray-medium" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Tu contrasena"
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
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
            </Button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm font-montserrat text-luxe-gray-medium">
              No tienes cuenta?{' '}
              <Link
                to="/registro"
                className="text-luxe-blue hover:underline font-medium"
              >
                Registrate
              </Link>
            </p>
          </div>
        </motion.form>
      </div>
    </div>
  );
}
