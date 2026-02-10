import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * users shape:
 * {
 *   "mor_2314": { role: "admin" }, 
 *  username: mor_2314
    password: 83r5^_
 *   "johnd": { role: "employee" }
 * }
 */

export const useAuthStore = create(
    persist(
        (set, get) => ({
            users: {},

            /**
             * Asegura que el usuario exista en el store.
             * Si no existe, se crea con rol "user".
             */
            ensureUser: (username) => {
                if (!username) return;

                const users = get().users;
                if (users[username]) return;

                set({
                    users: {
                        ...users,
                        [username]: { role: "user" },
                    },
                });
            },

            /**
             * Asigna un rol a un usuario existente.
             */
            setUserRole: (username, role) => {
                if (!username || !role) return;

                const users = get().users;
                if (!users[username]) return;

                set({
                    users: {
                        ...users,
                        [username]: { role },
                    },
                });
            },

            /**
             * Obtiene el rol de un usuario.
             * Devuelve null si no existe.
             */
            getUserRole: (username) => {
                if (!username) return null;
                const users = get().users;
                return users[username]?.role ?? null;
            },
        }),
        {
            name: "users-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
