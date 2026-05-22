import { useState, useEffect, useCallback } from 'react';
import {
  getCategories,
  getProducts,
  getProductById,
  getProductsByCategory,
  searchProducts,
  type BackendProduct,
  type BackendCategory,
} from '../services/api';

// Normalizar producto del backend: mapear image_url -> image
function normalizeProduct(p: BackendProduct): BackendProduct & { image: string } {
  return {
    ...p,
    image: p.image_url || p.image || '',
    category: p.category_name || p.category || 'General',
  };
}

// Normalizar categoría del backend
function normalizeCategory(c: BackendCategory): { id: string; name: string; image: string } {
  return {
    id: c.slug || String(c.id),
    name: c.name,
    image: c.image_url || c.image || '',
  };
}

export function useBackendCategories() {
  const [categories, setCategories] = useState<ReturnType<typeof normalizeCategory>[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories();
      setCategories(data?.map(normalizeCategory) ?? null);
    } catch (e) {
      setError('Error cargando categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useBackendProducts(category?: string) {
  const [products, setProducts] = useState<(BackendProduct & { image: string })[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: BackendProduct[] | null;
      if (category) {
        data = await getProductsByCategory(category);
      } else {
        data = await getProducts();
      }
      setProducts(data?.map(normalizeProduct) ?? null);
    } catch (e) {
      setError('Error cargando productos');
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
}

export function useBackendProduct(id: string | number) {
  const [product, setProduct] = useState<(BackendProduct & { image: string }) | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data ? normalizeProduct(data) : null);
    } catch (e) {
      setError('Error cargando producto');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading, error, refetch: fetchProduct };
}

export function useBackendSearch(query: string) {
  const [products, setProducts] = useState<(BackendProduct & { image: string })[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async () => {
    if (!query.trim()) {
      setProducts(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      setProducts(data?.map(normalizeProduct) ?? null);
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
