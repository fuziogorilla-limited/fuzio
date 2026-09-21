
```
fuzio
├─ README.md
├─ backend
│  ├─ .env
│  ├─ backend
│  │  ├─ __init__.py
│  │  ├─ asgi.py
│  │  ├─ settings.py
│  │  ├─ urls.py
│  │  └─ wsgi.py
│  ├─ db.sqlite3
│  ├─ fuzio.dbdiagram
│  ├─ fuzio.dbml
│  ├─ inventory
│  │  ├─ __init__.py
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  └─ views.py
│  ├─ manage.py
│  ├─ orders
│  │  ├─ __init__.py
│  │  ├─ admin.py
│  │  ├─ apps.py
│  │  ├─ migrations
│  │  │  ├─ 0001_initial.py
│  │  │  └─ __init__.py
│  │  ├─ models.py
│  │  ├─ serializers.py
│  │  ├─ tests.py
│  │  ├─ urls.py
│  │  └─ views.py
│  ├─ requirements.txt
│  ├─ static
│  │  └─ images
│  └─ users
│     ├─ __init__.py
│     ├─ admin.py
│     ├─ apps.py
│     ├─ migrations
│     │  ├─ 0001_initial.py
│     │  └─ __init__.py
│     ├─ models.py
│     ├─ serializers.py
│     ├─ tests.py
│     ├─ urls.py
│     └─ views.py
└─ frontend
   ├─ .env
   ├─ AGENTS.md
   ├─ CLAUDE.md
   ├─ README.md
   ├─ app
   │  ├─ (site)
   │  │  ├─ about
   │  │  │  └─ page.tsx
   │  │  ├─ category
   │  │  │  └─ [id]
   │  │  │     └─ page.tsx
   │  │  ├─ checkout
   │  │  │  └─ page.tsx
   │  │  ├─ contact
   │  │  │  └─ page.tsx
   │  │  ├─ layout.tsx
   │  │  ├─ page.tsx
   │  │  └─ product
   │  │     └─ [id]
   │  │        └─ page.tsx
   │  ├─ admin
   │  │  ├─ categories
   │  │  │  └─ page.tsx
   │  │  ├─ dashboard
   │  │  │  └─ page.tsx
   │  │  ├─ layout.tsx
   │  │  ├─ login
   │  │  │  └─ page.tsx
   │  │  ├─ orders
   │  │  │  └─ page.tsx
   │  │  └─ products
   │  │     └─ page.tsx
   │  ├─ globals.css
   │  └─ layout.tsx
   ├─ components
   │  ├─ admin
   │  │  ├─ Categories.tsx
   │  │  ├─ Dashboard.tsx
   │  │  ├─ Login.tsx
   │  │  ├─ Orders.tsx
   │  │  └─ Products.tsx
   │  └─ frontpage
   │     ├─ About.tsx
   │     ├─ CartDrawer.tsx
   │     ├─ Category.tsx
   │     ├─ Checkout.tsx
   │     ├─ Contact.tsx
   │     ├─ Footer.tsx
   │     ├─ Header.tsx
   │     └─ Home.tsx
   ├─ constants
   │  ├─ about.ts
   │  ├─ admin-auth.ts
   │  ├─ admin-dashboard.ts
   │  ├─ cart.ts
   │  ├─ category.ts
   │  ├─ checkout.ts
   │  ├─ contact.ts
   │  ├─ footer.ts
   │  ├─ home.ts
   │  ├─ navigation.ts
   │  ├─ orders.ts
   │  ├─ products.ts
   │  └─ site.ts
   ├─ context
   │  └─ CartContext.tsx
   ├─ dev.md
   ├─ eslint.config.mjs
   ├─ hooks
   │  ├─ useAdminAuth.ts
   │  ├─ useAdminDashboard.ts
   │  ├─ useCategories.ts
   │  ├─ useCategoryData.ts
   │  ├─ useCheckout.ts
   │  ├─ useHomeData.ts
   │  ├─ useOrders.ts
   │  └─ useProducts.ts
   ├─ lib
   │  ├─ api.ts
   │  ├─ routes.ts
   │  └─ utils.ts
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ package.json
   ├─ pnpm-lock.yaml
   ├─ pnpm-workspace.yaml
   ├─ postcss.config.mjs
   ├─ project-readme.md
   ├─ public
   │  ├─ globe.svg
   │  └─ ppe-optimized.mp4
   ├─ test.html
   ├─ tsconfig.json
   └─ types
      ├─ about.ts
      ├─ admin-auth.ts
      ├─ admin.ts
      ├─ cart.ts
      ├─ category.ts
      ├─ checkout.ts
      ├─ contact.ts
      ├─ home.ts
      ├─ order.ts
      └─ product.ts

```