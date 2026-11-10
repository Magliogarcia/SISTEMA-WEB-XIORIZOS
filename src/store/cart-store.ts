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
  addItem: (product: Product, variant?: ProductVariant, cantidad?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, cantidad: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemsCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, variant, cantidad = 1) => {
        set((state) => {
          const existente = state.items.find(
            (item) => item.product.id === product.id && item.variant?.id === variant?.id
          );
          if (existente) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id && item.variant?.id === variant?.id
                  ? { ...item, cantidad: item.cantidad + cantidad }
                  : item
              ),
              isOpen: true,
            };
          }
          return { items: [...state.items, { product, variant, cantidad }], isOpen: true };
        });
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
          items: state.items.map((item) =>
            item.product.id === productId && item.variant?.id === variantId
              ? { ...item, cantidad: Math.max(1, cantidad) }
              : item
          ),
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
    }),
    {
      name: "xiorizos-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
