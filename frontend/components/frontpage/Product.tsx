"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FaBoxOpen,
  FaWhatsapp,
} from "react-icons/fa";

import { useCart } from "@/context/CartContext";
import { PRODUCT } from "@/constants/products";
import { useProductData } from "@/hooks/useProductData";
import { formatPrice, mediaUrl, waLink } from "@/lib/utils";

export default function Product() {
  const params = useParams();
  const router = useRouter();

  const productId = Number(params.id);

  const { addToCart, openCart } = useCart();

  const {
    product,
    category,
    loading,
    error,
    notFound,
  } = useProductData(productId);

  const [qty, setQty] = useState(1);

  const changeQty = (delta: number) => {
    setQty((current) =>
      Math.max(1, current + delta)
    );
  };

  const handleAddToCart = () => {
    if (!product) return;

    const variant = product.variants[0];
    if (!variant) return;

    addToCart({
      pid: String(variant.id),
      name: product.name,
      price: Number(product.selling_price),
      size: product.variants[0]?.size || null,
      color: product.variants[0]?.color || null,
      qty,
    });

    openCart();
  };

  const handleBuyNow = () => {
    if (!product) return;

    const variant = product.variants[0];
    if (!variant) return;

    addToCart({
      pid: String(variant.id),
      name: product.name,
      price: Number(product.selling_price),
      size: product.variants[0]?.size || null,
      color: product.variants[0]?.color || null,
      qty,
    });

    router.push("/checkout");
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;

    let message =
      `Hello Fuzio Gorilla,\n\n` +
      `I would like to place an order.\n\n` +
      `Product:\n${product.name}\n`;

    if (product.variants[0]?.size) {
      message += `\nSize:\n${product.variants[0].size}\n`;
    }

    if (product.variants[0]?.color) {
      message += `\nColour:\n${product.variants[0].color}\n`;
    }

    message +=
      `\nQuantity:\n${qty}\n\n` +
      `Total:\n${formatPrice(
        Number(product.selling_price) * qty
      )}\n\n` +
      `Please confirm my order and delivery details.`;

    window.open(
      waLink(message),
      "_blank"
    );
  };

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

  if (error || notFound || !product) {
    return (
      <main className="w-full overflow-x-hidden bg-bg">
        <section className="px-4 py-16 text-center sm:px-6">
          <p className="mb-4 text-sm text-steel">
            {error
              ? PRODUCT.loadError
              : PRODUCT.notFound}
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 border-2 border-ink bg-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
          >
            Back to Home
          </Link>
        </section>
      </main>
    );
  }

  const image = mediaUrl(
    product.image ?? null
  );

  return (
    <main className="w-full overflow-x-hidden bg-bg">
      <section className="px-4 py-9 sm:px-6">
        <div className="mx-auto max-w-[1240px]">

          {/* Breadcrumb */}
          <div className="mb-5 text-xs font-semibold text-steel">
            <Link
              href="/"
              className="hover:text-accent-dark"
            >
              Home
            </Link>

            <span className="mx-1.5 opacity-50">
              /
            </span>

            {category ? (
              <Link
                href={`/category/${category.id}`}
                className="hover:text-accent-dark"
              >
                {category.name}
              </Link>
            ) : (
              <span>Category</span>
            )}

            <span className="mx-1.5 opacity-50">
              /
            </span>

            <span className="text-ink">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 items-start gap-11 md:grid-cols-2">

            {/* Gallery */}
            <div>
              <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-ink-2">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaBoxOpen className="text-6xl text-steel-light" />
                )}
              </div>

              {!image && (
                <p className="mt-2 text-center text-[11px] text-steel">
                  {PRODUCT.imageUnavailable}
                </p>
              )}
            </div>

            {/* Product details */}
            <div>
              <h1 className="mb-2 text-2xl font-black leading-tight tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h1>

              <div className="mb-1.5 font-mono text-xl font-bold text-ink sm:text-2xl">
                {formatPrice(
                  product.selling_price
                )}
              </div>

              <div className="mb-5 font-mono text-xs font-bold uppercase tracking-wide text-green">
                ✓ In Stock
              </div>

              <p className="mb-6 max-w-md text-sm leading-relaxed text-steel">
                {product.description}
              </p>

              {/* Size / Colour */}
              {(product.variants[0]?.size || product.variants[0]?.color) && (
                <div className="mb-6 flex flex-wrap gap-6">

                  {product.variants[0]?.size && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                        Size
                      </span>

                      <span className="inline-block border border-ink/15 bg-paper px-3.5 py-2 text-[13px] font-semibold">
                        {product.variants[0].size}
                      </span>
                    </div>
                  )}

                  {product.variants[0]?.color && (
                    <div>
                      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                        Colour
                      </span>

                      <span className="inline-block border border-ink/15 bg-paper px-3.5 py-2 text-[13px] font-semibold">
                        {product.variants[0].color}
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
                    type="button"
                    onClick={() =>
                      changeQty(-1)
                    }
                    className="flex h-10 w-9 items-center justify-center text-base font-bold hover:bg-bg"
                  >
                    −
                  </button>

                  <span className="w-11 text-center font-mono text-sm font-bold">
                    {qty}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      changeQty(1)
                    }
                    className="flex h-10 w-9 items-center justify-center text-base font-bold hover:bg-bg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex max-w-[340px] flex-col gap-2.5">

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full border-2 border-accent bg-accent py-3 text-[13px] font-bold uppercase tracking-wide text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="flex w-full items-center justify-center gap-2 bg-green py-3 text-[13px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#245530]"
                >
                  <FaWhatsapp />
                  Order on WhatsApp
                </button>
              </div>

              {/* Specifications */}
              <div className="mt-8 border-t border-ink/10 pt-5">
                <h5 className="mb-3 font-mono text-xs font-bold uppercase tracking-wide text-ink">
                  Specifications
                </h5>

                <table className="w-full border-collapse text-[13px]">
                  <tbody>
                    <tr className="border-b border-ink/5">
                      <td className="w-2/5 py-2 text-steel">
                        Category
                      </td>

                      <td className="py-2">
                        {category?.name ?? "—"}
                      </td>
                    </tr>

                    {product.variants[0]?.color && (
                      <tr className="border-b border-ink/5">
                        <td className="w-2/5 py-2 text-steel">
                          Colour
                        </td>

                        <td className="py-2">
                          {product.variants[0].color}
                        </td>
                      </tr>
                    )}

                    {product.variants[0]?.size && (
                      <tr className="border-b border-ink/5">
                        <td className="w-2/5 py-2 text-steel">
                          Size
                        </td>

                        <td className="py-2">
                          {product.variants[0].size}
                        </td>
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