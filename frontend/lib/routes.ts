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
        detail: (orderNumber: string) => `/api/orders/orders/${orderNumber}/`,

        // TODO (backend): none of these three exist yet.
        // - adminList needs a GET handler on an admin-only view that returns all Orders.
        // - adminUpdateStatus needs a `status` field added to the Order model + a PATCH handler.
        // - adminStats needs a view that aggregates revenue / order counts / product counts.
        adminList: "/api/orders/admin/orders/",
        adminUpdateStatus: (id: number | string) => `/api/orders/admin/orders/${id}/`,
        adminStats: "/api/orders/admin/stats/",
    },

    inventory: {
        categories: "/api/inventory/categories/",
        products: "/api/inventory/products/",

        category: (id: number) => `/api/inventory/category/${id}/`,
        product: (id: number) => `/api/inventory/product/${id}/`,

        publicCategories: "/api/inventory/pb/categories/",
        publicProducts: "/api/inventory/pb/products/",
    },
};

export default routes;