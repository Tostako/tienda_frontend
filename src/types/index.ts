export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: number;
  image: string;
  description?: string;
  sizes?: string[];
  isNew?: boolean;
  isOffer?: boolean;
  originalPrice?: number;
  handle?: string;
}

export interface CartItem extends Product {
  quantity: number;
  size: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Benefit {
  icon: string;
  title: string;
  description: string;
  color: string;
}

export interface Order {
  orderNumber: string;
  date: string;
  status: string;
  total: number;
  items: CartItem[];
}
