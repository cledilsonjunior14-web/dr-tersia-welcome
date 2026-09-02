/**
 * Meta Pixel — utilitário de rastreamento
 *
 * Eventos disparados neste projeto:
 * - PageView  → automático ao carregar a página (via __root.tsx)
 * - Lead      → quando o usuário conclui o quiz e clica em "Continuar no WhatsApp"
 */

export const PIXEL_ID = "1370662325256129";

// Declaração global para evitar erros de TypeScript
declare global {
  interface Window {
    fbq: (
      action: "track" | "trackCustom" | "init",
      eventNameOrId: string,
      params?: Record<string, unknown>
    ) => void;
    _fbq: unknown;
  }
}

/** Dispara qualquer evento padrão do Meta Pixel */
function track(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

/**
 * Lead qualificado:
 * Disparado quando o usuário preenche todas as etapas do quiz
 * e clica em "Continuar no WhatsApp".
 */
export function trackLead(params?: {
  nome?: string;
  trilha?: string;
  interesse?: string;
}) {
  track("Lead", params);
}

/** PageView — chamado automaticamente via __root.tsx */
export function trackPageView() {
  track("PageView");
}
