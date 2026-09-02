import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QualificationFlow } from "@/components/QualificationFlow";
import { RETURNING_PATIENT_MESSAGE, whatsappUrl } from "@/lib/lead";
import retrato from "@/assets/dra-tersia.jpg";
import { MapPin } from "lucide-react";

const TITLE = "Dra. Térsia Guimarães — Ginecologia e Saúde Íntima em Sobral";
const DESCRIPTION =
  "Agende sua primeira consulta com a Dra. Térsia Guimarães. Ginecologia, obstetrícia, medicina fetal e saúde íntima. Atendimento particular em Sobral — CE.";

const GOOGLE_MAPS_URL = "https://share.google/lE44u1x5abHLOIPPq";

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
      <div className="mx-auto flex min-h-screen w-full max-w-[380px] flex-col items-center px-6 pb-10 pt-14 text-center">

        {/* ── Foto circular com pulse ── */}
        <div className="animate-fade-up delay-100 relative mb-10">
          {/* anel pulsante externo */}
          <div className="absolute -inset-3 animate-pulse rounded-full border border-wine/30" />
          {/* anel fixo interno */}
          <div className="absolute -inset-1 rounded-full border border-sand/60" />
          <img
            src={retrato}
            alt="Retrato da Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
            width={150}
            height={150}
            className="relative z-10 h-[150px] w-[150px] rounded-full border-4 border-cream object-cover shadow-editorial"
            style={{ objectPosition: "50% 12%" }}
          />
        </div>

        {/* ── Nome + especialidade ── */}
        <header className="animate-fade-up delay-200 mb-10 space-y-3">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-wine-deep">
            Dra. Térsia Guimarães
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-wine/30" />
            <p className="eyebrow font-semibold text-wine">
              Ginecologia &amp; Obstetrícia
            </p>
            <span className="h-px w-6 bg-wine/30" />
          </div>
        </header>

        {/* ── Frase ── */}
        <p className="animate-fade-up delay-300 mb-12 max-w-[300px] text-[15px] leading-relaxed text-foreground/75 italic">
          Cuidar da sua saúde começa entendendo o que você precisa.
        </p>

        {/* ── Botões ── */}
        <div className="animate-fade-up delay-400 flex w-full flex-col gap-3">

          {/* Agendar primeira consulta */}
          <button
            id="btn-agendar-consulta"
            onClick={() => setOpen(true)}
            className="group relative w-full overflow-hidden bg-wine px-8 py-5 font-display text-xs font-bold tracking-[0.15em] text-primary-foreground shadow-editorial transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-deep"
          >
            <span
              className="pointer-events-none absolute inset-0 -skew-x-12 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full"
            />
            AGENDAR PRIMEIRA CONSULTA
          </button>

          {/* Já sou paciente */}
          <a
            id="btn-ja-sou-paciente"
            href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-wine-deep/20 px-8 py-5 font-display text-xs font-bold tracking-[0.15em] text-wine-deep transition-all duration-300 hover:border-wine-deep hover:bg-cream/60"
          >
            JÁ SOU PACIENTE
          </a>

          {/* Como chegar */}
          <a
            id="btn-como-chegar"
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 border border-dashed border-wine-deep/20 px-8 py-4 font-display text-xs font-semibold tracking-[0.12em] text-wine-deep/70 transition-all duration-300 hover:border-wine-deep/50 hover:bg-cream/40 hover:text-wine-deep"
          >
            <MapPin size={13} strokeWidth={2} />
            COMO CHEGAR
          </a>
        </div>

        {/* ── Rodapé ── */}
        <footer className="animate-fade-up delay-500 mt-auto pt-16">
          <p className="text-[9px] uppercase tracking-[0.3em] text-wine-deep/40">
            Ginecologia • Obstetrícia • Medicina Fetal • Saúde Íntima
          </p>
          <p className="mt-2 text-[9px] uppercase tracking-[0.3em] text-wine-deep/40">
            Atendimento particular em Sobral — CE
          </p>
        </footer>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}
    </main>
  );
}
