import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, ProductVariant } from "@/types/product";

export interface CartItem {
  product: Product;
  variant?: ProductVariant;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant?: ProductVariant, cantidad?: number) => boolean;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, cantidad: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
  getItemStock: (productId: string, variantId?: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, variant, cantidad = 1) => {
        const maxStock = variant?.stock ?? product.stock ?? 0;
        if (maxStock <= 0) {
          // Producto agotado, no agregar
          return false;
        }

        let pudoAgregar = true;

        set((state) => {
          const existente = state.items.find(
            (item) => item.product.id === product.id && item.variant?.id === variant?.id
          );

          if (existente) {
            if (existente.cantidad >= maxStock) {
              pudoAgregar = false;
              return { items: state.items, isOpen: true };
            }
            const nuevaCantidad = Math.min(existente.cantidad + cantidad, maxStock);
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variant?.id === variant?.id
                  ? { ...item, cantidad: nuevaCantidad }
                  : item
              ),
              isOpen: true,
            };
          }

          const cantidadInicial = Math.min(cantidad, maxStock);
          return {
            items: [...state.items, { product, variant, cantidad: cantidadInicial }],
            isOpen: true,
          };
        });

        return pudoAgregar;
      },

      removeItem: (productId, variantId) => {
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.product.id === productId && item.variant?.id === variantId)
          ),
        }));
      },

      updateQuantity: (productId, cantidad, variantId) => {
        set((state) => ({
          items: state.items.map((item) => {
            if (item.product.id === productId && item.variant?.id === variantId) {
              const maxStock = item.variant?.stock ?? item.product.stock ?? 999;
              return {
                ...item,
                cantidad: Math.min(Math.max(1, cantidad), maxStock),
              };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => {
          const precioUnitario = item.product.precio + (item.variant?.precioAdicional ?? 0);
          return total + precioUnitario * item.cantidad;
        }, 0);
      },

      getItemsCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },

      getItemStock: (productId, variantId) => {
        const item = get().items.find(
          (i) => i.product.id === productId && i.variant?.id === variantId
        );
        return item ? item.product.stock : 0;
      },
    }),
    {
      name: "xiorizos-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
