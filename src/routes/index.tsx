import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QualificationFlow } from "@/components/QualificationFlow";
import { ExitIntentBanner } from "@/components/ExitIntentBanner";
import { useExitIntent } from "@/hooks/useExitIntent";
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
      { name: "theme-color", content: "#F5EFEA" },
    ],
  }),
  component: Index,
});

function Index() {
  const [open, setOpen] = useState(false);

  // Exit intent — desativado enquanto o quiz está aberto
  const exitIntent = useExitIntent(open);

  function handleExitSchedule() {
    exitIntent.dismiss();
    setOpen(true);
  }

  return (
    <main className="min-h-screen bg-background md:grid md:place-items-center">
      <div className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-[22px] pb-7 pt-6 md:min-h-0 md:py-10">
        {/* ── Identificação ── */}
        <header className="animate-fade-up delay-100">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-wine">
            Dra. Térsia Guimarães
          </p>
          <p className="mt-1 text-[12px] tracking-[0.04em] text-foreground/60">
            Ginecologia • Obstetrícia • Saúde íntima
          </p>
        </header>

        {/* ── Retrato ── */}
        <figure className="animate-fade-up delay-200 relative mt-[18px] h-[min(46vh,440px)] min-h-[300px] overflow-hidden rounded-[22px] bg-muted md:h-[400px]">
          <img
            src={retrato}
            alt="Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
            className="h-full w-full object-cover"
            style={{ objectPosition: "50% 18%" }}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/10" />
        </figure>

        {/* ── Chamada ── */}
        <div className="animate-fade-up delay-300">
          <h1
            className="mt-[26px] font-display text-[clamp(28px,7.6vw,34px)] font-normal leading-[1.12] tracking-[-0.02em] text-wine-deep"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Sua saúde merece uma <em className="font-light italic">avaliação individual.</em>
          </h1>
          <p className="mt-2.5 text-[15px] leading-[1.55] text-foreground/60">
            Cuidar de você começa entendendo o que você precisa.
          </p>
        </div>

        {/* ── Ações ── */}
        <div className="animate-fade-up delay-400 mt-auto grid gap-3.5 pt-[26px] md:pt-[30px]">
          <button
            id="btn-agendar-consulta"
            onClick={() => setOpen(true)}
            className="w-full rounded-[14px] bg-wine px-5 py-[17px] text-[16px] font-bold text-primary-foreground transition-colors duration-150 hover:bg-wine-deep active:scale-[0.99]"
          >
            Quero agendar minha primeira consulta
          </button>

          <a
            id="btn-ja-sou-paciente"
            href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 text-center text-[16px] font-semibold text-wine-deep underline decoration-sand underline-offset-4 transition-colors hover:decoration-wine-deep"
          >
            Já sou paciente
          </a>
        </div>

        {/* ── Rodapé ── */}
        <footer className="animate-fade-up delay-500 mt-[22px] border-t border-sand pt-4 text-center text-[11.5px] leading-[1.7] text-foreground/60">
          <span className="font-semibold text-wine-deep">
            Ginecologia • Obstetrícia • Medicina Fetal • Saúde Íntima
          </span>
          <br />
          Atendimento particular em Sobral — CE
        </footer>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}

      {exitIntent.show && !open && (
        <ExitIntentBanner onSchedule={handleExitSchedule} onDismiss={exitIntent.dismiss} />
      )}
    </main>
  );
}
