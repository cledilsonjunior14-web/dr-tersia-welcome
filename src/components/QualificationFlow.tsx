import { useMemo, useState } from "react";
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
  { id: "gestacao", label: "Gestação / pré-natal", description: "Acompanhamento da gravidez" },
  { id: "outro", label: "Outro motivo", description: "Prefiro explicar no atendimento" },
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

type Step = 0 | 1 | 2 | 3 | 4;

export function QualificationFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>(0);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [track, setTrack] = useState<Track | null>(null);
  const [interesse, setInteresse] = useState<string | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);

  const progresso = ((step + 1) / 5) * 100;

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
    <div className="fixed inset-0 z-50 flex items-stretch justify-center overflow-y-auto bg-wine-deep/60 backdrop-blur-[2px] p-0 sm:items-center sm:p-6">
      <div className="relative flex w-full max-w-xl flex-col bg-background shadow-editorial sm:rounded-sm">
        <div className="h-px w-full bg-border">
          <div
            className="h-px bg-wine transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>

        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-5 top-5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Fechar
        </button>

        <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 sm:py-14">
          {step === 0 && (
            <Section
              eyebrow="Primeira consulta"
              title="Vamos entender como podemos te atender."
              subtitle="São só algumas informações rápidas."
            >
              <label className="mt-10 block text-sm text-muted-foreground">
                Olá! Como podemos te chamar?
              </label>
              <input
                autoFocus
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && nome.trim().length > 1) setStep(1);
                }}
                placeholder="Seu primeiro nome"
                className="mt-3 w-full border-b border-border bg-transparent pb-3 font-display text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-wine"
              />
              <Primary disabled={nome.trim().length < 2} onClick={() => setStep(1)}>
                Continuar
              </Primary>
            </Section>
          )}

          {step === 1 && (
            <Section
              eyebrow={`Olá, ${nome.trim()}`}
              title="Pra qual número podemos continuar seu atendimento?"
              subtitle="Usamos apenas para dar seguimento pelo WhatsApp."
            >
              <input
                autoFocus
                inputMode="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatPhone(e.target.value))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && isValidPhone(telefone)) criarLead();
                }}
                placeholder="(88) 99999-9999"
                className="mt-10 w-full border-b border-border bg-transparent pb-3 font-display text-2xl text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-wine"
              />
              <Primary disabled={!isValidPhone(telefone)} onClick={criarLead}>
                Continuar
              </Primary>
              <Back onClick={() => setStep(0)} />
            </Section>
          )}

          {step === 2 && (
            <Section
              eyebrow="Sobre você"
              title="O que fez você procurar a Dra. Térsia hoje?"
              subtitle="Escolha a opção mais próxima."
            >
              <div className="mt-8 flex flex-col gap-3">
                {TRACKS.map((t) => (
                  <Option
                    key={t.id}
                    label={t.label}
                    description={t.description}
                    selected={track === t.id}
                    onClick={() => escolherTrilha(t.id)}
                  />
                ))}
              </div>
              <Back onClick={() => setStep(1)} />
            </Section>
          )}

          {step === 3 && track && (
            <Section eyebrow="Quase lá" title={CONTEXT[track].question}>
              <div className="mt-8 flex flex-col gap-3">
                {CONTEXT[track].options.map((op) => (
                  <Option
                    key={op}
                    label={op}
                    selected={interesse === op}
                    onClick={() => escolherInteresse(op)}
                  />
                ))}
              </div>
              <Back onClick={() => setStep(2)} />
            </Section>
          )}

          {step === 4 && lead && (
            <Section
              eyebrow="Tudo certo"
              title={`Tudo certo, ${lead.nome}.`}
              subtitle="Já registramos suas informações. Agora vamos continuar seu atendimento pelo WhatsApp."
            >
              <a
                href={whatsappUrl(finalMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 block w-full bg-wine px-6 py-4 text-center text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-wine-deep"
              >
                Continuar no WhatsApp
              </a>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

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
      <h2 className="mt-4 font-display text-3xl leading-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
      {children}
    </div>
  );
}

function Primary({
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
      className="mt-10 w-full bg-wine px-6 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-colors hover:bg-wine-deep disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children} →
    </button>
  );
}

function Back({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mt-6 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
    >
      ← Voltar
    </button>
  );
}

function Option({
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
      className={`w-full border px-5 py-4 text-left transition-colors ${
        selected ? "border-wine bg-secondary/50" : "border-border hover:border-wine hover:bg-card"
      }`}
    >
      <span className="block text-[0.95rem] text-foreground">{label}</span>
      {description && (
        <span className="mt-1 block text-xs text-muted-foreground">{description}</span>
      )}
    </button>
  );
}
