"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
    FaEdit,
    FaPhoneAlt,
    FaPlus,
    FaTimes,
    FaTrash,
    FaTruck,
    FaWhatsapp,
} from "react-icons/fa";

import { useSuppliers } from "@/hooks/useSupplier";
import { getErrorMessage } from "@/hooks/useInventory";
import type { SupplierInput, SupplierPayload } from "@/types/suppliers";

const inputClass =
    "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent";

const labelClass =
    "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-steel";

type FormState = {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    product: string;
};

const emptyForm: FormState = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    product: "",
};

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("en-KE", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

/** Best-effort normalisation of a Kenyan number for a wa.me link (07... -> 2547...). */
function toWhatsappNumber(phone: string): string {
    const digits = phone.replace(/\D/g, "");
    if (digits.startsWith("0")) return `254${digits.slice(1)}`;
    return digits;
}

function ErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-semibold text-red-700">
            {message}
        </div>
    );
}

export default function Suppliers() {
    const {
        suppliers,
        loading,
        error,
        createSupplier,
        updateSupplier,
        deleteSupplier,
    } = useSuppliers();

    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<FormState>(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(
        null
    );
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    const visibleSuppliers = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return suppliers;

        return suppliers.filter((s) =>
            [s.first_name, s.last_name, s.phone_number, s.email, s.product]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(q))
        );
    }, [suppliers, search]);

    const update =
        (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm((f) => ({ ...f, [field]: e.target.value }));

    const openCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setShowForm(true);
    };

    const openEdit = (supplier: SupplierPayload) => {
        setEditingId(supplier.id);
        setForm({
            firstName: supplier.first_name,
            lastName: supplier.last_name,
            phone: supplier.phone_number,
            email: supplier.email ?? "",
            product: supplier.product ?? "",
        });
        setFormError(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);

        // email/product are null=True but not blank=True on the model, so
        // an empty input has to go out as null, not "".
        const input: SupplierInput = {
            first_name: form.firstName.trim(),
            last_name: form.lastName.trim(),
            phone_number: form.phone.trim(),
            email: form.email.trim() || null,
            product: form.product.trim() || null,
        };

        try {
            if (editingId !== null) {
                await updateSupplier(editingId, input);
            } else {
                await createSupplier(input);
            }
            closeForm();
        } catch (err) {
            setFormError(
                getErrorMessage(err, "Failed to save supplier. Try again.")
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        setDeletingId(id);
        setActionError(null);

        try {
            await deleteSupplier(id);
            setConfirmDeleteId(null);
        } catch (err) {
            setActionError(
                getErrorMessage(err, "Failed to delete supplier.")
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[1240px]">
                {/* Header */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                            Sourcing
                        </div>
                        <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                            Suppliers
                        </h1>
                        <p className="mt-1 text-[12.5px] text-steel">
                            {suppliers.length}{" "}
                            {suppliers.length === 1 ? "supplier" : "suppliers"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center gap-2 bg-ink px-4 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink"
                    >
                        <FaPlus size={11} />
                        Add Supplier
                    </button>
                </div>

                <ErrorBanner message={error} />
                <ErrorBanner message={actionError} />

                {/* Add / edit form */}
                {showForm && (
                    <form
                        onSubmit={handleSubmit}
                        className="mb-6 border border-ink/10 bg-paper p-5"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                                {editingId !== null
                                    ? "Edit Supplier"
                                    : "New Supplier"}
                            </h2>

                            <button
                                type="button"
                                onClick={closeForm}
                                aria-label="Close form"
                                className="text-steel transition-colors hover:text-ink"
                            >
                                <FaTimes size={14} />
                            </button>
                        </div>

                        <ErrorBanner message={formError} />

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    First Name
                                </label>
                                <input
                                    required
                                    className={inputClass}
                                    value={form.firstName}
                                    onChange={update("firstName")}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Last Name
                                </label>
                                <input
                                    required
                                    className={inputClass}
                                    value={form.lastName}
                                    onChange={update("lastName")}
                                />
                            </div>
                        </div>

                        <div className="mb-4 grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass}>
                                    Phone Number
                                </label>
                                <input
                                    required
                                    type="tel"
                                    className={inputClass}
                                    placeholder="07XX XXX XXX"
                                    value={form.phone}
                                    onChange={update("phone")}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>
                                    Email{" "}
                                    <span className="normal-case text-steel-light">
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    type="email"
                                    className={inputClass}
                                    value={form.email}
                                    onChange={update("email")}
                                />
                            </div>
                        </div>

                        <div className="mb-5">
                            <label className={labelClass}>
                                Product Supplied{" "}
                                <span className="normal-case text-steel-light">
                                    (optional)
                                </span>
                            </label>
                            <input
                                className={inputClass}
                                placeholder="e.g. Safety boots"
                                value={form.product}
                                onChange={update("product")}
                            />
                        </div>

                        <div className="flex gap-2.5">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {saving
                                    ? "Saving..."
                                    : editingId !== null
                                        ? "Save Changes"
                                        : "Add Supplier"}
                            </button>

                            <button
                                type="button"
                                onClick={closeForm}
                                className="border-2 border-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-paper"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {/* Search */}
                <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, phone, email or product..."
                    className={`${inputClass} mb-4 sm:max-w-sm`}
                />

                {/* List */}
                <div className="border border-ink/10 bg-paper">
                    {loading && (
                        <div className="p-6 text-sm text-steel">
                            Loading suppliers...
                        </div>
                    )}

                    {!loading && visibleSuppliers.length === 0 && (
                        <div className="flex flex-col items-center gap-2 p-10 text-center text-steel">
                            <FaTruck size={22} />
                            <p className="text-sm">
                                {suppliers.length === 0
                                    ? "No suppliers yet."
                                    : "No suppliers match your search."}
                            </p>
                        </div>
                    )}

                    {visibleSuppliers.map((supplier) => {
                        const confirming = confirmDeleteId === supplier.id;

                        return (
                            <div
                                key={supplier.id}
                                className="flex flex-wrap items-center gap-4 border-b border-ink/10 p-4 last:border-b-0"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-[14px] font-bold text-ink">
                                            {supplier.first_name}{" "}
                                            {supplier.last_name}
                                        </h3>

                                        {supplier.product && (
                                            <span className="bg-accent/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-accent-dark">
                                                {supplier.product}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-steel">
                                        <span className="inline-flex items-center gap-1.5">
                                            <FaPhoneAlt size={10} />
                                            {supplier.phone_number}
                                        </span>
                                        {supplier.email && (
                                            <span>{supplier.email}</span>
                                        )}
                                        <span>
                                            Added{" "}
                                            {formatDate(supplier.created_on)}
                                        </span>
                                    </p>
                                </div>

                                {confirming ? (
                                    <div className="flex items-center gap-2">
                                        <span className="text-[12px] font-semibold text-red-700">
                                            Delete this supplier?
                                        </span>
                                        <button
                                            type="button"
                                            disabled={deletingId === supplier.id}
                                            onClick={() =>
                                                handleDelete(supplier.id)
                                            }
                                            className="bg-red-600 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                                        >
                                            {deletingId === supplier.id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setConfirmDeleteId(null)
                                            }
                                            className="border border-ink/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-ink transition-colors hover:bg-ink/5"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <a
                                            href={`https://wa.me/${toWhatsappNumber(
                                                supplier.phone_number
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label="Message on WhatsApp"
                                            className="flex h-8 w-8 items-center justify-center bg-green text-white transition-colors hover:bg-[#245530]"
                                        >
                                            <FaWhatsapp size={14} />
                                        </a>

                                        <button
                                            type="button"
                                            onClick={() => openEdit(supplier)}
                                            aria-label="Edit supplier"
                                            className="flex h-8 w-8 items-center justify-center border border-ink/15 text-ink transition-colors hover:bg-ink hover:text-paper"
                                        >
                                            <FaEdit size={13} />
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setActionError(null);
                                                setConfirmDeleteId(supplier.id);
                                            }}
                                            aria-label="Delete supplier"
                                            className="flex h-8 w-8 items-center justify-center border border-red-500/30 text-red-600 transition-colors hover:bg-red-600 hover:text-white"
                                        >
                                            <FaTrash size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}