export interface ProductVariant {
  id: string;
  nombre: string;
  precioAdicional: number;
  stock: number;
}

export interface ProductReview {
  id: string;
  autor: string;
  calificacion: number;
  comentario: string;
  fecha: string;
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  costo?: number;
  marca: string;
  categoria: string;
  imagenUrl: string;
  imagenesGaleria: string[];
  variantes: ProductVariant[];
  stock: number;
  rating: number;
  reseñasCount: number;
  reseñas?: ProductReview[];
}
