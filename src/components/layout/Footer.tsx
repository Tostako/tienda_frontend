import { Link } from 'react-router-dom';
import { Camera, Globe, MessageCircle } from 'lucide-react';
import { CATEGORIES } from '../../lib/constants';

const footerLinks = {
  comprar: [
    ...CATEGORIES.map((cat) => ({ label: cat.name, href: `/catalogo/${cat.slug}` })),
    { label: 'Ofertas', href: '/ofertas' },
  ],
  ayuda: [
    { label: 'Rastrear Pedido', href: '/seguimiento' },
    { label: 'Envios y Devoluciones', href: '/envios' },
    { label: 'Guia de Tallas', href: '/guia-de-tallas' },
    { label: 'Contacto', href: '/contacto' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-luxe-dark text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-xl font-montserrat font-bold tracking-[0.3em] mb-4">LUXE</h2>
            <p className="text-sm font-montserrat text-gray-400 leading-relaxed mb-6">
              Elegancia minimalista para tu estilo de vida. Moda premium seleccionada para quienes buscan lo exceptional.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Comprar */}
          <div>
            <h3 className="text-sm font-montserrat font-semibold uppercase tracking-wider mb-4">Comprar</h3>
            <ul className="space-y-3">
              {footerLinks.comprar.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-montserrat text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ayuda */}
          <div>
            <h3 className="text-sm font-montserrat font-semibold uppercase tracking-wider mb-4">Ayuda</h3>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm font-montserrat text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-sm font-montserrat font-semibold uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm font-montserrat text-gray-400">
              <li>Av. Providencia 1234, Santiago</li>
              <li>+56 2 2345 6789</li>
              <li>hola@luxe.cl</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-sm font-montserrat text-gray-500">
            &copy; 2026 LUXE. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
