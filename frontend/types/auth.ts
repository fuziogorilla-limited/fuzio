/* =========================================================
   COMMON TYPES
========================================================= */

export type ID = number;

export type UUID = string;

export type DecimalString = string;

export type ISODateString = string;


/* =========================================================
   USER / AUTHENTICATION
========================================================= */

export interface User {
  id?: ID;
  first_name: string;
  last_name: string;
  email: string;
  date_registered?: ISODateString;
  date_updated?: ISODateString;
  is_staff?: boolean;
  is_superuser?: boolean;
}

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface VerifyCodeResponse {
  access: string;
  refresh?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiMessageResponse {
  message: string;
}
