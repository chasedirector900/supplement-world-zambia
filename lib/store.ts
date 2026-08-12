import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  addLine: (productId: string, size: string, quantity?: number) => void;
  removeLine: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addLine: (productId, size, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === productId && l.size === size
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId && l.size === size
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
              isOpen: true,
            };
          }
          return {
            lines: [...state.lines, { productId, size, quantity }],
            isOpen: true,
          };
        }),
      removeLine: (productId, size) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.productId === productId && l.size === size)
          ),
        })),
      updateQuantity: (productId, size, quantity) =>
        set((state) => ({
          lines: state.lines
            .map((l) =>
              l.productId === productId && l.size === size
                ? { ...l, quantity }
                : l
            )
            .filter((l) => l.quantity > 0),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "swz-cart",
      partialize: (state) => ({ lines: state.lines }),
    }
  )
);
