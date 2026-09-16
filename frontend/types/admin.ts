export type ApiErrorShape = {
  status?: number;
  data?: Record<string, unknown> | null;
};

export type AdminProduct = {
  id: number;
  is_active: boolean;
};