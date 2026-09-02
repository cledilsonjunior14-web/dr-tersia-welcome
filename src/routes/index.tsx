import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QualificationFlow } from "@/components/QualificationFlow";
import { ExitIntentBanner } from "@/components/ExitIntentBanner";
import { useExitIntent } from "@/hooks/useExitIntent";
import { RETURNING_PATIENT_MESSAGE, whatsappUrl } from "@/lib/lead";
import retrato from "@/assets/dra-tersia.jpg";
import {
  CalendarDays,
  ChevronRight,
  MapPin,
  MessageCircle,
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

  // Exit intent — desativado quando o quiz está aberto
  const exitIntent = useExitIntent(open);

  function handleExitSchedule() {
    exitIntent.dismiss();
    setOpen(true);
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col">

        {/* ══════════════════════════════
            HERO — foto circular + branding centralizado
        ══════════════════════════════ */}
        <div className="flex flex-col items-center px-6 pb-2 pt-12 text-center">

          {/* Foto circular com anel pulsante */}
          <div className="animate-fade-up delay-100 relative mb-6">
            <div className="absolute -inset-3 animate-pulse rounded-full border border-wine/25" />
            <div className="absolute -inset-1 rounded-full border border-sand/60" />
            <img
              src={retrato}
              alt="Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
              width={148}
              height={148}
              className="relative z-10 h-[148px] w-[148px] rounded-full border-4 border-cream object-cover shadow-editorial"
              style={{ objectPosition: "50% 10%" }}
            />
          </div>

          {/* Branding */}
          <div className="animate-fade-up delay-200">
            <p className="eyebrow text-[8px] tracking-[0.28em] text-wine/60">Dra.</p>
            <h1
              className="font-display font-bold leading-[1.15] text-wine-deep"
              style={{ fontSize: "1.45rem", letterSpacing: "0.02em" }}
            >
              Térsia Guimarães
            </h1>

            {/* Especialidades linha 1 */}
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="h-px w-4 bg-wine/25" />
              <p className="eyebrow text-[8.5px] font-semibold tracking-[0.16em] text-wine">
                Ginecologia • Obstetrícia • Medicina Fetal
              </p>
              <span className="h-px w-4 bg-wine/25" />
            </div>

            {/* Especialidades linha 2 */}
            <p className="mt-1 text-[9px] tracking-[0.08em] text-wine-deep/55">
              Estética Íntima&nbsp;|&nbsp;Ninfoplastia • Laser Íntimo
            </p>

            {/* CRM / RQE */}
            <p className="mt-2 text-[8px] tracking-[0.06em] text-foreground/35">
              CRM-CE 13957&nbsp;|&nbsp;RQE 12129&nbsp;|&nbsp;RQE 8882
            </p>
          </div>
        </div>

        {/* ══════════════════════════════
            CHAMADA PARA AÇÃO
        ══════════════════════════════ */}
        <div className="animate-fade-up delay-300 px-6 pb-1 pt-6 text-center">
          <h2
            className="font-display font-bold leading-snug text-wine-deep"
            style={{ fontSize: "1.25rem" }}
          >
            Sua saúde merece<br />
            <span className="text-wine">atenção especializada.</span>
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-foreground/55">
            Escolha como podemos te atender hoje.
          </p>
        </div>

        {/* ══════════════════════════════
            CARDS DE AÇÃO
        ══════════════════════════════ */}
        <div className="animate-fade-up delay-400 flex flex-col gap-3 px-5 py-4">

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
        <footer className="animate-fade-up delay-500 mt-auto px-5 pb-8 pt-6 text-center">
          <div className="flex items-center gap-2">
            <span className="h-px flex-1 bg-wine-deep/10" />
            <span className="h-px w-4 bg-wine-deep/10" />
          </div>
          <p className="mt-4 text-[8px] tracking-wide text-wine-deep/30">
            © 2026 Dra. Térsia Guimarães · Todos os direitos reservados.
          </p>
        </footer>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}

      {exitIntent.show && !open && (
        <ExitIntentBanner
          onSchedule={handleExitSchedule}
          onDismiss={exitIntent.dismiss}
        />
      )}
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
    <div className="group flex items-center gap-4 border border-sand/70 bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:border-wine/30 hover:shadow-editorial">
      {/* ícone */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-sand/60 bg-background text-wine transition-colors group-hover:border-wine/30 group-hover:bg-cream/80">
        {icon}
      </div>

      {/* texto */}
      <div className="flex-1 min-w-0">
        <p className="font-display text-[10.5px] font-bold tracking-[0.12em] text-wine-deep">
          {title}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-foreground/55">
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
