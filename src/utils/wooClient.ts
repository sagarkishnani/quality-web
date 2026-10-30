// Sin credenciales: solo habla con public/woo-api.php. Un recurso nuevo se agrega primero a $ROUTES del proxy.

import type { WooProduct, WooStock, WooCategory } from "../lib/woo/types";

function endpoint(): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}woo-api.php`.replace(/([^:])\/\//g, "$1/");
}

interface ApiOk<T> { ok: true; data: T }
interface ApiErr { ok: false; error: string }

async function call<T>(
  resource: string,
  params: Record<string, string | number> = {},
  init?: RequestInit
): Promise<T | null> {
  const qs = new URLSearchParams({ resource, ...Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ) });

  try {
    const res = await fetch(`${endpoint()}?${qs}`, {
      ...init,
      headers: { Accept: "application/json", ...(init?.headers || {}) },
    });
    const body = (await res.json()) as ApiOk<T> | ApiErr;
    if (!body.ok) {
      console.warn(`[woo] ${resource}: ${body.error}`);
      return null;
    }
    return body.data;
  } catch (err) {
    console.warn(`[woo] ${resource} no respondió`, err);
    return null;
  }
}

export async function fetchStock(ids: number[]): Promise<Map<number, WooStock>> {
  const out = new Map<number, WooStock>();
  if (!ids.length) return out;
  const rows = await call<WooStock[]>("stock", { include: ids.join(",") });
  for (const r of rows ?? []) out.set(r.id, r);
  return out;
}

export async function searchProducts(term: string, perPage = 12): Promise<WooProduct[]> {
  if (term.trim().length < 2) return [];
  return (await call<WooProduct[]>("products", { search: term, per_page: perPage })) ?? [];
}

export async function fetchProducts(
  params: { category?: string; page?: number; per_page?: number; orderby?: string; order?: "asc" | "desc" } = {}
): Promise<WooProduct[]> {
  return (await call<WooProduct[]>("products", params as Record<string, string | number>)) ?? [];
}

export async function fetchCategories(): Promise<WooCategory[]> {
  return (await call<WooCategory[]>("categories")) ?? [];
}

