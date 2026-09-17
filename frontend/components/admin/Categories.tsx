"use client";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaThLarge,
  FaTimes,
  FaSpinner,
  FaImage,
} from "react-icons/fa";

import { CATEGORY_MESSAGES } from "@/constants/category";
import { useCategories } from "@/hooks/useCategories";

import type { Category } from "@/types/fields";

export default function Categories() {
  const {
    categories,
    loading,
    loadError,

    deletingId,

    modalOpen,
    modalMode,
    draft,
    saving,
    formError,

    openAddModal,
    openEditModal,
    closeModal,
    updateDraft,
    saveCategory,
    deleteCategory,
  } = useCategories();

  /*
   * Keep the component aware of the backend category shape.
   *
   * Category:
   * - id
   * - name
   * - description
   * - image
   * - is_active
   * - date_added
   *
   * CreateCategoryPayload / UpdateCategoryPayload:
   * - name
   * - description
   * - image
   * - is_active
   */
  const typedCategories: Category[] = categories;

  return (
    <div className="w-full min-w-0">
      {/* Toolbar */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <span className="text-[12.5px] text-steel">
          {typedCategories.length} categor
          {typedCategories.length === 1 ? "y" : "ies"}
        </span>

        <button
          type="button"
          onClick={openAddModal}
          className="flex shrink-0 items-center gap-2 border-2 border-ink bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink"
        >
          <FaPlus size={11} />
          Add Category
        </button>
      </div>

      {/* Load error */}
      {loadError && (
        <p className="mb-5 border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
          {loadError}
        </p>
      )}

      {/* Categories */}
      <div className="border border-ink/10 bg-paper">
        {loading && (
          <div className="p-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="mb-3 h-12 w-full animate-pulse bg-bg last:mb-0"
              />
            ))}
          </div>
        )}

        {!loading &&
          !loadError &&
          typedCategories.length === 0 && (
            <p className="p-5 text-[13px] text-steel">
              {CATEGORY_MESSAGES.empty}
            </p>
          )}

        {!loading &&
          !loadError &&
          typedCategories.length > 0 && (
            <ul>
              {typedCategories.map((category) => (
                <li
                  key={category.id}
                  className="flex flex-wrap items-center gap-3 border-b border-ink/5 px-4 py-3 last:border-none sm:px-5"
                >
                  {/* Category image / fallback icon */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden bg-ink-2 text-steel-light">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaThLarge size={15} />
                    )}
                  </div>

                  {/* Name */}
                  <span className="min-w-0 shrink-0 basis-[160px] truncate text-[13.5px] font-bold">
                    {category.name}
                  </span>

                  {/* Description */}
                  <span className="min-w-0 flex-1 truncate text-[12.5px] text-steel">
                    {category.description || "No description"}
                  </span>

                  {/* Status */}
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-wide ${
                      category.is_active
                        ? "bg-green/15 text-green"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {category.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                  {/* Actions */}
                  <div className="ml-auto flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditModal(category)
                      }
                      aria-label={`Edit ${category.name}`}
                      className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-ink hover:text-ink"
                    >
                      <FaEdit size={13} />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteCategory(
                          category.id,
                          category.name
                        )
                      }
                      disabled={
                        deletingId === category.id
                      }
                      aria-label={`Delete ${category.name}`}
                      className="flex h-8 w-8 items-center justify-center border border-ink/15 text-steel hover:border-accent-dark hover:text-accent-dark disabled:opacity-50"
                    >
                      {deletingId === category.id ? (
                        <FaSpinner
                          className="animate-spin"
                          size={12}
                        />
                      ) : (
                        <FaTrash size={12} />
                      )}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </div>

      {/* Add / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 px-4"
          onClick={closeModal}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            className="w-full max-w-[440px] border border-ink/10 bg-paper"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
              <h3 className="text-[15px] font-extrabold text-ink">
                {modalMode === "add"
                  ? "Add Category"
                  : "Edit Category"}
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
              onSubmit={(event) => {
                event.preventDefault();
                saveCategory();
              }}
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
                  placeholder="e.g. Workwear"
                  className="w-full border border-ink/15 bg-paper px-3 py-2.5 text-[13.5px] outline-none focus:border-ink"
                />
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

              {/* Image */}
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                  Category Image
                </label>

                <label className="flex cursor-pointer items-center gap-3 border border-dashed border-ink/20 bg-bg px-3 py-3 transition-colors hover:border-ink/40">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-ink-2 text-steel-light">
                    {draft.image ? (
                      <img
                        src={
                          typeof draft.image === "string"
                            ? draft.image
                            : URL.createObjectURL(
                                draft.image
                              )
                        }
                        alt="Category preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FaImage size={15} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="block text-[12px] font-bold text-ink">
                      Choose image
                    </span>

                    <span className="block truncate text-[10.5px] text-steel">
                      JPG, PNG or WebP
                    </span>
                  </div>

                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      const file =
                        event.target.files?.[0] ?? null;

                      updateDraft("image", file);
                    }}
                  />
                </label>

                {draft.image && (
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft("image", null)
                    }
                    className="mt-1.5 text-[11px] font-semibold text-steel hover:text-accent-dark"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Active */}
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
                      ? "Add Category"
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