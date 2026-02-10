import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * users:
 * {
 *   mor_2314: { role: "admin" },
 *   johnd: { role: "employee" }
 * }
 */

export const useUsersStore = create(
    persist(
        (set) => ({
            users: {},

            setUserRole: (username, role) =>
                set((state) => ({
                    users: {
                        ...state.users,
                        [username]: { role },
                    },
                })),

            getUserRole: (username) => {
                return username && username in useUsersStore.getState().users
                    ? useUsersStore.getState().users[username].role
                    : null;
            },
        }),
        {
            name: "users-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);
