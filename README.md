
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
│  │  │  ├─ 0002_alter_category_image.py
│  │  │  ├─ 0003_alter_product_size.py
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
│     │  ├─ 0002_customuser_expiry_customuser_token_and_more.py
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
   │  │  ├─ layout.tsx
   │  │  └─ page.tsx
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
   │  ├─ category
   │  │  └─ [id]
   │  │     └─ page.tsx
   │  ├─ checkout
   │  │  └─ page.tsx
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
   │     ├─ Footer.tsx
   │     ├─ Frontpage.tsx
   │     └─ Header.tsx
   ├─ context
   │  ├─ CartContext.tsx
   │  └─ CartDrawer.tsx
   ├─ eslint.config.mjs
   ├─ lib
   │  ├─ api.ts
   │  └─ routes.ts
   ├─ next-env.d.ts
   ├─ next.config.ts
   ├─ package.json
   ├─ pnpm-lock.yaml
   ├─ pnpm-workspace.yaml
   ├─ postcss.config.mjs
   ├─ public
   │  └─ globe.svg
   ├─ test.html
   └─ tsconfig.json

```