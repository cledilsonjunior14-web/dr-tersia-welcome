import { useMemo, useState } from "react";
import { X, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
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
    question: "Como podemos te ajudar melhor?",
    options: [
      "Tirar uma dúvida",
      "Segunda opinião",
      "Retorno de exame",
      "Prefiro explicar no WhatsApp",
    ],
  },
};

const TOTAL_STEPS = 5;
type Step = 0 | 1 | 2 | 3 | 4;

const STEP_LABELS = ["Nome", "Contato", "Motivo", "Interesse", "Conclusão"];

export function QualificationFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [interesse, setInteresse] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);

  const progresso = ((step + 1) / TOTAL_STEPS) * 100;
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-wine-deep/55 backdrop-blur-[3px] sm:items-center sm:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="animate-fade-up relative flex w-full max-w-lg flex-col bg-background"
        style={{ maxHeight: "96dvh", boxShadow: "0 32px 80px -20px oklch(0.309 0.062 22 / 0.55)" }}
      >

        {/* ── Barra de progresso topo ── */}
        <div className="h-[3px] w-full bg-sand/50 shrink-0">
          <div
            className="h-[3px] bg-wine transition-all duration-500 ease-out"
            style={{ width: `${progresso}%` }}
          />
        </div>

        {/* ── Cabeçalho ── */}
        <div className="flex shrink-0 items-center justify-between border-b border-sand/60 px-6 py-4">
          {/* Steps lineares */}
          <div className="flex items-center gap-1">
            {STEP_LABELS.map((label, i) => (
              <div key={i} className="flex items-center gap-1">
                <span
                  className="text-[9px] font-semibold uppercase tracking-[0.18em] transition-colors duration-200"
                  style={{
                    color:
                      i < step
                        ? "oklch(0.446 0.135 26 / 0.5)"
                        : i === step
                        ? "oklch(0.446 0.135 26)"
                        : "oklch(0.851 0.021 55)",
                  }}
                >
                  {label}
                </span>
                {i < STEP_LABELS.length - 1 && (
                  <span className="text-[9px] text-sand/80 mx-0.5">·</span>
                )}
              </div>
            ))}
          </div>

          {/* Fechar */}
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="ml-3 shrink-0 text-foreground/40 transition-colors hover:text-foreground"
          >
            <X size={17} strokeWidth={1.8} />
          </button>
        </div>

        {/* ── Conteúdo ── */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10">

          {/* ETAPA 0 — Nome */}
          {step === 0 && (
            <Seção
              eyebrow="Primeira consulta"
              title="Vamos entender como podemos te atender."
              subtitle="São só algumas informações rápidas."
            >
              <label className="mt-8 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                Como podemos te chamar?
              </label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && nome.trim().length > 1) setStep(1); }}
                placeholder="Seu primeiro nome"
                className="mt-3 w-full border-b-2 border-sand bg-transparent pb-2 font-display text-[1.6rem] font-bold text-foreground outline-none transition-colors placeholder:font-normal placeholder:text-foreground/25 focus:border-wine"
              />
              <BotãoPrimário disabled={nome.trim().length < 2} onClick={() => setStep(1)}>
                Continuar
              </BotãoPrimário>
            </Seção>
          )}

          {/* ETAPA 1 — Telefone */}
          {step === 1 && (
            <Seção
              eyebrow={`Olá, ${nome.trim()}`}
              title="Qual é o seu WhatsApp?"
              subtitle="Usamos apenas para dar seguimento ao seu atendimento."
            >
              <label className="mt-8 block text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground/50">
                Número com DDD
              </label>
              <input
                autoFocus
                inputMode="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                onKeyDown={(e) => { if (e.key === "Enter" && isValidPhone(telefone)) criarLead(); }}
                placeholder="(88) 99999-9999"
                className="mt-3 w-full border-b-2 border-sand bg-transparent pb-2 font-display text-[1.6rem] font-bold text-foreground outline-none transition-colors placeholder:font-normal placeholder:text-foreground/25 focus:border-wine"
              />
              <BotãoPrimário disabled={!isValidPhone(telefone)} onClick={criarLead}>
                Continuar
              </BotãoPrimário>
              <BotãoVoltar onClick={() => setStep(0)} />
            </Seção>
          )}

          {/* ETAPA 2 — Motivo */}
          {step === 2 && (
            <Seção
              eyebrow="Sobre você"
              title="O que fez você procurar a Dra. Térsia hoje?"
              subtitle="Escolha a opção mais próxima."
            >
              <div className="mt-6 flex flex-col gap-2">
                {TRACKS.map((t) => (
                  <CartãoOpção
                    key={t.id}
                    label={t.label}
                    description={t.description}
                    selected={track === t.id}
                    onClick={() => escolherTrilha(t.id)}
                  />
                ))}
              </div>
              <BotãoVoltar onClick={() => setStep(1)} />
            </Seção>
          )}

          {/* ETAPA 3 — Interesse contextual */}
          {step === 3 && track && (
            <Seção eyebrow="Quase lá" title={CONTEXT[track].question}>
              <div className="mt-6 flex flex-col gap-2">
                {CONTEXT[track].options.map((op) => (
                  <CartãoOpção
                    key={op}
                    label={op}
                    selected={interesse === op}
                    onClick={() => escolherInteresse(op)}
                  />
                ))}
              </div>
              <BotãoVoltar onClick={() => setStep(2)} />
            </Seção>
          )}

          {/* ETAPA 4 — Tela final */}
          {step === 4 && lead && (
            <div className="flex flex-col items-center py-4 text-center">
              <div
                className="mb-6 flex h-14 w-14 items-center justify-center border border-wine/30"
                style={{ background: "oklch(0.985 0.005 75)" }}
              >
                <CheckCircle2 size={28} strokeWidth={1.4} className="text-wine" />
              </div>

              <p className="eyebrow text-wine">Tudo certo</p>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-wine-deep sm:text-3xl">
                {lead.nome}, suas informações<br />foram registradas.
              </h2>
              <p className="mt-3 max-w-xs text-[13px] leading-relaxed text-foreground/60">
                Agora vamos continuar seu atendimento pelo WhatsApp com uma mensagem já preparada para você.
              </p>

              <div className="my-7 h-px w-full bg-sand/60" />

              <a
                href={whatsappUrl(finalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2 bg-wine px-6 py-4 font-display text-[11px] font-bold tracking-[0.16em] text-primary-foreground transition-all duration-200 hover:bg-wine-deep"
              >
                CONTINUAR NO WHATSAPP
                <ArrowRight
                  size={13}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          )}
        </div>

        {/* ── Rodapé ── */}
        {step < 4 && (
          <div className="shrink-0 border-t border-sand/50 px-6 py-3 text-center">
            <p className="text-[9px] tracking-widest text-foreground/30 uppercase">
              Dra. Térsia Guimarães · CRM-CE 13957 · Sobral — CE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Subcomponentes ──────────────────────────── */

function Seção({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="eyebrow text-wine">{eyebrow}</p>
      <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-foreground sm:text-[1.75rem]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-[13px] leading-relaxed text-foreground/55">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function BotãoPrimário({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="mt-8 flex w-full items-center justify-center gap-2 bg-wine px-6 py-4 font-display text-[11px] font-bold tracking-[0.16em] text-primary-foreground transition-all duration-200 hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-25"
    >
      {children}
      <ArrowRight size={13} strokeWidth={2.5} />
    </button>
  );
}

function BotãoVoltar({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 flex items-center gap-1.5 text-[11px] font-medium tracking-wide text-foreground/40 transition-colors hover:text-foreground/70"
    >
      <ArrowLeft size={12} strokeWidth={2.5} />
      Voltar
    </button>
  );
}

function CartãoOpção({
  label,
  description,
  selected,
  onClick,
}: {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full border-l-2 px-4 py-3.5 text-left transition-all duration-150 ${
        selected
          ? "border-l-wine bg-wine/[0.04]"
          : "border-l-transparent bg-card hover:border-l-wine/40 hover:bg-cream/70"
      }`}
      style={{ borderRight: "1px solid", borderTop: "1px solid", borderBottom: "1px solid",
        borderRightColor: selected ? "oklch(0.446 0.135 26 / 0.25)" : "oklch(0.851 0.021 55 / 0.8)",
        borderTopColor: selected ? "oklch(0.446 0.135 26 / 0.25)" : "oklch(0.851 0.021 55 / 0.8)",
        borderBottomColor: selected ? "oklch(0.446 0.135 26 / 0.25)" : "oklch(0.851 0.021 55 / 0.8)",
      }}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span
            className="block text-[0.875rem] font-semibold leading-snug"
            style={{ color: selected ? "oklch(0.309 0.062 22)" : "oklch(0.215 0.008 50)" }}
          >
            {label}
          </span>
          {description && (
            <span className="mt-0.5 block text-[11px] leading-snug text-foreground/45">
              {description}
            </span>
          )}
        </div>
        {/* marcador lateral */}
        <div
          className="h-2 w-2 shrink-0 transition-colors duration-150"
          style={{
            background: selected ? "oklch(0.446 0.135 26)" : "oklch(0.851 0.021 55)",
          }}
        />
      </div>
    </button>
  );
}
