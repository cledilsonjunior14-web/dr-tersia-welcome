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
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-6 pb-10 pt-12 sm:max-w-lg">
        <header className="text-center">
          <h1 className="font-display text-[1.75rem] leading-none tracking-[0.06em] text-wine-deep uppercase sm:text-3xl">
            Dra. Térsia Guimarães
          </h1>
          <p className="eyebrow mt-3 text-muted-foreground">
            Ginecologia • Obstetrícia • Saúde íntima
          </p>
        </header>

        <div className="relative mt-9 overflow-hidden">
          <img
            src={retrato}
            alt="Retrato da Dra. Térsia Guimarães, ginecologista e obstetra em Sobral"
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 border border-sand/70" />
        </div>

        <p className="mt-10 text-center font-display text-2xl leading-snug text-foreground sm:text-[1.75rem]">
          Cuidar da sua saúde começa entendendo o que você precisa.
        </p>

        <div className="mt-10 flex flex-col gap-3">
          <button
            onClick={() => setOpen(true)}
            className="w-full bg-wine px-6 py-5 text-sm font-medium tracking-[0.04em] text-primary-foreground transition-colors hover:bg-wine-deep"
          >
            Quero agendar minha primeira consulta
          </button>

          <a
            href={whatsappUrl(RETURNING_PATIENT_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full border border-wine-deep/30 px-6 py-4 text-center text-sm tracking-[0.04em] text-wine-deep transition-colors hover:bg-secondary/60"
          >
            Já sou paciente
          </a>
        </div>

        <footer className="mt-auto pt-14 text-center">
          <p className="text-[0.7rem] leading-relaxed tracking-[0.12em] text-muted-foreground uppercase">
            Ginecologia • Obstetrícia • Medicina Fetal • Saúde Íntima
          </p>
          <p className="mt-2 text-[0.7rem] tracking-[0.12em] text-muted-foreground uppercase">
            Atendimento particular em Sobral — CE
          </p>
        </footer>
      </div>

      {open && <QualificationFlow onClose={() => setOpen(false)} />}
    </main>
  );
}
