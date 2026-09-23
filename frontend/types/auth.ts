/**
 * Types mirroring `users/serializers.py` and `users/views.py`.
 *
 * `UserSerializer` is a plain `serializers.Serializer` (not a
 * ModelSerializer), so its output only ever contains the fields it
 * explicitly declares — no `id`, and `password` is write-only so it never
 * comes back in a response.
 */

export interface UserPayload {
    first_name: string;
    last_name: string;
    email: string;
}

/** Used by the admin dashboard to create staff accounts — not the login form. */
export interface SignUpInput {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

/** PATCH /api/users/user/ — all fields optional, partial update. */
export interface UpdateUserInput {
    first_name?: string;
    last_name?: string;
    email?: string;
    password?: string;
}

/* -------------------------------------------------------------------------- */
/*  Login                                                                     */
/* -------------------------------------------------------------------------- */

export interface LoginInput {
    email: string;
    password: string;
}

/** LoginUser view returns a SimpleJWT refresh/access pair directly. */
export interface LoginResponse {
    refresh: string;
    access: string;
}

/* -------------------------------------------------------------------------- */
/*  Forgot password / verify code                                             */
/* -------------------------------------------------------------------------- */

export interface ForgotPasswordInput {
    email: string;
}

export interface ForgotPasswordResponse {
    message: string;
}

export interface VerifyCodeInput {
    email: string;
    code: string;
}

/**
 * VerifyCode returns a short-lived AccessToken (not a refresh token) —
 * it's meant to authorize exactly one follow-up request: PATCH
 * /api/users/user/ with a new password, using this token as the bearer.
 */
export interface VerifyCodeResponse {
    access: string;
}

/* -------------------------------------------------------------------------- */
/*  Token refresh                                                             */
/* -------------------------------------------------------------------------- */

export interface RefreshResponse {
    access: string;
}

/* -------------------------------------------------------------------------- */
/*  Errors                                                                    */
/* -------------------------------------------------------------------------- */

/** Shape thrown by apiFetch on a non-2xx response. */
export interface ApiErrorShape {
    status: number;
    data: unknown;
}