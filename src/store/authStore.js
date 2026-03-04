import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            role: null,
            username: null,
            isLogged: false,

            setSession: ({ token, role = "USER", username = null }) => {
                set({
                    token,
                    role,
                    username,
                    isLogged: Boolean(token),
                });
            },

            logout: () => {
                set({
                    token: null,
                    role: null,
                    username: null,
                    isLogged: false,
                });
            },
        }),
        {
            name: "auth-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
