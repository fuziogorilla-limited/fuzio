// components/SearchBar.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaBoxOpen, FaWhatsapp, FaArrowRight } from "react-icons/fa";

import { mediaUrl, waLink } from "@/lib/utils";
import {
  searchProducts,
  type SearchableCategory,
  type SearchableProduct,
} from "@/lib/search";

const MAX_SUGGESTIONS = 6;

type SearchProduct = SearchableProduct & { image?: string | null };

export default function SearchBar({
  products,
  categories,
  loading = false,
  inputClassName = "bg-ink-2",
  onNavigate,
}: {
  products: SearchProduct[];
  categories: SearchableCategory[];
  loading?: boolean;
  /** Background of the input box, so it suits the surface it sits on. */
  inputClassName?: string;
  /** Called after navigating (e.g. to close the mobile menu). */
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const trimmed = query.trim();

  const results = useMemo(
    () => searchProducts(products, categories, trimmed, MAX_SUGGESTIONS),
    [products, categories, trimmed]
  );

  const categoryName = useMemo(
    () => new Map(categories.map((c) => [String(c.id), c.name])),
    [categories]
  );

  // Close the dropdown when clicking anywhere outside the search bar.
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function finish(path: string) {
    router.push(path);
    setOpen(false);
    setActive(-1);
    onNavigate?.();
  }

  function submit() {
    finish(
      trimmed
        ? `/all-products?q=${encodeURIComponent(trimmed)}`
        : "/all-products"
    );
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (event.key === "Escape") {
      setOpen(false);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const picked = results[active];
      if (picked) finish(`/product/${picked.id}`);
      else submit();
    }
  }

  const showDropdown = open && trimmed.length > 0;

  return (
    <div ref={containerRef} className="relative w-full min-w-0">
      <div
        className={`flex min-w-0 items-center gap-2 rounded-sm border border-white/15 px-3 ${inputClassName}`}
      >
        <button
          type="button"
          aria-label="Search"
          onClick={submit}
          className="shrink-0 text-[13px] opacity-60 transition-opacity hover:opacity-100"
        >
          <FaSearch />
        </button>

        <input
          type="text"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="What are you looking for?"
          className="w-full min-w-0 bg-transparent px-2 py-2.5 text-[13px] text-paper outline-none placeholder:text-steel-light"
        />
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-white/10 bg-ink-2 shadow-2xl">
          {results.length > 0 ? (
            <ul role="listbox">
              {results.map((product, index) => (
                <li key={product.id} role="option" aria-selected={index === active}>
                  <Link
                    href={`/product/${product.id}`}
                    onClick={() => finish(`/product/${product.id}`)}
                    onMouseEnter={() => setActive(index)}
                    className={`flex items-center gap-3 px-3 py-2.5 ${
                      index === active ? "bg-ink" : ""
                    }`}
                  >
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden bg-ink">
                      {product.image ? (
                        <Image
                          src={mediaUrl(product.image)!}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-steel">
                          <FaBoxOpen size={14} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-bold text-paper">
                        {product.name}
                      </div>
                      {product.category != null &&
                        categoryName.get(String(product.category)) && (
                          <div className="truncate font-mono text-[10px] uppercase tracking-[0.08em] text-steel-light">
                            {categoryName.get(String(product.category))}
                          </div>
                        )}
                    </div>
                  </Link>
                </li>
              ))}

              <li className="border-t border-white/10">
                <button
                  type="button"
                  onClick={submit}
                  className="flex w-full items-center justify-between px-3 py-2.5 text-left font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-accent hover:bg-ink"
                >
                  See all results for &ldquo;{trimmed}&rdquo;
                  <FaArrowRight size={10} />
                </button>
              </li>
            </ul>
          ) : loading ? (
            <p className="px-3 py-3 text-[12.5px] text-steel-light">
              Searching…
            </p>
          ) : (
            <div className="px-3 py-3">
              <p className="text-[12.5px] text-steel-light">
                No products found for &ldquo;{trimmed}&rdquo;.
              </p>
              <a
                href={waLink(
                  `Hello Fuzio Gorilla, do you have or can you source: ${trimmed}?`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.06em] text-accent hover:text-paper"
              >
                <FaWhatsapp />
                Ask us, we can source it
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}