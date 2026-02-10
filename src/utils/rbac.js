export const ROLES = {
    GUEST: "guest",
    USER: "user",
    EMPLOYEE: "employee",
    ADMIN: "admin",
};

export const PERMISSIONS = {
    CART_USE: "cart:use",
    CHECKOUT: "checkout",
    PRODUCT_VISIBILITY: "product:visibility",
    USER_MANAGE: "user:manage",
};

export const ROLE_PERMISSIONS = {
    [ROLES.GUEST]: [],
    [ROLES.USER]: [PERMISSIONS.CART_USE, PERMISSIONS.CHECKOUT],
    [ROLES.EMPLOYEE]: [PERMISSIONS.CART_USE, PERMISSIONS.CHECKOUT, PERMISSIONS.PRODUCT_VISIBILITY],
    [ROLES.ADMIN]: [
        PERMISSIONS.CART_USE,
        PERMISSIONS.CHECKOUT,
        PERMISSIONS.PRODUCT_VISIBILITY,
        PERMISSIONS.USER_MANAGE,
    ],
};

export function can(role, permission) {
    const perms = ROLE_PERMISSIONS[role] || [];
    return perms.includes(permission);
}
