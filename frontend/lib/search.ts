// lib/search.ts
// Client-side product search. The backend has no search endpoint, so we rank
// the public product list (already fetched by usePublicProducts) in the browser.

export interface SearchableProduct {
  id: number | string;
  name: string;
  description?: string | null;
  category?: number | string | null;
}

export interface SearchableCategory {
  id: number | string;
  name: string;
}

/** Lowercase, strip accents/punctuation, collapse whitespace. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** "gloves" -> "glove", so singular/plural both match. */
function stem(token: string): string {
  return token.length > 3 && token.endsWith("s") ? token.slice(0, -1) : token;
}

/**
 * Returns products matching every word in `query`, best matches first.
 * A word scores highest when it starts a word in the name, then anywhere in
 * the name, then in the category name, then in the description.
 */
export function searchProducts<T extends SearchableProduct>(
  products: T[],
  categories: SearchableCategory[],
  query: string,
  limit?: number
): T[] {
  const tokens = normalize(query).split(" ").filter(Boolean).map(stem);
  if (tokens.length === 0) return [];

  const categoryName = new Map(
    categories.map((c) => [String(c.id), normalize(c.name)])
  );

  const scored: { product: T; score: number; name: string }[] = [];

  for (const product of products) {
    const name = normalize(product.name);
    const description = normalize(product.description ?? "");
    const category =
      product.category != null
        ? categoryName.get(String(product.category)) ?? ""
        : "";

    let total = 0;
    let matchedAll = true;

    for (const token of tokens) {
      let score = 0;

      if (name.split(" ").some((word) => word.startsWith(token))) score = 4;
      else if (name.includes(token)) score = 3;
      else if (category.includes(token)) score = 2;
      else if (description.includes(token)) score = 1;

      if (score === 0) {
        matchedAll = false;
        break;
      }
      total += score;
    }

    if (matchedAll) scored.push({ product, score: total, name });
  }

  scored.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));

  const results = scored.map((s) => s.product);
  return limit ? results.slice(0, limit) : results;
}