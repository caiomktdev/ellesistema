/** Mídias e tamanhos inspirados na vitrine da Movie Fitness */
export type ProductMedia = {
  primary: string;
  hover?: string;
  hoverVideo?: string;
  /** Grupos de tamanho exibidos no hover (ex.: conjuntos com parte de cima + baixo) */
  sizeGroups: { label?: string; sizes: string[] }[];
};

export const PRODUCT_MEDIA: Record<string, ProductMedia> = {
  "top-cropped-pulsar-ribana": {
    primary: "/products/top-cropped-1.webp",
    hover: "/products/top-cropped-2.png",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "legging-cintura-alta-compressao": {
    primary: "/products/legging-fondue-1.jpg",
    hover: "/products/legging-fondue-2.jpg",
    sizeGroups: [
      { label: "Parte de Cima", sizes: ["P", "M", "G"] },
      { label: "Parte de Baixo", sizes: ["P", "M", "G"] },
    ],
  },
  "conjunto-pulsar-verde-musgo": {
    primary: "/products/conjunto-fondue-1.png",
    hover: "/products/conjunto-fondue-2.png",
    sizeGroups: [
      { label: "Parte de Cima", sizes: ["P", "M", "G"] },
      { label: "Parte de Baixo", sizes: ["P", "M", "G"] },
    ],
  },
  "short-ciclista-mid-waist": {
    primary: "/products/short-preto-1.jpg",
    hover: "/products/short-preto-2.jpg",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "top-nadador-com-bojo": {
    primary: "/products/conjunto-off-1.jpg",
    hover: "/products/conjunto-off-2.jpg",
    sizeGroups: [
      { label: "Parte de Cima", sizes: ["P", "M", "G"] },
      { label: "Parte de Baixo", sizes: ["P", "M", "G"] },
    ],
  },
  "legging-flare-recortes": {
    primary: "/products/conjunto-preto-1.png",
    hover: "/products/conjunto-preto-2.png",
    sizeGroups: [
      { label: "Parte de Cima", sizes: ["P", "M", "G"] },
      { label: "Parte de Baixo", sizes: ["P", "M", "G"] },
    ],
  },
  "macacao-fitness-ziper": {
    primary: "/products/macaquinho-1.jpg",
    hoverVideo: "/products/macaquinho-hover.mp4",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "conjunto-khaki-premium": {
    primary: "/products/macacao-1.jpg",
    hover: "/products/macacao-2.jpg",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "legging-push-up-scrunch": {
    primary: "/products/legging-fondue-1.jpg",
    hover: "/products/legging-fondue-2.jpg",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "top-cropped-preto-basico": {
    primary: "/products/conjunto-preto-1.png",
    hover: "/products/conjunto-preto-2.png",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "short-cargo-fitness": {
    primary: "/products/short-preto-1.jpg",
    hover: "/products/short-preto-2.jpg",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
  "headband-pulsar": {
    primary: "/products/top-cropped-1.webp",
    hover: "/products/top-cropped-2.png",
    sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
  },
};

export const DEFAULT_PRODUCT_MEDIA: ProductMedia = {
  primary: "/products/conjunto-fondue-1.png",
  hover: "/products/conjunto-fondue-2.png",
  sizeGroups: [{ label: "Tamanho", sizes: ["P", "M", "G"] }],
};

export function getProductMedia(slug: string): ProductMedia {
  return PRODUCT_MEDIA[slug] ?? DEFAULT_PRODUCT_MEDIA;
}
