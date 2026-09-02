import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QualificationFlow } from "@/components/QualificationFlow";
import { RETURNING_PATIENT_MESSAGE, whatsappUrl } from "@/lib/lead";
import retrato from "@/assets/dra-tersia.jpg";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  MessageCircle,
  Instagram,
} from "lucide-react";

const TITLE = "Dra. Térsia Guimarães — Ginecologia e Saúde Íntima em Sobral";
const DESCRIPTION =
  "Agende sua primeira consulta com a Dra. Térsia Guimarães. Ginecologia, obstetrícia, medicina fetal e saúde íntima. Atendimento particular em Sobral — CE.";

const GOOGLE_MAPS_URL = "https://share.google/lE44u1x5abHLOIPPq";
const INSTAGRAM_URL = "https://instagram.com/dratersiaguimaraes";
const WHATSAPP_MESSAGE = RETURNING_PATIENT_MESSAGE;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col">

        {/* ══════════════════════════════
            HERO — foto esquerda + branding direita
        ══════════════════════════════ */}
        <div className="animate-fade-in delay-100 relative flex" style={{ minHeight: "52vw", maxHeight: "280px" }}>

          {/* Foto — sangra na esquerda */}
          <div className="relative w-[44%] shrink-0 overflow-hidden">
            <img
              src={retrato}
              alt="Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
              className="h-full w-full object-cover"
              style={{ objectPosition: "38% 8%" }}
            />
            {/* fade direito para fundir com o fundo */}
            <div
              className="pointer-events-none absolute inset-y-0 right-0 w-10"
              style={{
                background:
                  "linear-gradient(to right, transparent, oklch(0.960 0.010 58))",
              }}
            />
          </div>

          {/* Branding — direita */}
          <div className="animate-fade-up delay-200 flex flex-1 flex-col items-center justify-center px-4 py-6 text-center">
            {/* monograma */}
            <div className="mb-3 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-wine/40 bg-cream/60">
              <span
                className="font-display text-lg font-bold text-wine"
                style={{ letterSpacing: "0.04em" }}
              >
                TG
              </span>
            </div>

            <p className="eyebrow text-[8px] tracking-[0.28em] text-wine/60">Dra.</p>
            <h1
              className="font-display font-bold leading-[1.1] text-wine-deep"
              style={{ fontSize: "1.2rem", letterSpacing: "0.02em" }}
            >
              Térsia<br />Guimarães
            </h1>
            <p
              className="eyebrow mt-1 text-wine/50"
              style={{ fontSize: "0.55rem", letterSpacing: "0.2em" }}
            >
              Ginecologia &amp; Obstetrícia
            </p>

            <p className="mt-3 text-[10.5px] leading-relaxed text-foreground/60">
              Cuidando da sua saúde com atenção e dedicação individual.
            </p>

            {/* Ícones sociais */}
            <div className="mt-4 flex items-center gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-wine/50 transition-colors hover:text-wine"
              >
                <Instagram size={15} strokeWidth={1.8} />
              </a>
              <a
                href={whatsappUrl(WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-wine/50 transition-colors hover:text-wine"
              >
                <MessageCircle size={15} strokeWidth={1.8} />
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Localização"
                className="text-wine/50 transition-colors hover:text-wine"
              >
                <MapPin size={15} strokeWidth={1.8} />
              </a>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════
            CARDS DE AÇÃO
        ══════════════════════════════ */}
        <div className="animate-fade-up delay-300 flex flex-col gap-3 px-5 py-5">

          {/* Agendar primeira consulta */}
          <button
            id="btn-agendar-consulta"
            onClick={() => setOpen(true)}
            className="w-full"
          >
            <LinkCard
              icon={<CalendarDays size={20} strokeWidth={1.6} />}
              title="AGENDAR PRIMEIRA CONSULTA"
              description="Agende sua avaliação e inicie seu cuidado com a Dra. Térsia."
            />
          </button>

          {/* Já sou paciente */}
          <a
            id="btn-ja-sou-paciente"
            href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkCard
              icon={<MessageCircle size={20} strokeWidth={1.6} />}
              title="JÁ SOU PACIENTE"
              description="Continue seu atendimento diretamente pelo WhatsApp."
            />
          </a>

          {/* Como chegar */}
          <a
            id="btn-como-chegar"
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <LinkCard
              icon={<MapPin size={20} strokeWidth={1.6} />}
              title="COMO CHEGAR"
              description="Atendimento particular em Sobral — CE. Veja a localização."
            />
          </a>
        </div>

        {/* ══════════════════════════════
            RODAPÉ
        ══════════════════════════════ */}
        <footer className="animate-fade-up delay-400 mt-auto px-5 pb-8 pt-4 text-center">
          <p
            className="eyebrow mb-4 text-wine-deep/40"
            style={{ fontSize: "0.6rem", letterSpacing: "0.25em" }}
          >
            Conecte-se
          </p>

          {/* linha decorativa */}
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px flex-1 bg-wine-deep/10" />
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine/40 transition-colors hover:text-wine"
              >
                <Instagram size={15} strokeWidth={1.8} />
              </a>
              <a
                href={whatsappUrl(WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine/40 transition-colors hover:text-wine"
              >
                <MessageCircle size={15} strokeWidth={1.8} />
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-wine/40 transition-colors hover:text-wine"
              >
                <MapPin size={15} strokeWidth={1.8} />
              </a>
            </div>
            <span className="h-px flex-1 bg-wine-deep/10" />
          </div>

          <p className="text-[8px] tracking-wide text-wine-deep/30">
            © 2026 Dra. Térsia Guimarães · Todos os direitos reservados.
          </p>
        </footer>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}
    </main>
  );
}

/* ══════════════════════════════
   Componente de card reutilizável
══════════════════════════════ */
function LinkCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex items-center gap-4 rounded-2xl border border-sand/70 bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:border-wine/30 hover:shadow-editorial">
      {/* ícone */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sand/60 bg-background text-wine transition-colors group-hover:border-wine/30 group-hover:bg-cream/80">
        {icon}
      </div>

      {/* texto */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[10.5px] font-bold tracking-[0.12em] text-wine-deep">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">
          {description}
        </p>
      </div>

      {/* seta */}
      <ChevronRight
        size={16}
        strokeWidth={2}
        className="shrink-0 text-wine/30 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-wine/60"
      />
    </div>
  );
}
