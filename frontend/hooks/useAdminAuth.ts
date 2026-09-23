"use client";

import { useCallback, useEffect, useState } from "react";
import apiFetch from "@/lib/api";
import routes from "@/lib/routes";
import { getErrorMessage } from "@/hooks/useInventory";
import type {
    LoginInput,
    LoginResponse,
    ForgotPasswordInput,
    ForgotPasswordResponse,
    VerifyCodeInput,
    VerifyCodeResponse,
    UpdateUserInput,
    UserPayload,
} from "@/types/auth";

/** Same keys apiFetch's internal token helpers read/write — keep in sync. */
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

function readAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function storeTokens(access: string, refresh: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, access);
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

function clearStoredTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function useAdminAuth() {
    // null = "haven't checked localStorage yet" (avoids a flash of the
    // login form on first paint before the client-only check runs).
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsAuthenticated(Boolean(readAccessToken()));
    }, []);

    const login = useCallback(async (input: LoginInput) => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiFetch<LoginResponse>(routes.auth.login, {
                method: "POST",
                body: input,
                skipAuth: true,
            });

            storeTokens(data.access, data.refresh);
            setIsAuthenticated(true);
            return data;
        } catch (err) {
            const message = getErrorMessage(err, "Invalid email or password");
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        clearStoredTokens();
        setIsAuthenticated(false);
    }, []);

    const forgotPassword = useCallback(async (input: ForgotPasswordInput) => {
        setLoading(true);
        setError(null);

        try {
            return await apiFetch<ForgotPasswordResponse>(
                routes.auth.forgotPassword,
                { method: "POST", body: input, skipAuth: true }
            );
        } catch (err) {
            const message = getErrorMessage(
                err,
                "Couldn't send a reset code. Try again."
            );
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    const verifyCode = useCallback(async (input: VerifyCodeInput) => {
        setLoading(true);
        setError(null);

        try {
            // Returns a short-lived access token scoped to this one
            // password reset — never written to localStorage.
            return await apiFetch<VerifyCodeResponse>(
                routes.auth.verifyCode,
                { method: "POST", body: input, skipAuth: true }
            );
        } catch (err) {
            const message = getErrorMessage(
                err,
                "That code is invalid or has expired"
            );
            setError(message);
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Sets a new password using the one-time token from verifyCode.
     * Passed explicitly rather than relying on the stored session token,
     * since the person resetting their password isn't logged in yet.
     */
    const resetPassword = useCallback(
        async (resetAccessToken: string, newPassword: string) => {
            setLoading(true);
            setError(null);

            try {
                return await apiFetch<UserPayload>(routes.auth.user, {
                    method: "PATCH",
                    body: { password: newPassword } as UpdateUserInput,
                    skipAuth: true,
                    headers: {
                        Authorization: `Bearer ${resetAccessToken}`,
                    },
                });
            } catch (err) {
                const message = getErrorMessage(
                    err,
                    "Couldn't reset your password. Try again."
                );
                setError(message);
                throw new Error(message);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        forgotPassword,
        verifyCode,
        resetPassword,
    };
}

export default useAdminAuth;