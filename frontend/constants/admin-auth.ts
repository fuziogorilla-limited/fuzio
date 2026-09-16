export const ADMIN_AUTH_MESSAGES = {
  invalidCredentials: "Invalid email or password.",

  loginFallback:
    "Invalid email or password.",

  forgotPasswordFallback:
    "Something went wrong. Please try again.",

  resendFallback:
    "Couldn't resend the code. Please try again.",

  invalidCode:
    "That code is invalid or has expired.",

  missingLoginTokens:
    "Login succeeded but the server did not return authentication tokens.",

  missingVerificationToken:
    "Verification succeeded but no access token was returned.",

  emailPlaceholder:
    "admin@fuziogorilla.co.ke",

  passwordPlaceholder:
    "••••••••",

  codePlaceholder:
    "000000",

  resendCooldown: 30,
} as const;