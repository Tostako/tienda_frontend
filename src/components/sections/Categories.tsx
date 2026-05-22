import { Link } from 'react-router-dom';
import { categories as localCategories } from '../../data/products';
import { useBackendCategories } from '../../hooks/useBackend';
import { motion } from 'framer-motion';

export function Categories() {
  const { categories: backendCategories } = useBackendCategories();

  // Use backend categories if available, otherwise fallback to local categories
  const displayCategories = backendCategories && backendCategories.length > 0
    ? backendCategories
    : localCategories;

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl font-montserrat font-bold text-center uppercase tracking-wider text-luxe-black mb-12"
        >
          Compra por Categoria
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Link
                to={`/catalogo/${category.id}`}
                className="group relative block aspect-[3/4] overflow-hidden bg-gray-200"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl md:text-3xl font-montserrat font-bold text-white uppercase tracking-wider">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
