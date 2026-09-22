import type { Product } from "@/types/product";
import type { Service, Professional } from "@/types/appointment";
import type { HairColorTone } from "@/types/simulator";

export const mockProducts: Product[] = [
  {
    id: "p1",
    nombre: "Tinte Permanente Nutricolor",
    descripcion: "Coloración permanente con aceites nutritivos, cobertura total de canas.",
    precio: 18.5,
    marca: "Biokera",
    categoria: "Tintes",
    imagenUrl: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600",
    imagenesGaleria: [],
    variantes: [
      { id: "v1", nombre: "Rubio cenizo 8.1", precioAdicional: 0, stock: 12 },
      { id: "v2", nombre: "Castaño chocolate 5.3", precioAdicional: 0, stock: 8 },
    ],
    stock: 20,
    rating: 4.6,
    reseñasCount: 34,
  },
  {
    id: "p2",
    nombre: "Mascarilla Reconstructora",
    descripcion: "Tratamiento intensivo para cabello dañado por procesos químicos.",
    precio: 24.9,
    marca: "Kerastase",
    categoria: "Tratamientos",
    imagenUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600",
    imagenesGaleria: [],
    variantes: [{ id: "v3", nombre: "250ml", precioAdicional: 0, stock: 15 }],
    stock: 15,
    rating: 4.8,
    reseñasCount: 51,
  },
  {
    id: "p3",
    nombre: "Shampoo Matizador Violeta",
    descripcion: "Neutraliza tonos amarillos en cabellos decolorados o rubios.",
    precio: 15.0,
    marca: "Wella",
    categoria: "Shampoo",
    imagenUrl: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600",
    imagenesGaleria: [],
    variantes: [],
    stock: 30,
    rating: 4.4,
    reseñasCount: 22,
  },
  {
    id: "p4",
    nombre: "Aceite de Argán Capilar",
    descripcion: "Sellador de puntas, brillo y control de frizz.",
    precio: 12.0,
    marca: "Biokera",
    categoria: "Tratamientos",
    imagenUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=600",
    imagenesGaleria: [],
    variantes: [],
    stock: 40,
    rating: 4.7,
    reseñasCount: 18,
  },
];

export const mockServices: Service[] = [
  { id: "s1", nombre: "Corte de cabello", descripcion: "Corte y estilizado", duracionMin: 45, precio: 15, categoria: "Corte" },
  { id: "s2", nombre: "Coloración completa", descripcion: "Tinte de raíz a puntas", duracionMin: 120, precio: 45, categoria: "Color" },
  { id: "s3", nombre: "Mechas / Balayage", descripcion: "Técnica de iluminación", duracionMin: 150, precio: 60, categoria: "Color" },
  { id: "s4", nombre: "Tratamiento capilar", descripcion: "Hidratación profunda", duracionMin: 60, precio: 25, categoria: "Tratamiento" },
];

export const mockProfessionals: Professional[] = [
  { id: "pr1", nombre: "Andrea Salazar", especialidad: "Colorimetría", serviciosIds: ["s2", "s3"] },
  { id: "pr2", nombre: "Carlos Peña", especialidad: "Cortes y estilizado", serviciosIds: ["s1", "s4"] },
  { id: "pr3", nombre: "Xiomara Rodríguez", especialidad: "Fundadora / Colorimetría avanzada", serviciosIds: ["s1", "s2", "s3", "s4"] },
];

export const mockHairTones: HairColorTone[] = [
  { id: "t1", nombre: "Rubio platino", hex: "#E8D9B5", familia: "rubios" },
  { id: "t2", nombre: "Rubio ceniza", hex: "#C9B896", familia: "rubios" },
  { id: "t3", nombre: "Castaño chocolate", hex: "#4A2E1F", familia: "castaños" },
  { id: "t4", nombre: "Castaño claro", hex: "#7B5433", familia: "castaños" },
  { id: "t5", nombre: "Rojo cobrizo", hex: "#8B3A1F", familia: "rojos" },
  { id: "t6", nombre: "Borgoña", hex: "#5C1A2E", familia: "rojos" },
  { id: "t7", nombre: "Negro azabache", hex: "#1B1B1B", familia: "negros" },
  { id: "t8", nombre: "Lila fantasía", hex: "#B48CD6", familia: "fantasia" },
];
