import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { showToast } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('Gracias por suscribirte a nuestro newsletter', 'success');
      setEmail('');
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-4">
            Suscríbete a nuestro Newsletter
          </h2>
          <p className="text-sm font-montserrat text-luxe-gray-medium mb-8 max-w-lg mx-auto">
            Recibe las últimas tendencias y ofertas exclusivas directamente en tu correo
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Tu correo electrónico"
              required
              className="flex-1 px-4 py-3 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none transition-colors"
            />
            <Button type="submit" variant="primary">
              Suscribirse
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
