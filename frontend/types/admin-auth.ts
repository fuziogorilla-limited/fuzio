export type AdminAuthStep =
  | "login"
  | "forgot-email"
  | "forgot-code";

export type LoginResponse = {
  refresh: string;
  access: string;
};

export type ForgotPasswordResponse = {
  message: string;
};

export type VerifyCodeResponse = {
  access: string;
  refresh?: string;
};

export type AdminAuthError = {
  status?: number;
  data?: {
    message?: string;
    detail?: string;
    [key: string]: unknown;
  } | null;
};