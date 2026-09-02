import { useMemo, useState } from "react";
import { X, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
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
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-wine-deep/50 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Modal ── */}
      <div
        className="animate-fade-up relative flex w-full max-w-lg flex-col bg-background shadow-editorial sm:rounded-sm"
        style={{ maxHeight: "95dvh" }}
      >

        {/* ── Topo: barra de progresso + fechar ── */}
        <div className="shrink-0">
          {/* barra */}
          <div className="h-0.5 w-full bg-sand/60">
            <div
              className="h-0.5 bg-wine transition-all duration-500 ease-out"
              style={{ width: `${progresso}%` }}
            />
          </div>

          {/* header interno */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <div className="flex items-center gap-1.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === step ? "20px" : "6px",
                    backgroundColor:
                      i < step
                        ? "oklch(0.446 0.135 26)"        /* wine */
                        : i === step
                        ? "oklch(0.446 0.135 26 / 0.8)"
                        : "oklch(0.851 0.021 55)",       /* sand */
                  }}
                />
              ))}
            </div>

            <button
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <X size={16} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── Conteúdo scrollável ── */}
        <div className="flex-1 overflow-y-auto px-6 pb-8 pt-4 sm:px-10">

          {/* ETAPA 0 — Nome */}
          {step === 0 && (
            <Section
              eyebrow="Primeira consulta"
              title="Vamos entender como podemos te atender."
              subtitle="São só algumas informações rápidas."
            >
              <label className="mt-8 block text-xs tracking-wide text-muted-foreground uppercase">
                Como podemos te chamar?
              </label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nome.trim().length > 1) setStep(1);
                }}
                placeholder="Seu primeiro nome"
                className="mt-2 w-full border-b border-border bg-transparent pb-2 font-display text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-wine"
              />
              <PrimaryBtn disabled={nome.trim().length < 2} onClick={() => setStep(1)}>
                Continuar
              </PrimaryBtn>
            </Section>
          )}

          {/* ETAPA 1 — Telefone */}
          {step === 1 && (
            <Section
              eyebrow={`Olá, ${nome.trim()} 👋`}
              title="Qual é o seu WhatsApp?"
              subtitle="Usamos apenas para dar seguimento ao seu atendimento."
            >
              <label className="mt-8 block text-xs tracking-wide text-muted-foreground uppercase">
                Número com DDD
              </label>
              <input
                autoFocus
                inputMode="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidPhone(telefone)) criarLead();
                }}
                placeholder="(88) 99999-9999"
                className="mt-2 w-full border-b border-border bg-transparent pb-2 font-display text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-wine"
              />
              <PrimaryBtn disabled={!isValidPhone(telefone)} onClick={criarLead}>
                Continuar
              </PrimaryBtn>
              <BackBtn onClick={() => setStep(0)} />
            </Section>
          )}

          {/* ETAPA 2 — Motivo */}
          {step === 2 && (
            <Section
              eyebrow="Sobre você"
              title="O que fez você procurar a Dra. Térsia hoje?"
              subtitle="Escolha a opção mais próxima."
            >
              <div className="mt-6 flex flex-col gap-2.5">
                {TRACKS.map((t) => (
                  <OptionCard
                    key={t.id}
                    label={t.label}
                    description={t.description}
                    selected={track === t.id}
                    onClick={() => escolherTrilha(t.id)}
                  />
                ))}
              </div>
              <BackBtn onClick={() => setStep(1)} />
            </Section>
          )}

          {/* ETAPA 3 — Interesse contextual */}
          {step === 3 && track && (
            <Section eyebrow="Quase lá ✨" title={CONTEXT[track].question}>
              <div className="mt-6 flex flex-col gap-2.5">
                {CONTEXT[track].options.map((op) => (
                  <OptionCard
                    key={op}
                    label={op}
                    selected={interesse === op}
                    onClick={() => escolherInteresse(op)}
                  />
                ))}
              </div>
              <BackBtn onClick={() => setStep(2)} />
            </Section>
          )}

          {/* ETAPA 4 — Confirmação final */}
          {step === 4 && lead && (
            <div className="flex flex-col items-center py-6 text-center">
              {/* ícone de check animado */}
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-wine/30 bg-cream/60">
                <CheckCircle size={32} strokeWidth={1.5} className="text-wine" />
              </div>

              <p className="eyebrow text-wine">Tudo certo</p>
              <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-wine-deep sm:text-3xl">
                Tudo certo, {lead.nome}!
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Suas informações foram registradas. Agora vamos continuar
                seu atendimento pelo WhatsApp.
              </p>

              {/* linha decorativa */}
              <div className="my-6 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-sand/60" />
                <span className="eyebrow text-[9px] text-wine/40">próximo passo</span>
                <span className="h-px flex-1 bg-sand/60" />
              </div>

              <a
                href={whatsappUrl(finalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-2 bg-wine px-6 py-4 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground transition-all duration-300 hover:bg-wine-deep hover:shadow-editorial"
              >
                Continuar no WhatsApp
                <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          )}
        </div>

        {/* ── Rodapé discreto ── */}
        {step < 4 && (
          <div className="shrink-0 border-t border-sand/40 px-6 py-3 text-center">
            <p className="text-[9px] tracking-wide text-wine-deep/25">
              Dra. Térsia Guimarães · Atendimento particular em Sobral — CE
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Subcomponentes ──────────────────────────── */

function Section({
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
      <h2 className="mt-3 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      )}
      {children}
    </div>
  );
}

function PrimaryBtn({
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
      className="mt-8 flex w-full items-center justify-center gap-2 bg-wine px-6 py-4 font-display text-xs font-bold tracking-[0.14em] text-primary-foreground transition-all duration-200 hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
      <ArrowRight size={13} strokeWidth={2.5} />
    </button>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-5 flex items-center gap-1.5 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
    >
      <ArrowLeft size={12} strokeWidth={2} />
      Voltar
    </button>
  );
}

function OptionCard({
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
      className={`w-full border px-4 py-3.5 text-left transition-all duration-150 ${
        selected
          ? "border-wine bg-wine/5 shadow-sm"
          : "border-sand/80 bg-card hover:border-wine/50 hover:bg-cream/50"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="block text-[0.9rem] font-medium leading-snug text-foreground">
            {label}
          </span>
          {description && (
            <span className="mt-0.5 block text-[11px] leading-snug text-muted-foreground">
              {description}
            </span>
          )}
        </div>
        <div
          className={`h-4 w-4 shrink-0 rounded-full border-2 transition-colors ${
            selected ? "border-wine bg-wine" : "border-sand"
          }`}
        />
      </div>
    </button>
  );
}
