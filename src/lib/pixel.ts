/**
 * Meta Pixel — rastreamento no cliente
 *
 * Eventos:
 * - PageView → automático ao carregar (script em __root.tsx)
 * - Lead     → ao clicar em "Continuar no WhatsApp" na tela final do quiz
 *
 * Cada Lead recebe um eventID único. O mesmo ID é enviado pela Conversions API
 * (src/lib/capi.ts) para o Meta deduplicar Pixel + CAPI.
 *
 * Advanced Matching: após capturar nome e telefone, o Pixel é reinicializado
 * com esses dados. O próprio fbevents.js faz o hash antes de enviar.
 *
 * dataLayer: cada evento também é publicado em window.dataLayer, para GTM ou
 * qualquer outra ferramenta ler os mesmos dados.
 */

export const PIXEL_ID = "1370662325256129";

type FbqOptions = { eventID?: string };

declare global {
  interface Window {
    fbq: (
      action: "track" | "trackCustom" | "init",
      eventNameOrId: string,
      params?: Record<string, unknown>,
      options?: FbqOptions,
    ) => void;
    _fbq: unknown;
    dataLayer: Record<string, unknown>[];
  }
}

function hasFbq() {
  return typeof window !== "undefined" && typeof window.fbq === "function";
}

export function pushDataLayer(event: string, data: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
}

/** ID único por evento, compartilhado entre Pixel e CAPI. */
export function newEventId(prefix = "lead") {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}_${rand}`;
}

/** Cookies _fbp/_fbc, usados pela CAPI para casar o evento com o navegador. */
export function getFbCookies() {
  if (typeof document === "undefined") return {};
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(name + "="))
      ?.slice(name.length + 1);
  const out: { fbp?: string; fbc?: string } = {};
  const fbp = read("_fbp");
  const fbc = read("_fbc");
  if (fbp) out.fbp = fbp;
  if (fbc) out.fbc = fbc;
  return out;
}

/**
 * Advanced Matching: reinicializa o Pixel com telefone e primeiro nome.
 * Telefone em dígitos com DDI (ex.: 5588999998888). Nome em minúsculas.
 */
export function setAdvancedMatching(user: { phone?: string; firstName?: string }) {
  if (!hasFbq()) return;
  const data: Record<string, string> = {};
  if (user.phone) data["ph"] = user.phone.replace(/\D/g, "");
  if (user.firstName) data["fn"] = user.firstName.trim().toLowerCase();
  if (Object.keys(data).length) window.fbq("init", PIXEL_ID, data);
}

/** Lead qualificado. Retorna o eventID usado, para repassar à CAPI. */
export function trackLead(
  params?: { trilha?: string; interesse?: string },
  eventId: string = newEventId(),
) {
  pushDataLayer("lead_qualificado", { event_id: eventId, ...params });
  if (hasFbq()) window.fbq("track", "Lead", params, { eventID: eventId });
  return eventId;
}

export function trackPageView() {
  if (hasFbq()) window.fbq("track", "PageView");
}
