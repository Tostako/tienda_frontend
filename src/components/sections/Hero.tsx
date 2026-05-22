import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&h=1080&fit=crop"
          alt="Nueva Coleccion"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative z-10 text-center px-4"
      >
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-montserrat font-bold text-white tracking-wider uppercase mb-4">
          Nueva Coleccion
        </h2>
        <p className="text-lg md:text-xl font-montserrat text-white/90 mb-8 max-w-xl mx-auto">
          Elegancia minimalista para tu estilo de vida
        </p>
        <Link
          to="/catalogo"
          className="inline-flex items-center gap-2 bg-white text-luxe-black px-8 py-4 font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-luxe-blue hover:text-white transition-all duration-300"
        >
          Explorar Ahora
          <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    </section>
  );
}
