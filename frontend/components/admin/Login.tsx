"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaSpinner,
  FaShieldAlt,
} from "react-icons/fa";

// TODO: replace with your real backend base URL
const API_BASE = "https://api.example.com";

type Step = "login" | "forgot-email" | "forgot-code";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // forgot-password fields
  const [resetEmail, setResetEmail] = useState("");
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const resetMessages = () => setError("");

  // ---------- Step 1: Login ----------
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Invalid email or password");
      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Step 2: Request reset code ----------
  const handleRequestCode = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (!res.ok) throw new Error("We couldn't find an account with that email.");
      setResendCooldown(30);
      setStep("forgot-code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
      if (!res.ok) throw new Error("Couldn't resend the code. Please try again.");
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- Step 3: Verify code ----------
  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail, code }),
      });
      if (!res.ok) throw new Error("That code is invalid or has expired.");
      const data = await res.json();
      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const backToLogin = () => {
    resetMessages();
    setResetEmail("");
    setCode("");
    setResendCooldown(0);
    setStep("login");
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-ink px-4 py-10">
      <div className="w-full max-w-[400px]">
        {/* Brand */}
        <div className="mb-7 flex flex-col items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center border-2 border-paper bg-accent text-[16px] font-extrabold tracking-tight text-ink">
            FG
          </div>
          <div className="text-center leading-none">
            <div className="text-[15px] font-extrabold tracking-wide text-paper">FUZIO GORILLA</div>
            <div className="mt-1 font-mono text-[9px] tracking-[0.13em] text-accent">ADMIN PANEL</div>
          </div>
        </div>

        <div className="border border-white/10 bg-paper p-7">
          {/* ---------- LOGIN ---------- */}
          {step === "login" && (
            <>
              <h1 className="mb-1 text-xl font-extrabold text-ink">Admin Sign In</h1>
              <p className="mb-6 text-[13px] text-steel">Enter your credentials to access the dashboard.</p>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <Field label="Email Address">
                  <FaEnvelope className="shrink-0 text-steel" size={13} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@fuziogorilla.co.ke"
                    className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                  />
                </Field>

                <Field label="Password">
                  <FaLock className="shrink-0 text-steel" size={13} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-steel hover:text-ink"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </Field>

                <button
                  type="button"
                  onClick={() => {
                    resetMessages();
                    setStep("forgot-email");
                  }}
                  className="self-end text-[12px] font-semibold text-accent-dark hover:text-ink"
                >
                  Forgot password?
                </button>

                {error && <ErrorText message={error} />}

                <SubmitButton loading={loading} label="Sign In" />
              </form>
            </>
          )}

          {/* ---------- FORGOT: ENTER EMAIL ---------- */}
          {step === "forgot-email" && (
            <>
              <BackButton onClick={backToLogin} />
              <h1 className="mb-1 mt-3 text-xl font-extrabold text-ink">Reset Password</h1>
              <p className="mb-6 text-[13px] text-steel">
                Enter your admin email and we&apos;ll send you a verification code.
              </p>

              <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
                <Field label="Email Address">
                  <FaEnvelope className="shrink-0 text-steel" size={13} />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="admin@fuziogorilla.co.ke"
                    className="w-full min-w-0 bg-transparent text-[13.5px] outline-none"
                  />
                </Field>

                {error && <ErrorText message={error} />}

                <SubmitButton loading={loading} label="Send Code" />
              </form>
            </>
          )}

          {/* ---------- FORGOT: ENTER CODE ---------- */}
          {step === "forgot-code" && (
            <>
              <BackButton onClick={backToLogin} />
              <h1 className="mb-1 mt-3 text-xl font-extrabold text-ink">Enter Verification Code</h1>
              <p className="mb-6 text-[13px] text-steel">
                We sent a 6-digit code to <span className="font-semibold text-ink">{resetEmail}</span>.
              </p>

              <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
                <Field label="Verification Code">
                  <FaShieldAlt className="shrink-0 text-steel" size={13} />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full min-w-0 bg-transparent tracking-[0.3em] text-[15px] font-mono outline-none"
                  />
                </Field>

                {error && <ErrorText message={error} />}

                <SubmitButton loading={loading} label="Verify Code" />

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendCooldown > 0 || loading}
                  className="text-center text-[12px] font-semibold text-accent-dark hover:text-ink disabled:cursor-not-allowed disabled:text-steel-light"
                >
                  {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : "Resend code"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// ---------- Small shared bits (kept local — only used on this page) ----------
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide text-ink">{label}</span>
      <div className="flex min-w-0 items-center gap-2.5 border border-ink/15 bg-paper px-3.5 py-3 focus-within:border-ink">
        {children}
      </div>
    </label>
  );
}

function SubmitButton({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-1 flex items-center justify-center gap-2 border-2 border-ink bg-ink py-3 text-[13px] font-bold uppercase tracking-wide text-paper transition-colors hover:bg-accent hover:border-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading && <FaSpinner className="animate-spin" size={13} />}
      {loading ? "Please wait…" : label}
    </button>
  );
}

function ErrorText({ message }: { message: string }) {
  return <p className="border-l-4 border-accent-dark bg-accent/10 px-3 py-2 text-[12.5px] text-accent-dark">{message}</p>;
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-[12px] font-semibold text-steel hover:text-ink"
    >
      <FaArrowLeft size={11} /> Back to sign in
    </button>
  );
}