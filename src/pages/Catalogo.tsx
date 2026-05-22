import { useState, useMemo } from 'react';
import { useSearchParams, Link, useParams } from 'react-router-dom';
import { products as localProducts } from '../data/products';
import { useBackendProducts, useBackendSearch, useBackendCategories } from '../hooks/useBackend';
import { formatPrice } from '../lib/utils';
import { CATEGORIES } from '../lib/constants';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';

export function Catalogo() {
  const [searchParams] = useSearchParams();
  const { category } = useParams<{ category?: string }>();
  const searchQuery = searchParams.get('search') || '';

  const [priceRange, setPriceRange] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('relevancia');
  const [showFilters, setShowFilters] = useState(false);

  const { categories: backendCategories } = useBackendCategories();

  // Resolve category display name from backend first, then local fallback
  const currentCategoryName = useMemo(() => {
    if (searchQuery) return `Resultados para "${searchQuery}"`;
    if (!category || category === 'todos') return 'Catalogo';

    const backendCat = backendCategories?.find((c) => c.id === category);
    if (backendCat) return backendCat.name;

    const localCat = CATEGORIES.find((c) => c.slug === category);
    if (localCat) return localCat.name;

    return category;
  }, [category, searchQuery, backendCategories]);

  // Backend integration: pass category param directly (UUID or slug/name)
  const { products: backendProducts } = useBackendProducts(
    category && category !== 'todos' ? category : undefined
  );
  const { products: searchResults } = useBackendSearch(searchQuery);

  // Determine product source: backend first, then local fallback
  const rawProducts = useMemo(() => {
    if (searchQuery && searchResults && searchResults.length > 0) return searchResults;
    if (searchQuery && !searchResults) {
      const q = searchQuery.toLowerCase();
      return localProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      ).map((p) => ({ ...p, handle: String(p.id) }));
    }
    if (backendProducts !== null) return backendProducts;
    return localProducts.map((p) => ({ ...p, handle: String(p.id) }));
  }, [searchQuery, searchResults, backendProducts]);

  const filteredProducts = useMemo(() => {
    let result = [...rawProducts];

    // Local fallback filtering when backend is down and we have a local slug
    if (backendProducts === null && !searchQuery && category && category !== 'todos') {
      const selectedCatName = CATEGORIES.find((c) => c.slug === category)?.name;
      if (selectedCatName) {
        result = result.filter((p) => p.category === selectedCatName);
      }
    }

    if (priceRange !== 'todos') {
      const [min, max] = priceRange.split('-').map(Number);
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    switch (sortBy) {
      case 'precio-menor':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'precio-mayor':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'nombre':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [rawProducts, category, priceRange, sortBy, searchQuery, backendProducts]);

  const priceRanges = [
    { value: 'todos', label: 'Todos' },
    { value: '0-30000', label: 'Hasta $30.000' },
    { value: '30000-70000', label: '$30.000 - $70.000' },
    { value: '70000-150000', label: '$70.000 - $150.000' },
  ];

  const isCategoryPage = Boolean(category && category !== 'todos' && !searchQuery);

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-montserrat font-bold uppercase tracking-wider text-luxe-black mb-2">
            {currentCategoryName}
          </h1>
          <p className="text-sm font-montserrat text-luxe-gray-medium">
            {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-montserrat font-medium uppercase tracking-wider text-luxe-black hover:text-luxe-blue transition-colors lg:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtros
          </button>

          <div className="hidden lg:flex items-center gap-2">
            {priceRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => setPriceRange(range.value)}
                className={`px-3 py-1 text-xs font-montserrat uppercase tracking-wider border transition-colors ${
                  priceRange === range.value
                    ? 'bg-luxe-black text-white border-luxe-black'
                    : 'bg-white text-luxe-black border-luxe-gray hover:border-luxe-black'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 font-montserrat text-sm border border-luxe-gray focus:border-luxe-blue focus:outline-none bg-white"
          >
            <option value="relevancia">Relevancia</option>
            <option value="precio-menor">Precio: Menor a Mayor</option>
            <option value="precio-mayor">Precio: Mayor a Menor</option>
            <option value="nombre">Nombre</option>
          </select>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden mb-8 p-4 bg-luxe-gray-light">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-montserrat font-semibold uppercase">Precio</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setPriceRange(range.value)}
                  className={`px-3 py-1 text-xs font-montserrat uppercase tracking-wider border transition-colors ${
                    priceRange === range.value
                      ? 'bg-luxe-black text-white border-luxe-black'
                      : 'bg-white text-luxe-black border-luxe-gray hover:border-luxe-black'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <Link to={`/producto/${product.handle || product.id}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-gray-200">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {'isNew' in product && product.isNew && (
                      <span className="absolute top-3 left-3 bg-luxe-black text-white text-[10px] font-montserrat font-bold uppercase tracking-wider px-2 py-1">
                        Nuevo
                      </span>
                    )}
                    {'isOffer' in product && product.isOffer && (
                      <span className="absolute top-3 right-3 bg-luxe-coral text-white text-[10px] font-montserrat font-bold uppercase tracking-wider px-2 py-1">
                        Oferta
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-montserrat font-medium text-luxe-black group-hover:text-luxe-blue transition-colors mb-1">
                    {product.name}
                  </h3>
                  <p className="text-xs font-montserrat text-luxe-gray-medium uppercase tracking-wider mb-2">
                    {product.category}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-montserrat font-semibold text-luxe-black">
                      {formatPrice(product.price)}
                    </p>
                    {'originalPrice' in product && product.originalPrice && (
                      <p className="text-xs font-montserrat text-luxe-gray-medium line-through">
                        {formatPrice(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-montserrat text-luxe-gray-medium">
              {isCategoryPage
                ? 'No hay productos en esta categoria'
                : 'No se encontraron productos'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
