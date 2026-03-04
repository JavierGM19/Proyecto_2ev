import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product) => {
                if (!product?.id) return;

                const items = get().items;
                const existing = items.find((i) => i.id === product.id);

                if (existing) {
                    set({
                        items: items.map((i) =>
                            i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                        ),
                    });
                    return;
                }

                set({
                    items: [
                        ...items,
                        {
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            image: product.image,
                            quantity: 1,
                        },
                    ],
                });
            },

            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

            setQuantity: (id, quantity) => {
                const q = Number(quantity);
                if (!Number.isFinite(q)) return;

                const nextQ = Math.max(1, Math.floor(q));

                set({
                    items: get().items.map((i) =>
                        i.id === id ? { ...i, quantity: nextQ } : i
                    ),
                });
            },

            clearCart: () => set({ items: [] }),
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);
