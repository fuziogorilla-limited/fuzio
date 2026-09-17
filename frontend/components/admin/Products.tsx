"use client";

import { FaBoxOpen, FaEdit, FaPlus, FaSearch, FaSpinner, FaTimes, FaTrash } from "react-icons/fa";

import { PRODUCT_MESSAGES } from "@/constants/products";
import { useProducts } from "@/hooks/useProducts";

export default function Products() {
  const {
    categories,
    filteredProducts,

    loading,
    loadError,

    search,
    setSearch,

    categoryFilter,
    setCategoryFilter,

    deletingId,

    modalOpen,
    modalMode,

    draft,
    updateDraft,

    saving,
    formError,

    categoryName,

    openAddModal,
    openEditModal,
    closeModal,

    handleSubmit,
    handleDelete,
  } = useProducts();

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2 border border-ink/15 bg-paper px-3 py-2.5 sm:max-w-[280px]">
          <FaSearch
            className="shrink-0 text-steel"
            size={13}
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products…"
            className="w-full min-w-0 bg-transparent text-[13px] outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value === "all"
                ? "all"
                : Number(event.target.value)
            )
          }
          className="border border-ink/15 bg-paper px-3 py-2.5 text-[13px] font-medium outline-none"
        >
          <option value="all">All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={openAddModal}
          className="ml-auto flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
        >
          <FaPlus size={11} />
          Add Product
        </button>
      </div>

      {/* Load error */}
      {loadError && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {loadError}
        </p>
      )}

      {/* Products table */}
      <div className="border border-ink/10 bg-paper">
        {/* Loading */}
        {loading && (
          <div className="p-5">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0"
                />
              )
            )}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !loadError &&
          filteredProducts.length === 0 && (
            <p className="p-5 text-[13px] text-steel">
              {PRODUCT_MESSAGES.empty}
            </p>
          )}

        {/* Table */}
        {!loading &&
          !loadError &&
          filteredProducts.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-[13px]">
                <thead>
                  <tr className="border-b border-ink/10 text-left text-[11px] font-bold uppercase tracking-wide text-steel">
                    <th className="px-4 py-3 sm:px-5">
                      Product
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Category
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Price
                    </th>

                    <th className="px-4 py-3 sm:px-5">
                      Stock
                    </th>

                    <th className="px-4 py-3 text-right sm:px-5">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-ink/5 last:border-none hover:bg-bg"
                    >
                      {/* Product */}
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-steel-light">
                            <FaBoxOpen size={15} />
                          </div>

                          <span className="max-w-[180px] truncate font-semibold">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3 text-steel sm:px-5">
                        {categoryName(product.category)}
                      </td>

                      {/* Price */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold sm:px-5">
                        KES{" "}
                        {Number(
                          product.selling_price
                        ).toLocaleString("en-KE")}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3 sm:px-5">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                            product.total_quantity > 0
                              ? "bg-green/15 text-green"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {product.total_quantity > 0
                            ? `${product.total_quantity} in stock`
                            : "Out of stock"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 sm:px-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(product)
                            }
                            aria-label={`Edit ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                          >
                            <FaEdit size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                product.id,
                                product.name
                              )
                            }
                            disabled={
                              deletingId === product.id
                            }
                            aria-label={`Delete ${product.name}`}
                            className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-accent-dark hover:text-accent-dark disabled:opacity-50"
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/50 px-4 py-8"
          onClick={closeModal}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-[560px] border border-ink/10 bg-paper"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h3 className="text-[15px] font-extrabold text-ink">
                {modalMode === "add"
                  ? "Add Product"
                  : "Edit Product"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="text-steel hover:text-ink"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-5"
            >
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Name
                </label>

                <input
                  type="text"
                  autoFocus
                  value={draft.name}
                  onChange={(event) =>
                    updateDraft(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Industrial Overall"
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Category
                </label>

                <select
                  value={draft.category}
                  onChange={(event) =>
                    updateDraft(
                      "category",
                      event.target.value === ""
                        ? ""
                        : Number(event.target.value)
                    )
                  }
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(event) =>
                    updateDraft(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Short description shown on the storefront"
                  className="w-full resize-none border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Buying Price (KES)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.buying_price}
                    onChange={(event) =>
                      updateDraft(
                        "buying_price",
                        event.target.value
                      )
                    }
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Selling Price (KES)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={draft.selling_price}
                    onChange={(event) =>
                      updateDraft(
                        "selling_price",
                        event.target.value
                      )
                    }
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Product attributes */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Color
                  </label>

                  <input
                    type="text"
                    value={draft.color}
                    onChange={(event) =>
                      updateDraft(
                        "color",
                        event.target.value
                      )
                    }
                    placeholder="Navy"
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Size
                  </label>

                  <input
                    type="text"
                    value={draft.size}
                    onChange={(event) =>
                      updateDraft(
                        "size",
                        event.target.value
                      )
                    }
                    placeholder="M"
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={draft.quantity}
                    onChange={(event) =>
                      updateDraft(
                        "quantity",
                        event.target.value
                      )
                    }
                    className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                  />
                </div>
              </div>

              {/* Visibility */}
              <div className="flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={draft.is_active}
                    onChange={(event) =>
                      updateDraft(
                        "is_active",
                        event.target.checked
                      )
                    }
                  />

                  Active (visible on storefront)
                </label>

                <label className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
                  <input
                    type="checkbox"
                    checked={draft.feature}
                    onChange={(event) =>
                      updateDraft(
                        "feature",
                        event.target.checked
                      )
                    }
                  />

                  Featured on homepage
                </label>
              </div>

              {/* Form error */}
              {formError && (
                <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
                  {formError}
                </p>
              )}

              {/* Actions */}
              <div className="mt-1 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="flex-1 border-2 border-ink/15 py-2.5 text-[12px] font-bold uppercase tracking-wide text-steel transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 border-2 border-ink bg-ink py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && (
                    <FaSpinner
                      className="animate-spin"
                      size={12}
                    />
                  )}

                  {saving
                    ? "Saving…"
                    : modalMode === "add"
                      ? "Add Product"
                      : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}