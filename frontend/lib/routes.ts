const routes = {
    auth: {
        signup: "/api/users/sign-up/",
        login: "/api/users/login/",
        refresh: "/api/users/refresh/",
        user: "/api/users/user/",
        forgotPassword: "/api/users/forgot-password/",
        verifyCode: "/api/users/verify-code/",
    },

    cart: {
        create: "/api/orders/carts/",
        detail: (cartId: string) => `/api/orders/carts/${cartId}/`,
        items: (cartId: string) => `/api/orders/carts/${cartId}/items/`,
    },

    orders: {
        create: "/api/orders/orders/",
        detail: (orderNumber: string) =>
            `/api/orders/orders/${orderNumber}/`,
    },

    inventory: {
        categories: "/api/inventory/categories/",
        products: "/api/inventory/products/",

        category: (id: number) =>
            `/api/inventory/category/${id}/`,

        product: (id: number) =>
            `/api/inventory/product/${id}/`,

        publicCategories: "/api/inventory/pb/categories/",
        publicProducts: "/api/inventory/pb/products/",
    },
};

export default routes;