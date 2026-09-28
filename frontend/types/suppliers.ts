import type { ID } from "./inventory";

/**
 * SupplierSerializers (fields = "__all__") -> users.models.Suppliers.
 * `email` and `product` are nullable on the model, so they can come back null.
 */
export interface SupplierPayload {
    id: ID;
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string;
    product: string | null;
    created_on: string; // ISO datetime
}

/**
 * SupplierEditSerializers — used for both POST and PATCH.
 *
 * `email` and `product` are null=True but not blank=True on the model, so
 * DRF rejects empty strings for them. Send `null` (or omit the key) to
 * leave them empty — never "".
 */
export interface SupplierInput {
    first_name: string;
    last_name: string;
    phone_number: string;
    email?: string | null;
    product?: string | null;
}