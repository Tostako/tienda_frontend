import { useState, useCallback, createContext, useContext, type ReactNode } from 'react';
import type { CartItem, Product } from '../types';
import { addToCart as addToCartBackend, createOrder } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface AppContextType {
  cart: CartItem[];
  addToCart: (product: Product, size: string) => void;
  removeFromCart: (productId: string | number, size: string) => void;
  updateQuantity: (productId: string | number, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  customer: Customer | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, customer: Customer) => void;
  logout: () => void;
  syncCart: () => void;
  createOrderFromCart: (notes?: string) => Promise<{ orderId: string; orderNumber: string; total: number } | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getInitialCustomer(): Customer | null {
  try {
    const raw = localStorage.getItem('luxe_customer');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getInitialToken(): string | null {
  try {
    return localStorage.getItem('luxe_token');
  } catch {
    return null;
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(getInitialCustomer);
  const [token, setToken] = useState<string | null>(getInitialToken);

  const isAuthenticated = Boolean(token && customer);

  const login = useCallback((newToken: string, newCustomer: Customer) => {
    localStorage.setItem('luxe_token', newToken);
    localStorage.setItem('luxe_customer', JSON.stringify(newCustomer));
    setToken(newToken);
    setCustomer(newCustomer);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('luxe_token');
    localStorage.removeItem('luxe_customer');
    setToken(null);
    setCustomer(null);
    setCart([]);
  }, []);

  const syncCart = useCallback(async () => {
    if (!token) return;
    try {
      // Por ahora, no sincronizamos el carrito del backend al estado local
      // porque el backend espera product_id y no tenemos el mapeo completo.
      // El carrito local funciona para usuarios autenticados también.
    } catch {
      // silent fail
    }
  }, [token]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToCart = useCallback(async (product: Product, size: string) => {
    if (token) {
      // Usuario autenticado: guardar en backend
      try {
        await addToCartBackend(token, String(product.id), 1);
      } catch {
        showToast('Error al agregar al carrito', 'error');
        return;
      }
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, size }];
    });
    showToast(`${product.name} agregado al carrito`);
  }, [token, showToast]);

  const removeFromCart = useCallback((productId: string | number, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.size === size)));
  }, []);

  const updateQuantity = useCallback((productId: string | number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId && item.size === size ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const createOrderFromCart = useCallback(async (notes?: string): Promise<{ orderId: string; orderNumber: string; total: number } | null> => {
    if (!token) {
      showToast('Debes iniciar sesion para crear un pedido', 'error');
      return null;
    }
    try {
      const order = await createOrder(token, { notes });
      if (order) {
        clearCart();
        return {
          orderId: order.id,
          orderNumber: order.order_number || order.id.slice(0, 8).toUpperCase(),
          total: order.total,
        };
      }
      return null;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error al crear el pedido';
      showToast(message, 'error');
      return null;
    }
  }, [token, showToast, clearCart]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
        toasts,
        showToast,
        removeToast,
        searchQuery,
        setSearchQuery,
        customer,
        token,
        isAuthenticated,
        login,
        logout,
        syncCart,
        createOrderFromCart,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
