import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { getFbCookies, newEventId, setAdvancedMatching, trackLead } from "@/lib/pixel";
import { sendLeadToCapi } from "@/lib/capi";
import {
  buildLeadMessage,
  formatPhone,
  getTracking,
  isValidPhone,
  onlyDigits,
  saveLead,
  whatsappUrl,
  type Lead,
  type Track,
} from "@/lib/lead";

const TRACKS: { id: Track; label: string; description: string }[] = [
  {
    id: "ginecologia",
    label: "Consulta ginecológica / prevenção",
    description: "Rotina, exames e acompanhamento",
  },
  {
    id: "estetica",
    label: "Estética e saúde íntima",
    description: "Procedimentos e tratamentos íntimos",
  },
  {
    id: "gestacao",
    label: "Gestação / pré-natal",
    description: "Acompanhamento da gravidez",
  },
  {
    id: "outro",
    label: "Outro motivo",
    description: "Prefiro explicar no atendimento",
  },
];

const CONTEXT: Record<Track, { question: string; options: string[] }> = {
  ginecologia: {
    question: "O que você gostaria de fazer?",
    options: [
      "Consulta ginecológica",
      "Consulta + prevenção",
      "Quero uma avaliação mais completa",
      "Ainda não sei",
    ],
  },
  estetica: {
    question: "Qual assunto mais se aproxima do que você procura?",
    options: [
      "Ninfoplastia",
      "Clareamento íntimo",
      "Laser íntimo",
      "Preenchimento íntimo",
      "Ainda não sei qual é o mais indicado",
    ],
  },
  gestacao: {
    question: "Você está buscando:",
    options: [
      "Iniciar pré-natal",
      "Continuar acompanhamento",
      "Ultrassom / exame",
      "Outra orientação",
    ],
  },
  outro: {
    question: "Como podemos te orientar melhor?",
    options: [
      "Quero marcar uma avaliação",
      "Tenho uma dúvida sobre um atendimento",
      "Quero falar com a equipe",
    ],
  },
};

type Step = 0 | 1 | 2 | 3 | 4;


