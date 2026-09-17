"use client";

import { useEffect, useState } from "react";

import {
  CATEGORY_MESSAGES,
  EMPTY_CATEGORY_DRAFT,
} from "@/constants/category";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

import type {
  ApiError,
  Category,
  CategoryDraft,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types/fields";

function extractErrorMessage(
  error: unknown,
  fallback: string
): string {
  const apiError = error as ApiError;

  if (apiError?.data) {
    const firstKey = Object.keys(apiError.data)[0];

    if (firstKey) {
      const value = apiError.data[firstKey];

      if (
        Array.isArray(value) &&
        typeof value[0] === "string"
      ) {
        return value[0];
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  if (apiError?.message) {
    return apiError.message;
  }

  return fallback;
}

function buildCategoryFormData(
  draft: CategoryDraft
): FormData {
  const formData = new FormData();

  formData.append("name", draft.name.trim());
  formData.append(
    "description",
    draft.description.trim()
  );
  formData.append(
    "is_active",
    String(draft.is_active)
  );

  if (draft.image instanceof File) {
    formData.append("image", draft.image);
  }

  return formData;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(
    []
  );

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(
    null
  );

  const [deletingId, setDeletingId] = useState<number | null>(
    null
  );

  const [modalOpen, setModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState<
    "add" | "edit"
  >("add");

  const [editingId, setEditingId] = useState<number | null>(
    null
  );

  const [draft, setDraft] = useState<CategoryDraft>(
    EMPTY_CATEGORY_DRAFT
  );

  const [saving, setSaving] = useState(false);

  const [formError, setFormError] = useState<string | null>(
    null
  );

  /* =======================================================
     LOAD CATEGORIES
  ======================================================= */

  useEffect(() => {
    let cancelled = false;

    apiFetch<Category[]>(
      routes.inventory.categories
    )
      .then((data) => {
        if (!cancelled) {
          setCategories(data);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setLoadError(
            extractErrorMessage(
              error,
              CATEGORY_MESSAGES.loadError
            )
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  /* =======================================================
     OPEN ADD
  ======================================================= */

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);

    setDraft({
      ...EMPTY_CATEGORY_DRAFT,
    });

    setFormError(null);
    setModalOpen(true);
  };

  /* =======================================================
     OPEN EDIT
  ======================================================= */

  const openEditModal = (
    category: Category
  ) => {
    setModalMode("edit");
    setEditingId(category.id);

    /*
     * Important:
     *
     * Existing image is a URL string from Django.
     * CategoryDraft.image is File | null.
     *
     * We don't put the existing URL into the draft.
     * If the user doesn't select a new image, Django
     * keeps the existing image during PATCH.
     */
    setDraft({
      name: category.name,
      description: category.description,
      image: null,
      is_active: category.is_active,
    });

    setFormError(null);
    setModalOpen(true);
  };

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setFormError(null);
  };

  /* =======================================================
     UPDATE DRAFT
  ======================================================= */

  const updateDraft = <
    K extends keyof CategoryDraft
  >(
    key: K,
    value: CategoryDraft[K]
  ) => {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* =======================================================
     SAVE CATEGORY
  ======================================================= */

  const saveCategory = async () => {
    if (!draft.name.trim()) {
      setFormError(
        CATEGORY_MESSAGES.nameRequired
      );
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      if (modalMode === "add") {
        const payload: CreateCategoryPayload = {
          name: draft.name.trim(),
          description: draft.description.trim(),
          image: draft.image,
          is_active: draft.is_active,
        };

        const formData =
          buildCategoryFormData({
            ...draft,
            ...payload,
          });

        const response =
          await apiFetch<{
            message: string;
            category: Category;
          }>(
            routes.inventory.categories,
            {
              method: "POST",
              body: formData,
            }
          );

        setCategories((current) => [
          response.category,
          ...current,
        ]);
      }

      if (
        modalMode === "edit" &&
        editingId !== null
      ) {
        const payload: UpdateCategoryPayload = {
          name: draft.name.trim(),
          description: draft.description.trim(),
          image: draft.image,
          is_active: draft.is_active,
        };

        const formData =
          buildCategoryFormData({
            ...draft,
            ...payload,
          });

        const response =
          await apiFetch<{
            message: string;
            category: Category;
          }>(
            routes.inventory.category(
              editingId
            ),
            {
              method: "PATCH",
              body: formData,
            }
          );

        setCategories((current) =>
          current.map((category) =>
            category.id === editingId
              ? response.category
              : category
          )
        );
      }

      setModalOpen(false);
      setDraft({
        ...EMPTY_CATEGORY_DRAFT,
      });
    } catch (error) {
      setFormError(
        extractErrorMessage(
          error,
          CATEGORY_MESSAGES.saveError
        )
      );
    } finally {
      setSaving(false);
    }
  };

  /* =======================================================
     DELETE CATEGORY
  ======================================================= */

  const deleteCategory = async (
    id: number,
    name: string
  ) => {
    const confirmed = window.confirm(
      `Delete "${name}"? Products in this category won't be deleted.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);

    try {
      await apiFetch(
        routes.inventory.category(id),
        {
          method: "DELETE",
        }
      );

      setCategories((current) =>
        current.filter(
          (category) => category.id !== id
        )
      );
    } catch (error) {
      window.alert(
        extractErrorMessage(
          error,
          CATEGORY_MESSAGES.deleteError
        )
      );
    } finally {
      setDeletingId(null);
    }
  };

  return {
    categories,

    loading,
    loadError,

    deletingId,

    modalOpen,
    modalMode,
    editingId,

    draft,
    saving,
    formError,

    openAddModal,
    openEditModal,
    closeModal,

    updateDraft,
    saveCategory,
    deleteCategory,
  };
}