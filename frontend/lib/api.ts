const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
    skipAuth?: boolean;
    skipRefresh?: boolean;
};

type RefreshResponse = {
    access: string;
};

let refreshPromise: Promise<string | null> | null = null;

function getAccessToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("access_token");
}

function getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;

    return localStorage.getItem("refresh_token");
}

function saveAccessToken(access: string): void {
    if (typeof window === "undefined") return;

    localStorage.setItem("access_token", access);
}

function clearTokens(): void {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
}

function isAuthEndpoint(endpoint: string): boolean {
    return (
        endpoint.includes("/login/") ||
        endpoint.includes("/forgot-password/") ||
        endpoint.includes("/verify-code/") ||
        endpoint.includes("/refresh/")
    );
}

async function refreshAccessToken(): Promise<string | null> {
    if (typeof window === "undefined") {
        return null;
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        return null;
    }

    if (refreshPromise) {
        return refreshPromise;
    }

    refreshPromise = (async () => {
        try {
            const response = await fetch(
                `${API_BASE_URL}/api/users/refresh/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        refresh: refreshToken,
                    }),
                }
            );

            const data =
                (await response.json().catch(() => null)) as
                    | RefreshResponse
                    | null;

            if (!response.ok || !data?.access) {
                clearTokens();
                return null;
            }

            saveAccessToken(data.access);

            return data.access;
        } catch {
            clearTokens();
            return null;
        } finally {
            refreshPromise = null;
        }
    })();

    return refreshPromise;
}

async function apiFetch<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const {
        method = "GET",
        body,
        headers = {},
        skipAuth = false,
        skipRefresh = false,
    } = options;

    const shouldAttachAuth =
        !skipAuth && !isAuthEndpoint(endpoint);

    const accessToken = shouldAttachAuth
        ? getAccessToken()
        : null;

    /*
     * FormData MUST NOT have Content-Type manually set.
     *
     * The browser automatically sets:
     *
     * multipart/form-data;
     * boundary=----WebKitFormBoundary...
     *
     * If we manually set Content-Type, Django may not
     * correctly parse the uploaded image/form fields.
     */
    const isFormData = body instanceof FormData;

    const requestHeaders = new Headers(headers);

    if (!isFormData) {
        requestHeaders.set(
            "Content-Type",
            "application/json"
        );
    } else {
        requestHeaders.delete("Content-Type");
    }

    if (accessToken) {
        requestHeaders.set(
            "Authorization",
            `Bearer ${accessToken}`
        );
    }

    const requestBody =
        body === undefined
            ? undefined
            : isFormData
                ? body
                : JSON.stringify(body);

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            method,
            headers: requestHeaders,
            body: requestBody,
        }
    );

    const data = await response
        .json()
        .catch(() => null);

    /*
     * If access token expired, attempt one refresh.
     */
    if (
        response.status === 401 &&
        shouldAttachAuth &&
        !skipRefresh
    ) {
        const newAccessToken =
            await refreshAccessToken();

        if (!newAccessToken) {
            throw {
                status: 401,
                data,
            };
        }

        return apiFetch<T>(endpoint, {
            ...options,
            headers: {
                ...Object.fromEntries(
                    new Headers(headers).entries()
                ),
                Authorization: `Bearer ${newAccessToken}`,
            },
            skipRefresh: true,
        });
    }

    if (!response.ok) {
        throw {
            status: response.status,
            data,
        };
    }

    return data as T;
}

export default apiFetch;