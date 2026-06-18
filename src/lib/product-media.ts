export type ProductMedia = {
  primary: string;
  hover?: string;
  sizeGroups: { label?: string; sizes: string[] }[];
};

export const PRODUCT_MEDIA: Record<string, ProductMedia> = {
  "kit-4-camisas-brancas": {
    primary: "/products/camisa-branca.png",
    sizeGroups: [],
  },
  "kit-2-camisas-brancas": {
    primary: "/products/camisa-branca.png",
    sizeGroups: [],
  },
  "kit-4-camisas-pretas": {
    primary: "/products/camisa-preta.png",
    sizeGroups: [],
  },
  "kit-2-camisas-pretas": {
    primary: "/products/camisa-preta.png",
    sizeGroups: [],
  },
  "kit-4-camisas-ofwhite": {
    primary: "/products/camisa-ofwhite.png",
    sizeGroups: [],
  },
  "kit-2-camisas-ofwhite": {
    primary: "/products/camisa-ofwhite.png",
    sizeGroups: [],
  },
  "kit-4-camisas-azul-marinho": {
    primary: "/products/camisa-preta.png",
    sizeGroups: [],
  },
  "kit-2-camisas-azul-marinho": {
    primary: "/products/camisa-preta.png",
    sizeGroups: [],
  },
};

export const DEFAULT_PRODUCT_MEDIA: ProductMedia = {
  primary: "/products/camisa-branca.png",
  sizeGroups: [],
};

export function getProductMedia(slug: string): ProductMedia {
  return PRODUCT_MEDIA[slug] ?? DEFAULT_PRODUCT_MEDIA;
}
