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
      <div className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-[22px] pb-7 pt-8 md:min-h-0 md:py-10">
        {/* ── Identificação ── */}
        <header className="animate-fade-up delay-100 flex flex-col items-center pt-2 text-center">
          <div className="relative">
            <div className="absolute -inset-[5px] rounded-full border border-wine/35" />
            <div className="relative h-[132px] w-[132px] overflow-hidden rounded-full border-[3px] border-background bg-muted">
              <img
                src={retrato}
                alt="Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
                className="h-full w-full object-cover"
                style={{ objectPosition: "50% 0%", transform: "scale(1.75)", transformOrigin: "50% 18%" }}
              />
            </div>
          </div>

          <h2 className="mt-5 font-display text-[26px] font-normal leading-none tracking-[-0.01em] text-wine-deep">
            Dra. Térsia Guimarães
          </h2>
          <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.14em] text-wine">
            Ginecologia • Obstetrícia • Medicina Fetal
          </p>
          <p className="mt-1.5 text-[12.5px] tracking-[0.02em] text-foreground/70">
            Estética Íntima&nbsp;|&nbsp;Ninfoplastia • Laser Íntimo
          </p>
          <p className="mt-2 text-[11px] tracking-[0.04em] text-foreground/45">
            CRM-CE 13957&nbsp;|&nbsp;RQE 12129&nbsp;|&nbsp;RQE 8882
          </p>
        </header>

        {/* ── Chamada ── */}
        <div className="animate-fade-up delay-300">
          <h1
            className="mt-8 text-center font-display text-[clamp(26px,7vw,30px)] font-normal leading-[1.15] tracking-[-0.02em] text-wine-deep"
            style={{ fontVariationSettings: '"opsz" 72' }}
          >
            Sua saúde merece uma <em className="font-light italic">avaliação individual.</em>
          </h1>
          <p className="mt-2.5 text-center text-[15px] leading-[1.55] text-foreground/60">
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
