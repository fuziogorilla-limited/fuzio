import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import apiFetch from "@/lib/api";
import routes from "@/lib/routes";

import {
  ADMIN_AUTH_MESSAGES,
} from "@/constants/admin-auth";

import type {
  AdminAuthError,
  AdminAuthStep,
  ForgotPasswordResponse,
  LoginResponse,
  VerifyCodeResponse,
} from "@/types/fields";

function extractErrorMessage(
  error: unknown,
  fallback: string
) {
  const apiError = error as AdminAuthError;

  if (apiError?.data) {
    if (
      typeof apiError.data.message === "string"
    ) {
      return apiError.data.message;
    }

    if (
      typeof apiError.data.detail === "string"
    ) {
      return apiError.data.detail;
    }

    const firstKey = Object.keys(apiError.data)[0];

    if (firstKey) {
      const value = apiError.data[firstKey];

      if (
        Array.isArray(value) &&
        typeof value[0] === "string"
      ) {
        return value[0];
      }

      if (typeof value === "string") {
        return value;
      }
    }
  }

  if (apiError?.status === 401) {
    return ADMIN_AUTH_MESSAGES.invalidCredentials;
  }

  return fallback;
}

function storeTokens(
  access: string,
  refresh?: string
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "access_token",
    access
  );

  if (refresh) {
    localStorage.setItem(
      "refresh_token",
      refresh
    );
  }
}

function clearTokens() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export function useAdminAuth() {
  const router = useRouter();

  const [step, setStep] =
    useState<AdminAuthStep>("login");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // Login
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  // Password reset
  const [resetEmail, setResetEmail] =
    useState("");

  const [code, setCode] =
    useState("");

  const [resendCooldown, setResendCooldown] =
    useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setResendCooldown(
        (seconds) => seconds - 1
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetMessages = () => {
    setError("");
  };

  const handleLogin = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    resetMessages();
    setLoading(true);

    try {
      clearTokens();

      const data =
        await apiFetch<LoginResponse>(
          routes.auth.login,
          {
            method: "POST",

            body: {
              email: email
                .trim()
                .toLowerCase(),
              password,
            },

            skipAuth: true,
            skipRefresh: true,
          }
        );

      if (
        !data.access ||
        !data.refresh
      ) {
        throw new Error(
          ADMIN_AUTH_MESSAGES.missingLoginTokens
        );
      }

      storeTokens(
        data.access,
        data.refresh
      );

      router.replace(
        "/admin/dashboard"
      );
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          ADMIN_AUTH_MESSAGES.loginFallback
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCode = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    resetMessages();
    setLoading(true);

    try {
      await apiFetch<ForgotPasswordResponse>(
        routes.auth.forgotPassword,
        {
          method: "POST",

          body: {
            email: resetEmail
              .trim()
              .toLowerCase(),
          },

          skipAuth: true,
          skipRefresh: true,
        }
      );

      setResendCooldown(
        ADMIN_AUTH_MESSAGES.resendCooldown
      );

      setStep("forgot-code");
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          ADMIN_AUTH_MESSAGES.forgotPasswordFallback
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (
      resendCooldown > 0 ||
      loading
    ) {
      return;
    }

    resetMessages();
    setLoading(true);

    try {
      await apiFetch<ForgotPasswordResponse>(
        routes.auth.forgotPassword,
        {
          method: "POST",

          body: {
            email: resetEmail
              .trim()
              .toLowerCase(),
          },

          skipAuth: true,
          skipRefresh: true,
        }
      );

      setResendCooldown(
        ADMIN_AUTH_MESSAGES.resendCooldown
      );
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          ADMIN_AUTH_MESSAGES.resendFallback
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (
    event: FormEvent
  ) => {
    event.preventDefault();

    resetMessages();
    setLoading(true);

    try {
      const data =
        await apiFetch<VerifyCodeResponse>(
          routes.auth.verifyCode,
          {
            method: "POST",

            body: {
              email: resetEmail
                .trim()
                .toLowerCase(),
              code,
            },

            skipAuth: true,
            skipRefresh: true,
          }
        );

      if (!data.access) {
        throw new Error(
          ADMIN_AUTH_MESSAGES.missingVerificationToken
        );
      }

      storeTokens(
        data.access,
        data.refresh
      );

      router.replace(
        "/admin/dashboard"
      );
    } catch (err) {
      setError(
        extractErrorMessage(
          err,
          ADMIN_AUTH_MESSAGES.invalidCode
        )
      );
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

  return {
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
  };
}