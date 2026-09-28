/**
 * UserSerializer output. `password` is write_only on the backend so it never
 * comes back. There is no phone field on CustomUser today — see the note in
 * the settings component if you want to add one.
 */
export interface ProfilePayload {
    first_name: string;
    last_name: string;
    email: string;
}

/** PATCH /api/users/user/ — partial, send only what changed. */
export interface UpdateProfileInput {
    first_name?: string;
    last_name?: string;
    email?: string;
}

/**
 * UserView.patch currently wraps its result in an oddly-named key
 * ({ "Updates successfully": {...} }). The hook tolerates that shape as well
 * as a cleaner { message, data } one, so this stays loose on purpose.
 */
export type UpdateProfileResponse =
    | { message?: string; data: ProfilePayload }
    | Record<string, ProfilePayload | string>;

/** POST /api/users/change-password/ */
export interface ChangePasswordInput {
    current_password: string;
    new_password: string;
}

export interface ChangePasswordResponse {
    message: string;
}