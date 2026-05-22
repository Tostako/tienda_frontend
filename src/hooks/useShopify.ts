import { useState, useEffect, useCallback } from 'react';
import {
  getCollections,
  getProducts,
  getProductByHandle,
  searchProducts,
  isShopifyConfigured,
  type ShopifyProduct,
  type ShopifyCollection,
} from '../services/shopify';

// Helper to convert Shopify product to app Product type
function mapShopifyProduct(sp: ShopifyProduct): {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  sizes: string[];
  handle: string;
} {
  return {
    id: sp.id,
    name: sp.title,
    category: sp.collections?.edges[0]?.node.title || 'General',
    price: Math.round(parseFloat(sp.priceRange.minVariantPrice.amount)),
    image: sp.images.edges[0]?.node.url || '',
    description: sp.description,
    sizes: sp.variants.edges.map((v) => v.node.title).filter((s) => s !== 'Default Title'),
    handle: sp.handle,
  };
}

export function useShopifyCollections() {
  const [collections, setCollections] = useState<ShopifyCollection[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setCollections(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getCollections();
      setCollections(data);
    } catch (e) {
      setError('Error cargando categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  return { collections, loading, error, refetch: fetchCollections };
}

export function useShopifyProducts(collectionHandle?: string) {
  const [products, setProducts] = useState<ReturnType<typeof mapShopifyProduct>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!isShopifyConfigured()) {
      setProducts(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(20, collectionHandle);
      setProducts(data?.map(mapShopifyProduct) || []);
    } catch (e) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [collectionHandle]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useShopifyProduct(handle: string) {
  const [product, setProduct] = useState<ReturnType<typeof mapShopifyProduct> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!isShopifyConfigured() || !handle) {
      setProduct(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProductByHandle(handle);
      setProduct(data ? mapShopifyProduct(data) : null);
    } catch (e) {
      setError('Error cargando producto');
    } finally {
      setLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}

export function useShopifySearch(query: string) {
  const [products, setProducts] = useState<ReturnType<typeof mapShopifyProduct>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!isShopifyConfigured() || !query.trim()) {
      setProducts(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      setProducts(data?.map(mapShopifyProduct) || []);
    } catch (e) {
      setError('Error en la busqueda');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    search();
  }, [search]);

  return { products, loading, error, refetch: search };
}
