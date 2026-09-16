"use client";

import {
  FaArrowLeft,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaShieldAlt,
  FaSpinner,
} from "react-icons/fa";

import {
  ADMIN_AUTH_MESSAGES,
} from "@/constants/admin-auth";

import {
  useAdminAuth,
} from "@/hooks/useAdminAuth";

export default function AdminLogin() {
  const {
    step,
    setStep,

    loading,
    error,

    email,
    setEmail,

    password,
    setPassword,

    showPassword,
    setShowPassword,

    resetEmail,
    setResetEmail,

    code,
    setCode,

    resendCooldown,

    resetMessages,
    handleLogin,
    handleRequestCode,
    handleResendCode,
    handleVerifyCode,
    backToLogin,
  } = useAdminAuth();

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-ink px-4 py-10">
      <div className="w-full max-w-[400px]">

        {/* Brand */}
        <div className="mb-7 flex flex-col items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-paper bg-accent text-[16px] font-extrabold tracking-tight text-ink">
            FG
          </div>

          <div className="text-center leading-none">
            <div className="text-[15px] font-extrabold tracking-wide text-paper">
              FUZIO GORILLA
            </div>

            <div className="mt-1 font-mono text-[9px] tracking-[0.13em] text-accent">
              ADMIN PANEL
            </div>
          </div>
        </div>

        {/* Auth card */}
        <div className="border border-white/10 bg-paper p-7">

          {/* Login */}
          {step === "login" && (
            <>
              <h1 className="mb-1 text-xl font-extrabold text-ink">
                Admin Sign In
              </h1>

              <p className="mb-6 text-[13px] text-steel">
                Enter your credentials to
                access the dashboard.
              </p>

              <form
                onSubmit={handleLogin}
                className="flex flex-col gap-4"
              >
                {/* Email */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Email Address
                  </span>

                  <div className="flex min-w-0 items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 focus-within:border-ink">
                    <FaEnvelope
                      className="shrink-0 text-steel"
                      size={13}
                    />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder={
                        ADMIN_AUTH_MESSAGES.emailPlaceholder
                      }
                      className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                    />
                  </div>
                </label>

                {/* Password */}
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Password
                  </span>

                  <div className="flex min-w-0 items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 focus-within:border-ink">
                    <FaLock
                      className="shrink-0 text-steel"
                      size={13}
                    />

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(
                          event.target.value
                        )
                      }
                      placeholder={
                        ADMIN_AUTH_MESSAGES.passwordPlaceholder
                      }
                      className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) =>
                            !current
                        )
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="shrink-0 text-steel hover:text-ink"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={14} />
                      ) : (
                        <FaEye size={14} />
                      )}
                    </button>
                  </div>
                </label>

                {/* Forgot password */}
                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setStep(
                      "forgot-email"
                    );
                  }}
                  className="self-end text-[12px] font-semibold text-accent-dark hover:text-ink"
                >
                  Forgot password?
                </button>

                {/* Error */}
                {error && (
                  <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex items-center justify-center gap-2 border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <FaSpinner
                      className="animate-spin"
                      size={13}
                    />
                  )}

                  {loading
                    ? "Please wait…"
                    : "Sign In"}
                </button>
              </form>
            </>
          )}

          {/* Forgot password — email */}
          {step === "forgot-email" && (
            <>
              <button
                type="button"
                onClick={backToLogin}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-steel hover:text-ink"
              >
                <FaArrowLeft size={11} />
                Back to sign in
              </button>

              <h1 className="mb-1 mt-3 text-xl font-extrabold text-ink">
                Reset Password
              </h1>

              <p className="mb-6 text-[13px] text-steel">
                Enter your admin email and
                we&apos;ll send you a
                verification code.
              </p>

              <form
                onSubmit={handleRequestCode}
                className="flex flex-col gap-4"
              >
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Email Address
                  </span>

                  <div className="flex min-w-0 items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 focus-within:border-ink">
                    <FaEnvelope
                      className="shrink-0 text-steel"
                      size={13}
                    />

                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={resetEmail}
                      onChange={(event) =>
                        setResetEmail(
                          event.target.value
                        )
                      }
                      placeholder={
                        ADMIN_AUTH_MESSAGES.emailPlaceholder
                      }
                      className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                    />
                  </div>
                </label>

                {error && (
                  <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex items-center justify-center gap-2 border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <FaSpinner
                      className="animate-spin"
                      size={13}
                    />
                  )}

                  {loading
                    ? "Please wait…"
                    : "Send Code"}
                </button>
              </form>
            </>
          )}

          {/* Forgot password — verification code */}
          {step === "forgot-code" && (
            <>
              <button
                type="button"
                onClick={backToLogin}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-steel hover:text-ink"
              >
                <FaArrowLeft size={11} />
                Back to sign in
              </button>

              <h1 className="mb-1 mt-3 text-xl font-extrabold text-ink">
                Enter Verification Code
              </h1>

              <p className="mb-6 text-[13px] text-steel">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-ink">
                  {resetEmail}
                </span>
                .
              </p>

              <form
                onSubmit={handleVerifyCode}
                className="flex flex-col gap-4"
              >
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">
                    Verification Code
                  </span>

                  <div className="flex min-w-0 items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 focus-within:border-ink">
                    <FaShieldAlt
                      className="shrink-0 text-steel"
                      size={13}
                    />

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      required
                      autoComplete="one-time-code"
                      value={code}
                      onChange={(event) =>
                        setCode(
                          event.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder={
                        ADMIN_AUTH_MESSAGES.codePlaceholder
                      }
                      className="w-full min-w-0 bg-transparent font-mono text-[15px] tracking-[0.3em] outline-none"
                    />
                  </div>
                </label>

                {error && (
                  <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 flex items-center justify-center gap-2 border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:border-accent hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <FaSpinner
                      className="animate-spin"
                      size={13}
                    />
                  )}

                  {loading
                    ? "Please wait…"
                    : "Verify Code"}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={
                    resendCooldown > 0 ||
                    loading
                  }
                  className="text-center text-[12px] font-semibold text-accent-dark hover:text-ink disabled:cursor-not-allowed disabled:text-steel-light"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}