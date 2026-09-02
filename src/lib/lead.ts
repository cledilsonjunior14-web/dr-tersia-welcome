// Número de WhatsApp da clínica (formato internacional, somente dígitos).
export const WHATSAPP_NUMBER = "5588999999999";

export type Track = "ginecologia" | "estetica" | "gestacao" | "outro";

export interface TrackingData {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  referrer?: string;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  origem: string;
  canal: string;
  paciente: "primeira vez";
  trilha?: Track;
  trilhaLabel?: string;
  interesse?: string;
  etapa: "Novo Contato";
  status: "iniciou qualificação" | "qualificação concluída";
  quizConcluido: boolean;
  tracking: TrackingData;
  criadoEm: string;
  atualizadoEm: string;
}

export function getTracking(): TrackingData {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const t: TrackingData = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const) {
    const v = p.get(k);
    if (v) t[k] = v;
  }
  const fbclid = p.get("fbclid");
  if (fbclid) t.fbclid = fbclid;
  if (document.referrer) t.referrer = document.referrer;
  return t;
}

export function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

export function formatPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function isValidPhone(value: string) {
  return onlyDigits(value).length >= 10;
}

/**
 * Persistência local do lead. Substituir/estender por uma chamada ao CRM
 * (server function) quando o backend estiver conectado.
 */
export function saveLead(lead: Lead) {
  try {
    localStorage.setItem("lead:atual", JSON.stringify(lead));
    const all = JSON.parse(localStorage.getItem("leads") ?? "[]") as Lead[];
    const idx = all.findIndex((l) => l.id === lead.id);
    if (idx >= 0) all[idx] = lead;
    else all.push(lead);
    localStorage.setItem("leads", JSON.stringify(all));
  } catch {
    /* storage indisponível */
  }
}

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const RETURNING_PATIENT_MESSAGE =
  "Olá, já sou paciente da Dra. Térsia e gostaria de atendimento.";

export function buildLeadMessage(lead: Lead) {
  const partes = [
    `Olá, sou ${lead.nome}.`,
    "Vim pelo Instagram e estou buscando atendimento pela primeira vez.",
  ];
  if (lead.trilhaLabel) {
    partes.push(
      lead.interesse
        ? `Meu interesse é ${lead.trilhaLabel.toLowerCase()}, especialmente ${lead.interesse.toLowerCase()}.`
        : `Meu interesse é ${lead.trilhaLabel.toLowerCase()}.`,
    );
  }
  return partes.join(" ");
}
