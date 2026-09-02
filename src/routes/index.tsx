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
      <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col">

        {/* ── Foto editorial ── */}
        <div className="animate-fade-in delay-100 relative w-full overflow-hidden" style={{ height: "52vh", minHeight: "280px", maxHeight: "440px" }}>
          <img
            src={retrato}
            alt="Retrato da Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
            className="h-full w-full object-cover object-top"
          />
          {/* Gradient fade para baixo */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{
              height: "55%",
              background: "linear-gradient(to bottom, transparent 0%, oklch(0.960 0.010 58) 100%)",
            }}
          />
        </div>

        {/* ── Conteúdo ── */}
        <div className="flex flex-1 flex-col items-center px-7 pb-10 pt-2 text-center">

          {/* Nome + especialidades */}
          <div className="animate-fade-up delay-200 mt-1 space-y-2">
            <h1 className="font-display text-2xl font-bold uppercase tracking-[0.06em] text-wine-deep">
              Dra. Térsia Guimarães
            </h1>

            <div className="flex items-center justify-center gap-2">
              <span className="h-px w-5 bg-wine/30" />
              <p className="eyebrow font-semibold text-wine">
                Ginecologia &amp; Obstetrícia
              </p>
              <span className="h-px w-5 bg-wine/30" />
            </div>
          </div>

          {/* Frase editorial */}
          <p className="animate-fade-up delay-300 mt-7 max-w-[300px] text-[15px] leading-relaxed text-foreground/70 italic">
            Sua saúde merece uma avaliação individual e dedicada.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-400 mt-8 flex w-full flex-col gap-3">
            <button
              id="btn-agendar-consulta"
              onClick={() => setOpen(true)}
              className="group relative w-full overflow-hidden bg-wine px-8 py-5 font-display text-[11px] font-bold tracking-[0.16em] text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:bg-wine-deep hover:shadow-editorial"
            >
              {/* shimmer no hover */}
              <span
                className="pointer-events-none absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-500 group-hover:translate-x-full"
                style={{ transform: "skewX(-20deg)" }}
              />
              AGENDAR PRIMEIRA CONSULTA
            </button>

            <a
              id="btn-ja-sou-paciente"
              href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 font-display text-[11px] font-semibold tracking-[0.14em] text-wine-deep/70 underline-offset-4 transition-all duration-200 hover:text-wine-deep hover:underline"
            >
              JÁ SOU PACIENTE
            </a>
          </div>

          {/* Rodapé ultra-discreto */}
          <footer className="animate-fade-up delay-500 mt-auto pt-10">
            <div className="flex items-center justify-center gap-2 opacity-40">
              <span className="h-px w-8 bg-wine-deep/40" />
              <p className="text-[8.5px] uppercase tracking-[0.28em] text-wine-deep">
                Ginecologia • Obstetrícia • Medicina Fetal • Saúde Íntima
              </p>
              <span className="h-px w-8 bg-wine-deep/40" />
            </div>
            <p className="mt-1.5 text-[8.5px] uppercase tracking-[0.28em] text-wine-deep/40">
              Atendimento particular em Sobral — CE
            </p>
          </footer>
        </div>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}
    </main>
  );
}
