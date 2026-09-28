"use client";

import { useCallback, useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import { getErrorMessage } from "@/hooks/useInventory";
import type {
    ID,
    ApiMessageResponse,
    ApiDeleteResponse,
} from "@/types/inventory";
import type { SupplierPayload, SupplierInput } from "@/types/suppliers";

/**
 * Admin-only (the backend view is IsAdminUser), so requests carry the
 * access token like the other admin hooks.
 *
 * create/update/delete intentionally throw on failure — the component
 * catches them and shows the message next to the form or row that caused
 * it, using getErrorMessage. `error` here is just for the initial load.
 */
export function useSuppliers() {
    const [suppliers, setSuppliers] = useState<SupplierPayload[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<SupplierPayload[]>(
                routes.supplier.suppliers
            );
            setSuppliers(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load suppliers"));
        } finally {
            setLoading(false);
        }
    }, []);

    const createSupplier = useCallback(async (input: SupplierInput) => {
        const res = await apiFetch<ApiMessageResponse<SupplierPayload>>(
            routes.supplier.suppliers,
            { method: "POST", body: input }
        );
        // No default ordering on the model, so newest goes on top locally.
        setSuppliers((prev) => [res.data, ...prev]);
        return res.data;
    }, []);

    const updateSupplier = useCallback(
        async (id: ID, input: Partial<SupplierInput>) => {
            const res = await apiFetch<ApiMessageResponse<SupplierPayload>>(
                routes.supplier.supplier(id),
                { method: "PATCH", body: input }
            );
            // The PATCH response only echoes the editable fields (no id or
            // created_on), so merge it into the existing row rather than
            // replacing it.
            setSuppliers((prev) =>
                prev.map((s) => (s.id === id ? { ...s, ...res.data } : s))
            );
            return res.data;
        },
        []
    );

    const deleteSupplier = useCallback(async (id: ID) => {
        await apiFetch<ApiDeleteResponse>(routes.supplier.supplier(id), {
            method: "DELETE",
        });
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
    }, []);

    useEffect(() => {
        fetchSuppliers();
    }, [fetchSuppliers]);

    return {
        suppliers,
        loading,
        error,
        fetchSuppliers,
        createSupplier,
        updateSupplier,
        deleteSupplier,
    };
}