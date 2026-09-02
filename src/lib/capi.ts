/**
 * Meta Conversions API (CAPI) — envio server-side do evento Lead.
 *
 * Roda como server function do TanStack Start. O navegador chama
 * sendLeadToCapi(); o servidor faz o hash dos dados pessoais, junta IP e
 * User-Agent da requisição e envia para a Graph API.
 *
 * Variáveis de ambiente (nunca expor no cliente):
 *   META_CAPI_TOKEN      token de acesso gerado no Gerenciador de Eventos
 *   META_TEST_EVENT_CODE opcional, para validar em "Testar eventos"
 *
 * Sem META_CAPI_TOKEN a função não faz nada e retorna { skipped: true }.
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";
import { createHash } from "node:crypto";
import { PIXEL_ID } from "./pixel";

const GRAPH_VERSION = "v21.0";

export interface CapiLeadInput {
  eventId: string;
  eventSourceUrl: string;
  phone?: string;      // dígitos com DDI
  firstName?: string;
  externalId?: string; // id do lead no nosso sistema
  fbp?: string;
  fbc?: string;
  trilha?: string;
  interesse?: string;
}

function sha256(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

export const sendLeadToCapi = createServerFn({ method: "POST" })
  .validator((input: CapiLeadInput) => input)
  .handler(async ({ data }) => {
    const token = process.env["META_CAPI_TOKEN"];
    if (!token) return { ok: false, skipped: true, status: 0 };

    const userData: Record<string, unknown> = {
      client_ip_address: getRequestIP() ?? undefined,
      client_user_agent: getRequestHeader("user-agent") ?? undefined,
    };
    if (data.phone) userData["ph"] = [sha256(data.phone.replace(/\D/g, ""))];
    if (data.firstName) userData["fn"] = [sha256(data.firstName)];
    if (data.externalId) userData["external_id"] = [sha256(data.externalId)];
    if (data.fbp) userData["fbp"] = data.fbp;
    if (data.fbc) userData["fbc"] = data.fbc;

    const body: Record<string, unknown> = {
      data: [
        {
          event_name: "Lead",
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          event_source_url: data.eventSourceUrl,
          action_source: "website",
          user_data: userData,
          custom_data: {
            trilha: data.trilha,
            interesse: data.interesse,
            content_name: "Quiz primeira consulta",
          },
        },
      ],
    };
    const testCode = process.env["META_TEST_EVENT_CODE"];
    if (testCode) body["test_event_code"] = testCode;

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) },
    );
    const text = await res.text().catch(() => "");
    if (!res.ok) console.error("CAPI error", res.status, text);
    return { ok: res.ok, skipped: false, status: res.status };
  });
