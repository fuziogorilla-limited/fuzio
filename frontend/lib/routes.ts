const routes = {
    auth: {
        signup: "/api/users/sign-up/",
        login: "/api/users/login/",
        refresh: "/api/users/refresh/",
        user: "/api/users/user/",
        forgotPassword: "/api/users/forgot-password/",
        verifyCode: "/api/users/verify-code/",
    },

    inventory: {
        // Admin - Categories
        categories: "/api/inventory/category/",
        category: (id: number) => `/api/inventory/category/${id}/`,

        // Admin - Colors
        colors: "/api/inventory/color/",
        color: (id: number) => `/api/inventory/color/${id}/`,

        // Admin - Sizes
        sizes: "/api/inventory/size/",
        size: (id: number) => `/api/inventory/size/${id}/`,

        // Admin - Products
        products: "/api/inventory/product/",
        product: (id: number) => `/api/inventory/product/${id}/`,

        // Admin - Product Variants
        productVariants: "/api/inventory/product/variant/",
        productVariant: (id: number) =>
            `/api/inventory/product/variant/${id}/`,

        // Guest / Public
        guestProducts: "/api/inventory/guest/product/",
        publicCategories: "/api/inventory/guest/category/",
        guestProductVariants: "/api/inventory/guest/product/variants/",
    },
};

export default routes;