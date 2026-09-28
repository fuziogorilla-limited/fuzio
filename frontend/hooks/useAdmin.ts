"use client";

import { useCallback, useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import { getErrorMessage } from "@/hooks/useInventory";
import type {
    ChangePasswordInput,
    ChangePasswordResponse,
    ProfilePayload,
    UpdateProfileInput,
    UpdateProfileResponse,
} from "@/types/settings"

function isProfile(value: unknown): value is ProfilePayload {
    return (
        typeof value === "object" &&
        value !== null &&
        "email" in value &&
        "first_name" in value
    );
}

/** Pulls the updated profile out of either { data } or the legacy wrapped-key shape. */
function extractProfile(res: UpdateProfileResponse): ProfilePayload | null {
    if ("data" in res && isProfile(res.data)) return res.data;

    return Object.values(res).find(isProfile) ?? null;
}

/**
 * The signed-in admin's own account. Separate from useAdminAuth, which only
 * handles the login / logout / reset-password session flow.
 *
 * updateProfile and changePassword throw on failure so the settings page can
 * show the message next to the form that caused it (via getErrorMessage).
 * `error` is only for the initial profile load.
 */
export function useAdmin() {
    const [profile, setProfile] = useState<ProfilePayload | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<ProfilePayload>(routes.auth.user);
            setProfile(data);
        } catch (err) {
            setError(getErrorMessage(err, "Failed to load your profile"));
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProfile = useCallback(async (input: UpdateProfileInput) => {
        const res = await apiFetch<UpdateProfileResponse>(routes.auth.user, {
            method: "PATCH",
            body: input,
        });

        const updated = extractProfile(res);

        // Fall back to merging what we sent if the response shape surprises us.
        setProfile((prev) =>
            updated ?? (prev ? { ...prev, ...input } : prev)
        );

        return updated;
    }, []);

    const changePassword = useCallback(async (input: ChangePasswordInput) => {
        return apiFetch<ChangePasswordResponse>(routes.auth.changePassword, {
            method: "POST",
            body: input,
        });
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return {
        profile,
        loading,
        error,
        fetchProfile,
        updateProfile,
        changePassword,
    };
}

export default useAdmin;