export function QualificationFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [interesse, setInteresse] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);

  const finalMessage = useMemo(() => (lead ? buildLeadMessage(lead) : ""), [lead]);

  function criarLead() {
    const novo: Lead = {
      id: `lead_${Date.now()}`,
      nome: nome.trim(),
      telefone: onlyDigits(telefone),
      origem: "Instagram",
      canal: "Link da bio",
      paciente: "primeira vez",
      etapa: "Novo Contato",
      status: "iniciou qualificação",
      quizConcluido: false,
      tracking: getTracking(),
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    setLead(novo);
    saveLead(novo);
    setAdvancedMatching({ phone: "55" + novo.telefone, firstName: novo.nome });
    setStep(2);
  }

  function escolherTrilha(t: Track) {
    setTrack(t);
    const label = TRACKS.find((x) => x.id === t)!.label;
    if (lead) {
      const atualizado: Lead = {
        ...lead,
        trilha: t,
        trilhaLabel: label,
        atualizadoEm: new Date().toISOString(),
      };
      setLead(atualizado);
      saveLead(atualizado);
    }
    setStep(3);
  }

  function escolherInteresse(op: string) {
    setInteresse(op);
    if (lead) {
      const atualizado: Lead = {
        ...lead,
        interesse: op,
        status: "qualificação concluída",
        quizConcluido: true,
        atualizadoEm: new Date().toISOString(),
      };
      setLead(atualizado);
      saveLead(atualizado);
    }
    setStep(4);
  }

  const passos = 4; // etapas com pergunta; a tela final não conta
  const atual = Math.min(step + 1, passos);
  const progresso = (atual / passos) * 100;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/55 sm:items-center sm:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-up relative flex w-full max-w-[460px] flex-col rounded-t-[26px] bg-card sm:rounded-[22px]"
        style={{ maxHeight: "94dvh" }}
      >
        {/* ── Topo: progresso + fechar ── */}
        <div className="flex shrink-0 items-center gap-3.5 px-5 pt-4">
          <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-wine transition-all duration-300"
              style={{ width: `${progresso}%` }}
            />
          </div>
          {step < 4 && (
            <span className="text-[12px] font-semibold tracking-[0.04em] text-foreground/60">
              {atual} de {passos}
            </span>
          )}
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-[34px] w-[34px] place-items-center rounded-full border border-sand bg-card text-wine-deep transition-colors hover:border-wine-deep"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Conteúdo ── */}
        <div className="flex-1 overflow-y-auto px-[22px] pb-[26px] pt-[22px]">

          {/* ETAPA 0 — Nome */}
          {step === 0 && (
            <Seção
              title="Olá! Como podemos te chamar?"
              subtitle="São só algumas informações rápidas para entendermos como te atender."
            >
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && nome.trim().length > 1) setStep(1); }}
                placeholder="Seu primeiro nome"
                autoComplete="given-name"
                aria-label="Seu primeiro nome"
                className={campo}
              />
              <Nav>
                <BotãoPrimário disabled={nome.trim().length < 2} onClick={() => setStep(1)} />
              </Nav>
            </Seção>
          )}

          {/* ETAPA 1 — Telefone */}
          {step === 1 && (
            <Seção
              title="Pra qual número podemos continuar seu atendimento?"
              subtitle="Usamos o WhatsApp para dar sequência à sua consulta."
            >
              <input
                autoFocus
                inputMode="tel"
                autoComplete="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                onKeyDown={(e) => { if (e.key === "Enter" && isValidPhone(telefone)) criarLead(); }}
                placeholder="(88) 99999-9999"
                aria-label="Seu WhatsApp com DDD"
                className={campo}
              />
              <Nav>
                <BotãoVoltar onClick={() => setStep(0)} />
                <BotãoPrimário disabled={!isValidPhone(telefone)} onClick={criarLead} />
              </Nav>
            </Seção>
          )}

          {/* ETAPA 2 — Motivo */}
          {step === 2 && (
            <Seção
              title="O que fez você procurar a Dra. Térsia hoje?"
              subtitle="Não precisa saber o nome de nenhum procedimento."
            >
              <div className="grid gap-2.5">
                {TRACKS.map((t) => (
                  <Opção
                    key={t.id}
                    label={t.label}
                    selected={track === t.id}
                    onClick={() => escolherTrilha(t.id)}
                  />
                ))}
              </div>
              <Nav>
                <BotãoVoltar onClick={() => setStep(1)} />
              </Nav>
            </Seção>
          )}

          {/* ETAPA 3 — Interesse contextual */}
          {step === 3 && track && (
            <Seção
              title={CONTEXT[track].question}
              subtitle="Escolha a opção mais próxima. A equipe ajusta com você depois."
            >
              <div className="grid gap-2.5">
                {CONTEXT[track].options.map((op) => (
                  <Opção
                    key={op}
                    label={op}
                    selected={interesse === op}
                    onClick={() => escolherInteresse(op)}
                  />
                ))}
              </div>
              <Nav>
                <BotãoVoltar onClick={() => setStep(2)} />
              </Nav>
            </Seção>
          )}

          {/* ETAPA 4 — Final */}
          {step === 4 && lead && (
            <div>
              <h2 className="font-display text-[30px] font-normal leading-[1.15] tracking-[-0.015em] text-wine-deep">
                Tudo certo, {lead.nome}.
              </h2>
              <p className="mb-[26px] mt-2 text-[15.5px] leading-[1.55] text-foreground">
                Já registramos suas informações. Agora vamos continuar seu atendimento pelo WhatsApp.
              </p>
              <a
                href={whatsappUrl(finalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  const eventId = newEventId();
                  const params = {
                    ...(lead.trilha ? { trilha: lead.trilha } : {}),
                    ...(lead.interesse ? { interesse: lead.interesse } : {}),
                  };
                  trackLead(params, eventId);
                  sendLeadToCapi({
                    data: {
                      eventId,
                      eventSourceUrl: window.location.href,
                      phone: "55" + lead.telefone,
                      firstName: lead.nome,
                      externalId: lead.id,
                      ...getFbCookies(),
                      ...params,
                    },
                  }).catch(() => {});
                }}
                className="flex w-full items-center justify-center gap-2.5 rounded-[14px] bg-wine px-5 py-[16px] text-[16px] font-bold text-primary-foreground transition-colors hover:bg-wine-deep"
              >
                <WhatsAppIcon />
                Continuar no WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Subcomponentes ──────────────────────────── */

const campo =
  "w-full rounded-[14px] border border-sand bg-card px-4 py-4 text-[17px] text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-wine";

function Seção({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="font-display text-[26px] font-normal leading-[1.18] tracking-[-0.015em] text-wine-deep">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[14.5px] leading-[1.55] text-foreground/60">{subtitle}</p>
      )}
      <div className="mt-[22px]">{children}</div>
    </div>
  );
}

function Nav({ children }: { children: React.ReactNode }) {
  return <div className="mt-[22px] flex gap-2.5">{children}</div>;
}

function BotãoPrimário({ disabled, onClick }: { disabled?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 rounded-[14px] bg-wine px-[18px] py-[15px] text-[16px] font-bold text-primary-foreground transition-colors hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-40"
    >
      Continuar
    </button>
  );
}

function BotãoVoltar({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-[14px] border border-sand px-[18px] py-[15px] text-[16px] font-semibold text-wine-deep transition-colors hover:border-wine-deep"
    >
      Voltar
    </button>
  );
}

function Opção({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "w-full rounded-[14px] border px-4 py-4 text-left text-[15.5px] font-semibold transition-colors " +
        (selected
          ? "border-wine bg-wine/5 text-wine-deep shadow-[inset_0_0_0_1px_var(--wine)]"
          : "border-sand bg-card text-foreground hover:border-wine-deep")
      }
    >
      {label}
    </button>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 1.8a8.2 8.2 0 1 1-4.2 15.3l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 0 1 12 3.8zm-3 4.4c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.2 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3l-2-1c-.3-.1-.5-.1-.7.1l-.9 1.1c-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5L9.8 8.6c-.2-.4-.4-.4-.6-.4H9z" />
    </svg>
  );
}
