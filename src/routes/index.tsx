import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QualificationFlow } from "@/components/QualificationFlow";
import { RETURNING_PATIENT_MESSAGE, whatsappUrl } from "@/lib/lead";
import retrato from "@/assets/dra-tersia.jpg";

const TITLE = "Dra. Térsia Guimarães — Ginecologia e Saúde Íntima em Sobral";
const DESCRIPTION =
  "Agende sua primeira consulta com a Dra. Térsia Guimarães. Ginecologia, obstetrícia, medicina fetal e saúde íntima. Atendimento particular em Sobral — CE.";

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
        <div className="relative mb-10">
          <div className="absolute -inset-2 animate-pulse rounded-full border border-sand" />
          <img
            src={retrato}
            alt="Retrato da Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
            width={140}
            height={140}
            className="relative z-10 h-[140px] w-[140px] rounded-full border-4 border-cream object-cover object-top shadow-editorial"
          />
        </div>

        <header className="mb-12 space-y-3">
          <h1 className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-wine-deep">
            Dra. Térsia Guimarães
          </h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-6 bg-wine/30" />
            <p className="eyebrow font-semibold text-wine">
              Ginecologia & Obstetrícia
            </p>
            <span className="h-px w-6 bg-wine/30" />
          </div>
        </header>

        <p className="mb-12 max-w-[320px] text-[15px] leading-relaxed text-foreground/80 italic">
          Cuidar da sua saúde começa entendendo o que você precisa.
        </p>

        <div className="flex w-full flex-col gap-4">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-wine px-8 py-5 font-display text-xs font-bold tracking-[0.15em] text-primary-foreground shadow-editorial transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-deep"
          >
            AGENDAR PRIMEIRA CONSULTA
          </button>

          <a
            href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-wine-deep/20 px-8 py-5 font-display text-xs font-bold tracking-[0.15em] text-wine-deep transition-all duration-300 hover:border-wine-deep hover:bg-cream/60"
          >
            JÁ SOU PACIENTE
          </a>
        </div>

        <footer className="mt-auto pt-16">
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
