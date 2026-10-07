"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
    FaEnvelope,
    FaLock,
    FaKey,
    FaArrowLeft,
    FaEye,
    FaEyeSlash,
} from "react-icons/fa";

import { useAdminAuth } from "@/hooks/useAdminAuth";

type Mode =
    | "login"
    | "forgot-request"
    | "forgot-verify"
    | "forgot-reset"
    | "forgot-done";

export default function Login() {
    const router = useRouter();
    const { loading, error, login, forgotPassword, verifyCode, resetPassword } =
        useAdminAuth();

    const [mode, setMode] = useState<Mode>("login");
    const [localError, setLocalError] = useState<string | null>(null);

    // Login fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Forgot-password flow fields
    const [resetEmail, setResetEmail] = useState("");
    const [code, setCode] = useState("");
    const [resetToken, setResetToken] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const displayError = localError ?? error;

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            await login({ email, password });
            router.push("/admin/dashboard");
        } catch {
            // error state is already set inside useAdminAuth
        }
    };

    const handleForgotRequest = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            await forgotPassword({ email: resetEmail });
            setMode("forgot-verify");
        } catch {
            // error state is already set inside useAdminAuth
        }
    };

    const handleVerify = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        try {
            const data = await verifyCode({
                email: resetEmail,
                code,
            });

            setResetToken(data.access);
            setMode("forgot-reset");
        } catch {
            // error state is already set inside useAdminAuth
        }
    };

    const handleReset = async (e: FormEvent) => {
        e.preventDefault();
        setLocalError(null);

        if (newPassword.length < 8) {
            setLocalError("Password must be at least 8 characters");
            return;
        }

        if (newPassword !== confirmPassword) {
            setLocalError("Passwords don't match");
            return;
        }

        if (!resetToken) {
            setLocalError("Your reset session expired — start again");
            setMode("forgot-request");
            return;
        }

        try {
            await resetPassword(resetToken, newPassword);
            setMode("forgot-done");
        } catch {
            // error state is already set inside useAdminAuth
        }
    };

    const backToLogin = () => {
        setLocalError(null);
        setResetEmail("");
        setCode("");
        setResetToken(null);
        setNewPassword("");
        setConfirmPassword("");

        setShowPassword(false);
        setShowNewPassword(false);
        setShowConfirmPassword(false);

        setMode("login");
    };

    return (
        <div className="flex min-h-dvh w-full items-center justify-center bg-ink px-4 py-10 sm:px-6">
            <div className="w-full max-w-[400px]">
                {/* Brand */}
                <div className="mb-8 flex flex-col items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center border-2 border-paper bg-accent text-[15px] font-black tracking-tight text-ink">
                        FG
                    </div>

                    <div className="text-center">
                        <div className="text-[16px] font-black tracking-tight text-paper">
                            FUZIO GORILLA
                        </div>

                        <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-accent">
                            Admin
                        </div>
                    </div>
                </div>

                <div className="border border-paper/10 bg-paper p-7 sm:p-8">
                    {/* ------------------------------------------------------------------ */}
                    {/* LOGIN                                                                */}
                    {/* ------------------------------------------------------------------ */}

                    {mode === "login" && (
                        <>
                            <h1 className="mb-1 text-xl font-black tracking-tight text-ink">
                                Sign in
                            </h1>

                            <p className="mb-6 text-[13px] text-steel">
                                Manage products, orders and categories.
                            </p>

                            <form
                                onSubmit={handleLogin}
                                className="flex flex-col gap-4"
                            >
                                <Field
                                    label="Email"
                                    icon={<FaEnvelope size={12} />}
                                    type="email"
                                    value={email}
                                    onChange={setEmail}
                                    placeholder="you@fuziogorilla.co.ke"
                                    autoComplete="username"
                                    required
                                />

                                <PasswordField
                                    label="Password"
                                    value={password}
                                    onChange={setPassword}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    showPassword={showPassword}
                                    onToggle={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                />

                                {displayError && (
                                    <ErrorNote message={displayError} />
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Signing in..." : "Sign In"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setLocalError(null);
                                        setResetEmail(email);
                                        setMode("forgot-request");
                                    }}
                                    className="text-center text-[12.5px] font-semibold text-steel transition-colors hover:text-accent-dark"
                                >
                                    Forgot your password?
                                </button>
                            </form>
                        </>
                    )}

                    {/* ------------------------------------------------------------------ */}
                    {/* FORGOT PASSWORD - REQUEST                                          */}
                    {/* ------------------------------------------------------------------ */}

                    {mode === "forgot-request" && (
                        <>
                            <BackButton onClick={backToLogin} />

                            <h1 className="mb-1 text-xl font-black tracking-tight text-ink">
                                Reset password
                            </h1>

                            <p className="mb-6 text-[13px] text-steel">
                                Enter your account email and we&apos;ll send a
                                6-digit code.
                            </p>

                            <form
                                onSubmit={handleForgotRequest}
                                className="flex flex-col gap-4"
                            >
                                <Field
                                    label="Email"
                                    icon={<FaEnvelope size={12} />}
                                    type="email"
                                    value={resetEmail}
                                    onChange={setResetEmail}
                                    placeholder="you@fuziogorilla.co.ke"
                                    autoComplete="username"
                                    required
                                />

                                {displayError && (
                                    <ErrorNote message={displayError} />
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Sending..." : "Send Reset Code"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ------------------------------------------------------------------ */}
                    {/* FORGOT PASSWORD - VERIFY CODE                                      */}
                    {/* ------------------------------------------------------------------ */}

                    {mode === "forgot-verify" && (
                        <>
                            <BackButton
                                onClick={() => setMode("forgot-request")}
                            />

                            <h1 className="mb-1 text-xl font-black tracking-tight text-ink">
                                Enter code
                            </h1>

                            <p className="mb-6 text-[13px] text-steel">
                                We sent a 6-digit code to{" "}
                                <span className="font-semibold text-ink">
                                    {resetEmail}
                                </span>
                                . It expires in 5 minutes.
                            </p>

                            <form
                                onSubmit={handleVerify}
                                className="flex flex-col gap-4"
                            >
                                <Field
                                    label="Reset Code"
                                    icon={<FaKey size={12} />}
                                    type="text"
                                    value={code}
                                    onChange={(v) =>
                                        setCode(
                                            v
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    placeholder="000000"
                                    autoComplete="one-time-code"
                                    required
                                    mono
                                />

                                {displayError && (
                                    <ErrorNote message={displayError} />
                                )}

                                <button
                                    type="submit"
                                    disabled={
                                        loading || code.length !== 6
                                    }
                                    className="mt-1 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Verifying..."
                                        : "Verify Code"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ------------------------------------------------------------------ */}
                    {/* FORGOT PASSWORD - RESET                                           */}
                    {/* ------------------------------------------------------------------ */}

                    {mode === "forgot-reset" && (
                        <>
                            <h1 className="mb-1 text-xl font-black tracking-tight text-ink">
                                Set a new password
                            </h1>

                            <p className="mb-6 text-[13px] text-steel">
                                Choose a new password for your admin account.
                            </p>

                            <form
                                onSubmit={handleReset}
                                className="flex flex-col gap-4"
                            >
                                <PasswordField
                                    label="New Password"
                                    value={newPassword}
                                    onChange={setNewPassword}
                                    placeholder="At least 8 characters"
                                    autoComplete="new-password"
                                    showPassword={showNewPassword}
                                    onToggle={() =>
                                        setShowNewPassword((prev) => !prev)
                                    }
                                />

                                <PasswordField
                                    label="Confirm Password"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    placeholder="Re-enter password"
                                    autoComplete="new-password"
                                    showPassword={showConfirmPassword}
                                    onToggle={() =>
                                        setShowConfirmPassword(
                                            (prev) => !prev
                                        )
                                    }
                                />

                                {displayError && (
                                    <ErrorNote message={displayError} />
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-1 w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading
                                        ? "Saving..."
                                        : "Save New Password"}
                                </button>
                            </form>
                        </>
                    )}

                    {/* ------------------------------------------------------------------ */}
                    {/* FORGOT PASSWORD - DONE                                             */}
                    {/* ------------------------------------------------------------------ */}

                    {mode === "forgot-done" && (
                        <div className="text-center">
                            <h1 className="mb-2 text-xl font-black tracking-tight text-ink">
                                Password updated
                            </h1>

                            <p className="mb-6 text-[13px] leading-relaxed text-steel">
                                Your password has been reset. Sign in with
                                your new password.
                            </p>

                            <button
                                type="button"
                                onClick={backToLogin}
                                className="w-full bg-ink px-6 py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:text-ink"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Regular Field                                                             */
/* -------------------------------------------------------------------------- */

function Field({
    label,
    icon,
    type,
    value,
    onChange,
    placeholder,
    autoComplete,
    required,
    mono,
}: {
    label: string;
    icon: React.ReactNode;
    type: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    required?: boolean;
    mono?: boolean;
}) {
    return (
        <label className="block">
            <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                {label}
            </span>

            <div className="flex items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 transition-colors focus-within:border-ink">
                <span className="shrink-0 text-steel">
                    {icon}
                </span>

                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required={required}
                    className={`w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-steel ${
                        mono ? "font-mono tracking-[0.3em]" : ""
                    }`}
                />
            </div>
        </label>
    );
}

/* -------------------------------------------------------------------------- */
/*  Password Field                                                            */
/* -------------------------------------------------------------------------- */

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
    autoComplete,
    showPassword,
    onToggle,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    autoComplete?: string;
    showPassword: boolean;
    onToggle: () => void;
}) {
    return (
        <label className="block">
            <span className="mb-2 block font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-ink">
                {label}
            </span>

            <div className="flex items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 transition-colors focus-within:border-ink">
                <span className="shrink-0 text-steel">
                    <FaLock size={12} />
                </span>

                <input
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    required
                    className="w-full bg-transparent text-[13.5px] text-ink outline-none placeholder:text-steel"
                />

                <button
                    type="button"
                    onClick={onToggle}
                    aria-label={
                        showPassword
                            ? `Hide ${label.toLowerCase()}`
                            : `Show ${label.toLowerCase()}`
                    }
                    className="shrink-0 text-steel transition-colors hover:text-ink"
                >
                    {showPassword ? (
                        <FaEyeSlash size={13} />
                    ) : (
                        <FaEye size={13} />
                    )}
                </button>
            </div>
        </label>
    );
}

/* -------------------------------------------------------------------------- */
/*  Error                                                                     */
/* -------------------------------------------------------------------------- */

function ErrorNote({ message }: { message: string }) {
    return (
        <div className="border-l-4 border-accent bg-accent/10 px-3.5 py-2.5 text-[12.5px] font-semibold text-accent-dark">
            {message}
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Back Button                                                               */
/* -------------------------------------------------------------------------- */

function BackButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="mb-4 inline-flex items-center gap-1.5 text-[12px] font-bold uppercase tracking-wide text-steel transition-colors hover:text-accent-dark"
        >
            <FaArrowLeft size={10} />
            Back
        </button>
    );
}