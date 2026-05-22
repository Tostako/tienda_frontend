const SHOPIFY_DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN || '';
const STOREFRONT_TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '';

const API_URL = SHOPIFY_DOMAIN
  ? `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`
  : '';

interface ShopifyResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  if (!API_URL || !STOREFRONT_TOKEN) {
    console.warn('Shopify credentials not configured. Using local data.');
    return null;
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error('Shopify API error:', response.status, response.statusText);
      return null;
    }

    const json: ShopifyResponse<T> = await response.json();

    if (json.errors) {
      console.error('Shopify GraphQL errors:', json.errors);
      return null;
    }

    return json.data || null;
  } catch (error) {
    console.error('Shopify fetch error:', error);
    return null;
  }
}

// Queries
export async function getCollections() {
  const query = `
    query GetCollections {
      collections(first: 20) {
        edges {
          node {
            id
            title
            handle
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    collections: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
          image?: { url: string; altText?: string };
        };
      }>;
    };
  }>(query);

  return data?.collections.edges.map((edge) => edge.node) || null;
}

export async function getProducts(first = 20, collectionHandle?: string) {
  let query: string;

  if (collectionHandle) {
    query = `
      query GetProductsByCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            edges {
              node {
                id
                title
                handle
                description
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                variants(first: 1) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
                    }
                  }
                }
                collections(first: 1) {
                  edges {
                    node {
                      title
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  } else {
    query = `
      query GetProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                  }
                }
              }
              collections(first: 1) {
                edges {
                  node {
                    title
                  }
                }
              }
            }
          }
        }
      }
    `;
  }

  const variables = collectionHandle
    ? { handle: collectionHandle, first }
    : { first };

  const data = await shopifyFetch<{
    products?: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
    collection?: {
      products: {
        edges: Array<{
          node: ShopifyProduct;
        }>;
      };
    };
  }>(query, variables);

  if (collectionHandle) {
    return data?.collection?.products.edges.map((edge) => edge.node) || null;
  }
  return data?.products?.edges.map((edge) => edge.node) || null;
}

export async function getProductByHandle(handle: string) {
  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
        collections(first: 1) {
          edges {
            node {
              title
              handle
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    product: ShopifyProduct;
  }>(query, { handle });

  return data?.product || null;
}

export async function searchProducts(queryStr: string, first = 20) {
  const query = `
    query SearchProducts($query: String!, $first: Int!) {
      products(first: $first, query: $query) {
        edges {
          node {
            id
            title
            handle
            description
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 1) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 1) {
              edges {
                node {
                  id
                  title
                  availableForSale
                }
              }
            }
            collections(first: 1) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  }>(query, { query: queryStr, first });

  return data?.products.edges.map((edge) => edge.node) || null;
}

// Types
export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText?: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price?: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
  collections?: {
    edges: Array<{
      node: {
        title: string;
        handle?: string;
      };
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  image?: { url: string; altText?: string };
}

// Check if Shopify is configured
export function isShopifyConfigured(): boolean {
  return Boolean(SHOPIFY_DOMAIN && STOREFRONT_TOKEN);
}
