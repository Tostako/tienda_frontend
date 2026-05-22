export const CATEGORIES = [
  { id: 'camisetas', name: 'Camisetas', slug: 'camisetas' },
  { id: 'pantalones', name: 'Pantalones', slug: 'pantalones' },
  { id: 'vestidos', name: 'Vestidos', slug: 'vestidos' },
  { id: 'zapatos', name: 'Zapatos', slug: 'zapatos' },
];

export const MAIN_NAV_CATEGORIES = CATEGORIES.slice(0, 2);
export const MORE_CATEGORIES = CATEGORIES.slice(2);

export const ALL_CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);
export const ALL_CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
