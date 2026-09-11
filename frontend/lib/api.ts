const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

if (!API_BASE_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL is not defined");
}

type ApiOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    headers?: HeadersInit;
};

async function apiFetch<T>(
    endpoint: string,
    options: ApiOptions = {}
): Promise<T> {
    const {
        method = "GET",
        body,
        headers = {},
    } = options;

    const accessToken =
        typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",

            ...(accessToken
                ? {
                      Authorization: `Bearer ${accessToken}`,
                  }
                : {}),

            ...headers,
        },

        ...(body !== undefined
            ? {
                  body: JSON.stringify(body),
              }
            : {}),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw {
            status: response.status,
            data,
        };
    }

    return data as T;
}

export default apiFetch;