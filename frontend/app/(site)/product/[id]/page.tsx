"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FaBoxOpen, FaWhatsapp } from "react-icons/fa";
import { useCart } from "@/context/CartContext";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

const WHATSAPP_NUMBER = "254700000000"; // E.164 without '+' — keep in sync with other pages

// Mirrors PublicProductSerializer: excludes quantity, date_added, buying_price.
// NOTE: the Product model has no "image" field at all, and color/size are
// single strings, not lists — so there's nothing to build a swatch picker
// from. If you want real photos and multiple size/color options per
// product, that needs an `image` field on Product plus (likely) a separate
// ProductVariant model on the backend.
type Product = {
  id: number;
  category: number;
  name: string;
  description: string;
  selling_price: string;
  color: string;
  size: string;
  is_active: boolean;
  feature: boolean;
};

type Category = {
  id: number;
  name: string;
  description: string;
  image: string | null;
};

function fmt(price: string) {
  return "KES " + Number(price).toLocaleString("en-KE");
}

function waLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  const { addToCart, openCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [qty, setQty] = useState(1);

  useEffect(() => {
    let cancelled = false;

    apiFetch<Product[]>(routes.inventory.publicProducts)
      .then((products) => {
        if (cancelled) return;
        const found = products.find((p) => p.id === productId && p.is_active) || null;
        if (!found) {
          setNotFound(true);
          return;
        }
        setProduct(found);

        return apiFetch<Category[]>(routes.inventory.publicCategories).then((cats) => {
          if (cancelled) return;
          setCategory(cats.find((c) => c.id === found.category) || null);
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const changeQty = (delta: number) => setQty((q) => Math.max(1, q + delta));

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      pid: String(product.id),
      name: product.name,
      price: Number(product.selling_price),
      size: product.size || null,
      color: product.color || null,
      qty,
    });
    openCart();
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart({
      pid: String(product.id),
      name: product.name,
      price: Number(product.selling_price),
      size: product.size || null,
      color: product.color || null,
      qty,
    });
    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    let msg = `Hello Fuzio Gorilla,\n\nI would like to place an order.\n\nProduct:\n${product.name}\n`;
    if (product.size) msg += `\nSize:\n${product.size}\n`;
    if (product.color) msg += `\nColour:\n${product.color}\n`;
    msg += `\nQuantity:\n${qty}\n\nTotal:\n${fmt(String(Number(product.selling_price) * qty))}\n\nPlease confirm my order and delivery details.`;
    window.open(waLink(msg), "_blank");
  };

  // ---------- Loading state ----------
  if (loading) {
    return (
      <main className="w-full overflow-x-hidden bg-bg">
        <section className="px-4 py-9 sm:px-6">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid grid-cols-1 gap-11 md:grid-cols-2">
              <div className="aspect-square w-full animate-pulse bg-ink-2" />
              <div>
                <div className="mb-3 h-8 w-3/4 animate-pulse bg-paper" />
                <div className="mb-6 h-6 w-1/3 animate-pulse bg-paper" />
                <div className="h-24 w-full animate-pulse bg-paper" />
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ---------- Error / not found ----------
  if (error || notFound || !product) {
    return (
      <main className="w-full overflow-x-hidden bg-bg">
        <section className="px-4 py-16 text-center sm:px-6">
          <p className="mb-4 text-sm text-steel">
            {error ? "Couldn't load this product right now. Please try again shortly." : "We couldn't find that product."}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink"
          >
            Back to Home
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">
          {/* Breadcrumb */}
          <div className="mb-5 text-xs font-semibold text-steel">
            <Link href="/" className="hover:text-accent-dark">
              Home
            </Link>
            <span className="mx-1.5 opacity-50">/</span>
            {category ? (
              <Link href={`/category/${category.id}`} className="hover:text-accent-dark">
                {category.name}
              </Link>
            ) : (
              <span>Category</span>
            )}
            <span className="mx-1.5 opacity-50">/</span>
            <span className="text-ink">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-2">
            {/* Gallery */}
            <div>
              <div className="flex aspect-square w-full items-center justify-center bg-ink-2">
                <FaBoxOpen className="text-6xl text-steel-light" />
              </div>
              <p className="mt-2 text-center text-[11px] text-steel">
                Product photos aren&apos;t available yet — this needs an image field on the backend.
              </p>
            </div>

            {/* Details */}
            <div>
              <h1 className="mb-2 text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h1>
              <div className="mb-1.5 font-mono text-xl font-bold text-ink sm:text-2xl">
                {fmt(product.selling_price)}
              </div>
              <div className="mb-5 font-mono text-xs font-bold uppercase tracking-wide text-green">
                ✓ In Stock
              </div>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-steel">{product.description}</p>

              {/* Size / Colour (single value from backend — not a picker) */}
              {(product.size || product.color) && (
                <div className="mb-6 flex flex-wrap gap-6">
                  {product.size && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                        Size
                      </span>
                      <span className="inline-block border border-ink/15 bg-paper px-3.5 py-2 text-[13px] font-semibold">
                        {product.size}
                      </span>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                        Colour
                      </span>
                      <span className="inline-block border border-ink/15 bg-paper px-3.5 py-2 text-[13px] font-semibold">
                        {product.color}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Quantity
                </span>
                <div className="flex w-fit items-center border-[1.5px] border-ink/15">
                  <button
                    onClick={() => changeQty(-1)}
                    className="flex h-10 w-9 items-center justify-center text-base font-bold hover:bg-bg"
                  >
                    −
                  </button>
                  <span className="w-11 text-center font-mono text-sm font-bold">{qty}</span>
                  <button
                    onClick={() => changeQty(1)}
                    className="flex h-10 w-9 items-center justify-center text-base font-bold hover:bg-bg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex max-w-[340px] flex-col gap-2.5">
                <button
                  onClick={handleAddToCart}
                  className="w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="w-full border-2 border-accent bg-accent py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleWhatsAppOrder}
                  className="flex w-full items-center justify-center gap-2 bg-green py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
                >
                  <FaWhatsapp /> Order on WhatsApp
                </button>
              </div>

              {/* Specs */}
              <div className="mt-8 border-t border-ink/10 pt-5">
                <h5 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide text-ink">
                  Specifications
                </h5>
                <table className="w-full border-collapse text-[13px]">
                  <tbody>
                    <tr className="border-b border-ink/5">
                      <td className="w-2/5 py-2 text-steel">Category</td>
                      <td className="py-2">{category?.name ?? "—"}</td>
                    </tr>
                    {product.color && (
                      <tr className="border-b border-ink/5">
                        <td className="w-2/5 py-2 text-steel">Colour</td>
                        <td className="py-2">{product.color}</td>
                      </tr>
                    )}
                    {product.size && (
                      <tr className="border-b border-ink/5">
                        <td className="w-2/5 py-2 text-steel">Size</td>
                        <td className="py-2">{product.size}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}