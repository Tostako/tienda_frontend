import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { featuredProducts } from '../../data/products';
import { useBackendProducts } from '../../hooks/useBackend';
import { formatPrice } from '../../lib/utils';
import { motion } from 'framer-motion';

export function FeaturedProducts() {
  const { products: backendProducts } = useBackendProducts();

  // Use backend products if available, otherwise fallback to local featured products
  const displayProducts = backendProducts && backendProducts.length > 0
    ? backendProducts.slice(0, 4)
    : featuredProducts;

  return (
    <section className="bg-luxe-gray-light py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-montserrat font-bold text-center uppercase tracking-wider text-luxe-black mb-12"
        >
          Productos Destacados
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={`/producto/${product.handle || product.id}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <h3 className="text-sm font-montserrat font-medium text-luxe-black group-hover:text-luxe-blue transition-colors mb-1">
                  {product.name}
                </h3>
                <p className="text-xs font-montserrat text-luxe-gray-medium uppercase tracking-wider mb-2">
                  {product.category}
                </p>
                <p className="text-sm font-montserrat font-semibold text-luxe-black">
                  {formatPrice(product.price)}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 border-2 border-luxe-black text-luxe-black px-8 py-3 font-montserrat font-medium text-sm uppercase tracking-wider hover:bg-luxe-black hover:text-white transition-all duration-300"
          >
            Ver Todo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
