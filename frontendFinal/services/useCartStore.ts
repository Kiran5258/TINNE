import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product } from "../types";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size?: string) => void;
  removeItem: (id: string, size?: string) => void;
  updateQuantity: (id: string, size: string | undefined, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  discount: number;
  appliedCode: string | null;
  applyDiscount: (percentage: number, code?: string) => void;
  removeDiscount: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, size) => {
        set((state) => {
          const sizeLabel =
            typeof size === "string"
              ? size
              : product.sizes?.[0]?.label ?? "";

          // calculate final price
          const finalPrice =
            product.offerPrice > 0
              ? product.price - (product.price * product.offerPrice) / 100
              : product.price;

          const existingIndex = state.items.findIndex(
            (item) =>
              item.id === product._id && item.selectedSize === sizeLabel
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated };
          }

          return {
            items: [
              ...state.items,
              {
                id: product._id,
                productName: product.productName,
                price: finalPrice,
                originalPrice: product.price,
                images: product.images,
                category: product.category,
                offerPrice: product.offerPrice,
                quantity: 1,
                selectedSize: sizeLabel,
              },
            ],
          };
        });
      },



      removeItem: (id, size) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !(item.id === id && item.selectedSize === size)
          ),
        })),

      updateQuantity: (id, size, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.selectedSize === size
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      getCartCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getCartTotal: () => {
        const subtotal = get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
        const discount = get().discount || 0;
        return subtotal - (subtotal * discount) / 100;
      },

      discount: 0,
      appliedCode: null,

      applyDiscount: (percentage, code) => set({ discount: percentage, appliedCode: code }),
      removeDiscount: () => set({ discount: 0, appliedCode: null }),
    }),
    {
      name: "tinne-cart-storage",
    }
  )
);
