const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://invetario-backned.onrender.com/api/v1';
const SHOP_SLUG = import.meta.env.VITE_SHOP_SLUG || '';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown> | object;
  headers?: Record<string, string>;
  token?: string | null;
}

function buildUrl(endpoint: string, queryParams?: Record<string, string>): string {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (SHOP_SLUG && !endpoint.startsWith('/auth')) {
    url.searchParams.set('shop_slug', SHOP_SLUG);
  }
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString().replace(window.location.origin, '');
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}, queryParams?: Record<string, string>): Promise<T | null> {
  const url = buildUrl(endpoint, queryParams);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (options.token) {
    headers['Authorization'] = `Bearer ${options.token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorJson = await response.json().catch(() => null);
      console.error(`API error ${response.status}:`, errorJson?.message || response.statusText);
      throw new Error(errorJson?.message || `Error ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    const json = await response.json();
    if (json && 'data' in json) {
      return json.data as T;
    }
    return json as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.error('API fetch error:', error);
    return null;
  }
}

// ─── Products (Public endpoints) ─────────────────────────

export interface BackendProduct {
  id: number | string;
  name: string;
  category: string;
  category_name?: string;
  price: number;
  image_url?: string;
  image?: string;
  images?: string[];
  description?: string;
  sizes?: string[];
  isNew?: boolean;
  isOffer?: boolean;
  originalPrice?: number;
  handle?: string;
  stock?: number;
}

export interface BackendCategory {
  id: number | string;
  name: string;
  slug: string;
  image?: string;
  image_url?: string;
}

export async function getProducts(): Promise<BackendProduct[] | null> {
  return apiFetch<BackendProduct[]>('/public/products');
}

export async function getProductById(id: string | number): Promise<BackendProduct | null> {
  return apiFetch<BackendProduct>(`/public/products/${id}`);
}

export async function getProductsByCategory(category: string): Promise<BackendProduct[] | null> {
  return apiFetch<BackendProduct[]>('/public/products', undefined, { category_id: category });
}

export async function searchProducts(query: string): Promise<BackendProduct[] | null> {
  return apiFetch<BackendProduct[]>('/public/products', undefined, { search: query });
}

// ─── Categories (Public endpoints) ───────────────────────

export async function getCategories(): Promise<BackendCategory[] | null> {
  return apiFetch<BackendCategory[]>('/public/categories');
}

// ─── Auth (Customer) ─────────────────────────────────────

export interface CustomerLoginData {
  email: string;
  password: string;
}

export interface CustomerRegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
}

export async function customerLogin(data: CustomerLoginData): Promise<AuthResponse | null> {
  return apiFetch<AuthResponse>('/auth/customer/login', {
    method: 'POST',
    body: { ...data, shop_slug: SHOP_SLUG },
  });
}

export async function customerRegister(data: CustomerRegisterData): Promise<AuthResponse | null> {
  return apiFetch<AuthResponse>('/auth/customer/register', {
    method: 'POST',
    body: { ...data, shop_slug: SHOP_SLUG },
  });
}

// ─── Cart ────────────────────────────────────────────────

export interface CartItemBackend {
  id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  total: number;
}

export interface CartData {
  items: CartItemBackend[];
  total: number;
}

export async function getCart(token: string): Promise<CartData | null> {
  return apiFetch<CartData>('/cart', { token });
}

export async function addToCart(token: string, productId: string | number, quantity: number = 1): Promise<CartData | null> {
  return apiFetch<CartData>('/cart/items', {
    method: 'POST',
    token,
    body: { product_id: productId, quantity },
  });
}

export async function updateCartItem(token: string, itemId: string, quantity: number): Promise<CartData | null> {
  return apiFetch<CartData>(`/cart/items/${itemId}`, {
    method: 'PATCH',
    token,
    body: { quantity },
  });
}

export async function removeCartItem(token: string, itemId: string): Promise<CartData | null> {
  return apiFetch<CartData>(`/cart/items/${itemId}`, {
    method: 'DELETE',
    token,
  });
}

// ─── Orders ──────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  quantity: number;
  discount?: number;
}

export interface CreateOrderData {
  notes?: string;
}

export interface OrderItemResponse {
  id: string;
  product_id: string;
  product_name?: string;
  product_sku?: string;
  quantity: number;
  unit_price: number;
  discount: number;
  subtotal: number;
  created_at: string;
}

export interface OrderResponse {
  id: string;
  order_number: string;
  status: string;
  total: number;
  customer_id: string;
  customer_name?: string | null;
  notes?: string;
  created_at: string;
  items?: OrderItemResponse[];
}

export async function createOrder(token: string, data?: CreateOrderData): Promise<OrderResponse | null> {
  return apiFetch<OrderResponse>('/orders', {
    method: 'POST',
    token,
    body: data || {},
  });
}

export async function getOrders(token: string): Promise<OrderResponse[] | null> {
  return apiFetch<OrderResponse[]>('/orders', { token });
}

export async function getMyOrders(token: string): Promise<OrderResponse[] | null> {
  return apiFetch<OrderResponse[]>('/orders/my-orders', { token });
}

export async function getOrderById(token: string, orderId: string): Promise<OrderResponse | null> {
  return apiFetch<OrderResponse>(`/orders/${orderId}`, { token });
}

// ─── Payments ────────────────────────────────────────────

export interface CardPaymentData {
  order_id: string;
  token: string; // token de Mercado Pago
  description: string;
  installments: number;
  payment_method_id: string;
  issuer_id: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
}

export interface PaymentResponse {
  status: string;
  payment_id?: string;
  external_resource_url?: string;
}

export async function payWithCard(token: string, data: CardPaymentData): Promise<PaymentResponse | null> {
  return apiFetch<PaymentResponse>('/payments/card', {
    method: 'POST',
    token,
    body: data,
  });
}

// ─── Health Check ────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string } | null> {
  const base = API_BASE_URL.replace('/api/v1', '');
  try {
    const response = await fetch(`${base}/health`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// ─── Offers (Public endpoint) ───────────────────────────

export interface OfferResponse {
  id: string;
  title: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  scope: 'storewide' | 'category' | 'product';
  code: string | null;
  starts_at: string;
  ends_at: string;
  product_name: string | null;
  category_name: string | null;
  product_image?: string | null;
  product_price?: number | null;
}

export async function getOffers(): Promise<OfferResponse[] | null> {
  return apiFetch<OfferResponse[]>('/public/offers');
}

// ─── Config check ────────────────────────────────────────

export function isBackendConfigured(): boolean {
  return Boolean(API_BASE_URL && SHOP_SLUG);
}
