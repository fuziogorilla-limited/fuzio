"use client";

import { useEffect, useState, type FormEvent } from "react";
import { FaCheckCircle, FaLock, FaUser } from "react-icons/fa";

import { useAdmin } from "@/hooks/useAdmin";
import { getErrorMessage } from "@/hooks/useInventory";

const inputClass =
    "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-accent";

const labelClass =
    "mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-steel";

const MIN_PASSWORD_LENGTH = 8;

type ProfileForm = {
    firstName: string;
    lastName: string;
    email: string;
};

type PasswordForm = {
    current: string;
    next: string;
    confirm: string;
};

const emptyPasswordForm: PasswordForm = { current: "", next: "", confirm: "" };

function ErrorBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-4 border border-red-500/30 bg-red-500/10 px-3 py-2 text-[13px] font-semibold text-red-700">
            {message}
        </div>
    );
}

function SuccessBanner({ message }: { message: string | null }) {
    if (!message) return null;

    return (
        <div className="mb-4 flex items-center gap-2 border border-green/30 bg-green/10 px-3 py-2 text-[13px] font-semibold text-green">
            <FaCheckCircle size={12} />
            {message}
        </div>
    );
}

export default function Settings() {
    const { profile, loading, error, updateProfile, changePassword } =
        useAdmin();

    /* ---------------------------- Profile card ---------------------------- */

    const [profileForm, setProfileForm] = useState<ProfileForm>({
        firstName: "",
        lastName: "",
        email: "",
    });
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);

    // Seed the form whenever the profile (re)loads or is saved.
    useEffect(() => {
        if (profile) {
            setProfileForm({
                firstName: profile.first_name,
                lastName: profile.last_name,
                email: profile.email,
            });
        }
    }, [profile]);

    const profileDirty =
        profile !== null &&
        (profileForm.firstName !== profile.first_name ||
            profileForm.lastName !== profile.last_name ||
            profileForm.email !== profile.email);

    const updateProfileField =
        (field: keyof ProfileForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setProfileSuccess(null);
            setProfileForm((f) => ({ ...f, [field]: e.target.value }));
        };

    const handleProfileSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!profile) return;

        setSavingProfile(true);
        setProfileError(null);
        setProfileSuccess(null);

        // Only send what actually changed.
        const changes: Record<string, string> = {};
        if (profileForm.firstName.trim() !== profile.first_name)
            changes.first_name = profileForm.firstName.trim();
        if (profileForm.lastName.trim() !== profile.last_name)
            changes.last_name = profileForm.lastName.trim();
        if (profileForm.email.trim() !== profile.email)
            changes.email = profileForm.email.trim();

        try {
            await updateProfile(changes);
            setProfileSuccess("Your details have been updated.");
        } catch (err) {
            setProfileError(
                getErrorMessage(err, "Couldn't update your details.")
            );
        } finally {
            setSavingProfile(false);
        }
    };

    /* --------------------------- Password card ---------------------------- */

    const [passwordForm, setPasswordForm] =
        useState<PasswordForm>(emptyPasswordForm);
    const [savingPassword, setSavingPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(
        null
    );

    const updatePasswordField =
        (field: keyof PasswordForm) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setPasswordSuccess(null);
            setPasswordForm((f) => ({ ...f, [field]: e.target.value }));
        };

    const handlePasswordSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(null);

        if (passwordForm.next.length < MIN_PASSWORD_LENGTH) {
            setPasswordError(
                `New password must be at least ${MIN_PASSWORD_LENGTH} characters.`
            );
            return;
        }

        if (passwordForm.next !== passwordForm.confirm) {
            setPasswordError("New password and confirmation don't match.");
            return;
        }

        if (passwordForm.next === passwordForm.current) {
            setPasswordError(
                "New password must be different from your current one."
            );
            return;
        }

        setSavingPassword(true);

        try {
            await changePassword({
                current_password: passwordForm.current,
                new_password: passwordForm.next,
            });
            setPasswordForm(emptyPasswordForm);
            setPasswordSuccess("Password changed successfully.");
        } catch (err) {
            setPasswordError(
                getErrorMessage(err, "Couldn't change your password.")
            );
        } finally {
            setSavingPassword(false);
        }
    };

    /* ------------------------------- Render ------------------------------- */

    return (
        <div className="px-4 py-8 sm:px-6">
            <div className="mx-auto max-w-[760px]">
                <div className="mb-6">
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-accent-dark">
                        Account
                    </div>
                    <h1 className="mt-1 text-2xl font-black tracking-tight text-ink">
                        Settings
                    </h1>
                </div>

                <ErrorBanner message={error} />

                {/* Profile details */}
                <form
                    onSubmit={handleProfileSubmit}
                    className="mb-6 border border-ink/10 bg-paper p-5 sm:p-6"
                >
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center bg-accent text-ink">
                            <FaUser size={13} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                            Your Details
                        </h2>
                    </div>

                    <ErrorBanner message={profileError} />
                    <SuccessBanner message={profileSuccess} />

                    {loading && !profile ? (
                        <p className="text-sm text-steel">
                            Loading your details...
                        </p>
                    ) : (
                        <>
                            <div className="mb-4 grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className={labelClass}>
                                        First Name
                                    </label>
                                    <input
                                        required
                                        className={inputClass}
                                        value={profileForm.firstName}
                                        onChange={updateProfileField(
                                            "firstName"
                                        )}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Last Name
                                    </label>
                                    <input
                                        required
                                        className={inputClass}
                                        value={profileForm.lastName}
                                        onChange={updateProfileField(
                                            "lastName"
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="mb-5">
                                <label className={labelClass}>Email</label>
                                <input
                                    required
                                    type="email"
                                    className={inputClass}
                                    value={profileForm.email}
                                    onChange={updateProfileField("email")}
                                />
                                <p className="mt-1.5 text-[11.5px] text-steel">
                                    This is the email you sign in with and
                                    where password reset codes are sent.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    savingProfile ||
                                    !profileDirty ||
                                    profile === null
                                }
                                className="bg-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {savingProfile ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </form>

                {/* Change password */}
                <form
                    onSubmit={handlePasswordSubmit}
                    className="border border-ink/10 bg-paper p-5 sm:p-6"
                >
                    <div className="mb-4 flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center bg-accent text-ink">
                            <FaLock size={13} />
                        </div>
                        <h2 className="text-sm font-black uppercase tracking-tight text-ink">
                            Change Password
                        </h2>
                    </div>

                    <ErrorBanner message={passwordError} />
                    <SuccessBanner message={passwordSuccess} />

                    <div className="mb-4">
                        <label className={labelClass}>Current Password</label>
                        <input
                            required
                            type="password"
                            autoComplete="current-password"
                            className={inputClass}
                            value={passwordForm.current}
                            onChange={updatePasswordField("current")}
                        />
                    </div>

                    <div className="mb-5 grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className={labelClass}>New Password</label>
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                className={inputClass}
                                value={passwordForm.next}
                                onChange={updatePasswordField("next")}
                            />
                        </div>

                        <div>
                            <label className={labelClass}>
                                Confirm New Password
                            </label>
                            <input
                                required
                                type="password"
                                autoComplete="new-password"
                                className={inputClass}
                                value={passwordForm.confirm}
                                onChange={updatePasswordField("confirm")}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={savingPassword}
                        className="bg-ink px-5 py-2.5 text-[12px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {savingPassword ? "Updating..." : "Update Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}